import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe secret key not configured. Add STRIPE_SECRET_KEY to .env.local" },
      { status: 503 }
    );
  }

  try {
    const { amount, currency = "eur", metadata } = await req.json();

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Montant invalide (minimum 0.50 €)" }, { status: 400 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // montant en centimes
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: metadata ?? {},
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
