import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendVendorNewOrder, trySend } from "@/lib/email";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "product" | "service" | "event";
}

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const stripe = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    if (!webhookSecret) {
      // Mode dev sans secret — logguer un avertissement
      console.warn("[webhook] STRIPE_WEBHOOK_SECRET manquant — signature non vérifiée");
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
  } catch {
    return NextResponse.json({ error: "Webhook signature invalide" }, { status: 400 });
  }

  const supabase = await createClient();

  // ── 1. Paiement produit réussi → créer commande, décrémenter stock, envoyer emails ──
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const { user_id, cart_json, shipping_json, buyer_email } = pi.metadata ?? {};

    if (!user_id || !cart_json) {
      // Payment intent non lié à une commande marketplace (ex. abonnement) — ignorer
      return NextResponse.json({ received: true });
    }

    let cart: CartItem[];
    let shipping: Record<string, string> | null = null;
    try {
      cart = JSON.parse(cart_json);
      if (shipping_json) shipping = JSON.parse(shipping_json);
    } catch {
      console.error("[webhook] Erreur parsing cart_json", cart_json);
      return NextResponse.json({ error: "Données panier invalides" }, { status: 400 });
    }

    // Idempotence : vérifier si la commande existe déjà (double-fire webhook)
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("payment_intent_id", pi.id)
      .maybeSingle();
    if (existing) return NextResponse.json({ received: true }); // déjà traité

    // Vérifier stock et récupérer les infos produits depuis la DB (ne jamais faire confiance au client)
    const productIds = cart.map(i => i.id);
    const { data: products } = await supabase
      .from("products")
      .select("id, price, is_active, quantity, type, name, title, shop_id")
      .in("id", productIds);

    const productMap = Object.fromEntries((products ?? []).map(p => [p.id, p]));

    // Vérifier que tous les produits sont actifs + stock suffisant
    for (const item of cart) {
      const p = productMap[item.id];
      if (!p || !p.is_active) {
        // Produit retiré entre le paiement et le traitement — remboursement auto
        await stripe.refunds.create({ payment_intent: pi.id, reason: "fraudulent" });
        console.warn(`[webhook] Produit inactif ${item.id} — remboursement déclenché`);
        return NextResponse.json({ received: true });
      }
      if (p.type === "product" && p.quantity !== null && p.quantity < item.quantity) {
        // Stock insuffisant — remboursement auto
        await stripe.refunds.create({ payment_intent: pi.id, reason: "requested_by_customer" });
        console.warn(`[webhook] Stock insuffisant ${item.id} — remboursement déclenché`);
        return NextResponse.json({ received: true });
      }
    }

    // Calculer le total réel côté serveur
    const serverTotal = cart.reduce((sum, item) => {
      const p = productMap[item.id];
      return sum + (p ? Number(p.price) * item.quantity : 0);
    }, 0);

    // Récupérer les shop owner_ids pour les notifications vendeurs
    const shopIds = [...new Set((products ?? []).map(p => p.shop_id).filter(Boolean))];
    const { data: shops } = shopIds.length > 0
      ? await supabase.from("shops").select("id, name, owner_id").in("id", shopIds)
      : { data: [] };
    const shopMap = Object.fromEntries((shops ?? []).map(s => [s.id, s]));

    // Récupérer emails des owners
    const ownerIds = [...new Set((shops ?? []).map(s => s.owner_id).filter(Boolean))];
    const { data: ownerProfiles } = ownerIds.length > 0
      ? await supabase.from("profiles").select("id, email: id").in("id", ownerIds)
      : { data: [] };
    // Note: email est dans auth.users, pas profiles — on utilise buyer_email pour l'acheteur
    // Pour les vendors, on envoie via leur profil auth
    const { data: ownerUsers } = ownerIds.length > 0
      ? await supabase.auth.admin?.listUsers?.() ?? { data: null }
      : { data: null };

    // Créer la commande
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id,
        total_amount: Math.round(serverTotal * 100) / 100,
        status: "paid",
        payment_intent_id: pi.id,
        shipping_name:    shipping?.name    ?? null,
        shipping_email:   shipping?.email   ?? buyer_email ?? null,
        shipping_address: shipping?.address ?? null,
        shipping_city:    shipping?.city    ?? null,
        shipping_zip:     shipping?.zip     ?? null,
        shipping_country: shipping?.country ?? "FR",
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      console.error("[webhook] Erreur création order", orderErr);
      return NextResponse.json({ error: "Order insert failed" }, { status: 500 });
    }

    // Créer les order_items
    const orderItems = cart.map(item => {
      const p = productMap[item.id];
      const shop = p ? shopMap[p.shop_id] : null;
      return {
        order_id: order.id,
        product_id: item.id,
        vendor_id: shop?.owner_id ?? null,
        quantity: item.quantity,
        price_at_purchase: p ? Number(p.price) : item.price,
      };
    });

    await supabase.from("order_items").insert(orderItems);

    // Décrémenter le stock des produits physiques (atomique)
    const physicalItems = cart.filter(item => {
      const p = productMap[item.id];
      return p?.type === "product" && p.quantity !== null;
    });
    for (const item of physicalItems) {
      await supabase.rpc("decrement_stock", {
        p_product_id: item.id,
        p_qty: item.quantity,
      });
    }

    // ── Emails ──────────────────────────────────────────────
    const emailItems = cart.map(item => {
      const p = productMap[item.id];
      return {
        name: p ? String(p.name || p.title) : item.name,
        price: p ? Number(p.price) : item.price,
        quantity: item.quantity,
      };
    });

    // Email acheteur
    const buyerEmail = shipping?.email ?? buyer_email;
    if (buyerEmail) {
      await trySend(() => sendOrderConfirmation({
        to: buyerEmail,
        orderRef: order.id,
        items: emailItems,
        total: serverTotal,
        shippingName: shipping?.name,
      }));
    }

    // Email vendeur(s) — groupé par boutique
    const vendorItems = new Map<string, { shopName: string; email: string; items: typeof emailItems }>();
    for (const item of cart) {
      const p = productMap[item.id];
      if (!p) continue;
      const shop = shopMap[p.shop_id];
      if (!shop) continue;
      const entry = vendorItems.get(shop.owner_id);
      const emailItem = { name: String(p.name || p.title), price: Number(p.price), quantity: item.quantity };
      if (entry) {
        entry.items.push(emailItem);
      } else {
        vendorItems.set(shop.owner_id, {
          shopName: shop.name,
          email: "", // sera récupéré via auth admin
          items: [emailItem],
        });
      }
    }
    // Note: sans service_role on ne peut pas lire auth.users directement.
    // En production, configurer un edge function Supabase pour notifier les vendors.
    // Pour l'instant on log seulement.
    console.log(`[webhook] Commande ${order.id} créée — ${cart.length} article(s) — ${vendorItems.size} vendeur(s)`);
  }

  // ── 2. Abonnement vendeur souscrit ──────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const shopId = session.metadata?.shop_id;
    if (shopId && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const subAny = sub as unknown as { current_period_end: number };
      await supabase.from("shops").update({
        subscription_status: "active",
        subscription_id: sub.id,
        subscription_current_period_end: new Date(subAny.current_period_end * 1000).toISOString(),
      }).eq("id", shopId);
    }
  }

  // ── 3. Abonnement mis à jour / annulé ────────────────────────────────────────
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub    = event.data.object as Stripe.Subscription;
    const subAny = sub as unknown as { current_period_end: number };
    await supabase.from("shops").update({
      subscription_status: sub.status === "active" ? "active" : "inactive",
      subscription_current_period_end: new Date(subAny.current_period_end * 1000).toISOString(),
    }).eq("subscription_id", sub.id);
  }

  // ── 4. Paiement échoué ────────────────────────────────────────────────────────
  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const { user_id } = pi.metadata ?? {};
    if (user_id) {
      // Marquer une éventuelle commande en attente comme failed
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("payment_intent_id", pi.id)
        .eq("status", "pending");
    }
  }

  return NextResponse.json({ received: true });
}
