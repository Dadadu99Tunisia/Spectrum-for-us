"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  TrendingUp, ShoppingCart, Store, Users, Clock,
  AlertTriangle, CheckCircle, ShieldCheck, MessageSquare,
  ArrowUpRight, ArrowDownRight, Package
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

type KPIs = {
  revenueToday: number; revenueMonth: number; revenueYear: number;
  totalOrders: number; ordersToday: number; ordersMonth: number;
  vendors: number; buyers: number; avgBasket: number;
  pendingMod: number; openTickets: number; pendingKyc?: number;
};

type ChartPoint = { date: string; revenue: number };

export default function AdminDashboard() {
  const router = useRouter();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<Record<string, unknown>[]>([]);
  const [recentVendors, setRecentVendors] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch KPIs from API
    fetch("/api/admin/kpis")
      .then(r => r.json())
      .then(d => { setKpis(d.kpis); setChart(d.charts?.dailyRevenue ?? []); })
      .catch(() => {});

    // Fetch recent orders + vendors via API (sécurisé server-side)
    Promise.all([
      fetch("/api/admin/orders?limit=8").then(r => r.json()).catch(() => ({ data: [] })),
      fetch("/api/admin/vendors?limit=5").then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([orders, vendors]) => {
      setRecentOrders(orders.data ?? []);
      setRecentVendors(vendors.data ?? []);
      setLoading(false);
    });
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const fmtSmall = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

  const KPI_CARDS = kpis ? [
    { label: "CA Aujourd'hui",  value: fmt(kpis.revenueToday),  sub: `${kpis.ordersToday} commandes`, icon: TrendingUp,   color: "#E0337E",  trend: null },
    { label: "CA Ce mois",      value: fmt(kpis.revenueMonth),  sub: `${kpis.ordersMonth} commandes`, icon: TrendingUp,   color: "#6D2DB5",  trend: null },
    { label: "CA Annuel",       value: fmt(kpis.revenueYear),   sub: "depuis le 1er janvier",         icon: TrendingUp,   color: "#E0901E",  trend: null },
    { label: "Panier moyen",    value: fmtSmall(kpis.avgBasket),sub: `sur ${kpis.totalOrders} cmds`,  icon: ShoppingCart, color: "#1C9C95",  trend: null },
    { label: "Vendeur·ses",     value: kpis.vendors.toString(), sub: "boutiques actives",             icon: Store,        color: "#CF3F7C",  trend: null },
    { label: "Acheteur·ses",    value: kpis.buyers.toString(),  sub: "comptes actifs",                icon: Users,        color: "#F2B79E",  trend: null },
    { label: "Modération",      value: kpis.pendingMod.toString(), sub: "éléments en attente",       icon: ShieldCheck,  color: kpis.pendingMod > 0 ? "#E0901E" : "#1C9C95", trend: null },
    { label: "Support",         value: kpis.openTickets.toString(), sub: "tickets ouverts",          icon: MessageSquare,color: kpis.openTickets > 5 ? "#E0337E" : "#1C9C95", trend: null },
  ] : [];

  const STATUS_STYLE: Record<string, string> = {
    paid:      "bg-green-500/15 text-green-400",
    pending:   "bg-yellow-500/15 text-yellow-400",
    shipped:   "bg-blue-500/15 text-blue-400",
    cancelled: "bg-red-500/15 text-red-400",
    delivered: "bg-teal-500/15 text-teal-400",
  };
  const STATUS_LABEL: Record<string, string> = {
    paid: "Payé", pending: "En attente", shipped: "Expédié",
    cancelled: "Annulé", delivered: "Livré",
  };

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="font-fraunces text-2xl text-[#F3EADB] mb-0.5">Dashboard</h1>
        <p className="font-hanken text-sm text-[#F3EADB]/40">
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#F3EADB]/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KPI_CARDS.map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label}
                className="p-4 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02] hover:bg-[#F3EADB]/[0.04] transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${k.color}18`, border: `1px solid ${k.color}30` }}>
                    <Icon size={14} style={{ color: k.color }} />
                  </div>
                </div>
                <p className="font-fraunces text-xl text-[#F3EADB] leading-none mb-1">{k.value}</p>
                <p className="font-mono text-[9px] text-[#F3EADB]/30 uppercase tracking-widest">{k.label}</p>
                <p className="font-hanken text-[11px] text-[#F3EADB]/25 mt-0.5">{k.sub}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue 30 days */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-fraunces text-base text-[#F3EADB]">Revenus — 30 derniers jours</p>
              <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase mt-0.5">Chiffre d&apos;affaires journalier</p>
            </div>
          </div>
          {chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#E0337E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E0337E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3EADB08" />
                <XAxis dataKey="date" tick={{ fill: "#F3EADB40", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: "#F3EADB40", fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v === 0 ? "0" : `${(v/1000).toFixed(1)}k`} />
                <Tooltip
                  contentStyle={{ background: "#0e061a", border: "1px solid #F3EADB15", borderRadius: "12px", color: "#F3EADB" }}
                  formatter={(v: unknown) => [`${Number(v).toFixed(2)} €`, "Revenus"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E0337E" strokeWidth={2} fill="url(#rev)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#F3EADB]/20 font-hanken text-sm">
              Aucune donnée de vente pour l&apos;instant
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="p-5 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02]">
          <p className="font-fraunces text-base text-[#F3EADB] mb-5">Actions prioritaires</p>
          <div className="space-y-2">
            {[
              { label: "Modérer les contenus", href: "/admin/moderation", count: kpis?.pendingMod, color: "#E0901E", icon: ShieldCheck },
              { label: "Voir les commandes",    href: "/admin/orders",     count: kpis?.ordersToday, color: "#1C9C95", icon: ShoppingCart },
              { label: "Valider les vendeurs",  href: "/admin/vendors",    count: null, color: "#6D2DB5", icon: Store },
              { label: "Tickets support",       href: "/admin/support",    count: kpis?.openTickets, color: "#CF3F7C", icon: MessageSquare },
              { label: "Scraper événements",    href: "/admin/evenements", count: null, color: "#E0337E", icon: AlertTriangle },
            ].map(a => {
              const Icon = a.icon;
              return (
                <button key={a.href} onClick={() => router.push(a.href)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#F3EADB]/6 hover:border-[#F3EADB]/15 hover:bg-[#F3EADB]/[0.03] transition-all group text-left">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${a.color}15` }}>
                    <Icon size={13} style={{ color: a.color }} />
                  </div>
                  <span className="font-hanken text-sm text-[#F3EADB]/60 group-hover:text-[#F3EADB] flex-1 transition-colors">{a.label}</span>
                  {a.count !== null && a.count !== undefined && a.count > 0 && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: `${a.color}20`, color: a.color }}>{a.count}</span>
                  )}
                  <ArrowUpRight size={12} className="text-[#F3EADB]/15 group-hover:text-[#F3EADB]/40 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent orders */}
        <div className="p-5 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <p className="font-fraunces text-base text-[#F3EADB]">Dernières commandes</p>
            <button onClick={() => router.push("/admin/orders")}
              className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#E0337E] uppercase tracking-widest transition-colors">
              Tout voir →
            </button>
          </div>
          {loading ? (
            <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-[#F3EADB]/5 rounded-lg" />)}</div>
          ) : recentOrders.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart size={24} className="text-[#F3EADB]/15 mx-auto mb-2" />
              <p className="font-hanken text-sm text-[#F3EADB]/25">Aucune commande pour l&apos;instant</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentOrders.map(o => (
                <div key={String(o.id)} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[#F3EADB]/[0.03] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-[#F3EADB]/5 flex items-center justify-center shrink-0">
                    <Package size={12} className="text-[#F3EADB]/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-[#F3EADB]/60 truncate">#{String(o.id).slice(0,8)}</p>
                    <p className="font-mono text-[10px] text-[#F3EADB]/25">
                      {new Date(String(o.created_at)).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-[#F3EADB]">{fmtSmall(Number(o.total_amount || 0))}</span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${STATUS_STYLE[String(o.status)] ?? "bg-[#F3EADB]/10 text-[#F3EADB]/40"}`}>
                    {STATUS_LABEL[String(o.status)] ?? String(o.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New vendors */}
        <div className="p-5 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <p className="font-fraunces text-base text-[#F3EADB]">Nouveaux vendeur·ses</p>
            <button onClick={() => router.push("/admin/vendors")}
              className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#E0337E] uppercase tracking-widest transition-colors">
              Tout voir →
            </button>
          </div>
          {loading ? (
            <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-[#F3EADB]/5 rounded-lg" />)}</div>
          ) : recentVendors.length === 0 ? (
            <div className="py-8 text-center">
              <Store size={24} className="text-[#F3EADB]/15 mx-auto mb-2" />
              <p className="font-hanken text-sm text-[#F3EADB]/25">Aucune boutique pour l&apos;instant</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentVendors.map(v => (
                <div key={String(v.id)} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[#F3EADB]/[0.03] transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/vendors`)}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#E0337E18", border: "1px solid #E0337E25" }}>
                    <span className="font-fraunces text-sm text-[#E0337E]">
                      {String(v.name || "?")[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-hanken text-sm text-[#F3EADB] truncate">{String(v.name || "—")}</p>
                    <p className="font-mono text-[10px] text-[#F3EADB]/25">
                      Créé le {new Date(String(v.created_at)).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${Boolean(v.is_active) ? "bg-green-400" : "bg-[#F3EADB]/20"}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
