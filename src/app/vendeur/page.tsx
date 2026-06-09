"use client";

/**
 * Dashboard vendeur·euse · Spectrum For Us
 * Design : "Dashboard Vendeur Spectrum" (Claude Design handoff).
 * Thème clair back-office (Bricolage / Hanken / Space Mono), c-blé aux données réelles
 * (boutique, produits, commandes via order_items.vendor_id, revenus, rang Fondateur·ice).
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectPayments } from "@/components/vendor/ConnectPayments";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import {
  Home, Package, Boxes, Store, CircleDollarSign, BarChart3, CreditCard,
  Settings, Search, Bell, Plus, Menu, ExternalLink, Check, ArrowUpRight, Truck,
} from "lucide-react";
import { ShippingSettings, type ShippingMethod } from "@/components/vendor/ShippingSettings";

// ── Palette (design tokens) ───────────────────────────────────────────────
const C = {
  bg: "#FBFAF8", panel: "#fff", ink: "#101014", soft: "#6B6258", faint: "#9B9285",
  line: "#ECE6DB", line2: "#D8CFC0", mag: "#FF2DA0", grn: "#16A06A", amb: "#F2A03D",
  vio: "#6A44D6", cya: "#1FB6C9", red: "#E0335E",
  spec: "linear-gradient(90deg,#FF2DA0,#C44CFF,#6B5CFF,#1FB6C9,#16A06A,#F2A03D)",
};

type Shop = {
  id: string; name: string; slug: string; is_active: boolean;
  logo_url: string | null; banner_url: string | null; contact_email: string | null;
  description: string | null; subscription_status: string | null;
  shipping_options?: ShippingMethod[] | null;
};
type Product = {
  id: string; name: string; title: string; price: number;
  quantity: number; category: string; is_active: boolean; created_at: string;
};
type VendorOrder = {
  id: string; order_id: string; quantity: number; price_at_purchase: number; created_at: string;
  products: { name: string; title: string } | null;
  orders: { status: string; created_at: string; shipping_name: string | null } | null;
};

type Metrics = {
  paid: VendorOrder[]; revenueMonth: number; totalRevenue: number; orderCount: number;
  toPrepare: Set<string>; weeks: number[]; maxWeek: number; recent: VendorOrder[];
  amount: (o: VendorOrder) => number;
};

type View = "overview" | "products" | "orders" | "shop" | "livraison" | "revenue" | "stats" | "subscription" | "settings";
const PAID = ["paid", "shipped", "delivered"];
const eur = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n)) + " €";

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  paid:      { label: "À préparer", bg: "#FCEAD2", fg: "#9A6516" },
  pending:   { label: "En attente", bg: "#EEEAE1", fg: C.soft },
  shipped:   { label: "Expédié",    bg: "#DDEBFB", fg: "#2660B8" },
  delivered: { label: "Livré",      bg: "#DCF0E5", fg: C.grn },
  failed:    { label: "Échec",      bg: "#FBE0E6", fg: C.red },
  cancelled: { label: "Annulé",     bg: "#FBE0E6", fg: C.red },
};

const NAV: { v: View; label: string; icon: React.ElementType; section?: string }[] = [
  { v: "overview", label: "Vue d'ensemble", icon: Home },
  { v: "products", label: "Produits", icon: Package },
  { v: "orders", label: "Commandes", icon: Boxes },
  { v: "shop", label: "Ma boutique", icon: Store },
  { v: "livraison", label: "Livraison", icon: Truck },
  { v: "revenue", label: "Revenus", icon: CircleDollarSign, section: "Business" },
  { v: "stats", label: "Statistiques", icon: BarChart3 },
  { v: "subscription", label: "Abonnement", icon: CreditCard },
  { v: "settings", label: "Paramètres", icon: Settings, section: "Compte" },
];
const TITLES: Record<View, string> = {
  overview: "Vue d'ensemble", products: "Produits", orders: "Commandes", shop: "Ma boutique",
  livraison: "Livraison", revenue: "Revenus", stats: "Statistiques", subscription: "Abonnement", settings: "Paramètres",
};

export default function VendeurDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [founderRank, setFounderRank] = useState<number | null>(null);
  const [commissions, setCommissions] = useState<{ gross_amount: number; commission_amount: number; status: string }[]>([]);
  const [loadingData, setLoading] = useState(true);
  const [view, setView] = useState<View>("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.push("/auth?redirect=/vendeur"); return; }
    if (!user) return;
    const supabase = createClient();
    (async () => {
      try {
        const { data: shopData } = await supabase.from("shops").select("*").eq("owner_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle();
        if (!shopData) { router.push("/vendeur/onboarding"); return; }
        setShop(shopData as Shop);
        supabase.from("founder_program_members").select("rank").eq("user_id", user.id).single()
          .then(({ data }) => { if (data) setFounderRank(data.rank as number); });
        const [prodRes, orderRes, commRes] = await Promise.all([
          supabase.from("products").select("*").eq("shop_id", shopData.id).order("created_at", { ascending: false }),
          supabase.from("order_items")
            .select("id, order_id, quantity, price_at_purchase, created_at, products(name,title), orders(status, created_at, shipping_name)")
            .eq("vendor_id", user.id).order("created_at", { ascending: false }),
          supabase.from("commissions").select("gross_amount, commission_amount, status").eq("shop_id", shopData.id),
        ]);
        setProducts((prodRes.data ?? []) as Product[]);
        setOrders(((orderRes.data ?? []) as unknown) as VendorOrder[]);
        setCommissions((commRes.data ?? []) as { gross_amount: number; commission_amount: number; status: string }[]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, loading, router]);

  // ── Dérivés ──────────────────────────────────────────────────────────────
  const m = useMemo(() => {
    const paid = orders.filter(o => o.orders && PAID.includes(o.orders.status));
    const amount = (o: VendorOrder) => Number(o.price_at_purchase) * o.quantity;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const revenueMonth = paid.filter(o => new Date(o.orders!.created_at).getTime() >= monthStart).reduce((s, o) => s + amount(o), 0);
    const totalRevenue = paid.reduce((s, o) => s + amount(o), 0);
    const orderCount = new Set(orders.map(o => o.order_id)).size;
    const toPrepare = new Set(orders.filter(o => o.orders?.status === "paid").map(o => o.order_id));
    // 12 semaines glissantes
    const weeks: number[] = Array(12).fill(0);
    const weekMs = 7 * 86400000;
    const base = now.getTime() - 11 * weekMs;
    for (const o of paid) {
      const idx = Math.floor((new Date(o.orders!.created_at).getTime() - base) / weekMs);
      if (idx >= 0 && idx < 12) weeks[idx] += amount(o);
    }
    const maxWeek = Math.max(...weeks, 1);
    const recent = orders.slice(0, 4);
    return { paid, revenueMonth, totalRevenue, orderCount, toPrepare, weeks, maxWeek, recent, amount };
  }, [orders]);

  const checklist = shop ? [
    { label: "Compléter ta boutique (logo, bannière, contact)", done: !!(shop.logo_url && shop.banner_url && shop.contact_email), href: "/vendeur/boutique" },
    { label: products.length === 0 ? "Ajouter ton premier produit" : "Ajouter plus de produits (boost visibilité)", done: products.length >= 3, href: "/vendeur/nouveau-produit" },
    { label: m.toPrepare.size > 0 ? `Préparer ${m.toPrepare.size} commande${m.toPrepare.size > 1 ? "s" : ""}` : "Aucune commande à préparer", done: m.toPrepare.size === 0, href: "#orders" },
    { label: "Connecter les paiements (Stripe)", done: shop.subscription_status === "active", href: "/vendeur/abonnement" },
  ] : [];

  if (loading || loadingData) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <SpectrumLoader size="md" />
    </div>
  );
  if (!shop) return null;

  const activeCount = products.filter(p => p.is_active).length;

  return (
    <div className="flex min-h-screen" style={{ background: C.bg, color: C.ink, fontFamily: "var(--font-hanken),sans-serif" }}>
      {/* backdrop mobile */}
      {menuOpen && <div className="fixed inset-0 z-50 bg-black/30 lg:hidden" onClick={() => setMenuOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-[60] flex flex-col h-screen w-[248px] shrink-0 px-3.5 py-5 transition-transform duration-200 ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ background: C.panel, borderRight: `1px solid ${C.line}` }}
        data-open={menuOpen}
      >
        <Link href="/" className="flex items-center px-2 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="Spectrum For Us" className="h-9 w-auto" />
        </Link>

        <nav className="flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map(({ v, label, icon: Icon, section }) => (
            <div key={v}>
              {section && <p className="font-mono text-[10px] tracking-[0.12em] uppercase px-2.5 pt-3.5 pb-1.5" style={{ color: C.faint }}>{section}</p>}
              <button
                onClick={() => { setView(v); setMenuOpen(false); }}
                className="flex items-center gap-3 w-full text-left px-2.5 py-2.5 rounded-[10px] text-[14.5px] transition-colors"
                style={view === v
                  ? { background: C.ink, color: "#fff", fontWeight: 600 }
                  : { color: C.soft, fontWeight: 500 }}
              >
                <Icon size={18} strokeWidth={1.7} className="shrink-0" />
                <span className="flex-1">{label}</span>
                {v === "orders" && m.toPrepare.size > 0 && (
                  <span className="font-mono text-[10px] font-bold text-white rounded-full px-1.5 py-px" style={{ background: C.mag }}>{m.toPrepare.size}</span>
                )}
              </button>
            </div>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 p-2.5 rounded-xl" style={{ border: `1px solid ${C.line}` }}>
          <span className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white font-bricolage font-bold text-[15px] shrink-0 overflow-hidden" style={{ background: C.spec }}>
            {shop.logo_url ? <img src={shop.logo_url} alt="" className="w-full h-full object-cover" /> : shop.name[0]?.toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <b className="font-bricolage text-sm leading-tight block truncate">{shop.name}</b>
            <a href={`/boutique/${shop.slug}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11.5px] hover:underline" style={{ color: C.faint }}>
              voir ma boutique <ExternalLink size={9} />
            </a>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOPBAR */}
        <div className="sticky top-0 z-10 flex items-center gap-4 px-5 lg:px-8 py-4"
          style={{ background: "rgba(251,249,245,.86)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}` }}>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden w-[42px] h-[42px] rounded-[11px] flex items-center justify-center" style={{ border: `1px solid ${C.line}`, background: "#fff" }}>
            <Menu size={20} />
          </button>
          <h1 className="font-bricolage font-bold text-[22px] lg:text-2xl tracking-[-0.01em]">{TITLES[view]}</h1>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 rounded-[11px] px-3 py-2.5 w-[260px]" style={{ background: "#fff", border: `1px solid ${C.line}`, color: C.faint }}>
            <Search size={16} />
            <input placeholder="Rechercher…" className="bg-transparent outline-none text-sm w-full" style={{ color: C.ink }} />
          </div>
          <button className="relative w-[42px] h-[42px] rounded-[11px] flex items-center justify-center" style={{ border: `1px solid ${C.line}`, background: "#fff" }}>
            <Bell size={19} strokeWidth={1.7} />
            {m.toPrepare.size > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full" style={{ background: C.mag, border: "2px solid #fff" }} />}
          </button>
          <Link href="/vendeur/nouveau-produit" className="inline-flex items-center gap-2 rounded-[11px] font-bold text-sm text-white px-4 py-2.5" style={{ background: C.mag }}>
            <Plus size={17} strokeWidth={2.2} /> <span className="hidden sm:inline">Ajouter un produit</span>
          </Link>
        </div>

        <div className="px-5 lg:px-8 py-6 pb-16 w-full max-w-[1180px]">
          {view === "overview" && <Overview m={m} shop={shop} products={products} activeCount={activeCount} founderRank={founderRank} checklist={checklist} go={setView} />}
          {view === "products" && <Products products={products} />}
          {view === "orders" && <Orders orders={orders} toPrepare={m.toPrepare} />}
          {view === "revenue" && <Revenue total={m.totalRevenue} commissions={commissions} />}
          {view === "subscription" && <Subscription shop={shop} founderRank={founderRank} />}
          {view === "livraison" && <ShippingSettings shopId={shop.id} initial={(shop.shipping_options as ShippingMethod[]) ?? []} />}
          {(view === "shop" || view === "stats" || view === "settings") && (
            <Placeholder view={view} shopSlug={shop.slug} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Panels réutilisables ───────────────────────────────────────────────────
function Panel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`rounded-2xl p-5 ${className}`} style={{ background: C.panel, border: `1px solid ${C.line}`, ...style }}>{children}</div>;
}
function PanelHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bricolage font-bold text-[17px]">{title}</h3>
      {action}
    </div>
  );
}
function Pill({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, bg: "#EEEAE1", fg: C.soft };
  return <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.03em] px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: s.bg, color: s.fg }}>{s.label}</span>;
}
const TH = "font-mono text-[10.5px] tracking-[0.06em] uppercase text-left pb-3 px-3 font-bold";
const TD = "px-3 py-3.5 text-sm align-middle";

