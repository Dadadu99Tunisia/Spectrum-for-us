"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, ShoppingCart, Store, Users, Clock,
  ShieldCheck, MessageSquare, Package, Coins, Bot, Star,
  CalendarDays, ArrowUpRight, Zap, CheckCircle2, AlertCircle,
  BarChart2, RefreshCw, Mail, Activity, MapPin,
  UserPlus, Building2, Target, ChevronUp, ChevronDown, Minus,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { CommandCenter } from "@/components/admin/CommandCenter";

// ── Types ─────────────────────────────────────────────────────────────────────
type Growth = {
  newMembersWeek: number;    newMembersMonth: number;   membersTrend: number;
  totalMembers: number;      newVendorsMonth: number;   vendorsTrend: number;
  newJoinRequestsWeek: number; pendingJoinRequests: number;
  totalOrgsDB: number;       featuredOrgs: number;
  crmTotal: number;          crmWon: number;            crmContacted: number;
};
type KPIs = {
  revenueToday: number; revenueMonth: number; revenueYear: number;
  totalOrders: number;  ordersToday: number;  ordersMonth: number;
  vendors: number;      buyers: number;       avgBasket: number;
  pendingMod: number;   openTickets: number;
  growth: Growth;
};
type ChartPoint = { date: string; revenue: number };
type MemberPoint = { date: string; count: number };

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt   = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtSm = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const fmtN  = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

const STATUS_PILL: Record<string, string> = {
  paid:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  pending:   "bg-amber-500/15   text-amber-400   border-amber-500/20",
  shipped:   "bg-sky-500/15     text-sky-400     border-sky-500/20",
  cancelled: "bg-red-500/15     text-red-600     border-red-500/20",
  delivered: "bg-teal-500/15    text-teal-400    border-teal-500/20",
};
const STATUS_LABEL: Record<string, string> = {
  paid: "Payé", pending: "En attente", shipped: "Expédié",
  cancelled: "Annulé", delivered: "Livré",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, icon: Icon, href, alert }: {
  label: string; value: string; sub: string; color: string;
  icon: React.ElementType; href?: string; alert?: boolean;
}) {
  const content = (
    <div className={`relative p-5 rounded-2xl border bg-[#101014]/[0.07] hover:bg-[#101014]/[0.055] transition-all group cursor-default ${alert ? "border-[#FFD400]/30" : "border-[#101014]/[0.13]"}`}
      style={alert ? { boxShadow: "0 0 0 1px rgba(224,144,30,.15)" } : {}}>
      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full" style={{ background: color }} />
      <div className="flex items-start justify-between mb-4 pl-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
          <Icon size={16} style={{ color }} />
        </div>
        {href && <ArrowUpRight size={13} className="text-[#101014]/15 group-hover:text-[#101014]/50 transition-colors mt-0.5" />}
        {alert && !href && <span className="w-2 h-2 rounded-full bg-[#FFD400] mt-1" />}
      </div>
      <div className="pl-3">
        <p className="font-fraunces text-2xl text-[#101014] leading-none mb-1">{value}</p>
        <p className="font-mono text-[10px] text-[#101014]/35 uppercase tracking-widest">{label}</p>
        <p className="font-hanken text-xs text-[#101014]/25 mt-1">{sub}</p>
      </div>
    </div>
  );
  if (href) return <Link href={href} className="block">{content}</Link>;
  return content;
}

