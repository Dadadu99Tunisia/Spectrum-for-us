import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/rbac";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = await createClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const yearStart  = new Date(now.getFullYear(), 0, 1).toISOString();
  const last30Days = new Date(Date.now() - 30 * 86400000).toISOString();

  const [
    ordersToday, ordersMonth, ordersYear, allOrders,
    vendors, buyers, pendingMod, openTickets, pendingKyc,
    revenueByDay,
  ] = await Promise.all([
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", todayStart),
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", monthStart),
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", yearStart),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status","paid"),
    supabase.from("shops").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "buyer"),
    supabase.from("moderation_queue").select("id", { count: "exact", head: true }).eq("mod_status","pending"),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("ticket_status","open"),
    supabase.from("vendor_kyc").select("id", { count: "exact", head: true }).eq("kyc_status","submitted"),
    supabase.from("orders").select("created_at,total_amount").eq("status","paid").gte("created_at", last30Days).order("created_at"),
  ]);

  const sum = (rows: { total_amount: number }[] | null) =>
    (rows ?? []).reduce((s, r) => s + Number(r.total_amount || 0), 0);

  const revenueToday  = sum(ordersToday.data);
  const revenueMonth  = sum(ordersMonth.data);
  const revenueYear   = sum(ordersYear.data);
  const totalOrders   = allOrders.count ?? 0;
  const avgBasket     = totalOrders > 0 ? revenueYear / totalOrders : 0;

  const dailyMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dailyMap[d.toISOString().split("T")[0]] = 0;
  }
  (revenueByDay.data ?? []).forEach(o => {
    const day = (o.created_at as string).split("T")[0];
    if (dailyMap[day] !== undefined) dailyMap[day] += Number(o.total_amount || 0);
  });
  const chartData = Object.entries(dailyMap).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    revenue: Math.round(revenue * 100) / 100,
  }));

  return NextResponse.json({
    kpis: {
      revenueToday:  Math.round(revenueToday * 100) / 100,
      revenueMonth:  Math.round(revenueMonth * 100) / 100,
      revenueYear:   Math.round(revenueYear * 100) / 100,
      totalOrders,
      ordersToday:   ordersToday.data?.length ?? 0,
      ordersMonth:   ordersMonth.data?.length ?? 0,
      vendors:       vendors.count ?? 0,
      buyers:        buyers.count ?? 0,
      avgBasket:     Math.round(avgBasket * 100) / 100,
      pendingMod:    pendingMod.count ?? 0,
      openTickets:   openTickets.count ?? 0,
      pendingKyc:    pendingKyc.count ?? 0,
    },
    charts: { dailyRevenue: chartData },
  }, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" } });
}
