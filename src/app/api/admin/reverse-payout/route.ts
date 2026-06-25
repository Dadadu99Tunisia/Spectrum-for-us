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
  const nameBySeller: Record<string, string> = {};
  for (const sh of (shops ?? []) as { name: string; seller_id: string }[]) {
    if (sh.seller_id && !nameBySeller[sh.seller_id]) nameBySeller[sh.seller_id] = sh.name;
  }

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

  let body: { seller_id?: string; amount_eur?: number; reason?: string; order_id?: string };
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

  // Transfert Stripe vers le compte connecté
  let transferId: string;
  try {
    const stripe = getStripeServer();
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency: "eur",
      destination: seller.stripe_account_id,
      description: (body.reason || "Régularisation Spectrum For Us").slice(0, 200),
      metadata: { reason: (body.reason || "").slice(0, 400), order_id: body.order_id ?? "", by: auth.user.id },
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
    order_id: body.order_id ?? null,
    stripe_transfer_id: transferId,
    created_by: auth.user.id,
  });

  return apiResponse({ ok: true, transfer_id: transferId, amount_eur: amountCents / 100 });
}