function GrowthCard({ label, value, trend, sub, color, icon: Icon, href, urgent }: {
  label: string; value: string | number; trend?: number; sub: string;
  color: string; icon: React.ElementType; href?: string; urgent?: boolean;
}) {
  const TrendIcon = trend === undefined ? null : trend > 0 ? ChevronUp : trend < 0 ? ChevronDown : Minus;
  const trendColor = trend === undefined ? "" : trend > 0 ? "text-emerald-400" : trend < 0 ? "text-red-600" : "text-[#101014]/30";

  const content = (
    <div className={`relative p-4 rounded-2xl border transition-all group cursor-default overflow-hidden
      ${urgent ? "border-[#FF2DA0]/30 bg-[#FF2DA0]/5" : "border-[#101014]/[0.13] bg-[#101014]/[0.07] hover:bg-[#101014]/[0.055]"}`}>
      {/* Gradient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 50%, ${color}08 0%, transparent 60%)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <div className="flex items-center gap-1">
          {TrendIcon && trend !== undefined && (
            <span className={`flex items-center gap-0.5 font-mono text-[10px] font-bold ${trendColor}`}>
              <TrendIcon size={10} />
              {Math.abs(trend)}%
            </span>
          )}
          {href && <ArrowUpRight size={11} className="text-[#101014]/15 group-hover:text-[#101014]/50 transition-colors" />}
        </div>
      </div>

      <p className="font-fraunces text-xl text-[#101014] leading-none mb-0.5">{fmtN(Number(value))}</p>
      <p className="font-mono text-[9px] text-[#101014]/35 uppercase tracking-widest leading-tight">{label}</p>
      <p className="font-hanken text-[11px] text-[#101014]/25 mt-1 leading-tight">{sub}</p>
    </div>
  );
  if (href) return <Link href={href} className="block">{content}</Link>;
  return content;
}

function SectionTitle({ children, action, accent }: { children: React.ReactNode; action?: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {accent && <div className="w-1 h-4 rounded-full shrink-0" style={{ background: accent }} />}
        <h2 className="font-fraunces text-base text-[#101014]">{children}</h2>
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 rounded-2xl border border-[#101014]/[0.13] bg-[#101014]/[0.07] ${className}`}>
      {children}
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [kpis, setKpis]     = useState<KPIs | null>(null);
  const [chart, setChart]   = useState<ChartPoint[]>([]);
  const [chartMembers, setChartMembers] = useState<MemberPoint[]>([]);
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
      setChartMembers(kpiRes.charts?.dailyMembers ?? []);
      setRecentOrders(ordersRes.data ?? []);
      setRecentVendors(vendorsRes.data ?? []);
    } catch { /* silent */ }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = async () => { setRefreshing(true); await loadData(); };

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const g = kpis?.growth;

  const QUICK_ACTIONS = [
    { label: "Rejoindre",      sub: g ? `${g.pendingJoinRequests} en attente` : "-", href: "/admin/rejoindre",  color: "#FF2DA0", icon: UserPlus,    urgent: (g?.pendingJoinRequests ?? 0) > 0 },
    { label: "Modération",     sub: kpis ? `${kpis.pendingMod} en attente` : "-",    href: "/admin/moderation", color: "#FFD400", icon: ShieldCheck,  urgent: (kpis?.pendingMod ?? 0) > 0 },
    { label: "Support",        sub: kpis ? `${kpis.openTickets} tickets` : "-",      href: "/admin/support",    color: "#FF2DA0", icon: MessageSquare, urgent: (kpis?.openTickets ?? 0) > 0 },
    { label: "CRM Pipeline",   sub: g ? `${g.crmContacted} contacts actifs` : "-",   href: "/admin/crm",        color: "#a78bfa", icon: TrendingUp,   urgent: false },
    { label: "Annuaire",       sub: g ? `${g.totalOrgsDB} orgs dans la DB` : "-",   href: "/admin/annuaire",   color: "#2323C4", icon: MapPin,        urgent: false },
    { label: "Outreach",       sub: "Prospecter associations",                        href: "/admin/outreach",   color: "#7A2BF0", icon: Mail,          urgent: false },
    { label: "Agents IA",      sub: "Aria · Fina · Koda · Mira",                     href: "/admin/agents",     color: "#34d399", icon: Bot,           urgent: false },
    { label: "Événements",     sub: "Scraper & gérer",                               href: "/admin/evenements", color: "#fbbf24", icon: CalendarDays,  urgent: false },
  ];

  const ALL_TOOLS = [
    { section: "Opérations", color: "#FFD400", tools: [
      { href: "/admin/moderation", label: "Modération",  icon: ShieldCheck },
      { href: "/admin/orders",     label: "Commandes",   icon: ShoppingCart },
      { href: "/admin/vendors",    label: "Vendeurs",    icon: Store },
      { href: "/admin/products",   label: "Produits",    icon: Package },
      { href: "/admin/services",   label: "Services",    icon: Activity },
    ]},
    { section: "Communauté", color: "#7A2BF0", tools: [
      { href: "/admin/users",       label: "Utilisateurs", icon: Users },
      { href: "/admin/rejoindre",   label: "Rejoindre",    icon: UserPlus },
      { href: "/admin/annuaire",    label: "Associations", icon: Building2 },
      { href: "/admin/evenements",  label: "Événements",   icon: CalendarDays },
      { href: "/admin/ambassadeurs",label: "Ambassadeurs", icon: Star },
    ]},
    { section: "Business", color: "#2323C4", tools: [
      { href: "/admin/finance",     label: "Finance",      icon: Coins },
      { href: "/admin/crm",         label: "CRM Pipeline", icon: Target },
      { href: "/admin/outreach",    label: "Outreach",     icon: Mail },
      { href: "/admin/support",     label: "Support",      icon: MessageSquare },
      { href: "/admin/agents",      label: "Agents IA",    icon: Bot },
    ]},
    { section: "Contenu", color: "#FF2DA0", tools: [
      { href: "/admin/contenu",       label: "Site & CMS",   icon: BarChart2 },
      { href: "/admin/articles",      label: "Articles",     icon: Package },
      { href: "/admin/communication", label: "Newsletter",   icon: Mail },
    ]},
  ];

  return (
    <div className="space-y-7 max-w-[1440px]">

      {/* ── Command Center (live) ── */}
      <CommandCenter />

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="font-mono text-[10px] text-[#101014]/25 uppercase tracking-widest">{today}</span>
          </div>
          <h1 className="font-fraunces text-2xl text-[#101014]">Bonjour 👋</h1>
          <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">Vue d&apos;ensemble · Spectrum For Us</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#101014]/[0.13] bg-[#101014]/[0.07] font-hanken text-sm text-[#101014]/50 hover:text-[#101014] hover:bg-[#101014]/[0.06] transition-all disabled:opacity-40">
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          CROISSANCE COMMUNAUTAIRE · bloc prioritaire
      ══════════════════════════════════════════════════════ */}
      <div>
        <SectionTitle accent="#FF2DA0" action={
          <Link href="/admin/rejoindre" className="font-mono text-[10px] text-[#101014]/30 hover:text-[#FF2DA0] uppercase tracking-widest transition-colors flex items-center gap-1">
            Voir les demandes <ArrowUpRight size={10} />
          </Link>
        }>
          🌱 Croissance communautaire
        </SectionTitle>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 animate-pulse">
            {[...Array(7)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-[#101014]/[0.08]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <GrowthCard
              label="Nouveaux membres" value={g?.newMembersWeek ?? 0}
              sub="cette semaine" color="#FF2DA0" icon={UserPlus}
              urgent={(g?.newMembersWeek ?? 0) === 0}
              href="/admin/users"
            />
            <GrowthCard
              label="Nouveaux membres" value={g?.newMembersMonth ?? 0}
              trend={g?.membersTrend} sub="ce mois" color="#FF2DA0" icon={Users}
              href="/admin/users"
            />
            <GrowthCard
              label="Total membres" value={g?.totalMembers ?? 0}
              sub="depuis le lancement" color="#7A2BF0" icon={Users}
              href="/admin/users"
            />
            <GrowthCard
              label="Nouveaux vendeurs" value={g?.newVendorsMonth ?? 0}
              trend={g?.vendorsTrend} sub="ce mois" color="#FFD400" icon={Store}
              href="/admin/vendors"
            />
            <GrowthCard
              label="Demandes rejoindre" value={g?.newJoinRequestsWeek ?? 0}
              sub="cette semaine" color="#2323C4" icon={UserPlus}
              urgent={(g?.pendingJoinRequests ?? 0) > 0}
              href="/admin/rejoindre"
            />
            <GrowthCard
              label="Associations DB" value={g?.totalOrgsDB ?? 0}
              sub="logos / overrides" color="#a78bfa" icon={Building2}
              href="/admin/annuaire"
            />
            <GrowthCard
              label="Pipeline CRM" value={g?.crmTotal ?? 0}
              sub={`${g?.crmWon ?? 0} convertis`} color="#34d399" icon={Target}
              href="/admin/crm"
            />
          </div>
        )}
      </div>

      {/* ── Charts croissance + revenus ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Chart membres 30j */}
        <Card>
          <SectionTitle accent="#FF2DA0" action={
            <Link href="/admin/users" className="font-mono text-[10px] text-[#101014]/30 hover:text-[#FF2DA0] uppercase tracking-widest transition-colors flex items-center gap-1">
              Détails <ArrowUpRight size={10} />
            </Link>
          }>
            Nouveaux membres · 30 jours
          </SectionTitle>
          {chartMembers.some(p => p.count > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartMembers} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(243,234,219,.06)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(243,234,219,.3)", fontSize: 9 }} tickLine={false} axisLine={false} interval={6} />
                <YAxis tick={{ fill: "rgba(243,234,219,.3)", fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1535", border: "1px solid rgba(255,255,255,.1)", borderRadius: "12px", color: "#101014", fontSize: 12 }}
                  formatter={(v) => [v as number, "nouveaux membres"]}
                  labelStyle={{ color: "rgba(243,234,219,.5)" }} />
                <Bar dataKey="count" fill="#FF2DA0" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex flex-col items-center justify-center gap-2">
              <UserPlus size={28} className="text-[#FF2DA0]/20" />
              <p className="font-hanken text-sm text-[#101014]/25">Aucun membre cette semaine</p>
              <p className="font-mono text-[10px] text-[#101014]/15">C&apos;est le moment de lancer la campagne de recrutement</p>
            </div>
          )}
        </Card>

        {/* Chart revenus 30j */}
        <Card>
          <SectionTitle accent="#7A2BF0" action={
            <Link href="/admin/finance" className="font-mono text-[10px] text-[#101014]/30 hover:text-[#FF2DA0] uppercase tracking-widest transition-colors flex items-center gap-1">
              Détails <ArrowUpRight size={10} />
            </Link>
          }>
            Revenus · 30 derniers jours
          </SectionTitle>
          {chart.some(p => p.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7A2BF0" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7A2BF0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(243,234,219,.06)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(243,234,219,.3)", fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fill: "rgba(243,234,219,.3)", fontSize: 9 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v === 0 ? "0" : `${(v/1000).toFixed(1)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1a1535", border: "1px solid rgba(255,255,255,.1)", borderRadius: "12px", color: "#101014", fontSize: 12 }}
                  formatter={(v: unknown) => [`${Number(v).toFixed(2)} €`, "Revenus"]}
                  labelStyle={{ color: "rgba(243,234,219,.5)" }} />
                <Area type="monotone" dataKey="revenue" stroke="#7A2BF0" strokeWidth={2} fill="url(#rev)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex flex-col items-center justify-center gap-2">
              <BarChart2 size={28} className="text-[#101014]/10" />
              <p className="font-hanken text-sm text-[#101014]/25">Aucune vente pour l&apos;instant</p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Commerce KPIs ── */}
      <div>
        <SectionTitle accent="#7A2BF0">Commerce</SectionTitle>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
            {[...Array(8)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-[#101014]/[0.08]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="CA Aujourd'hui" value={fmt(kpis?.revenueToday ?? 0)} sub={`${fmtN(kpis?.ordersToday ?? 0)} commandes`}    color="#FF2DA0" icon={TrendingUp}    href="/admin/finance" />
            <KpiCard label="CA Ce mois"     value={fmt(kpis?.revenueMonth ?? 0)} sub={`${fmtN(kpis?.ordersMonth ?? 0)} commandes`}    color="#7A2BF0" icon={TrendingUp}    href="/admin/finance" />
            <KpiCard label="CA Annuel"      value={fmt(kpis?.revenueYear ?? 0)}  sub="depuis le 1er janvier"                          color="#FFD400" icon={Coins}         href="/admin/finance" />
            <KpiCard label="Panier moyen"   value={fmtSm(kpis?.avgBasket ?? 0)} sub={`${fmtN(kpis?.totalOrders ?? 0)} commandes total`} color="#2323C4" icon={ShoppingCart} href="/admin/orders" />
            <KpiCard label="Vendeur·ses"    value={fmtN(kpis?.vendors ?? 0)}    sub="boutiques actives"                              color="#FF2DA0" icon={Store}         href="/admin/vendors" />
            <KpiCard label="Acheteur·ses"   value={fmtN(kpis?.buyers ?? 0)}     sub="comptes actifs"                                 color="#a78bfa" icon={Users}         href="/admin/users" />
            <KpiCard label="Modération"     value={fmtN(kpis?.pendingMod ?? 0)} sub="éléments en attente"                            color="#FFD400" icon={ShieldCheck}   href="/admin/moderation" alert={(kpis?.pendingMod ?? 0) > 0} />
            <KpiCard label="Support"        value={fmtN(kpis?.openTickets ?? 0)} sub="tickets ouverts"                               color="#FF2DA0" icon={MessageSquare} href="/admin/support"     alert={(kpis?.openTickets ?? 0) > 3} />
          </div>
        )}
      </div>

      {/* ── Actions prioritaires + commandes récentes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Quick actions */}
        <Card>
          <SectionTitle accent="#FFD400">Actions prioritaires</SectionTitle>
          <div className="space-y-1.5">
            {QUICK_ACTIONS.map(a => {
              const Icon = a.icon;
              return (
                <Link key={a.href} href={a.href}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                    a.urgent
                      ? "border-[#FF2DA0]/25 bg-[#FF2DA0]/5 hover:bg-[#FF2DA0]/10"
                      : "border-[#101014]/[0.10] hover:border-[#101014]/[0.12] hover:bg-[#101014]/[0.08]"
                  }`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${a.color}15` }}>
                    <Icon size={13} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-hanken text-[13px] text-[#101014]/70 group-hover:text-[#101014] transition-colors leading-tight">{a.label}</p>
                    <p className="font-mono text-[9px] text-[#101014]/30 mt-0.5">{a.sub}</p>
                  </div>
                  {a.urgent && <span className="w-2 h-2 rounded-full bg-[#FF2DA0] shrink-0 animate-pulse" />}
                  <ArrowUpRight size={12} className="text-[#101014]/15 group-hover:text-[#101014]/50 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Recent orders */}
        <Card>
          <SectionTitle accent="#2323C4" action={
            <Link href="/admin/orders" className="font-mono text-[10px] text-[#101014]/30 hover:text-[#FF2DA0] uppercase tracking-widest transition-colors flex items-center gap-1">
              Tout voir <ArrowUpRight size={10} />
            </Link>
          }>
            Dernières commandes
          </SectionTitle>
          {loading ? (
            <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-[#101014]/[0.08]" />)}</div>
          ) : recentOrders.length === 0 ? (
            <div className="py-10 text-center">
              <ShoppingCart size={28} className="text-[#101014]/10 mx-auto mb-2" />
              <p className="font-hanken text-sm text-[#101014]/25">Aucune commande pour l&apos;instant</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentOrders.map(o => (
                <div key={String(o.id)}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[#101014]/[0.07] transition-colors cursor-pointer"
                  onClick={() => router.push("/admin/orders")}>
                  <div className="w-7 h-7 rounded-lg bg-[#101014]/[0.09] flex items-center justify-center shrink-0">
                    <Package size={12} className="text-[#101014]/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-[#101014]/60 truncate">
                      #{String(o.id).slice(0, 8)} ·{" "}
                      <span className="text-[#101014]/80">{(o.profiles as { full_name?: string } | null)?.full_name || String(o.shipping_name ?? "") || (o.user_id ? "Acheteur·se" : "Sans acheteur")}</span>
                    </p>
                    <p className="font-mono text-[10px] text-[#101014]/25">
                      {new Date(String(o.created_at)).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      {!o.payment_intent_id && <span className="text-[#F93C2C]/70"> · ⚠ sans paiement</span>}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-[#101014]/80">{fmtSm(Number(o.total_amount ?? o.total ?? 0))}</span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${STATUS_PILL[String(o.status)] ?? "bg-[#101014]/[0.06] text-[#101014]/40 border-[#101014]/[0.13]"}`}>
                    {STATUS_LABEL[String(o.status)] ?? String(o.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent vendors */}
        <Card>
          <SectionTitle accent="#FF2DA0" action={
            <Link href="/admin/vendors" className="font-mono text-[10px] text-[#101014]/30 hover:text-[#FF2DA0] uppercase tracking-widest transition-colors flex items-center gap-1">
              Tout voir <ArrowUpRight size={10} />
            </Link>
          }>
            Nouveaux vendeur·ses
          </SectionTitle>
          {loading ? (
            <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-[#101014]/[0.08]" />)}</div>
          ) : recentVendors.length === 0 ? (
            <div className="py-10 text-center">
              <Store size={28} className="text-[#101014]/10 mx-auto mb-2" />
              <p className="font-hanken text-sm text-[#101014]/25">Aucune boutique pour l&apos;instant</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentVendors.map(v => (
                <div key={String(v.id)}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[#101014]/[0.07] transition-colors cursor-pointer"
                  onClick={() => router.push("/admin/vendors")}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#FF2DA018", border: "1px solid #FF2DA022" }}>
                    <span className="font-fraunces text-[12px] text-[#FF2DA0]">{String(v.name ?? "?")[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-hanken text-sm text-[#101014]/80 truncate">{String(v.name ?? "-")}</p>
                    <p className="font-mono text-[10px] text-[#101014]/25">{new Date(String(v.created_at)).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${Boolean(v.is_active) ? "bg-emerald-400" : "bg-[#101014]/15"}`} />
                    <span className={`font-mono text-[9px] ${Boolean(v.is_active) ? "text-emerald-400/70" : "text-[#101014]/25"}`}>
                      {Boolean(v.is_active) ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Tous les outils ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <Zap size={14} className="text-[#a78bfa]" />
          <h2 className="font-fraunces text-base text-[#101014]">Tous les outils</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_TOOLS.map(section => (
            <div key={section.section} className="rounded-2xl border border-[#101014]/[0.12] bg-[#101014]/[0.02] p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: section.color }} />
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#101014]/25">{section.section}</p>
              </div>
              <div className="space-y-0.5">
                {section.tools.map(t => {
                  const Icon = t.icon;
                  return (
                    <Link key={t.href} href={t.href}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#101014]/[0.09] transition-colors group">
                      <Icon size={13} className="text-[#101014]/30 group-hover:text-[#101014]/60 transition-colors shrink-0" />
                      <span className="font-hanken text-sm text-[#101014]/50 group-hover:text-[#101014]/80 transition-colors">{t.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center gap-4 py-3 px-4 rounded-xl bg-[#101014]/[0.02] border border-[#101014]/[0.10]">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-[#101014]/35">API opérationnelle</span>
        </div>
        <div className="w-px h-3 bg-[#101014]/[0.08]" />
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={10} className="text-emerald-400/60" />
          <span className="font-mono text-[10px] text-[#101014]/35">Supabase connecté</span>
        </div>
        <div className="w-px h-3 bg-[#101014]/[0.08]" />
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={10} className="text-emerald-400/60" />
          <span className="font-mono text-[10px] text-[#101014]/35">Paiements actifs</span>
        </div>
        {(kpis?.pendingMod ?? 0) > 0 && (
          <>
            <div className="w-px h-3 bg-[#101014]/[0.08]" />
            <Link href="/admin/moderation" className="flex items-center gap-1.5 hover:text-[#FFD400] transition-colors">
              <AlertCircle size={10} className="text-[#FFD400]" />
              <span className="font-mono text-[10px] text-[#FFD400]/70">{kpis?.pendingMod} éléments à modérer</span>
            </Link>
          </>
        )}
        {(g?.pendingJoinRequests ?? 0) > 0 && (
          <>
            <div className="w-px h-3 bg-[#101014]/[0.08]" />
            <Link href="/admin/rejoindre" className="flex items-center gap-1.5 hover:text-[#FF2DA0] transition-colors">
              <AlertCircle size={10} className="text-[#FF2DA0]" />
              <span className="font-mono text-[10px] text-[#FF2DA0]/70">{g?.pendingJoinRequests} demandes en attente</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
