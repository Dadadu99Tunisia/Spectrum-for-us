import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";
import { sendPayoutNotification, trySend } from "@/lib/email";

export async function GET() {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  const admin = createAdminClient();

  // Le mode manuel est porté par le SELLER ; on liste ses activités pour le solde.
  const { data: manualSellers } = await admin.from("sellers")
    .select("id, payout_method, payout_details, country")
    .eq("payout_mode", "manual");
  if (!manualSellers?.length) return apiResponse([]);
  const sellerMap: Record<string, { payout_method: string | null; payout_details: string | null; country: string | null }> =
    Object.fromEntries(manualSellers.map(s => [s.id, s]));

  const { data: shops } = await admin.from("shops")
    .select("id, name, owner_id, seller_id")
    .in("seller_id", manualSellers.map(s => s.id));
  if (!shops?.length) return apiResponse([]);

  const shopIds = shops.map(s => s.id);
  const [{ data: comm }, { data: ships }, { data: payouts }, { data: prods }] = await Promise.all([
    admin.from("commissions").select("shop_id, gross_amount, commission_amount").in("shop_id", shopIds),
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

  const result = shops.map(s => {
    const sel = sellerMap[s.seller_id as string] ?? { payout_method: null, payout_details: null, country: null };
    const earned = (gross[s.id] ?? 0) - (commission[s.id] ?? 0) + (shipping[s.id] ?? 0);
    const owed = Math.round((earned - (paid[s.id] ?? 0)) * 100) / 100;
    return {
      shop_id: s.id, name: s.name, payout_method: sel.payout_method, payout_details: sel.payout_details,
      country: sel.country ?? "—",
      email: emailByShop[s.id] ?? null, products: prodCount[s.id] ?? 0,
      earned: Math.round(earned * 100) / 100, paid: Math.round((paid[s.id] ?? 0) * 100) / 100, owed,
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
