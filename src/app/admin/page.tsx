"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, ShoppingCart, Store, Users, Clock,
  AlertTriangle, ShieldCheck, MessageSquare,
  Package, Coins, Bot, Star, CalendarDays,
  ArrowUpRight, Zap, CheckCircle2, AlertCircle,
  BarChart2, RefreshCw, Mail, Activity,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";

type KPIs = {
  revenueToday: number; revenueMonth: number; revenueYear: number;
  totalOrders: number;  ordersToday: number;  ordersMonth: number;
  vendors: number;      buyers: number;       avgBasket: number;
  pendingMod: number;   openTickets: number;
};
type ChartPoint = { date: string; revenue: number };

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt   = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtSm = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const fmtN  = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

// ── Status configs ────────────────────────────────────────────────────────────
const STATUS_PILL: Record<string, string> = {
  paid:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  pending:   "bg-amber-500/15   text-amber-400   border-amber-500/20",
  shipped:   "bg-sky-500/15     text-sky-400     border-sky-500/20",
  cancelled: "bg-red-500/15     text-red-400     border-red-500/20",
  delivered: "bg-teal-500/15    text-teal-400    border-teal-500/20",
};
const STATUS_LABEL: Record<string, string> = {
  paid: "Payé", pending: "En attente", shipped: "Expédié",
  cancelled: "Annulé", delivered: "Livré",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, color, icon: Icon, href, alert,
}: {
  label: string; value: string; sub: string;
  color: string; icon: React.ElementType;
  href?: string; alert?: boolean;
}) {
  const content = (
    <div className={`
      relative p-5 rounded-2xl border bg-white/[0.07] hover:bg-white/[0.055] transition-all group cursor-default
      ${alert ? "border-[#E0901E]/30" : "border-white/[0.13]"}
    `}
      style={alert ? { boxShadow: "0 0 0 1px rgba(224,144,30,.15)" } : {}}>
      {/* Left accent */}
      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
        style={{ background: color }} />

      <div className="flex items-start justify-between mb-4 pl-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
          <Icon size={16} style={{ color }} />
        </div>
        {href && (
          <ArrowUpRight size={13} className="text-[#F3EADB]/15 group-hover:text-[#F3EADB]/50 transition-colors mt-0.5" />
        )}
        {alert && !href && (
          <span className="w-2 h-2 rounded-full bg-[#E0901E] mt-1" />
        )}
      </div>

      <div className="pl-3">
        <p className="font-fraunces text-2xl text-[#F3EADB] leading-none mb-1">{value}</p>
        <p className="font-mono text-[10px] text-[#F3EADB]/35 uppercase tracking-widest">{label}</p>
        <p className="font-hanken text-xs text-[#F3EADB]/25 mt-1">{sub}</p>
      </div>
    </div>
  );

  if (href) return <Link href={href} className="block">{content}</Link>;
  return content;
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-fraunces text-base text-[#F3EADB]">{children}</h2>
      {action}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 rounded-2xl border border-white/[0.13] bg-white/[0.07] ${className}`}>
      {children}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [kpis, setKpis]           = useState<KPIs | null>(null);
  const [chart, setChart]         = useState<ChartPoint[]>([]);
  const [recentOrders, setRecentOrders]   = useState<Record<string, unknown>[]>([]);
  const [recentVendors, setRecentVendors] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [kpiRes, ordersRes, vendorsRes] = await Promise.all([
        fetch("/api/admin/kpis").then(r => r.json()).catch(() => ({})),
        fetch("/api/admin/orders?limit=6").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/api/admin/vendors?limit=5").then(r => r.json()).catch(() => ({ data: [] })),
      ]);
      setKpis(kpiRes.kpis ?? null);
      setChart(kpiRes.charts?.dailyRevenue ?? []);
      setRecentOrders(ordersRes.data ?? []);
      setRecentVendors(vendorsRes.data ?? []);
    } catch { /* silent */ }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Quick action matrix — what the team needs to do first thing every morning
  const QUICK_ACTIONS = [
    { label: "Modération",       sub: kpis ? `${kpis.pendingMod} en attente` : "—", href: "/admin/moderation", color: "#E0901E", icon: ShieldCheck, urgent: (kpis?.pendingMod ?? 0) > 0 },
    { label: "Support",          sub: kpis ? `${kpis.openTickets} tickets` : "—",   href: "/admin/support",    color: "#CF3F7C", icon: MessageSquare, urgent: (kpis?.openTickets ?? 0) > 0 },
    { label: "Commandes",        sub: kpis ? `${kpis.ordersToday} aujourd'hui` : "—",href: "/admin/orders",    color: "#1C9C95", icon: ShoppingCart, urgent: false },
    { label: "Vendeurs",         sub: "Vérifier KYC",                                href: "/admin/vendors",   color: "#6D2DB5", icon: Store,         urgent: false },
    { label: "CRM Pipeline",     sub: "Leads à qualifier",                           href: "/admin/crm",       color: "#a78bfa", icon: TrendingUp,    urgent: false },
    { label: "Outreach IA",      sub: "Générer messages",                            href: "/admin/outreach",  color: "#E0337E", icon: Mail,          urgent: false },
    { label: "IA Spectrum",      sub: "Outils d'analyse",                            href: "/admin/ai",        color: "#34d399", icon: Bot,           urgent: false },
    { label: "Événements",       sub: "Scraper & gérer",                             href: "/admin/evenements",color: "#fbbf24", icon: CalendarDays,  urgent: false },
  ];

  // Tool links — all pages at a glance
  const ALL_TOOLS = [
    { section: "Opérations",  tools: [
      { href: "/admin/moderation",    label: "Modération",    icon: ShieldCheck },
      { href: "/admin/orders",        label: "Commandes",     icon: ShoppingCart },
      { href: "/admin/vendors",       label: "Vendeurs",      icon: Store },
      { href: "/admin/products",      label: "Produits",      icon: Package },
      { href: "/admin/services",      label: "Services",      icon: Activity },
    ]},
    { section: "Communauté",  tools: [
      { href: "/admin/users",         label: "Utilisateurs",  icon: Users },
      { href: "/admin/rejoindre",     label: "Rejoindre",     icon: Star },
      { href: "/admin/evenements",    label: "Événements",    icon: CalendarDays },
      { href: "/admin/outreach",      label: "Outreach",      icon: Mail },
    ]},
    { section: "Business",    tools: [
      { href: "/admin/finance",       label: "Finance",       icon: Coins },
      { href: "/admin/crm",          label: "CRM",            icon: TrendingUp },
      { href: "/admin/support",       label: "Support",       icon: MessageSquare },
    ]},
    { section: "Contenu",     tools: [
      { href: "/admin/contenu",       label: "Site",          icon: BarChart2 },
      { href: "/admin/articles",      label: "Articles",      icon: Package },
      { href: "/admin/ambassadeurs",  label: "Ambassadeurs",  icon: Star },
      { href: "/admin/communication", label: "Comms",         icon: Mail },
    ]},
  ];

  return (
    <div className="space-y-7 max-w-[1440px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="font-mono text-[10px] text-[#F3EADB]/25 uppercase tracking-widest">{today}</span>
          </div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Bonjour 👋</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">Vue d'ensemble de la marketplace</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.13] bg-white/[0.07] font-hanken text-sm text-[#F3EADB]/50 hover:text-[#F3EADB] hover:bg-white/[0.06] transition-all disabled:opacity-40">
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* ── KPI Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
          {[...Array(8)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/[0.08]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="CA Aujourd'hui"  value={fmt(kpis?.revenueToday ?? 0)}   sub={`${fmtN(kpis?.ordersToday ?? 0)} commandes`}   color="#E0337E"  icon={TrendingUp}    href="/admin/finance" />
          <KpiCard label="CA Ce mois"      value={fmt(kpis?.revenueMonth ?? 0)}   sub={`${fmtN(kpis?.ordersMonth ?? 0)} commandes`}   color="#6D2DB5"  icon={TrendingUp}    href="/admin/finance" />
          <KpiCard label="CA Annuel"       value={fmt(kpis?.revenueYear ?? 0)}    sub="depuis le 1er janvier"                          color="#E0901E"  icon={Coins}         href="/admin/finance" />
          <KpiCard label="Panier moyen"    value={fmtSm(kpis?.avgBasket ?? 0)}   sub={`${fmtN(kpis?.totalOrders ?? 0)} commandes total`} color="#1C9C95" icon={ShoppingCart} href="/admin/orders" />
          <KpiCard label="Vendeur·ses"     value={fmtN(kpis?.vendors ?? 0)}      sub="boutiques actives"                              color="#CF3F7C"  icon={Store}         href="/admin/vendors" />
          <KpiCard label="Acheteur·ses"    value={fmtN(kpis?.buyers ?? 0)}       sub="comptes actifs"                                 color="#a78bfa"  icon={Users}         href="/admin/users" />
          <KpiCard label="Modération"      value={fmtN(kpis?.pendingMod ?? 0)}   sub="éléments en attente"                            color="#E0901E"  icon={ShieldCheck}   href="/admin/moderation" alert={(kpis?.pendingMod ?? 0) > 0} />
          <KpiCard label="Support"         value={fmtN(kpis?.openTickets ?? 0)}  sub="tickets ouverts"                                color="#CF3F7C"  icon={MessageSquare} href="/admin/support"     alert={(kpis?.openTickets ?? 0) > 3} />
        </div>
      )}

      {/* ── Charts + Quick actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <SectionTitle action={
            <Link href="/admin/finance" className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#E0337E] uppercase tracking-widest transition-colors flex items-center gap-1">
              Détails <ArrowUpRight size={10} />
            </Link>
          }>
            Revenus — 30 derniers jours
          </SectionTitle>
          {chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#E0337E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E0337E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(243,234,219,.06)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(243,234,219,.3)", fontSize: 10 }}
                  tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: "rgba(243,234,219,.3)", fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v === 0 ? "0" : `${(v/1000).toFixed(1)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1a1535", border: "1px solid rgba(255,255,255,.1)", borderRadius: "12px", color: "#F3EADB", fontSize: 12 }}
                  formatter={(v: unknown) => [`${Number(v).toFixed(2)} €`, "Revenus"]}
                  labelStyle={{ color: "rgba(243,234,219,.5)" }} />
                <Area type="monotone" dataKey="revenue" stroke="#E0337E" strokeWidth={2} fill="url(#rev)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center gap-2">
              <BarChart2 size={28} className="text-[#F3EADB]/10" />
              <p className="font-hanken text-sm text-[#F3EADB]/25">Aucune donnée de vente pour l&apos;instant</p>
            </div>
          )}
        </Card>

        {/* Quick actions */}
        <Card>
          <SectionTitle>Actions prioritaires</SectionTitle>
          <div className="space-y-1.5">
            {QUICK_ACTIONS.map(a => {
              const Icon = a.icon;
              return (
                <Link key={a.href} href={a.href}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                    a.urgent
                      ? "border-[#E0901E]/25 bg-[#E0901E]/5 hover:bg-[#E0901E]/10"
                      : "border-white/[0.10] hover:border-white/[0.12] hover:bg-white/[0.08]"
                  }`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${a.color}15` }}>
                    <Icon size={13} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-hanken text-[13px] text-[#F3EADB]/70 group-hover:text-[#F3EADB] transition-colors leading-tight">{a.label}</p>
                    <p className="font-mono text-[9px] text-[#F3EADB]/30 mt-0.5">{a.sub}</p>
                  </div>
                  {a.urgent && <span className="w-2 h-2 rounded-full bg-[#E0901E] shrink-0 animate-pulse" />}
                  <ArrowUpRight size={12} className="text-[#F3EADB]/15 group-hover:text-[#F3EADB]/50 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Recent orders + vendors ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Orders */}
        <Card>
          <SectionTitle action={
            <Link href="/admin/orders" className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#E0337E] uppercase tracking-widest transition-colors flex items-center gap-1">
              Tout voir <ArrowUpRight size={10} />
            </Link>
          }>
            Dernières commandes
          </SectionTitle>
          {loading ? (
            <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-white/[0.08]" />)}</div>
          ) : recentOrders.length === 0 ? (
            <div className="py-10 text-center">
              <ShoppingCart size={28} className="text-[#F3EADB]/10 mx-auto mb-2" />
              <p className="font-hanken text-sm text-[#F3EADB]/25">Aucune commande pour l&apos;instant</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentOrders.map(o => (
                <div key={String(o.id)}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.07] transition-colors cursor-pointer"
                  onClick={() => router.push("/admin/orders")}>
                  <div className="w-7 h-7 rounded-lg bg-white/[0.09] flex items-center justify-center shrink-0">
                    <Package size={12} className="text-[#F3EADB]/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-[#F3EADB]/60 truncate">#{String(o.id).slice(0, 8)}</p>
                    <p className="font-mono text-[10px] text-[#F3EADB]/25">
                      {new Date(String(o.created_at)).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-[#F3EADB]/80">{fmtSm(Number(o.total_amount ?? o.total ?? 0))}</span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${STATUS_PILL[String(o.status)] ?? "bg-white/[0.06] text-[#F3EADB]/40 border-white/[0.13]"}`}>
                    {STATUS_LABEL[String(o.status)] ?? String(o.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Vendors */}
        <Card>
          <SectionTitle action={
            <Link href="/admin/vendors" className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#E0337E] uppercase tracking-widest transition-colors flex items-center gap-1">
              Tout voir <ArrowUpRight size={10} />
            </Link>
          }>
            Nouveaux vendeur·ses
          </SectionTitle>
          {loading ? (
            <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-white/[0.08]" />)}</div>
          ) : recentVendors.length === 0 ? (
            <div className="py-10 text-center">
              <Store size={28} className="text-[#F3EADB]/10 mx-auto mb-2" />
              <p className="font-hanken text-sm text-[#F3EADB]/25">Aucune boutique pour l&apos;instant</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentVendors.map(v => (
                <div key={String(v.id)}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.07] transition-colors cursor-pointer"
                  onClick={() => router.push("/admin/vendors")}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#E0337E18", border: "1px solid #E0337E22" }}>
                    <span className="font-fraunces text-[12px] text-[#E0337E]">
                      {String(v.name ?? "?")[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-hanken text-sm text-[#F3EADB]/80 truncate">{String(v.name ?? "—")}</p>
                    <p className="font-mono text-[10px] text-[#F3EADB]/25">
                      {new Date(String(v.created_at)).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${Boolean(v.is_active) ? "bg-emerald-400" : "bg-[#F3EADB]/15"}`} />
                    <span className={`font-mono text-[9px] ${Boolean(v.is_active) ? "text-emerald-400/70" : "text-[#F3EADB]/25"}`}>
                      {Boolean(v.is_active) ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Full tool map ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <Zap size={14} className="text-[#a78bfa]" />
          <h2 className="font-fraunces text-base text-[#F3EADB]">Tous les outils</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_TOOLS.map(section => (
            <div key={section.section} className="rounded-2xl border border-white/[0.12] bg-white/[0.02] p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/25 mb-3">{section.section}</p>
              <div className="space-y-1">
                {section.tools.map(t => {
                  const Icon = t.icon;
                  return (
                    <Link key={t.href} href={t.href}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.09] transition-colors group">
                      <Icon size={13} className="text-[#F3EADB]/30 group-hover:text-[#F3EADB]/60 transition-colors" />
                      <span className="font-hanken text-sm text-[#F3EADB]/50 group-hover:text-[#F3EADB]/80 transition-colors">{t.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center gap-4 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.10]">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-[#F3EADB]/35">API opérationnelle</span>
        </div>
        <div className="w-px h-3 bg-white/[0.08]" />
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={10} className="text-emerald-400/60" />
          <span className="font-mono text-[10px] text-[#F3EADB]/35">Supabase connecté</span>
        </div>
        <div className="w-px h-3 bg-white/[0.08]" />
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={10} className="text-emerald-400/60" />
          <span className="font-mono text-[10px] text-[#F3EADB]/35">Paiements actifs</span>
        </div>
        {(kpis?.pendingMod ?? 0) > 0 && (
          <>
            <div className="w-px h-3 bg-white/[0.08]" />
            <Link href="/admin/moderation" className="flex items-center gap-1.5 hover:text-[#E0901E] transition-colors">
              <AlertCircle size={10} className="text-[#E0901E]" />
              <span className="font-mono text-[10px] text-[#E0901E]/70">{kpis?.pendingMod} éléments à modérer</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
