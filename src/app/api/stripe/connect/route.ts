import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeServer, PLATFORM_URL } from "@/lib/stripe-server";

/**
 * Stripe Connect (Express) · onboarding du vendeur.
 * POST → crée/récupère le compte Express + renvoie un lien d'onboarding.
 * GET  → statut actuel (rafraîchi depuis Stripe).
 */

async function getShop() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const admin = createAdminClient();
  const { data: shop } = await admin
    .from("shops")
    .select("id, name, stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!shop) return { error: NextResponse.json({ error: "Aucune boutique" }, { status: 404 }) };
  return { user, shop, admin };
}

export async function POST() {
  try {
    const ctx = await getShop();
    if ("error" in ctx) return ctx.error;
    const { user, shop, admin } = ctx;
    const stripe = getStripeServer();

    let accountId = shop.stripe_account_id as string | null;

    // Crée le compte Express si nécessaire
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email ?? undefined,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
        business_profile: { name: shop.name as string, url: `${PLATFORM_URL}/boutique` },
        metadata: { shop_id: shop.id as string, user_id: user.id },
      });
      accountId = account.id;
      await admin.from("shops").update({ stripe_account_id: accountId }).eq("id", shop.id);
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
    const ctx = await getShop();
    if ("error" in ctx) return ctx.error;
    const { shop, admin } = ctx;
    const accountId = shop.stripe_account_id as string | null;
    if (!accountId) {
      return NextResponse.json({ connected: false, charges_enabled: false, payouts_enabled: false });
    }
    const stripe = getStripeServer();
    const account = await stripe.accounts.retrieve(accountId);
    const charges = !!account.charges_enabled;
    const payouts = !!account.payouts_enabled;
    // Sync DB si changé
    if (charges !== shop.stripe_charges_enabled || payouts !== shop.stripe_payouts_enabled) {
      await admin.from("shops").update({ stripe_charges_enabled: charges, stripe_payouts_enabled: payouts }).eq("id", shop.id);
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
