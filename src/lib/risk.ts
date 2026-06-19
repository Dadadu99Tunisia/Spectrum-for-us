import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Risk scoring vendeur (niveau SELLER).
 * Basé sur le taux de remboursement et de litige des commandes rattachées aux activités du seller.
 * Sert à : prioriser la revue manuelle + (optionnel) retenir les versements Stripe (delay_days).
 */

export type RiskLevel = "low" | "medium" | "high";
export type RiskResult = {
  risk_level: RiskLevel;
  paid_orders: number;
  refunds: number;
  disputes: number;
  refund_rate: number;
  dispute_rate: number;
};

const PAIDISH = ["paid", "shipped", "delivered", "refunded"];

export async function computeSellerRisk(admin: SupabaseClient, sellerId: string): Promise<RiskResult> {
  const zero: RiskResult = { risk_level: "low", paid_orders: 0, refunds: 0, disputes: 0, refund_rate: 0, dispute_rate: 0 };

  const { data: shops } = await admin.from("shops").select("id").eq("seller_id", sellerId);
  const shopIds = (shops ?? []).map(s => s.id as string);
  if (!shopIds.length) return zero;

  const { data: items } = await admin.from("order_items").select("order_id").in("activity_id", shopIds);
  const orderIds = [...new Set((items ?? []).map(i => i.order_id as string))];
  if (!orderIds.length) return zero;

  const { data: orders } = await admin
    .from("orders")
    .select("status, refund_status, dispute_status, dispute_opened_at")
    .in("id", orderIds);

  const rows = (orders ?? []) as { status: string; refund_status: string | null; dispute_status: string | null; dispute_opened_at: string | null }[];
  const paid = rows.filter(o => PAIDISH.includes(o.status));
  const total = paid.length;
  const refunds = rows.filter(o => o.refund_status && o.refund_status !== "none").length;
  const disputes = rows.filter(o => (o.dispute_status && o.dispute_status !== "none") || o.dispute_opened_at).length;

  const refund_rate = total ? refunds / total : 0;
  const dispute_rate = total ? disputes / total : 0;

  let risk: RiskLevel = "low";
  if (total >= 5) {
    if (dispute_rate > 0.02 || refund_rate > 0.15) risk = "high";
    else if (dispute_rate > 0 || refund_rate > 0.07) risk = "medium";
  } else if (disputes > 0) {
    risk = "medium"; // peu de volume mais déjà un litige → vigilance
  }

  return { risk_level: risk, paid_orders: total, refunds, disputes, refund_rate, dispute_rate };
}
