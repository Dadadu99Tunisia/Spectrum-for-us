import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";
import { sendPayoutNotification, trySend } from "@/lib/email";

export async function GET() {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  const admin = createAdminClient();

  // Fenêtre de rétention : on ne libère un versement qu'après N jours (anti-fraude
  // cross-border : couvre l'expédition + la fenêtre de litige). Configurable.
  const { data: holdSetting } = await admin.from("admin_settings").select("value").eq("key", "manual_payout_hold_days").maybeSingle();
  const holdDays = Number.isFinite(Number(holdSetting?.value)) ? Number(holdSetting?.value) : 7;
  const holdCutoff = new Date(Date.now() - holdDays * 86400_000).toISOString();

  // Le mode manuel est porté par le SELLER ; on liste ses activités pour le solde.
  const { data: manualSellers } = await admin.from("sellers")
    .select("id, payout_method, payout_details, country, created_at")
    .eq("payout_mode", "manual");
  if (!manualSellers?.length) return apiResponse([]);
  const sellerMap: Record<string, { payout_method: string | null; payout_details: string | null; country: string | null; created_at: string | null }> =
    Object.fromEntries(manualSellers.map(s => [s.id, s]));

  const { data: shops } = await admin.from("shops")
    .select("id, name, owner_id, seller_id")
    .in("seller_id", manualSellers.map(s => s.id));
  if (!shops?.length) return apiResponse([]);

  const shopIds = shops.map(s => s.id);
  const [{ data: comm }, { data: ships }, { data: payouts }, { data: prods }] = await Promise.all([
    admin.from("commissions").select("shop_id, gross_amount, commission_amount, created_at").in("shop_id", shopIds),
    admin.from("order_shipments").select("shop_id, shipping_cost").in("shop_id", shopIds),
    admin.from("vendor_payouts").select("shop_id, amount").in("shop_id", shopIds),
    admin.from("products").select("shop_id, is_active").in("shop_id", shopIds),
  ]);

  // E-mails des propriétaires
  const emailByShop: Record<string, string | null> = {};
  await Promise.all(shops.map(async s => {
    try { const { data } = await admin.auth.admin.getUserById(s.owner_id); emailByShop[s.id] = data?.user?.email ?? null; }
    catch { emailByShop[s.id] = null; }
  }));

  // Nb de produits actifs par boutique
  const prodCount: Record<string, number> = {};
  for (const p of (prods ?? []) as { shop_id: string; is_active: boolean }[]) {
    if (p.is_active) prodCount[p.shop_id] = (prodCount[p.shop_id] ?? 0) + 1;
  }

  const agg = (rows: { shop_id: string }[] | null, field: string, sign = 1) => {
    const m: Record<string, number> = {};
    for (const r of (rows ?? []) as Record<string, unknown>[]) {
      const sid = r.shop_id as string;
      m[sid] = (m[sid] ?? 0) + sign * Number(r[field] || 0);
    }
    return m;
  };
  const gross = agg(comm, "gross_amount");
  const commission = agg(comm, "commission_amount");
  const shipping = agg(ships, "shipping_cost");
  const paid = agg(payouts, "amount");

  // Net produit (gross − commission) LIBÉRABLE = commissions plus vieilles que la
  // fenêtre de rétention. Le port (remboursement d'affranchissement) est libéré tout de suite.
  const availableNet: Record<string, number> = {};
  for (const c of (comm ?? []) as { shop_id: string; gross_amount: number; commission_amount: number; created_at: string | null }[]) {
    if (c.created_at && c.created_at <= holdCutoff) {
      availableNet[c.shop_id] = (availableNet[c.shop_id] ?? 0) + (Number(c.gross_amount || 0) - Number(c.commission_amount || 0));
    }
  }

  const r2 = (n: number) => Math.round(n * 100) / 100;

  const result = shops.map(s => {
    const sel = sellerMap[s.seller_id as string] ?? { payout_method: null, payout_details: null, country: null, created_at: null };
    const earned = (gross[s.id] ?? 0) - (commission[s.id] ?? 0) + (shipping[s.id] ?? 0);
    const paidAmt = paid[s.id] ?? 0;
    const owed = r2(earned - paidAmt);
    // Disponible maintenant = net libéré + port − déjà versé. Le reste est retenu.
    const availableEarned = (availableNet[s.id] ?? 0) + (shipping[s.id] ?? 0);
    const releasable = r2(Math.max(0, availableEarned - paidAmt));
    const held = r2(Math.max(0, owed - releasable));
    // Signaux de revue (anti-fraude · pas de blocage automatique)
    const sellerAgeDays = sel.created_at ? (Date.now() - new Date(sel.created_at).getTime()) / 86400_000 : Infinity;
    const flags: string[] = [];
    if ((prodCount[s.id] ?? 0) === 0 && owed > 0) flags.push("no_active_products");
    if (sellerAgeDays < 14 && owed > 100) flags.push("new_seller_high_owed");
    return {
      shop_id: s.id, name: s.name, payout_method: sel.payout_method, payout_details: sel.payout_details,
      country: sel.country ?? "—",
      email: emailByShop[s.id] ?? null, products: prodCount[s.id] ?? 0,
      earned: r2(earned), paid: r2(paidAmt), owed, releasable, held, flags,
    };
  }).sort((a, b) => b.owed - a.owed);

  return apiResponse(result);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  let body: { shop_id?: string; amount?: number; method?: string; reference?: string; note?: string };
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }
  if (!body.shop_id || !body.amount || body.amount <= 0) return apiError("shop_id et montant requis");

  const admin = createAdminClient();

  // Garde-fou rétention : on ne verse pas au-delà du montant LIBÉRÉ (net produit
  // hors fenêtre de rétention + port − déjà versé). Protège le cash cross-border.
  {
    const { data: holdSetting } = await admin.from("admin_settings").select("value").eq("key", "manual_payout_hold_days").maybeSingle();
    const holdDays = Number.isFinite(Number(holdSetting?.value)) ? Number(holdSetting?.value) : 7;
    const holdCutoff = new Date(Date.now() - holdDays * 86400_000).toISOString();
    const [{ data: comm }, { data: ships }, { data: payouts }] = await Promise.all([
      admin.from("commissions").select("gross_amount, commission_amount, created_at").eq("shop_id", body.shop_id),
      admin.from("order_shipments").select("shipping_cost").eq("shop_id", body.shop_id),
      admin.from("vendor_payouts").select("amount").eq("shop_id", body.shop_id),
    ]);
    const availableNet = (comm ?? []).reduce((s, c: { gross_amount: number; commission_amount: number; created_at: string | null }) =>
      c.created_at && c.created_at <= holdCutoff ? s + (Number(c.gross_amount || 0) - Number(c.commission_amount || 0)) : s, 0);
    const shippingTot = (ships ?? []).reduce((s, x: { shipping_cost: number }) => s + Number(x.shipping_cost || 0), 0);
    const paidTot = (payouts ?? []).reduce((s, p: { amount: number }) => s + Number(p.amount || 0), 0);
    const releasable = Math.round(Math.max(0, availableNet + shippingTot - paidTot) * 100) / 100;
    if (body.amount > releasable + 0.01) {
      return apiError(`Montant supérieur au disponible : ${releasable.toFixed(2)} € libérés (rétention ${holdDays} j). Le reste se débloque après la fenêtre de rétention.`);
    }
  }

  const { error } = await admin.from("vendor_payouts").insert({
    shop_id: body.shop_id, amount: body.amount,
    method: body.method?.trim() || null, reference: body.reference?.trim() || null, note: body.note?.trim() || null,
    created_by: auth.user.id,
  });
  if (error) return apiError(error.message);

  // E-mail au·à la vendeur·se (best-effort)
  try {
    const { data: shop } = await admin.from("shops").select("owner_id, seller_id").eq("id", body.shop_id).maybeSingle();
    if (shop?.owner_id) {
      let sellerMethod: string | null = null;
      if (shop.seller_id) {
        const { data: sel } = await admin.from("sellers").select("payout_method").eq("id", shop.seller_id).maybeSingle();
        sellerMethod = sel?.payout_method ?? null;
      }
      const { data: authUser } = await admin.auth.admin.getUserById(shop.owner_id);
      const email = authUser?.user?.email;
      if (email) await trySend(() => sendPayoutNotification({
        to: email, amount: Number(body.amount),
        method: body.method?.trim() || sellerMethod || undefined, reference: body.reference?.trim() || undefined,
      }));
    }
  } catch (e) { console.error("[payout] email non bloquant", e); }

  return apiResponse({ ok: true });
}
