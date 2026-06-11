import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCommissionRate } from "@/lib/commission";
import { limits, rateLimitResponse } from "@/lib/rate-limit";
import { shippingPrice } from "@/lib/shipping";

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

  let body: {
    cart: CartItemInput[]; currency?: string; shipping?: Record<string, string>;
    shipping_selections?: { shop_id: string; method_id: string; relay_point: Record<string, string> | null }[];
  };
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
    .select("id, price, is_active, quantity, type, name, title, shop_id, weight_grams")
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

  // ── Stripe Connect · multi-vendeur (separate charges & transfers) ──
  // Sous-total (centimes) par boutique
  const subtotalByShop: Record<string, number> = {};
  const weightByShop: Record<string, number> = {};
  for (const item of cart) {
    const p = productMap[item.id];
    const sid = p.shop_id as string;
    if (!sid) continue;
    subtotalByShop[sid] = (subtotalByShop[sid] ?? 0) + Math.round(Number(p.price) * 100 * item.quantity);
    weightByShop[sid] = (weightByShop[sid] ?? 0) + (Number(p.weight_grams ?? 500) || 500) * item.quantity;
  }
  const shopIds = Object.keys(subtotalByShop);

  const admin = createAdminClient();
  const { data: shops } = await admin
    .from("shops")
    .select("id, name, stripe_account_id, stripe_charges_enabled, shipping_options, payout_mode")
    .in("id", shopIds);
  const shopMap = Object.fromEntries((shops ?? []).map(s => [s.id, s]));

  // Tous les vendeurs doivent pouvoir être payés : soit Stripe activé, soit versement manuel
  for (const sid of shopIds) {
    const s = shopMap[sid];
    const manual = s?.payout_mode === "manual";
    if (!manual && (!s?.stripe_account_id || !s.stripe_charges_enabled)) {
      return NextResponse.json(
        { error: `${s?.name ?? "Un vendeur"} n'a pas encore activé ses paiements. Retire ses articles ou reviens bientôt.` },
        { status: 400 }
      );
    }
  }

  // ── Frais de port par boutique (recalculés SERVEUR, jamais le client) ──
  const shipSelections = Array.isArray(body.shipping_selections) ? body.shipping_selections : [];
  const shipmentByShop: Record<string, { method_type: string; method_label: string; cost: number; relay_point: Record<string, string> | null }> = {};
  let shippingCents = 0;
  for (const sid of shopIds) {
    const opts = Array.isArray(shopMap[sid]?.shipping_options) ? (shopMap[sid].shipping_options as Array<Record<string, unknown>>) : [];
    if (!opts.length) continue; // boutique sans livraison configurée → pas de frais (ex. services)
    const sel = shipSelections.find(s => s.shop_id === sid);
    const method = sel ? opts.find(m => m.id === sel.method_id && m.enabled) : null;
    if (!method) {
      return NextResponse.json({ error: `Choisis un mode de livraison pour ${shopMap[sid]?.name ?? "une boutique"}.` }, { status: 400 });
    }
    const sub = subtotalByShop[sid];
    const freeAbove = method.free_above != null ? Math.round(Number(method.free_above) * 100) : null;
    const free = freeAbove != null && sub >= freeAbove;
    const cost = free ? 0 : Math.round(shippingPrice(String(method.type), weightByShop[sid] ?? 0) * 100);
    shippingCents += cost;
    shipmentByShop[sid] = {
      method_type: String(method.type),
      method_label: String(method.label ?? ""),
      cost,
      relay_point: method.type === "relay" ? (sel?.relay_point ?? null) : null,
    };
  }

  // Reversement par vendeur·se Stripe = sous-total − commission.
  // Les frais de port restent sur la plateforme (c'est elle qui paie l'étiquette via son compte Sendcloud).
  const transfers: { a: string; c: number; s: string }[] = [];
  for (const sid of shopIds) {
    // Versement manuel (pays sans Stripe) : pas de transfert Stripe, l'argent reste sur la plateforme
    // qui reverse à la main (le port leur revient car elles s'expédient elles-mêmes — suivi dans le registre).
    if (shopMap[sid].payout_mode === "manual") continue;
    const rate = await getCommissionRate(admin, sid);
    const sub = subtotalByShop[sid];
    const commission = Math.round(sub * (rate / 100));
    transfers.push({ a: shopMap[sid].stripe_account_id as string, c: sub - commission, s: sid });
  }
  const grandTotalCents = totalCents + shippingCents;
  const transferGroup = `sfu_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // ── Customer Stripe (cartes enregistrées + réutilisation) ──
  const { data: prof } = await admin.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
  let customerId = prof?.stripe_customer_id as string | null;
  if (!customerId) {
    const c = await stripe.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
    customerId = c.id;
    await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }
  // Session client pour afficher les cartes enregistrées dans le PaymentElement
  const customerSession = await stripe.customerSessions.create({
    customer: customerId,
    components: {
      payment_element: {
        enabled: true,
        features: { payment_method_save: "enabled", payment_method_redisplay: "enabled", payment_method_remove: "enabled" },
      },
    },
  });

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

  // Colis à créer par le webhook (un par boutique)
  const shipmentsMeta = Object.entries(shipmentByShop).map(([shop_id, v]) => ({ shop_id, ...v }));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: grandTotalCents,
    currency,
    automatic_payment_methods: { enabled: true },
    customer: customerId,
    setup_future_usage: "off_session", // enregistre la carte pour les prochains achats
    // Paiement encaissé par la plateforme, puis reversé à chaque vendeur (webhook)
    transfer_group: transferGroup,
    metadata: {
      user_id: user.id,
      buyer_email: user.email ?? "",
      cart_json: JSON.stringify(serverCart),
      shipping_json: shipping ? JSON.stringify(shipping) : "",
      transfer_group: transferGroup,
      transfers_json: JSON.stringify(transfers),
      shipments_json: JSON.stringify(shipmentsMeta),
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    customerSessionClientSecret: customerSession.client_secret,
    serverTotal: grandTotalCents / 100,
  });
}
