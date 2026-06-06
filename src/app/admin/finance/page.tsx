"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Coins, ShoppingCart, RotateCcw, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type FinanceSummary = {
  revenueThisMonth: number;
  revenuePrevMonth: number;
  revenueYear: number;
  monthGrowthPct: number;
  commissionRate: number;
  estimatedCommissions: number;
  statusBreakdown: Record<string, { count: number; revenue: number }>;
  chartRevenue: { date: string; revenue: number }[];
  topVendors: { shop_id: string; revenue: number }[];
};

export default function FinancePage() {
  const [data, setData]     = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/finance/summary")
      .then(r => r.json())
      .then(j => { setData(j.data); setLoading(false); });
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const STATUS_LABELS: Record<string, string> = {
    paid: "Payé", pending: "En attente", shipped: "Expédié",
    cancelled: "Annulé", delivered: "Livré",
  };
  const STATUS_COLORS: Record<string, string> = {
    paid: "#1C9C95", pending: "#E0901E", shipped: "#6D2DB5",
    cancelled: "#E0533A", delivered: "#6db56d",
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <SpectrumLoader size="sm" />
    </div>
  );

  if (!data) return null;

  const growth = data.monthGrowthPct;
  const kpis = [
    {
      label: "CA Ce mois",
      value: fmt(data.revenueThisMonth),
      sub: `vs ${fmt(data.revenuePrevMonth)} le mois dernier`,
      icon: Coins,
      color: "#E0337E",
      trend: growth,
    },
    {
      label: "CA Annuel",
      value: fmt(data.revenueYear),
      sub: `depuis le 1er janvier`,
      icon: TrendingUp,
      color: "#6D2DB5",
      trend: null,
    },
    {
      label: "Commissions Spectrum",
      value: fmt(data.estimatedCommissions),
      sub: `${data.commissionRate}% du CA annuel`,
      icon: ArrowUpRight,
      color: "#E0901E",
      trend: null,
    },
    {
      label: "Remboursements",
      value: fmt((data.statusBreakdown["cancelled"]?.revenue ?? 0)),
      sub: `${data.statusBreakdown["cancelled"]?.count ?? 0} commandes annulées`,
      icon: RotateCcw,
      color: "#E0533A",
      trend: null,
    },
  ];

  const barData = Object.entries(data.statusBreakdown).map(([status, d]) => ({
    name: STATUS_LABELS[status] ?? status,
    revenue: Math.round(d.revenue * 100) / 100,
    count: d.count,
    color: STATUS_COLORS[status] ?? "#F3EADB",
  }));

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="font-fraunces text-2xl text-[#F3EADB]">Comptabilité</h1>
        <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">Vue CFO · données en temps réel</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="p-5 rounded-2xl border border-white/[0.13] bg-white/[0.07]">
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
                  <Icon size={15} style={{ color: k.color }} />
                </div>
                {k.trend !== null && (
                  <span className={`flex items-center gap-1 font-mono text-[10px] ${k.trend >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {k.trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(k.trend).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="font-fraunces text-xl text-[#F3EADB] leading-none mb-1">{k.value}</p>
              <p className="font-mono text-[9px] text-[#F3EADB]/30 uppercase tracking-widest">{k.label}</p>
              <p className="font-hanken text-[11px] text-[#F3EADB]/25 mt-1">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue trend */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/[0.13] bg-white/[0.07]">
          <p className="font-fraunces text-base text-[#F3EADB] mb-1">Revenus · 30 derniers jours</p>
          <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase mb-5">CA journalier payé</p>
          {data.chartRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.chartRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="finRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#E0337E" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#E0337E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3EADB08" />
                <XAxis dataKey="date" tick={{ fill: "#F3EADB40", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: "#F3EADB40", fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v === 0 ? "0" : `${(v/1000).toFixed(1)}k€`} />
                <Tooltip
                  contentStyle={{ background: "#0e061a", border: "1px solid #F3EADB15", borderRadius: "12px" }}
                  labelStyle={{ color: "#F3EADB60", fontFamily: "monospace", fontSize: 10 }}
                  formatter={(v: unknown) => [`${Number(v).toFixed(2)} €`, "CA"]} />
                <Area type="monotone" dataKey="revenue" stroke="#E0337E" strokeWidth={2} fill="url(#finRev)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-[#F3EADB]/20 font-hanken text-sm">
              Aucune donnée de vente
            </div>
          )}
        </div>

        {/* Répartition par statut */}
        <div className="p-5 rounded-2xl border border-white/[0.13] bg-white/[0.07]">
          <p className="font-fraunces text-base text-[#F3EADB] mb-1">Par statut</p>
          <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase mb-5">CA toutes périodes</p>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3EADB08" />
                <XAxis dataKey="name" tick={{ fill: "#F3EADB40", fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#F3EADB40", fontSize: 9 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v === 0 ? "0" : `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#0e061a", border: "1px solid #F3EADB15", borderRadius: "12px" }}
                  labelStyle={{ color: "#F3EADB60", fontFamily: "monospace", fontSize: 10 }}
                  formatter={(v: unknown) => [`${Number(v).toFixed(2)} €`, "Revenus"]} />
                <Bar dataKey="revenue" radius={[4,4,0,0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-[#F3EADB]/20 font-hanken text-sm">Aucune donnée</div>
          )}
        </div>
      </div>

      {/* Détail statuts */}
      <div className="p-5 rounded-2xl border border-white/[0.13] bg-white/[0.07]">
        <p className="font-fraunces text-base text-[#F3EADB] mb-4">Détail par statut de commande</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(data.statusBreakdown).map(([status, d]) => (
            <div key={status} className="p-3 rounded-xl border border-white/[0.12]">
              <div className="w-2 h-2 rounded-full mb-2" style={{ background: STATUS_COLORS[status] ?? "#F3EADB" }} />
              <p className="font-mono text-[9px] text-[#F3EADB]/30 uppercase mb-1">{STATUS_LABELS[status] ?? status}</p>
              <p className="font-fraunces text-lg text-[#F3EADB]">{fmt(d.revenue)}</p>
              <p className="font-hanken text-[11px] text-[#F3EADB]/30">{d.count} commande{d.count !== 1 ? "s" : ""}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top vendeurs */}
      {data.topVendors.length > 0 && (
        <div className="p-5 rounded-2xl border border-white/[0.13] bg-white/[0.07]">
          <p className="font-fraunces text-base text-[#F3EADB] mb-4">Top vendeurs (CA annuel)</p>
          <div className="space-y-3">
            {data.topVendors.map((v, i) => {
              const pct = data.revenueYear > 0 ? (v.revenue / data.revenueYear) * 100 : 0;
              return (
                <div key={v.shop_id} className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-[#F3EADB]/20 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-[#F3EADB]/40">{v.shop_id.slice(0,12)}…</span>
                      <span className="font-fraunces text-sm text-[#F3EADB]">{fmt(v.revenue)}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.09] rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, #E0337E, #6D2DB5)" }} />
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-[#F3EADB]/25 w-10 text-right">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
