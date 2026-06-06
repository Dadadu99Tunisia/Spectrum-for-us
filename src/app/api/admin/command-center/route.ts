import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/rbac";

/** Command Center · état temps réel de la plateforme (admin). */
export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const last7 = new Date(Date.now() - 7 * 86400000).toISOString();
  const C = { head: true as const, count: "exact" as const };

  const [todaySales, toProcess, failed7d, modPending, atRiskSubs] = await Promise.all([
    supabase.from("orders").select("total_amount").eq("status", "paid").gte("created_at", dayStart),
    supabase.from("orders").select("id", C).eq("status", "paid"),
    supabase.from("orders").select("id", C).eq("status", "failed").gte("created_at", last7),
    supabase.from("moderation_queue").select("id", C).eq("mod_status", "pending"),
    supabase.from("shops").select("id", C).eq("subscription_status", "active").lt("subscription_current_period_end", now.toISOString()),
  ]);

  const todayRevenue = (todaySales.data ?? []).reduce((s, o) => s + Number(o.total_amount || 0), 0);

  return NextResponse.json({
    todayRevenue: Math.round(todayRevenue * 100) / 100,
    todayOrders: (todaySales.data ?? []).length,
    toProcess: toProcess.count ?? 0,
    failed7d: failed7d.count ?? 0,
    moderationPending: modPending.count ?? 0,
    atRiskSubs: atRiskSubs.count ?? 0,
    ts: now.toISOString(),
  }, { headers: { "Cache-Control": "no-store" } });
}
