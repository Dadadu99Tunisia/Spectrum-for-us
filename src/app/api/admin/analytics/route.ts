import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(["super_admin", "ceo", "commercial"]);
  if ("error" in auth) return auth.error;

  const days = Math.min(90, Math.max(1, Number(new URL(req.url).searchParams.get("days") ?? 30)));
  const since = new Date(Date.now() - days * 86400_000).toISOString();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("analytics_events")
    .select("event_type, user_id, created_at")
    .gte("created_at", since)
    .limit(50000);
  if (error) return apiError(error.message);

  const rows = data ?? [];
  const byType: Record<string, number> = {};
  const byDay: Record<string, number> = {};
  const visitors = new Set<string>();
  for (const r of rows) {
    byType[r.event_type] = (byType[r.event_type] ?? 0) + 1;
    if (r.event_type === "page_view") {
      const d = (r.created_at as string).slice(0, 10);
      byDay[d] = (byDay[d] ?? 0) + 1;
    }
    if (r.user_id) visitors.add(r.user_id as string);
  }

  return apiResponse({
    total: rows.length,
    byType,
    byDay: Object.entries(byDay).sort().map(([date, count]) => ({ date, count })),
    signedVisitors: visitors.size,
    funnel: {
      page_view: byType["page_view"] ?? 0,
      add_to_cart: byType["add_to_cart"] ?? 0,
      follow_shop: byType["follow_shop"] ?? 0,
      newsletter_subscribe: byType["newsletter_subscribe"] ?? 0,
    },
  });
}
