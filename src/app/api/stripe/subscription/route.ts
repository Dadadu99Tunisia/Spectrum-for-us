import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureSeller } from "@/lib/seller";

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  const stripe = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const { priceId, shopId } = await req.json();
    if (!priceId) return NextResponse.json({ error: "NEXT_PUBLIC_STRIPE_VENDOR_PRICE_ID non configuré. Ajoute cette variable dans Vercel." }, { status: 503 });

    // Client Stripe d'abonnement = au niveau SELLER (partagé par toutes ses activités)
    const admin = createAdminClient();
    const seller = await ensureSeller(admin, user.id);
    let customerId = seller.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id, seller_id: seller.id },
      });
      customerId = customer.id;
      await admin.from("sellers").update({ stripe_customer_id: customerId }).eq("id", seller.id);
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://spectrumforus.com"}/vendeur?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://spectrumforus.com"}/vendeur/onboarding?step=abonnement`,
      metadata: { shop_id: shopId, user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
