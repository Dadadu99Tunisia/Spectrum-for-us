import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo","cfo","support"]);
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, Number(searchParams.get("page")    ?? 1));
  const limit    = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const status   = searchParams.get("status")    ?? "";
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo   = searchParams.get("date_to")   ?? "";
  const offset   = (page - 1) * limit;

  const supabase = createAdminClient();
  let query = supabase
    .from("orders")
    .select("id, status, total_amount, created_at, tracking_number, carrier, dispute_status, refund_status, refund_amount, user_id, shipping_name, shipping_email, payment_intent_id", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (status)   query = query.eq("status", status);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo)   query = query.lte("created_at", dateTo);

  const { data: orders, error, count } = await query;
  if (error) return apiError(error.message);

  // Enrichir avec les profils acheteurs
  const userIds = [...new Set((orders ?? []).map(o => o.user_id).filter(Boolean))];
  const profileMap: Record<string, { id: string; full_name: string | null }> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
    for (const p of profiles ?? []) profileMap[p.id] = p;
  }

  const enriched = (orders ?? []).map(o => ({
    ...o,
    profiles: profileMap[o.user_id] ?? null,
  }));

  return apiResponse(enriched, { total: count, page, limit });
}
