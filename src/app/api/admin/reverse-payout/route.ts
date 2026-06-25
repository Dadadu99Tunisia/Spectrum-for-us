import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";
import { getStripeServer } from "@/lib/stripe-server";

// Reversement manuel (régularisation) vers le compte Stripe connecté d'un·e vendeur·se.
// Déclenché par un·e admin depuis l'interface (action confirmée côté UI).
// GET  → liste des vendeur·ses Stripe + derniers reversements.
// POST → crée le transfert Stripe + journalise.

export async function GET() {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;
  const admin = createAdminClient();

  const { data: sellers } = await admin
    .from("sellers")
    .select("id, stripe_account_id, stripe_charges_enabled, user_id")
    .eq("payout_mode", "stripe")
    .not("stripe_account_id", "is", null);

  // Nom de boutique pour l'affichage
  const sellerIds = (sellers ?? []).map((s) => s.id);
  const { data: shops } = sellerIds.length
    ? await admin.from("shops").select("name, seller_id").in("seller_id", sellerIds)
    : { data: [] as { name: string; seller_id: string }[] };
  // Un·e vendeur·se (= 1 compte Stripe) peut avoir plusieurs boutiques → on les liste toutes.
  const shopsBySeller: Record<string, string[]> = {};
  for (const sh of (shops ?? []) as { name: string; seller_id: string }[]) {
    if (sh.seller_id) (shopsBySeller[sh.seller_id] ??= []).push(sh.name);
  }
  const nameBySeller: Record<string, string> = {};
  for (const [sid, names] of Object.entries(shopsBySeller)) nameBySeller[sid] = names.join(" · ");

  const { data: recent } = await admin
    .from("vendor_reversals")
    .select("id, seller_id, amount_cents, reason, stripe_transfer_id, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return apiResponse({
    sellers: (sellers ?? []).map((s) => ({
      seller_id: s.id,
      stripe_account_id: s.stripe_account_id,
      name: nameBySeller[s.id] ?? "Boutique",
      ready: s.stripe_charges_enabled === true,
    })),
    recent: recent ?? [],
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "cfo"]);
  if ("error" in auth) return auth.error;

  let body: { seller_id?: string; amount_eur?: number; reason?: string; order_ref?: string };
  try { body = await req.json(); } catch { return apiError("Requête invalide"); }

  const amountCents = Math.round(Number(body.amount_eur) * 100);
  if (!Number.isFinite(amountCents) || amountCents <= 0) return apiError("Montant invalide");
  if (amountCents > 1_000_00) return apiError("Montant trop élevé (plafond 1000 € par reversement)"); // garde-fou
  if (!body.seller_id) return apiError("Vendeur·se manquant·e");

  const admin = createAdminClient();
  const { data: seller } = await admin
    .from("sellers")
    .select("id, stripe_account_id, payout_mode")
    .eq("id", body.seller_id)
    .maybeSingle();
  if (!seller?.stripe_account_id) return apiError("Compte Stripe du vendeur introuvable", 404);
  if (seller.payout_mode !== "stripe") return apiError("Ce vendeur n'est pas en mode Stripe");

  const stripe = getStripeServer();

  // Optionnel : adosser le transfert au paiement d'une commande (source_transaction).
  // → puise directement dans la charge, même si les fonds sont encore « en attente » (zéro « insufficient funds »).
  let sourceCharge: string | null = null;
  let resolvedOrderId: string | null = null;
  const ref = body.order_ref?.trim().toLowerCase();
  if (ref) {
    // `id` est un uuid → pas de ilike. On récupère les commandes récentes et on matche le préfixe en JS.
    const { data: candidates } = await admin
      .from("orders")
      .select("id, payment_intent_id")
      .not("payment_intent_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1000);
    const ord = (candidates ?? []).find((o) => String(o.id).toLowerCase().startsWith(ref));
    if (!ord?.payment_intent_id) return apiError(`Commande « ${body.order_ref} » ou son paiement introuvable.`, 404);
    resolvedOrderId = ord.id;
    try {
      const pi = await stripe.paymentIntents.retrieve(ord.payment_intent_id);
      sourceCharge = (typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id) ?? null;
    } catch { /* on retombe sur un transfert classique si la charge est introuvable */ }
    if (!sourceCharge) return apiError("Charge Stripe de cette commande introuvable.", 404);
  }

  // Transfert Stripe vers le compte connecté
  let transferId: string;
  try {
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency: "eur",
      destination: seller.stripe_account_id,
      ...(sourceCharge ? { source_transaction: sourceCharge } : {}),
      description: (body.reason || "Régularisation Spectrum For Us").slice(0, 200),
      metadata: { reason: (body.reason || "").slice(0, 400), order_id: resolvedOrderId ?? "", by: auth.user.id },
    });
    transferId = transfer.id;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Échec du transfert Stripe";
    return apiError("Transfert refusé par Stripe : " + msg, 502);
  }

  // Journalisation
  await admin.from("vendor_reversals").insert({
    seller_id: seller.id,
    stripe_account_id: seller.stripe_account_id,
    amount_cents: amountCents,
    reason: body.reason ?? null,
    order_id: resolvedOrderId,
    stripe_transfer_id: transferId,
    created_by: auth.user.id,
  });

  return apiResponse({ ok: true, transfer_id: transferId, amount_eur: amountCents / 100 });
}
