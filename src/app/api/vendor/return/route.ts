import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeServer } from "@/lib/stripe-server";
import { sendRefundConfirmation, trySend } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  let body: { id?: string; action?: "approve" | "refuse"; note?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Requête invalide" }, { status: 400 }); }
  const { id, action, note } = body;
  if (!id || (action !== "approve" && action !== "refuse"))
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });

  // Lecture sous RLS : ne renvoie la demande que si l'utilisateur·ice est propriétaire de la boutique
  const { data: rr } = await supabase
    .from("return_requests")
    .select("id, order_id, shop_id, user_id, status")
    .eq("id", id)
    .maybeSingle();
  if (!rr) return NextResponse.json({ error: "Demande introuvable ou non autorisée" }, { status: 403 });
  if (rr.status !== "requested") return NextResponse.json({ error: "Demande déjà traitée" }, { status: 409 });

  // ── Refus ──
  if (action === "refuse") {
    const { error } = await supabase.from("return_requests")
      .update({ status: "refused", vendor_note: note?.trim() || null, resolved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, status: "refused" });
  }

  // ── Approbation = remboursement ──
  const admin = createAdminClient();

  // Boutique → propriétaire (pour retrouver les items du vendeur)
  const { data: shop } = await admin.from("shops").select("id, owner_id").eq("id", rr.shop_id).maybeSingle();
  const { data: order } = await admin.from("orders").select("id, payment_intent_id").eq("id", rr.order_id).maybeSingle();
  if (!shop || !order?.payment_intent_id)
    return NextResponse.json({ error: "Commande ou boutique introuvable" }, { status: 404 });

  // Montant remboursé = sous-total des articles de cette boutique + frais de port de ce colis
  const { data: oitems } = await admin
    .from("order_items").select("price_at_purchase, quantity, vendor_id")
    .eq("order_id", rr.order_id).eq("vendor_id", shop.owner_id);
  const itemsTotal = (oitems ?? []).reduce((s, it) => s + Number(it.price_at_purchase) * it.quantity, 0);
  const { data: ship } = await admin
    .from("order_shipments").select("shipping_cost").eq("order_id", rr.order_id).eq("shop_id", rr.shop_id).maybeSingle();
  const shipCost = ship ? Number(ship.shipping_cost) : 0;
  const refundCents = Math.round((itemsTotal + shipCost) * 100);
  if (refundCents <= 0) return NextResponse.json({ error: "Montant à rembourser nul" }, { status: 400 });

  const stripe = getStripeServer();
  let refundId: string | null = null;
  try {
    // 1) Rembourser l'acheteur·se (partiel, montant de cette boutique)
    const refund = await stripe.refunds.create({ payment_intent: order.payment_intent_id, amount: refundCents });
    refundId = refund.id;

    // 2) Reprendre le versement au·à la vendeur·se (annulation du transfert de cette boutique)
    try {
      const pi = await stripe.paymentIntents.retrieve(order.payment_intent_id);
      const group = (pi.metadata?.transfer_group ?? pi.transfer_group) as string | undefined;
      if (group) {
        const transfers = await stripe.transfers.list({ transfer_group: group, limit: 20 });
        const t = transfers.data.find(x => x.metadata?.shop_id === rr.shop_id);
        if (t) {
          const reverseAmount = Math.min(t.amount, refundCents);
          await stripe.transfers.createReversal(t.id, { amount: reverseAmount });
        }
      }
    } catch (e) {
      console.error("[return] reversal transfert (non bloquant)", e);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur Stripe";
    return NextResponse.json({ error: "Remboursement échoué : " + msg }, { status: 500 });
  }

  const { error } = await supabase.from("return_requests")
    .update({
      status: "refunded", refund_amount: refundCents / 100, stripe_refund_id: refundId,
      vendor_note: note?.trim() || null, resolved_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Reflète aussi l'état sur la commande (best-effort)
  try { await admin.from("orders").update({ refund_status: "refunded", refund_amount: refundCents / 100 }).eq("id", rr.order_id); } catch {}

  // E-mail de confirmation à l'acheteur·se (best-effort, non bloquant)
  try {
    const { data: ord } = await admin.from("orders").select("shipping_email, user_id").eq("id", rr.order_id).maybeSingle();
    let to = ord?.shipping_email as string | null;
    if (!to && ord?.user_id) {
      const { data: prof } = await admin.from("profiles").select("email").eq("id", ord.user_id).maybeSingle();
      to = (prof?.email as string) ?? null;
    }
    if (to) await trySend(() => sendRefundConfirmation({ to, orderRef: rr.order_id, amount: refundCents / 100 }));
  } catch (e) {
    console.error("[return] email remboursement non bloquant", e);
  }

  return NextResponse.json({ ok: true, status: "refunded", refund_amount: refundCents / 100 });
}
