import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmation, trySend, sendBookingConfirmation, sendBookingVendorAlert, sendVendorNewOrder } from "@/lib/email";
import { getCommissionRates, resolveCommissionRate } from "@/lib/commission";

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
    const { user_id, cart_json, shipping_json, shipments_json, buyer_email } = pi.metadata ?? {};

    // ── 0. Réservation de service (booking) ──
    const bookingId = pi.metadata?.booking_id;
    if (bookingId) {
      // Idempotence atomique : on ne passe à "confirmed" QUE si la ligne était encore "pending".
      // Si 0 ligne mise à jour, c'est qu'une autre invocation du webhook a déjà tout traité → on sort.
      const { data: claimed } = await supabase.from("bookings")
        .update({ status: "confirmed", updated_at: new Date().toISOString() })
        .eq("id", bookingId).eq("status", "pending")
        .select("id, start_at, customer_email, product_id, shop_id, amount");
      const bk = claimed && claimed[0];
      if (bk) {
        // Transfert au·à la prestataire (sous-total − commission) · clé d'idempotence = pas de double versement
        try {
          const account = pi.metadata?.transfer_account;
          const amount = parseInt(pi.metadata?.transfer_amount ?? "0");
          const chargeId = typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id;
          if (account && amount > 0) {
            await stripe.transfers.create({
              amount, currency: pi.currency, destination: account,
              ...(chargeId ? { source_transaction: chargeId } : {}),
              transfer_group: pi.metadata?.transfer_group ?? `bk_${bookingId}`,
              metadata: { booking_id: bookingId, shop_id: bk.shop_id },
            }, { idempotencyKey: `bk_transfer_${bookingId}` });
          }
        } catch (e) { console.error("[webhook] transfert booking (non bloquant)", e); }
        // E-mails (client·e + prestataire)
        try {
          const { data: prod } = await supabase.from("products").select("name, title").eq("id", bk.product_id).maybeSingle();
          const { data: shop } = await supabase.from("shops").select("name, owner_id").eq("id", bk.shop_id).maybeSingle();
          const when = new Date(bk.start_at as string).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" });
          const svc = prod?.name || prod?.title || "votre service";
          if (bk.customer_email) {
            await trySend(() => sendBookingConfirmation({ to: bk.customer_email as string, service: svc, when, shop: shop?.name ?? "" }));
          }
          if (shop?.owner_id) {
            const { data: owner } = await supabase.from("profiles").select("email").eq("id", shop.owner_id).maybeSingle();
            if (owner?.email) await trySend(() => sendBookingVendorAlert({ to: owner.email as string, service: svc, when }));
          }
        } catch (e) { console.error("[webhook] emails booking (non bloquant)", e); }
      }
      return NextResponse.json({ received: true });
    }

    if (!user_id || !cart_json) {
      // Payment intent non lié à une commande marketplace (ex. abonnement) · ignorer
      return NextResponse.json({ received: true });
    }

    let cart: CartItem[];
    let shipping: Record<string, string> | null = null;
    let shipments: { shop_id: string; method_type: string; method_label: string; cost: number; relay_point: Record<string, string> | null }[] = [];
    try {
      cart = JSON.parse(cart_json);
      if (shipping_json) shipping = JSON.parse(shipping_json);
      if (shipments_json) shipments = JSON.parse(shipments_json);
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

    // Calculer le total réel côté serveur (produits + frais de port)
    const productsTotal = cart.reduce((sum, item) => {
      const p = productMap[item.id];
      return sum + (p ? Number(p.price) * item.quantity : 0);
    }, 0);
    const shippingTotal = shipments.reduce((sum, s) => sum + (Number(s.cost) || 0) / 100, 0);
    const discountAmount = Number(pi.metadata?.discount_amount || 0);
    const serverTotal = Math.max(0, productsTotal + shippingTotal - discountAmount);

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
      // 23505 = la commande pour ce PaymentIntent existe déjà (rejeu webhook concurrent) → déjà traité
      if (orderErr?.code === "23505") return NextResponse.json({ received: true, duplicate: true });
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
        activity_id: p?.shop_id ?? null, // segmentation par activité
        quantity: item.quantity,
        price_at_purchase: p ? Number(p.price) : item.price,
      };
    });

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
    if (itemsErr) {
      // Échec partiel : on annule la commande pour que le rejeu Stripe la recrée proprement
      // (AVANT toute émission de transfert → pas d'argent envoyé sur une commande incomplète).
      console.error("[webhook] order_items insert échoué, rollback order", itemsErr);
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "order_items insert failed" }, { status: 500 });
    }

    // Panier récupéré → plus de relance d'abandon
    try { await supabase.from("abandoned_carts").update({ recovered_at: new Date().toISOString() }).eq("user_id", user_id); } catch {}

    // Incrémente l'usage du code promo utilisé
    const usedCode = pi.metadata?.discount_code;
    if (usedCode) {
      try {
        const { data: dc } = await supabase.from("discount_codes").select("id, used_count").ilike("code", usedCode).maybeSingle();
        if (dc) await supabase.from("discount_codes").update({ used_count: (dc.used_count ?? 0) + 1 }).eq("id", dc.id);
      } catch (e) { console.error("[webhook] incrément code promo", e); }
    }

    // Créer les colis (un par boutique) à partir des frais de port choisis
    if (shipments.length > 0) {
      const shipmentRows = shipments.map(s => ({
        order_id: order.id,
        shop_id: s.shop_id,
        method_type: s.method_type || "home",
        method_label: s.method_label || null,
        shipping_cost: Math.round((Number(s.cost) || 0)) / 100,
        relay_point: s.relay_point ?? null,
        status: "pending",
      }));
      const { error: shipErr } = await supabase.from("order_shipments").insert(shipmentRows);
      if (shipErr) console.error("[webhook] order_shipments insert", shipErr);
    }

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
          }, { idempotencyKey: `tr_${pi.id}_${t.s}` }); // anti double-payout sur rejeu
        }
      }
    } catch (e) {
      console.error("[webhook] transfers vendeurs (non-bloquant)", e);
    }

    // ── Commissions (par boutique) · traçables, non bloquant ────────────────
    // Taux selon le rail de versement : Stripe (5 %, 0 % fondateur) vs manuel
    // (12 %, 6 % fondateur). Cf. lib/commission.ts · resolveCommissionRate.
    try {
      const grossByShop: Record<string, number> = {};
      for (const item of cart) {
        const p = productMap[item.id];
        if (!p?.shop_id) continue;
        grossByShop[p.shop_id] = (grossByShop[p.shop_id] ?? 0) + Number(p.price) * item.quantity;
      }
      const shopIdList = Object.keys(grossByShop);
      if (shopIdList.length > 0) {
        const rates = await getCommissionRates(supabase);

        // Rail de versement par boutique (shop → seller.payout_mode)
        const { data: shopSellers } = await supabase
          .from("shops").select("id, sellers(payout_mode)").in("id", shopIdList);
        const payoutModeByShop: Record<string, string | null> = {};
        for (const s of (shopSellers ?? []) as { id: string; sellers?: { payout_mode?: string | null } | { payout_mode?: string | null }[] | null }[]) {
          const rel = s.sellers ?? null;
          payoutModeByShop[s.id] = (Array.isArray(rel) ? rel[0]?.payout_mode : rel?.payout_mode) ?? null;
        }

        const { data: founders } = await supabase
          .from("founder_program_members")
          .select("shop_id, commission_free_until, commission_rate_override")
          .in("shop_id", shopIdList);
        const founderByShop = Object.fromEntries((founders ?? []).map(f => [f.shop_id, f]));

        const commissionRows = shopIdList.map(shopId => {
          const f = founderByShop[shopId] as { commission_free_until: string | null; commission_rate_override: number | null } | undefined;
          const rate = resolveCommissionRate({
            payoutMode: payoutModeByShop[shopId] ?? null,
            founderFreeUntil: f?.commission_free_until ?? null,
            founderOverride: f?.commission_rate_override ?? null,
            rates,
          });
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
    // Notifie chaque vendeur·se de sa commande (service-role → résolution email fiable).
    for (const [ownerId, entry] of vendorItems) {
      try {
        const { data: vu } = await supabase.auth.admin.getUserById(ownerId);
        const vendorEmail = vu?.user?.email;
        if (!vendorEmail) continue;
        const vendorTotal = entry.items.reduce((s, it) => s + it.price * it.quantity, 0);
        await trySend(() => sendVendorNewOrder({
          to: vendorEmail,
          shopName: entry.shopName,
          orderRef: order.id,
          items: entry.items,
          total: vendorTotal,
        }));
      } catch (e) { console.error("[webhook] email vendeur", e); }
    }
    console.log(`[webhook] Commande ${order.id} créée · ${cart.length} article(s) · ${vendorItems.size} vendeur(s) notifié(s)`);
  }

  // ── 2. Abonnement vendeur souscrit ──────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const shopId = session.metadata?.shop_id;
    if (shopId && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const patch = {
        subscription_status: "active",
        subscription_id: sub.id,
        subscription_current_period_end: subPeriodEndISO(sub),
      };
      await supabase.from("shops").update(patch).eq("id", shopId);
      // Canonique : abonnement au niveau du seller (entité financière) + forfait
      const plan = session.metadata?.plan === "studio" ? "studio" : "solo";
      const { data: sh } = await supabase.from("shops").select("seller_id, owner_id").eq("id", shopId).maybeSingle();
      if (sh?.seller_id) await supabase.from("sellers").update({ ...patch, plan }).eq("id", sh.seller_id);
    }
  }

  // ── 3. Abonnement mis à jour / annulé ────────────────────────────────────────
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const stillActive = sub.status === "active";
    const patch = {
      subscription_status: stillActive ? "active" : "inactive",
      subscription_current_period_end: subPeriodEndISO(sub),
    };
    await supabase.from("shops").update(patch).eq("subscription_id", sub.id);
    // Abonnement arrêté → on repasse le forfait à Solo (les activités existantes restent, mais plus de création multi).
    await supabase.from("sellers").update(stillActive ? patch : { ...patch, plan: "solo" }).eq("subscription_id", sub.id);
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

  // Connect · synchronise le statut du compte vendeur (canonique = sellers)
  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    const flags = {
      stripe_charges_enabled: !!account.charges_enabled,
      stripe_payouts_enabled: !!account.payouts_enabled,
    };
    await supabase.from("sellers").update(flags).eq("stripe_account_id", account.id);
    // Legacy : maj de l'activité primaire qui portait encore l'account id (sans effet sinon)
    await supabase.from("shops").update(flags).eq("stripe_account_id", account.id);
  }

  return NextResponse.json({ received: true });
}
