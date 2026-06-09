import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmation, trySend } from "@/lib/email";

/** current_period_end a migré au niveau de l'item d'abonnement (Stripe API récente). */
function subPeriodEndISO(sub: Stripe.Subscription): string | null {
  const end = sub.items?.data?.[0]?.current_period_end;
  return end ? new Date(end * 1000).toISOString() : null;
}

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
      // En production, refuser tout event non signé (sinon n'importe qui peut
      // forger un paiement). En dev seulement, on tolère l'absence de secret.
      if (process.env.NODE_ENV === "production") {
        console.error("[webhook] STRIPE_WEBHOOK_SECRET manquant en production · rejet");
        return NextResponse.json({ error: "Webhook non configuré" }, { status: 503 });
      }
      console.warn("[webhook] STRIPE_WEBHOOK_SECRET manquant · signature non vérifiée (dev)");
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
  } catch {
    return NextResponse.json({ error: "Webhook signature invalide" }, { status: 400 });
  }

  // Client service-role : indispensable car le webhook n'a aucune session
  // utilisateur et les tables orders/order_items exigent le rôle service_role (RLS).
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    console.error("[webhook] service-role indisponible", e);
    // 503 → Stripe réessaiera une fois SUPABASE_SERVICE_ROLE_KEY configurée
    return NextResponse.json({ error: "Service role non configuré" }, { status: 503 });
  }

  // ── 1. Paiement produit réussi → créer commande, décrémenter stock, envoyer emails ──
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const { user_id, cart_json, shipping_json, buyer_email } = pi.metadata ?? {};

    if (!user_id || !cart_json) {
      // Payment intent non lié à une commande marketplace (ex. abonnement) · ignorer
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
        // Produit retiré entre le paiement et le traitement · remboursement auto
        await stripe.refunds.create({ payment_intent: pi.id, reason: "fraudulent" });
        console.warn(`[webhook] Produit inactif ${item.id} · remboursement déclenché`);
        return NextResponse.json({ received: true });
      }
      if (p.type === "product" && p.quantity !== null && p.quantity < item.quantity) {
        // Stock insuffisant · remboursement auto
        await stripe.refunds.create({ payment_intent: pi.id, reason: "requested_by_customer" });
        console.warn(`[webhook] Stock insuffisant ${item.id} · remboursement déclenché`);
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

    // ── Reversements Connect aux vendeurs (separate charges & transfers) ──────
    // Chaque vendeur reçoit son sous-total − commission, prélevé sur la charge.
    try {
      const transfers: { a: string; c: number; s: string }[] = JSON.parse(pi.metadata?.transfers_json ?? "[]");
      const chargeId = typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id;
      const group = pi.metadata?.transfer_group ?? pi.transfer_group ?? undefined;
      for (const t of transfers) {
        if (t.c > 0 && t.a) {
          await stripe.transfers.create({
            amount: t.c,
            currency: pi.currency,
            destination: t.a,
            ...(chargeId ? { source_transaction: chargeId } : {}),
            ...(group ? { transfer_group: group } : {}),
            metadata: { order_pi: pi.id, shop_id: t.s },
          });
        }
      }
    } catch (e) {
      console.error("[webhook] transfers vendeurs (non-bloquant)", e);
    }

    // ── Commissions (par boutique) · traçables, non bloquant ────────────────
    // Taux : 0 % si avantage fondateur·ice actif · sinon override · sinon défaut.
    try {
      const grossByShop: Record<string, number> = {};
      for (const item of cart) {
        const p = productMap[item.id];
        if (!p?.shop_id) continue;
        grossByShop[p.shop_id] = (grossByShop[p.shop_id] ?? 0) + Number(p.price) * item.quantity;
      }
      const shopIdList = Object.keys(grossByShop);
      if (shopIdList.length > 0) {
        const { data: setting } = await supabase
          .from("admin_settings").select("value").eq("key", "commission_rate").maybeSingle();
        const cfg = Number(setting?.value);
        const defaultRate = Number.isFinite(cfg) ? cfg : 8; // % par défaut

        const { data: founders } = await supabase
          .from("founder_program_members")
          .select("shop_id, commission_free_until, commission_rate_override")
          .in("shop_id", shopIdList);
        const founderByShop = Object.fromEntries((founders ?? []).map(f => [f.shop_id, f]));
        const nowMs = Date.now();

        const commissionRows = shopIdList.map(shopId => {
          const f = founderByShop[shopId] as { commission_free_until: string | null; commission_rate_override: number | null } | undefined;
          let rate = defaultRate;
          if (f?.commission_free_until && new Date(f.commission_free_until).getTime() > nowMs) {
            rate = 0; // avantage fondateur·ice actif
          } else if (f?.commission_rate_override != null) {
            rate = Number(f.commission_rate_override);
          }
          const gross = Math.round(grossByShop[shopId] * 100) / 100;
          const amount = Math.round(gross * (rate / 100) * 100) / 100;
          return {
            order_id: order.id, shop_id: shopId,
            gross_amount: gross, commission_rate: rate,
            commission_amount: amount, platform_fee: amount, status: "pending",
          };
        });
        const { error: cErr } = await supabase.from("commissions").insert(commissionRows);
        if (cErr) console.error("[webhook] commissions insert", cErr);
      }
    } catch (e) {
      console.error("[webhook] commission calc failed (non-blocking)", e);
    }

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

    // Email vendeur(s) · groupé par boutique
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
    console.log(`[webhook] Commande ${order.id} créée · ${cart.length} article(s) · ${vendorItems.size} vendeur(s)`);
  }

  // ── 2. Abonnement vendeur souscrit ──────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const shopId = session.metadata?.shop_id;
    if (shopId && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      await supabase.from("shops").update({
        subscription_status: "active",
        subscription_id: sub.id,
        subscription_current_period_end: subPeriodEndISO(sub),
      }).eq("id", shopId);
    }
  }

  // ── 3. Abonnement mis à jour / annulé ────────────────────────────────────────
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    await supabase.from("shops").update({
      subscription_status: sub.status === "active" ? "active" : "inactive",
      subscription_current_period_end: subPeriodEndISO(sub),
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

  // Connect · synchronise le statut du compte vendeur
  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    await supabase
      .from("shops")
      .update({
        stripe_charges_enabled: !!account.charges_enabled,
        stripe_payouts_enabled: !!account.payouts_enabled,
      })
      .eq("stripe_account_id", account.id);
  }

  return NextResponse.json({ received: true });
}
