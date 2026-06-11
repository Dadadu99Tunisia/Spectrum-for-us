import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","support"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const { amount, reason } = body;

  // Valider le montant si fourni
  if (amount !== undefined && amount !== null) {
    if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
      return apiError("amount doit être un entier positif (en centimes)", 400);
    }
    if (amount > 100_000_00) { // 100 000 € max
      return apiError("Montant de remboursement trop élevé", 400);
    }
  }

  const supabase = createAdminClient();
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, total_amount, status, payment_intent_id, refund_status")
    .eq("id", id)
    .single();

  if (orderErr || !order) return apiError("Order not found", 404);
  if (order.refund_status === "refunded") return apiError("Order already refunded");
  if (!order.payment_intent_id) return apiError("No payment intent on this order");

  const pi = await stripe.paymentIntents.retrieve(order.payment_intent_id as string);
  const chargeId = typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id;
  if (!chargeId) return apiError("No charge found");

  const refundAmount = amount ?? Math.round(Number(order.total_amount) * 100);

  const refund = await stripe.refunds.create({
    charge: chargeId,
    amount: refundAmount,
    reason: "requested_by_customer",
    metadata: { admin_id: auth.user.id, order_id: id, reason: reason ?? "" },
  });

  await supabase.from("orders").update({
    refund_status: "refunded",
    refund_amount: refundAmount / 100,
    status: "cancelled",
  }).eq("id", id);

  await logActivity(auth.user.id, "refund_order", "order", id, {
    amount: refundAmount / 100,
    refund_id: refund.id,
    reason,
  });

  return apiResponse({ refund_id: refund.id, amount: refundAmount / 100, status: refund.status });
}