// ── Overview ───────────────────────────────────────────────────────────────
function Overview({ m, shop, products, activeCount, founderRank, checklist, go }: {
  m: Metrics; shop: Shop; products: Product[]; activeCount: number;
  founderRank: number | null; checklist: { label: string; done: boolean; href: string }[]; go: (v: View) => void;
}) {
  void shop;
  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4.5" style={{ marginBottom: 18 }}>
        <Kpi tint="#DCF0E5" label="Revenus ce mois" value={eur(m.revenueMonth)} delta="ce mois-ci" deltaColor={C.faint} />
        <Kpi tint="#FCEAD2" label="Commandes" value={String(m.orderCount)} delta={`${m.toPrepare.size} à préparer`} deltaColor={m.toPrepare.size ? C.amb : C.faint} />
        <Kpi tint="#EAE0FB" label="Produits actifs" value={`${activeCount}/${products.length}`} delta="en ligne" deltaColor={C.faint} />
        <Kpi tint="#FBEAD3" label="Total encaissé" value={eur(m.totalRevenue)} delta="depuis le début" deltaColor={C.grn} />
      </div>

      {/* Connexion paiements Stripe */}
      <div className="mb-4" style={{ marginBottom: 18 }}>
        <ConnectPayments />
      </div>

      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-4">
        {/* Chart */}
        <Panel>
          <PanelHead title="Revenus · 12 dernières semaines" action={<button onClick={() => go("revenue")} className="text-[13px] font-bold" style={{ color: C.mag }}>Voir le détail</button>} />
          <div className="flex items-end gap-2.5 h-[150px] pt-2">
            {m.weeks.map((v, i) => (
              <div key={i} className="flex-1 rounded-t-md min-h-[6px]" title={eur(v)}
                style={{ height: `${Math.max(6, (v / m.maxWeek) * 100)}%`, background: C.spec, opacity: 0.85, borderRadius: "6px 6px 3px 3px" }} />
            ))}
          </div>
          <div className="flex gap-2.5 mt-2">
            {["S1", "S3", "S5", "S7", "S9", "S11"].map(s => <span key={s} className="flex-1 text-center font-mono text-[10px]" style={{ color: C.faint }}>{s}</span>)}
          </div>
        </Panel>

        {/* Founder */}
        <div className="rounded-2xl p-5 relative overflow-hidden text-white" style={{ background: "linear-gradient(120deg,#241038,#6A1E4E)" }}>
          <div className="absolute inset-0" style={{ background: C.spec, opacity: 0.16, mixBlendMode: "screen" }} />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold rounded-full px-2.5 py-1 mb-3" style={{ background: "rgba(255,255,255,.16)" }}>
              ✦ {founderRank ? `Fondateur·ice #${String(founderRank).padStart(3, "0")}` : "Programme Fondateur·ice"}
            </span>
            <h3 className="font-bricolage font-extrabold text-[21px] mb-2">Tes avantages à vie</h3>
            <p className="text-[13.5px] leading-relaxed mb-3.5" style={{ color: "rgba(255,255,255,.82)" }}>
              {founderRank && founderRank <= 20
                ? "0 % de commission pendant 6 mois · abonnement offert 12 mois · badge exclusif sur ton profil."
                : founderRank
                ? "0 % de commission pendant 3 mois · abonnement offert 6 mois · badge sur ton profil."
                : "0 % de commission les premiers mois · abonnement offert · badge sur ton profil."}
            </p>
            {founderRank ? (
              <>
                <div className="h-[7px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.2)" }}>
                  <i className="block h-full rounded-full" style={{ width: "64%", background: "#fff" }} />
                </div>
                <small className="block mt-2 font-mono text-[11px]" style={{ color: "rgba(255,255,255,.7)" }}>Commission gratuite · bénéfice fondateur·ice actif</small>
              </>
            ) : (
              <Link href="/programme-fondateur" className="inline-flex items-center gap-1.5 font-bold text-[13px] rounded-lg px-3.5 py-2" style={{ background: "#fff", color: "#241038" }}>
                Rejoindre <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-4 mt-4">
        {/* Recent orders */}
        <Panel>
          <PanelHead title="Commandes récentes" action={<button onClick={() => go("orders")} className="text-[13px] font-bold" style={{ color: C.mag }}>Tout voir</button>} />
          {ordersTable(m.recent, false)}
        </Panel>
        {/* To-do */}
        <Panel>
          <PanelHead title="À faire" />
          {checklist.map((t, i) => (
            <Link key={i} href={t.href.startsWith("#") ? "#" : t.href}
              className="flex items-center gap-3 py-3 last:border-0" style={{ borderBottom: `1px solid ${C.line}` }}>
              <span className="w-[22px] h-[22px] rounded-[7px] shrink-0 flex items-center justify-center"
                style={t.done ? { background: C.grn, border: `2px solid ${C.grn}` } : { border: `2px solid ${C.line2}` }}>
                {t.done && <Check size={13} color="#fff" strokeWidth={3} />}
              </span>
              <span className="flex-1 text-[13.5px]" style={t.done ? { color: C.faint, textDecoration: "line-through" } : undefined}>{t.label}</span>
            </Link>
          ))}
        </Panel>
      </div>
    </>
  );
}

