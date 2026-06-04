import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { limits, rateLimitResponse } from "@/lib/rate-limit";

interface CartItemInput {
  id: string;
  name: string;
  quantity: number;
  type: "product" | "service" | "event";
}

export async function POST(req: NextRequest) {
  // Auth requise
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Rate limit par user
  const rl = limits.payment(user.id);
  const limited = rateLimitResponse(rl);
  if (limited) return limited;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });

  let body: { cart: CartItemInput[]; currency?: string; shipping?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { cart, currency = "eur", shipping } = body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });
  }

  // Recalcul du total SERVEUR (jamais faire confiance au client)
  const productIds = cart.map(i => i.id);
  const { data: products, error: dbErr } = await supabase
    .from("products")
    .select("id, price, is_active, quantity, type, name, title")
    .in("id", productIds);

  if (dbErr) return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });

  const productMap = Object.fromEntries((products ?? []).map(p => [p.id, p]));

  // Valider chaque article
  for (const item of cart) {
    const p = productMap[item.id];
    if (!p) return NextResponse.json({ error: `Produit introuvable: ${item.id}` }, { status: 400 });
    if (!p.is_active) return NextResponse.json({ error: `Produit indisponible: ${p.name || p.title}` }, { status: 400 });
    if (p.type === "product" && p.quantity !== null && Number(p.quantity) < item.quantity) {
      return NextResponse.json({ error: `Stock insuffisant pour "${p.name || p.title}"` }, { status: 400 });
    }
    if (item.quantity < 1 || item.quantity > 100) {
      return NextResponse.json({ error: "Quantité invalide" }, { status: 400 });
    }
  }

  // Total recalculé
  const serverTotal = cart.reduce((sum, item) => {
    const p = productMap[item.id];
    return sum + (Number(p.price) * 100 * item.quantity);
  }, 0);
  const totalCents = Math.round(serverTotal);

  if (totalCents < 50) {
    return NextResponse.json({ error: "Montant minimum 0,50 €" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });

  // Enrichir le panier avec les prix serveur (pour le webhook)
  const serverCart = cart.map(item => {
    const p = productMap[item.id];
    return {
      id: item.id,
      name: String(p.name || p.title),
      price: Number(p.price),
      quantity: item.quantity,
      type: p.type ?? "product",
    };
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      user_id: user.id,
      buyer_email: user.email ?? "",
      cart_json: JSON.stringify(serverCart),
      shipping_json: shipping ? JSON.stringify(shipping) : "",
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    serverTotal: totalCents / 100,
  });
}
