import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeServer, PLATFORM_URL } from "@/lib/stripe-server";
import { ensureSeller } from "@/lib/seller";

/**
 * Stripe Connect (Express) · onboarding du SELLER (entité financière unique).
 * Le compte Stripe est rattaché au seller, partagé par toutes ses activités.
 * POST → crée/récupère le compte Express + renvoie un lien d'onboarding.
 * GET  → statut actuel (rafraîchi depuis Stripe).
 */

async function getCtx() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const admin = createAdminClient();
  const seller = await ensureSeller(admin, user.id);
  // Nom d'affichage Stripe = activité primaire (la plus ancienne) si dispo.
  const { data: shop } = await admin
    .from("shops")
    .select("name")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return { user, seller, admin, displayName: (shop?.name as string) ?? user.email ?? "Spectrum" };
}

export async function POST() {
  try {
    const ctx = await getCtx();
    if ("error" in ctx) return ctx.error;
    const { user, seller, admin, displayName } = ctx;
    const stripe = getStripeServer();

    let accountId = seller.stripe_account_id;

    // Crée le compte Express si nécessaire
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email ?? undefined,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
        business_profile: { name: displayName, url: `${PLATFORM_URL}/boutique` },
        metadata: { seller_id: seller.id, user_id: user.id },
      });
      accountId = account.id;
      await admin.from("sellers").update({ stripe_account_id: accountId }).eq("id", seller.id);
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${PLATFORM_URL}/vendeur?connect=refresh`,
      return_url: `${PLATFORM_URL}/vendeur?connect=done`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: link.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur Stripe";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const ctx = await getCtx();
    if ("error" in ctx) return ctx.error;
    const { seller, admin } = ctx;
    const accountId = seller.stripe_account_id;
    if (!accountId) {
      return NextResponse.json({ connected: false, charges_enabled: false, payouts_enabled: false });
    }
    const stripe = getStripeServer();
    const account = await stripe.accounts.retrieve(accountId);
    const charges = !!account.charges_enabled;
    const payouts = !!account.payouts_enabled;
    // Sync DB si changé
    if (charges !== seller.stripe_charges_enabled || payouts !== seller.stripe_payouts_enabled) {
      await admin.from("sellers").update({ stripe_charges_enabled: charges, stripe_payouts_enabled: payouts }).eq("id", seller.id);
    }
    return NextResponse.json({
      connected: true,
      charges_enabled: charges,
      payouts_enabled: payouts,
      details_submitted: !!account.details_submitted,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur Stripe";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
