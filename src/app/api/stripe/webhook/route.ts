import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const stripe = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(body, sig, webhookSecret)
      : JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalide" }, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const shopId = session.metadata?.shop_id;
    if (shopId && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      await supabase.from("shops").update({
        subscription_status: "active",
        subscription_id: sub.id,
        subscription_current_period_end: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
      }).eq("id", shopId);
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const subWithPeriod = sub as unknown as { current_period_end: number };
    await supabase.from("shops").update({
      subscription_status: sub.status === "active" ? "active" : "inactive",
      subscription_current_period_end: new Date(subWithPeriod.current_period_end * 1000).toISOString(),
    }).eq("subscription_id", sub.id);
  }

  return NextResponse.json({ received: true });
}
