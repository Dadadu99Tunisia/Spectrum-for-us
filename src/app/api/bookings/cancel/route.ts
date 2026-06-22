import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeServer } from "@/lib/stripe-server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  let body: { booking_id?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide" }, { status: 400 }); }
  const { booking_id } = body;
  if (!booking_id) return NextResponse.json({ error: "booking_id manquant" }, { status: 400 });

  const admin = createAdminClient();
  const { data: bk } = await admin.from("bookings")
    .select("id, customer_id, shop_id, status, start_at, payment_intent_id, amount").eq("id", booking_id).maybeSingle();
  if (!bk) return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });

  // Autorisation : client·e propriétaire OU propriétaire de la boutique
  const { data: shop } = await admin.from("shops").select("owner_id").eq("id", bk.shop_id).maybeSingle();
  const isCustomer = bk.customer_id === user.id;
  const isVendor = shop?.owner_id === user.id;
  if (!isCustomer && !isVendor) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  if (bk.status === "cancelled") return NextResponse.json({ ok: true, status: "cancelled" });
  if (new Date(bk.start_at as string).getTime() <= Date.now())
    return NextResponse.json({ error: "Ce créneau est déjà passé." }, { status: 409 });

  // Réclame ATOMIQUEMENT l'annulation d'une résa CONFIRMÉE (un seul gagnant → anti double-remboursement).
  let refunded = false;
  const { data: claimed } = await admin.from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", booking_id).eq("status", "confirmed").select("id");

  if (claimed && claimed.length) {
    if (bk.payment_intent_id) {
      try {
        const stripe = getStripeServer();
        await stripe.refunds.create({ payment_intent: bk.payment_intent_id }, { idempotencyKey: `bk_refund_${booking_id}` });
        refunded = true;
        try {
          const transfers = await stripe.transfers.list({ transfer_group: `bk_${bk.id}`, limit: 5 });
          for (const t of transfers.data) await stripe.transfers.createReversal(t.id, {}, { idempotencyKey: `bk_rev_${t.id}` });
        } catch (e) { console.error("[cancel] reversal", e); }
      } catch (e) { console.error("[cancel] refund", e); }
    }
  } else {
    // Pas confirmée → annule si encore "pending" (sinon déjà annulée : no-op).
    await admin.from("bookings").update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", booking_id).eq("status", "pending");
  }
  return NextResponse.json({ ok: true, status: "cancelled", refunded });
}
