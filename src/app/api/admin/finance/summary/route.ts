import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiError } from "@/lib/admin/rbac";

export async function GET() {
  const auth = await requireAdmin(["super_admin","ceo","cfo"]);
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const now = new Date();
  const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const prevMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
  const yearStart      = new Date(now.getFullYear(), 0, 1).toISOString();
  const last30         = new Date(Date.now() - 30 * 86400000).toISOString();

  const [thisMonth, prevMonth, thisYear, byStatus, daily, topVendors] = await Promise.all([
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", monthStart),
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", prevMonthStart).lte("created_at", prevMonthEnd),
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", yearStart),
    supabase.from("orders").select("status, total_amount"),
    supabase.from("orders").select("created_at,total_amount").eq("status","paid").gte("created_at", last30).order("created_at"),
    supabase.from("orders").select("shop_id, total_amount").eq("status","paid").gte("created_at", yearStart),
  ]);

  if (thisMonth.error) return apiError(thisMonth.error.message);

  const sum = (rows: { total_amount: number }[] | null) =>
    (rows ?? []).reduce((s, r) => s + Number(r.total_amount || 0), 0);

  const revenueThisMonth = sum(thisMonth.data);
  const revenuePrevMonth = sum(prevMonth.data);
  const revenueYear      = sum(thisYear.data);
  const growth = revenuePrevMonth > 0
    ? ((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100 : 0;

  // Breakdown par statut
  const statusBreakdown: Record<string, { count: number; revenue: number }> = {};
  for (const o of byStatus.data ?? []) {
    if (!statusBreakdown[o.status]) statusBreakdown[o.status] = { count: 0, revenue: 0 };
    statusBreakdown[o.status].count++;
    statusBreakdown[o.status].revenue += Number(o.total_amount || 0);
  }

  // Chart 30 jours
  const dailyMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dailyMap[d.toISOString().split("T")[0]] = 0;
  }
  for (const o of daily.data ?? []) {
    const day = (o.created_at as string).split("T")[0];
    if (dailyMap[day] !== undefined) dailyMap[day] += Number(o.total_amount || 0);
  }
  const chartRevenue = Object.entries(dailyMap).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    revenue: Math.round(revenue * 100) / 100,
  }));

  // Top vendeurs
  const vendorMap: Record<string, number> = {};
  for (const o of topVendors.data ?? []) {
    if (!o.shop_id) continue;
    vendorMap[o.shop_id] = (vendorMap[o.shop_id] ?? 0) + Number(o.total_amount || 0);
  }
  const topVendorsList = Object.entries(vendorMap)
    .sort(([,a],[,b]) => b - a).slice(0, 5)
    .map(([shop_id, revenue]) => ({ shop_id, revenue: Math.round(revenue * 100) / 100 }));

  return NextResponse.json({
    data: {
      revenueThisMonth:  Math.round(revenueThisMonth * 100) / 100,
      revenuePrevMonth:  Math.round(revenuePrevMonth * 100) / 100,
      revenueYear:       Math.round(revenueYear * 100) / 100,
      monthGrowthPct:    Math.round(growth * 100) / 100,
      commissionRate:    15, // % Spectrum
      estimatedCommissions: Math.round(revenueYear * 0.15 * 100) / 100,
      statusBreakdown,
      chartRevenue,
      topVendors: topVendorsList,
    },
    error: null,
  }, { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate" } });
}
