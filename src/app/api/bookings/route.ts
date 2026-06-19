import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeServer } from "@/lib/stripe-server";
import { getCommissionRate } from "@/lib/commission";
import { generateSlots, type AvailabilityRule } from "@/lib/slots";
import { sellerForShop } from "@/lib/seller";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connecte-toi pour réserver." }, { status: 401 });

  let body: { product_id?: string; start_at?: string; name?: string; note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide" }, { status: 400 }); }
  const { product_id, start_at, name, note } = body;
  if (!product_id || !start_at) return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });

  const admin = createAdminClient();

  // Libère les créneaux des réservations "en attente" périmées (paiement abandonné)
  try { await admin.rpc("expire_stale_bookings"); } catch { /* non bloquant */ }

  // Produit service + boutique
  const { data: product } = await admin.from("products")
    .select("id, name, title, price, type, shop_id, is_active").eq("id", product_id).maybeSingle();
  if (!product || !product.is_active || product.type !== "service")
    return NextResponse.json({ error: "Service introuvable" }, { status: 404 });

  const { data: shop } = await admin.from("shops")
    .select("id, name").eq("id", product.shop_id).maybeSingle();
  if (!shop) return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
  // Compte Stripe destinataire = celui du SELLER de l'activité (partagé)
  const seller = await sellerForShop(admin, product.shop_id);
  if (!seller?.stripe_account_id || !seller.stripe_charges_enabled)
    return NextResponse.json({ error: "Ce·tte prestataire n'a pas encore activé les paiements." }, { status: 400 });

  // Recalcul des créneaux SERVEUR pour valider start_at
  const [{ data: rules }, { data: blackouts }, { data: booked }] = await Promise.all([
    admin.from("service_availability").select("weekday, specific_date, start_time, end_time, slot_minutes").eq("product_id", product_id),
    admin.from("service_blackouts").select("date").eq("product_id", product_id),
    admin.from("bookings").select("start_at").eq("product_id", product_id).in("status", ["pending", "confirmed"]),
  ]);

  const startDate = new Date(start_at);
  if (isNaN(startDate.getTime()) || startDate.getTime() <= Date.now())
    return NextResponse.json({ error: "Créneau invalide" }, { status: 400 });

  const slotsByDay = generateSlots({
    rules: (rules ?? []) as AvailabilityRule[],
    blackouts: (blackouts ?? []).map(b => b.date as string),
    booked: (booked ?? []).map(b => ({ start: new Date(b.start_at as string).getTime() })),
    fromDate: startDate,
    days: 1,
  });
  const daySlots = Object.values(slotsByDay)[0] ?? [];
  const match = daySlots.find(s => s.start.getTime() === startDate.getTime());
  if (!match) return NextResponse.json({ error: "Ce créneau n'est plus disponible." }, { status: 409 });

  const amountCents = Math.round(Number(product.price) * 100);
  if (amountCents < 50) return NextResponse.json({ error: "Montant trop faible" }, { status: 400 });

  // Réserve le créneau (l'index unique empêche le double-booking)
  const { data: booking, error: bErr } = await admin.from("bookings").insert({
    product_id, shop_id: shop.id, customer_id: user.id,
    customer_name: name?.trim() || null, customer_email: user.email ?? null,
    start_at: match.start.toISOString(), end_at: match.end.toISOString(),
    status: "pending", amount: amountCents / 100, note: note?.trim() || null,
  }).select("id").single();
  if (bErr) {
    if (bErr.code === "23505") return NextResponse.json({ error: "Ce créneau vient d'être réservé." }, { status: 409 });
    return NextResponse.json({ error: bErr.message }, { status: 500 });
  }

  try {
    const stripe = getStripeServer();
    const rate = await getCommissionRate(admin, shop.id);
    const commission = Math.round(amountCents * (rate / 100));
    const transferAmount = amountCents - commission;
    const transferGroup = `bk_${booking.id}`;

    // Customer Stripe (réutilisation carte)
    const { data: prof } = await admin.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
    let customerId = prof?.stripe_customer_id as string | null;
    if (!customerId) {
      const c = await stripe.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
      customerId = c.id;
      await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const pi = await stripe.paymentIntents.create({
      amount: amountCents, currency: "eur",
      automatic_payment_methods: { enabled: true },
      customer: customerId,
      transfer_group: transferGroup,
      metadata: {
        booking_id: booking.id, shop_id: shop.id, user_id: user.id,
        transfer_account: seller.stripe_account_id, transfer_amount: String(transferAmount), transfer_group: transferGroup,
      },
    });
    await admin.from("bookings").update({ payment_intent_id: pi.id }).eq("id", booking.id);

    return NextResponse.json({ clientSecret: pi.client_secret, amount: amountCents / 100, bookingId: booking.id });
  } catch (e) {
    // Annule la réservation si le paiement n'a pas pu être initié
    await admin.from("bookings").delete().eq("id", booking.id);
    const msg = e instanceof Error ? e.message : "Erreur paiement";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
