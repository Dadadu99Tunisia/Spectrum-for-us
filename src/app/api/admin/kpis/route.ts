import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/rbac";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = await createClient();

  const now          = new Date();
  const todayStart   = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart    = new Date(Date.now() - 7  * 86400000).toISOString();
  const monthStart   = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const prevMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
  const yearStart    = new Date(now.getFullYear(), 0, 1).toISOString();
  const last30Days   = new Date(Date.now() - 30 * 86400000).toISOString();
  const last7Days    = new Date(Date.now() -  7 * 86400000).toISOString();

  const [
    // Commerce
    ordersToday, ordersMonth, ordersYear, allOrders,
    vendors, buyers, pendingMod, openTickets,
    revenueByDay,
    // Croissance — membres
    newMembersWeek, newMembersMonth, prevNewMembersMonth,
    totalMembers,
    // Croissance — vendeurs
    newVendorsMonth, prevNewVendorsMonth,
    // Croissance — demandes rejoindre
    newJoinRequestsWeek, pendingJoinRequests,
    // Associations (annuaire)
    totalOrgs, featuredOrgs,
    // CRM pipeline
    crmTotal, crmWon, crmContacted,
    // Croissance chart membres 30j
    membersByDay,
  ] = await Promise.all([
    // Commerce
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", todayStart),
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", monthStart),
    supabase.from("orders").select("total_amount").eq("status","paid").gte("created_at", yearStart),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status","paid"),
    supabase.from("shops").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "buyer"),
    supabase.from("moderation_queue").select("id", { count: "exact", head: true }).eq("mod_status","pending"),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("ticket_status","open"),
    supabase.from("orders").select("created_at,total_amount").eq("status","paid").gte("created_at", last30Days).order("created_at"),
    // Croissance membres
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", prevMonthStart).lte("created_at", prevMonthEnd),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    // Croissance vendeurs
    supabase.from("shops").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("shops").select("id", { count: "exact", head: true }).gte("created_at", prevMonthStart).lte("created_at", prevMonthEnd),
    // Demandes rejoindre
    supabase.from("join_requests").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("join_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    // Associations
    supabase.from("annuaire_overrides").select("org_id", { count: "exact", head: true }),
    supabase.from("annuaire_overrides").select("org_id", { count: "exact", head: true }).eq("is_featured", true),
    // CRM
    supabase.from("crm_contacts").select("id", { count: "exact", head: true }),
    supabase.from("crm_contacts").select("id", { count: "exact", head: true }).eq("stage", "won"),
    supabase.from("crm_contacts").select("id", { count: "exact", head: true }).eq("stage", "contacted"),
    // Membres par jour (30j)
    supabase.from("profiles").select("created_at").gte("created_at", last30Days).order("created_at"),
  ]);

  const sum = (rows: { total_amount: number }[] | null) =>
    (rows ?? []).reduce((s, r) => s + Number(r.total_amount || 0), 0);

  const revenueToday = sum(ordersToday.data);
  const revenueMonth = sum(ordersMonth.data);
  const revenueYear  = sum(ordersYear.data);
  const totalOrders  = allOrders.count ?? 0;
  const avgBasket    = totalOrders > 0 ? revenueYear / totalOrders : 0;

  // Calcul tendances (% vs mois précédent)
  const membersThisMonth = newMembersMonth.count ?? 0;
  const membersPrevMonth = prevNewMembersMonth.count ?? 0;
  const membersTrend = membersPrevMonth > 0
    ? Math.round(((membersThisMonth - membersPrevMonth) / membersPrevMonth) * 100)
    : membersThisMonth > 0 ? 100 : 0;

  const vendorsThisMonth = newVendorsMonth.count ?? 0;
  const vendorsPrevMonth = prevNewVendorsMonth.count ?? 0;
  const vendorsTrend = vendorsPrevMonth > 0
    ? Math.round(((vendorsThisMonth - vendorsPrevMonth) / vendorsPrevMonth) * 100)
    : vendorsThisMonth > 0 ? 100 : 0;

  // Chart revenus 30j
  const revenueMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    revenueMap[d.toISOString().split("T")[0]] = 0;
  }
  (revenueByDay.data ?? []).forEach(o => {
    const day = (o.created_at as string).split("T")[0];
    if (revenueMap[day] !== undefined) revenueMap[day] += Number(o.total_amount || 0);
  });
  const chartRevenue = Object.entries(revenueMap).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    revenue: Math.round(revenue * 100) / 100,
  }));

  // Chart membres 30j
  const membersMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    membersMap[d.toISOString().split("T")[0]] = 0;
  }
  (membersByDay.data ?? []).forEach(p => {
    const day = (p.created_at as string).split("T")[0];
    if (membersMap[day] !== undefined) membersMap[day]++;
  });
  const chartMembers = Object.entries(membersMap).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    count,
  }));

  return NextResponse.json({
    kpis: {
      // Commerce
      revenueToday:  Math.round(revenueToday * 100) / 100,
      revenueMonth:  Math.round(revenueMonth * 100) / 100,
      revenueYear:   Math.round(revenueYear  * 100) / 100,
      totalOrders,
      ordersToday:   ordersToday.data?.length ?? 0,
      ordersMonth:   ordersMonth.data?.length ?? 0,
      vendors:       vendors.count ?? 0,
      buyers:        buyers.count ?? 0,
      avgBasket:     Math.round(avgBasket * 100) / 100,
      pendingMod:    pendingMod.count ?? 0,
      openTickets:   openTickets.count ?? 0,
      // Croissance communautaire
      growth: {
        newMembersWeek:      newMembersWeek.count ?? 0,
        newMembersMonth:     membersThisMonth,
        membersTrend,
        totalMembers:        totalMembers.count ?? 0,
        newVendorsMonth:     vendorsThisMonth,
        vendorsTrend,
        newJoinRequestsWeek: newJoinRequestsWeek.count ?? 0,
        pendingJoinRequests: pendingJoinRequests.count ?? 0,
        // Associations
        totalOrgsDB:         totalOrgs.count ?? 0,
        featuredOrgs:        featuredOrgs.count ?? 0,
        // CRM
        crmTotal:            crmTotal.count ?? 0,
        crmWon:              crmWon.count ?? 0,
        crmContacted:        crmContacted.count ?? 0,
      },
    },
    charts: {
      dailyRevenue: chartRevenue,
      dailyMembers: chartMembers,
    },
  }, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" } });
}