function Kpi({ tint, label, value, delta, deltaColor }: { tint: string; label: string; value: string; delta: string; deltaColor: string }) {
  return (
    <Panel className="!p-[18px]">
      <div className="flex items-center gap-2 text-[13px]" style={{ color: C.soft }}>
        <span className="w-[26px] h-[26px] rounded-lg" style={{ background: tint }} />
        {label}
      </div>
      <div className="font-bricolage font-bold text-[30px] tracking-[-0.01em] mt-2 mb-1">{value}</div>
      <div className="font-mono text-[12px] font-bold" style={{ color: deltaColor }}>{delta}</div>
    </Panel>
  );
}

// ── Tables ─────────────────────────────────────────────────────────────────
function ordersTable(rows: VendorOrder[], full: boolean) {
  if (rows.length === 0) return <p className="text-sm py-6 text-center" style={{ color: C.faint }}>Aucune commande pour l&apos;instant.</p>;
  return (
    <div className="overflow-x-auto">
    <table className="w-full border-collapse min-w-[460px]">
      <thead><tr>
        {full && <th className={TH} style={{ color: C.faint }}>N°</th>}
        <th className={TH} style={{ color: C.faint }}>Produit</th>
        <th className={TH} style={{ color: C.faint }}>Client</th>
        {full && <th className={TH} style={{ color: C.faint }}>Date</th>}
        <th className={TH} style={{ color: C.faint }}>Montant</th>
        <th className={TH} style={{ color: C.faint }}>Statut</th>
      </tr></thead>
      <tbody>
        {rows.map(o => (
          <tr key={o.id}>
            {full && <td className={`${TD} font-mono text-[12.5px]`} style={{ borderTop: `1px solid ${C.line}`, color: C.soft }}>#{o.order_id.slice(0, 5).toUpperCase()}</td>}
            <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}>
              <div className="flex items-center gap-2.5">
                <span className="w-[42px] h-[42px] rounded-[9px] shrink-0" style={{ background: "#FBEAD3" }} />
                <b>{o.products?.name || o.products?.title || "Produit"}</b>
              </div>
            </td>
            <td className={TD} style={{ borderTop: `1px solid ${C.line}`, color: C.soft }}>{o.orders?.shipping_name || "-"}</td>
            {full && <td className={TD} style={{ borderTop: `1px solid ${C.line}`, color: C.soft }}>{o.orders ? new Date(o.orders.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "-"}</td>}
            <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}><b>{eur(Number(o.price_at_purchase) * o.quantity)}</b></td>
            <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}><Pill status={o.orders?.status ?? "pending"} /></td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

function Products({ products }: { products: Product[] }) {
  return (
    <Panel className="!p-0">
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="font-bricolage font-bold text-[17px]">Tes produits · {products.length}</h3>
        <Link href="/vendeur/nouveau-produit" className="inline-flex items-center gap-2 rounded-[11px] font-bold text-sm text-white px-3.5 py-2.5" style={{ background: C.mag }}><Plus size={16} /> Ajouter</Link>
      </div>
      <div className="p-2">
        {products.length === 0 ? <p className="text-sm py-8 text-center" style={{ color: C.faint }}>Aucun produit. Ajoute ta première création ✦</p> : (
          <>
          {/* Cartes mobile */}
          <div className="md:hidden space-y-2 p-1">
            {products.map(p => (
              <Link key={p.id} href={`/vendeur/produit/${p.id}`} className="flex items-center gap-3 p-3 rounded-2xl" style={{ boxShadow: `inset 0 0 0 1px ${C.line}` }}>
                <span className="w-12 h-12 rounded-xl shrink-0" style={{ background: "#FBEAD3" }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bricolage font-semibold text-[14.5px] leading-tight line-clamp-2">{p.name || p.title}</p>
                  <p className="text-[12.5px] mt-0.5" style={{ color: C.soft }}>{p.category || "—"} · {(p.quantity ?? 0) <= 0 ? "Rupture" : `${p.quantity} en stock`}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-[14px]">{eur(p.price)}</p>
                  <span className="inline-block mt-1 font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-full" style={p.is_active ? { background: "#DCF0E5", color: C.grn } : { background: "#EEEAE1", color: C.soft }}>{p.is_active ? "Actif" : "Brouillon"}</span>
                </div>
              </Link>
            ))}
          </div>
          {/* Tableau desktop */}
          <table className="hidden md:table w-full border-collapse">
            <thead><tr>
              {["Produit", "Catégorie", "Prix", "Stock", "Statut", ""].map((h, i) => <th key={i} className={TH} style={{ color: C.faint }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}><div className="flex items-center gap-2.5"><span className="w-[42px] h-[42px] rounded-[9px] shrink-0" style={{ background: "#FBEAD3" }} /><b>{p.name || p.title}</b></div></td>
                  <td className={TD} style={{ borderTop: `1px solid ${C.line}`, color: C.soft }}>{p.category || "-"}</td>
                  <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}><b>{eur(p.price)}</b></td>
                  <td className={TD} style={{ borderTop: `1px solid ${C.line}`, color: (p.quantity ?? 0) <= 0 ? C.red : C.soft }}>{(p.quantity ?? 0) <= 0 ? "Rupture" : p.quantity}</td>
                  <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}>
                    <span className="font-mono text-[10.5px] font-bold uppercase px-2.5 py-1 rounded-full" style={p.is_active ? { background: "#DCF0E5", color: C.grn } : { background: "#EEEAE1", color: C.soft }}>{p.is_active ? "Actif" : "Brouillon"}</span>
                  </td>
                  <td className={`${TD} text-right`} style={{ borderTop: `1px solid ${C.line}` }}>
                    <Link href={`/vendeur/produit/${p.id}`} className="rounded-lg px-3 py-1.5 text-[12.5px] font-semibold" style={{ border: `1px solid ${C.line}`, color: C.ink }}>Éditer</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </div>
    </Panel>
  );
}

function Orders({ orders, toPrepare }: { orders: VendorOrder[]; toPrepare: Set<string> }) {
  const [filter, setFilter] = useState<"all" | "prep">("all");
  const rows = filter === "prep" ? orders.filter(o => o.orders?.status === "paid") : orders;
  return (
    <Panel className="!p-0">
      <div className="flex items-center justify-between px-5 pt-5 flex-wrap gap-2">
        <h3 className="font-bricolage font-bold text-[17px]">Commandes</h3>
        <div className="flex gap-2">
          <button onClick={() => setFilter("prep")} className="rounded-[11px] font-bold text-sm px-3.5 py-2.5" style={filter === "prep" ? { background: C.ink, color: "#fff" } : { background: "#fff", border: `1px solid ${C.line}` }}>À préparer ({toPrepare.size})</button>
          <button onClick={() => setFilter("all")} className="rounded-[11px] font-bold text-sm px-3.5 py-2.5" style={filter === "all" ? { background: C.ink, color: "#fff" } : { background: "#fff", border: `1px solid ${C.line}` }}>Toutes</button>
        </div>
      </div>
      <div className="p-2">{ordersTable(rows, true)}</div>
    </Panel>
  );
}

function Revenue({ total, commissions }: { total: number; commissions: { gross_amount: number; commission_amount: number; status: string }[] }) {
  const gross = commissions.reduce((s, c) => s + Number(c.gross_amount || 0), 0) || total;
  const commission = commissions.reduce((s, c) => s + Number(c.commission_amount || 0), 0);
  const net = gross - commission;
  const pending = commissions.filter(c => c.status === "pending").reduce((s, c) => s + (Number(c.gross_amount || 0) - Number(c.commission_amount || 0)), 0);
  const rate = gross > 0 ? Math.round((commission / gross) * 1000) / 10 : 0;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Kpi tint="#DCF0E5" label="Brut encaissé" value={eur(gross)} delta="commandes payées" deltaColor={C.grn} />
        <Kpi tint="#FCEAD2" label="Commission plateforme" value={eur(commission)} delta={commission === 0 ? "0 % · fondateur·ice ✦" : `${rate} % effectif`} deltaColor={commission === 0 ? C.grn : C.amb} />
        <Kpi tint="#EAE0FB" label="Net pour toi" value={eur(net)} delta={`${eur(pending)} à verser`} deltaColor={C.faint} />
      </div>
      <Panel>
        <PanelHead title="Versements" />
        {commissions.length === 0 ? (
          <p className="text-sm py-4" style={{ color: C.faint }}>Aucune vente pour l&apos;instant · tes versements apparaîtront ici.</p>
        ) : (
          <div className="overflow-x-auto"><table className="w-full border-collapse min-w-[420px]">
            <thead><tr>{["Commandes", "Brut", "Commission", "Net", "Statut"].map(h => <th key={h} className={TH} style={{ color: C.faint }}>{h}</th>)}</tr></thead>
            <tbody>
              <tr>
                <td className={TD} style={{ borderTop: `1px solid ${C.line}`, color: C.soft }}>{commissions.length}</td>
                <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}>{eur(gross)}</td>
                <td className={TD} style={{ borderTop: `1px solid ${C.line}`, color: C.soft }}>{eur(commission)}</td>
                <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}><b>{eur(net)}</b></td>
                <td className={TD} style={{ borderTop: `1px solid ${C.line}` }}><span className="font-mono text-[10.5px] font-bold uppercase px-2.5 py-1 rounded-full" style={{ background: "#FCEAD2", color: "#9A6516" }}>{eur(pending)} en attente</span></td>
              </tr>
            </tbody>
          </table></div>
        )}
        <p className="text-[11px] mt-4" style={{ color: C.faint }}>Versements manuels pour l&apos;instant · contacte le support. Commission 0 % pendant l&apos;avantage fondateur·ice.</p>
      </Panel>
    </>
  );
}

function Subscription({ shop, founderRank }: { shop: Shop; founderRank: number | null }) {
  const active = shop.subscription_status === "active";
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Panel>
        <PanelHead title="Ton abonnement" />
        <div className="flex items-baseline gap-2"><span className="font-bricolage font-extrabold text-[34px]">9,90 €</span><span style={{ color: C.soft }}>/ mois</span></div>
        <p className="text-sm leading-relaxed mt-2" style={{ color: C.soft }}>
          {active
            ? <>Abonnement <b style={{ color: C.ink }}>actif</b>. Boutique, outils et mise en avant éditoriale inclus.</>
            : <>Déclenché à ta <b style={{ color: C.ink }}>première vente</b> · tu n&apos;as encore rien payé. Boutique, outils, mise en avant éditoriale inclus.</>}
        </p>
        <div className="flex gap-2.5 mt-3 flex-wrap">
          <Link href="/vendeur/abonnement" className="rounded-[11px] font-bold text-sm px-4 py-2.5" style={{ background: "#fff", border: `1px solid ${C.line}` }}>Gérer l&apos;abonnement</Link>
        </div>
      </Panel>
      <div className="rounded-2xl p-5 relative overflow-hidden text-white" style={{ background: "linear-gradient(120deg,#241038,#6A1E4E)" }}>
        <div className="absolute inset-0" style={{ background: C.spec, opacity: 0.16, mixBlendMode: "screen" }} />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold rounded-full px-2.5 py-1 mb-3" style={{ background: "rgba(255,255,255,.16)" }}>✦ Programme Fondateur·ice</span>
          <h3 className="font-bricolage font-extrabold text-[21px] mb-2">{founderRank ? `Place #${String(founderRank).padStart(3, "0")} / 120` : "120 places"}</h3>
          <p className="text-[13.5px] leading-relaxed" style={{ color: "rgba(255,255,255,.82)" }}>Fondateur·ice (rang 1-20) : abonnement offert 12 mois · 0 % commission 6 mois. Pionnier·e (rang 21-120) : abonnement offert 6 mois · 0 % commission 3 mois. Mise en avant prioritaire à vie.</p>
        </div>
      </div>
    </div>
  );
}

function Placeholder({ view, shopSlug }: { view: View; shopSlug: string }) {
  const map: Record<string, { title: string; body: React.ReactNode; cta?: React.ReactNode }> = {
    shop: { title: "Ma boutique", body: "Bio, pronoms, ville, badges, cover, mise en avant.", cta: <a href={`/boutique/${shopSlug}`} target="_blank" rel="noopener noreferrer" className="rounded-[11px] font-bold text-sm text-white px-4 py-2.5" style={{ background: C.mag }}>Voir en public</a> },
    stats: { title: "Statistiques", body: "Trafic, sources, taux de conversion, produits les plus vus." },
    settings: { title: "Paramètres", body: "Profil, expédition, paiements (Stripe), notifications, accessibilité." },
  };
  const p = map[view];
  const editHref = view === "shop" ? "/vendeur/boutique" : view === "settings" ? "/compte" : null;
  return (
    <Panel>
      <PanelHead title={p.title} action={p.cta} />
      <p className="text-sm" style={{ color: C.soft }}>{p.body}</p>
      {editHref && <Link href={editHref} className="inline-block mt-4 rounded-[11px] font-bold text-sm px-4 py-2.5" style={{ background: "#fff", border: `1px solid ${C.line}` }}>Configurer →</Link>}
    </Panel>
  );
}
