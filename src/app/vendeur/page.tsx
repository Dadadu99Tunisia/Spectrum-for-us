"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  Euro, Package, BarChart3, Star, Plus, Settings,
  Eye, EyeOff, Pencil, CheckCircle2, Circle,
  ArrowRight, ExternalLink, ImageIcon, Mail, Zap,
} from "lucide-react";
import { FounderBanner } from "@/components/founder/FounderBanner";
import { FounderBadge, type FounderStatus } from "@/components/founder/FounderBadge";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import Link from "next/link";

type Shop = {
  id: string; name: string; slug: string; is_active: boolean;
  logo_url: string | null; banner_url: string | null;
  contact_email: string | null; description: string | null;
};
type Product = {
  id: string; name: string; title: string; price: number;
  quantity: number; category: string; is_active: boolean; created_at: string;
};

type VendorOrder = {
  id: string;
  order_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  products: { name: string; title: string } | null;
  orders: { status: string; created_at: string; shipping_name: string | null } | null;
};

const TABS = ["Vue d'ensemble", "Produits", "Commandes", "Finances"] as const;
type Tab = typeof TABS[number];

export default function VendeurPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab]               = useState<Tab>("Vue d'ensemble");
  const [shop, setShop]             = useState<Shop | null>(null);
  const [products, setProducts]     = useState<Product[]>([]);
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loadingData, setLoading]   = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [founderStatus, setFounderStatus] = useState<{ status: FounderStatus; rank: number } | null>(null);

  useEffect(() => {
    if (!loading && !user) { router.push("/auth?redirect=/vendeur"); return; }
    if (!user) return;
    const supabase = createClient();
    const load = async () => {
      try {
        const { data: shopData } = await supabase.from("shops").select("*").eq("owner_id", user.id).single();
        if (!shopData) { router.push("/vendeur/onboarding"); return; }
        setShop(shopData as Shop);
        // Fetch founder program status silently
        supabase.from("founder_program_members")
          .select("status, rank")
          .eq("user_id", user.id)
          .single()
          .then(({ data: fp }) => {
            if (fp) setFounderStatus({ status: fp.status as FounderStatus, rank: fp.rank });
          });
        const [prodRes, orderRes] = await Promise.all([
          supabase.from("products").select("*").eq("shop_id", shopData.id).order("created_at", { ascending: false }),
          supabase.from("order_items")
            .select("id, order_id, quantity, price_at_purchase, created_at, products(name,title), orders(status, created_at, shipping_name)")
            .eq("vendor_id", user.id)
            .order("created_at", { ascending: false }),
        ]);
        setProducts(prodRes.data ?? []);
        const orders = ((orderRes.data ?? []) as unknown) as VendorOrder[];
        setVendorOrders(orders);
        const revenue = orders
          .filter(o => o.orders?.status === "paid" || o.orders?.status === "shipped" || o.orders?.status === "delivered")
          .reduce((sum, o) => sum + (Number(o.price_at_purchase) * o.quantity), 0);
        setTotalRevenue(revenue);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, loading, router]);

  const toggleProduct = async (p: Product) => {
    setTogglingId(p.id);
    await createClient().from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
    setTogglingId(null);
  };

  if (loading || loadingData) return (
    <div className="min-h-screen bg-[#3D1F5C] flex items-center justify-center">
      <SpectrumLoader size="md" />
    </div>
  );
  if (!shop) return null;

  const activeProducts = products.filter(p => p.is_active);

  /* ── Checklist ── */
  const checklist = [
    {
      id: "logo",
      label: "Ajouter un logo",
      done: !!shop.logo_url,
      href: "/vendeur/boutique",
      icon: ImageIcon,
    },
    {
      id: "banner",
      label: "Ajouter une bannière",
      done: !!shop.banner_url,
      href: "/vendeur/boutique",
      icon: ImageIcon,
    },
    {
      id: "contact",
      label: "Renseigner un email de contact",
      done: !!shop.contact_email,
      href: "/vendeur/boutique",
      icon: Mail,
    },
    {
      id: "product",
      label: "Ajouter ton premier produit",
      done: products.length > 0,
      href: "/vendeur/nouveau-produit",
      icon: Package,
    },
  ];
  const doneCount  = checklist.filter(c => c.done).length;
  const setupDone  = doneCount === checklist.length;
  const pct        = Math.round((doneCount / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-[#3D1F5C]">
      <Header />
      <div className="pt-20 flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-60 border-r border-[#F3EADB]/8 min-h-screen pt-8 px-4 gap-1 shrink-0">
          {/* Shop identity */}
          <div className="mb-6 px-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#E0337E]/10 border border-[#E0337E]/20 flex items-center justify-center shrink-0">
                {shop.logo_url
                  ? <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                  : <span className="font-fraunces text-lg text-[#E0337E]">{shop.name[0]}</span>
                }
              </div>
              <div className="min-w-0">
                <p className="font-bricolage font-bold text-[#F3EADB] text-sm leading-tight truncate">{shop.name}</p>
                <a href={`/boutique/${shop.slug}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#E0337E] transition-colors tracking-widest">
                  voir ma boutique <ExternalLink size={8} />
                </a>
              </div>
            </div>
            {/* Setup progress bar */}
            {!setupDone && (
              <div className="px-1 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[9px] text-[#F3EADB]/30 uppercase tracking-wider">Profil</span>
                  <span className="font-mono text-[9px] text-[#E0901E]">{pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-[#F3EADB]/8 overflow-hidden">
                  <div className="h-full rounded-full bg-[#E0901E] transition-all duration-500"
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
          </div>

          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-left px-3 py-2.5 rounded-xl text-sm font-hanken transition-all duration-200 ${
                tab === t ? "bg-[#E0337E]/10 text-[#E0337E]" : "text-[#F3EADB]/50 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5"
              }`}>{t}</button>
          ))}

          <div className="mt-auto pb-6 px-2 space-y-2">
            <Link href="/vendeur/nouveau-produit"
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-hanken text-[#E0337E] bg-[#E0337E]/8 hover:bg-[#E0337E]/15 transition-colors">
              <Plus size={14} /> Nouveau produit
            </Link>
            <Link href="/vendeur/boutique"
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-hanken text-[#F3EADB]/40 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-colors">
              <Settings size={14} /> Ma boutique
            </Link>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 px-4 md:px-8 py-8 overflow-auto">

          {/* Mobile tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-hanken border transition-all ${
                  tab === t ? "border-[#E0337E] text-[#E0337E] bg-[#E0337E]/10" : "border-[#F3EADB]/15 text-[#F3EADB]/50"
                }`}>{t}</button>
            ))}
          </div>

          {/* ══ VUE D'ENSEMBLE ══ */}
          {tab === "Vue d'ensemble" && (
            <div className="space-y-6">

              {/* Founder banner — shown only if no status yet (program still open) */}
              {!founderStatus && <FounderBanner compact dismissible />}

              {/* Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-fraunces text-3xl text-[#F3EADB]">
                    Bonjour <span className="text-[#E0337E]">✦</span>
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="font-hanken text-[#F3EADB]/40 text-sm">{shop.name}</p>
                    {founderStatus && founderStatus.status !== "STANDARD" && (
                      <FounderBadge status={founderStatus.status} rank={founderStatus.rank} size="sm" showRank />
                    )}
                  </div>
                </div>
                <a href={`/boutique/${shop.slug}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#F3EADB]/15 text-[#F3EADB]/50 font-hanken text-sm hover:border-[#E0337E]/30 hover:text-[#E0337E] transition-all">
                  <ExternalLink size={13} /> Voir ma boutique
                </a>
              </div>

              {/* Checklist — affiché si profil incomplet */}
              {!setupDone && (
                <div className="rounded-2xl border border-[#E0901E]/25 bg-[#E0901E]/5 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-[#E0901E]/15 flex items-center justify-center">
                      <Zap size={15} className="text-[#E0901E]" />
                    </div>
                    <div>
                      <p className="font-bricolage font-semibold text-[#F3EADB] text-sm">
                        Configure ta boutique ({doneCount}/{checklist.length})
                      </p>
                      <p className="font-hanken text-xs text-[#F3EADB]/40">
                        Une boutique complète attire 3× plus de clients
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {checklist.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.id} href={item.done ? "#" : item.href}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                            item.done
                              ? "opacity-50 cursor-default"
                              : "bg-[#F3EADB]/5 hover:bg-[#F3EADB]/8 group"
                          }`}>
                          {item.done
                            ? <CheckCircle2 size={16} className="text-[#1C9C95] shrink-0" />
                            : <Circle size={16} className="text-[#F3EADB]/25 shrink-0" />
                          }
                          <Icon size={14} className={item.done ? "text-[#F3EADB]/30" : "text-[#F3EADB]/50"} />
                          <span className={`font-hanken text-sm flex-1 ${item.done ? "line-through text-[#F3EADB]/30" : "text-[#F3EADB]/70"}`}>
                            {item.label}
                          </span>
                          {!item.done && (
                            <ArrowRight size={13} className="text-[#F3EADB]/20 group-hover:text-[#E0337E] transition-colors" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Revenus", value: `${totalRevenue.toFixed(2)} €`, icon: Euro, color: "#E0337E" },
                  { label: "Produits actifs", value: String(activeProducts.length), icon: Package, color: "#1C9C95" },
                  { label: "Note moyenne", value: "—", icon: Star, color: "#E0901E" },
                  { label: "Vues boutique", value: "—", icon: BarChart3, color: "#6D2DB5" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <Card key={label} hoverable={false} className="p-5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${color}18` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div className="font-fraunces text-2xl text-[#F3EADB] mb-1">{value}</div>
                    <div className="font-hanken text-xs text-[#F3EADB]/40">{label}</div>
                  </Card>
                ))}
              </div>

              {/* Empty products CTA */}
              {products.length === 0 && (
                <Card hoverable={false} className="p-8 text-center border-dashed border-[#E0337E]/20">
                  <Package size={36} className="mx-auto mb-4 text-[#F3EADB]/20" />
                  <p className="font-hanken text-[#F3EADB]/50 mb-1">Ta boutique n&apos;a pas encore de produits.</p>
                  <p className="font-hanken text-xs text-[#F3EADB]/30 mb-5">Ajoute ton premier produit pour apparaître dans la marketplace.</p>
                  <Button variant="primary" href="/vendeur/nouveau-produit" className="text-sm">
                    <Plus size={14} /> Ajouter mon premier produit
                  </Button>
                </Card>
              )}

              {/* Recent products preview */}
              {products.length > 0 && (
                <Card hoverable={false} className="overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3EADB]/8">
                    <h2 className="font-bricolage font-semibold text-[#F3EADB] text-sm">Produits récents</h2>
                    <button onClick={() => setTab("Produits")}
                      className="font-mono text-[10px] text-[#E0337E]/60 hover:text-[#E0337E] uppercase tracking-widest transition-colors">
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y divide-[#F3EADB]/5">
                    {products.slice(0, 4).map((p) => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${p.is_active ? "bg-[#1C9C95]" : "bg-[#F3EADB]/20"}`} />
                          <span className="font-hanken text-sm text-[#F3EADB]/80 truncate max-w-[160px]">{p.name || p.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-xs text-[#F3EADB]/40">{Number(p.price).toFixed(2)} €</span>
                          <Link href={`/vendeur/produit/${p.id}`}
                            className="p-1.5 rounded-lg border border-[#F3EADB]/10 text-[#F3EADB]/30 hover:text-[#E0337E] hover:border-[#E0337E]/30 transition-colors">
                            <Pencil size={11} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ══ PRODUITS ══ */}
          {tab === "Produits" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="font-fraunces text-3xl text-[#F3EADB]">Mes produits</h1>
                <Button variant="primary" href="/vendeur/nouveau-produit" className="text-sm px-4 py-2.5">
                  <Plus size={14} /> Ajouter
                </Button>
              </div>
              {products.length === 0 ? (
                <Card hoverable={false} className="p-8 text-center">
                  <p className="font-hanken text-[#F3EADB]/40 mb-4">Aucun produit encore.</p>
                  <Button variant="primary" href="/vendeur/nouveau-produit" className="text-sm">Ajouter un produit</Button>
                </Card>
              ) : (
                <Card hoverable={false} className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-[#F3EADB]/8">
                          {["Nom", "Prix", "Stock", "Catégorie", "Statut", "Actions"].map((h) => (
                            <th key={h} className="text-left px-5 py-3 font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/30">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id} className="border-b border-[#F3EADB]/6 last:border-0 hover:bg-[#F3EADB]/[0.02] transition-colors">
                            <td className="px-5 py-4 font-hanken text-sm text-[#F3EADB]">{p.name || p.title}</td>
                            <td className="px-5 py-4 font-mono text-sm text-[#F3EADB]">{Number(p.price).toFixed(2)} €</td>
                            <td className="px-5 py-4 font-mono text-sm">
                              <span className={p.quantity === 0 ? "text-red-400" : "text-[#F3EADB]/60"}>{p.quantity}</span>
                            </td>
                            <td className="px-5 py-4"><Tag variant="default">{p.category || "—"}</Tag></td>
                            <td className="px-5 py-4"><Tag variant={p.is_active ? "teal" : "default"}>{p.is_active ? "en ligne" : "hors ligne"}</Tag></td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleProduct(p)} disabled={togglingId === p.id}
                                  title={p.is_active ? "Désactiver" : "Activer"}
                                  className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 ${
                                    p.is_active
                                      ? "border-red-400/20 text-red-400/50 hover:text-red-400 hover:border-red-400/40"
                                      : "border-green-400/20 text-green-400/50 hover:text-green-400 hover:border-green-400/40"
                                  }`}>
                                  {p.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <Link href={`/vendeur/produit/${p.id}`}
                                  className="p-1.5 rounded-lg border border-[#F3EADB]/10 text-[#F3EADB]/30 hover:text-[#E0337E] hover:border-[#E0337E]/30 transition-colors">
                                  <Pencil size={13} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ══ COMMANDES ══ */}
          {tab === "Commandes" && (
            <div className="space-y-5">
              <h1 className="font-fraunces text-3xl text-[#F3EADB]">Mes commandes</h1>
              {vendorOrders.length === 0 ? (
                <Card hoverable={false} className="p-8 text-center">
                  <Package size={36} className="mx-auto mb-4 text-[#F3EADB]/20" />
                  <p className="font-hanken text-[#F3EADB]/40">Aucune commande pour l&apos;instant.</p>
                  <p className="font-hanken text-xs text-[#F3EADB]/25 mt-1">Elles apparaîtront dès qu&apos;un·e acheteur·se commandera tes produits.</p>
                </Card>
              ) : (
                <Card hoverable={false} className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-[#F3EADB]/8">
                          {["Produit", "Acheteur·se", "Qté", "Montant", "Statut", "Date"].map(h => (
                            <th key={h} className="text-left px-5 py-3 font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/30">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {vendorOrders.map(o => {
                          const statusColors: Record<string, string> = {
                            paid: "text-[#1C9C95]", shipped: "text-[#6D2DB5]",
                            delivered: "text-[#1C9C95]", pending: "text-[#E0901E]", cancelled: "text-red-400",
                          };
                          const statusLabels: Record<string, string> = {
                            paid: "Payé", shipped: "Expédié", delivered: "Livré",
                            pending: "En attente", cancelled: "Annulé",
                          };
                          const st = o.orders?.status ?? "pending";
                          return (
                            <tr key={o.id} className="border-b border-[#F3EADB]/6 last:border-0 hover:bg-[#F3EADB]/[0.02] transition-colors">
                              <td className="px-5 py-4 font-hanken text-sm text-[#F3EADB] truncate max-w-[160px]">
                                {(o.products as {name?:string;title?:string}|null)?.name || (o.products as {name?:string;title?:string}|null)?.title || "—"}
                              </td>
                              <td className="px-5 py-4 font-hanken text-sm text-[#F3EADB]/60">{o.orders?.shipping_name ?? "—"}</td>
                              <td className="px-5 py-4 font-mono text-sm text-[#F3EADB]/60">{o.quantity}</td>
                              <td className="px-5 py-4 font-mono text-sm text-[#F3EADB]">{(Number(o.price_at_purchase) * o.quantity).toFixed(2)} €</td>
                              <td className="px-5 py-4">
                                <span className={`font-mono text-[10px] ${statusColors[st] ?? "text-[#F3EADB]/40"}`}>
                                  {statusLabels[st] ?? st}
                                </span>
                              </td>
                              <td className="px-5 py-4 font-mono text-xs text-[#F3EADB]/30">
                                {new Date(o.created_at).toLocaleDateString("fr-FR")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ══ FINANCES ══ */}
          {tab === "Finances" && (
            <div>
              <h1 className="font-fraunces text-3xl text-[#F3EADB] mb-6">Finances</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "CA total encaissé", value: `${totalRevenue.toFixed(2)} €`, color: "#E0337E" },
                  { label: "Commandes reçues", value: String(vendorOrders.filter(o => o.orders?.status === "paid" || o.orders?.status === "shipped" || o.orders?.status === "delivered").length), color: "#E0901E" },
                  { label: "En attente paiement", value: `${vendorOrders.filter(o => o.orders?.status === "pending").reduce((s,o) => s + Number(o.price_at_purchase)*o.quantity, 0).toFixed(2)} €`, color: "#1C9C95" },
                ].map(({ label, value, color }) => (
                  <Card key={label} hoverable={false} className="p-6">
                    <div className="font-fraunces text-3xl mb-1" style={{ color }}>{value}</div>
                    <div className="font-hanken text-sm text-[#F3EADB]/40">{label}</div>
                  </Card>
                ))}
              </div>
              <Card hoverable={false} className="p-6">
                <h2 className="font-bricolage font-bold text-[#F3EADB] mb-3">Reversements automatiques</h2>
                <p className="font-hanken text-sm text-[#F3EADB]/50 leading-relaxed mb-4">
                  Les paiements sont gérés via <strong className="text-[#F3EADB]/70">Stripe Connect</strong>. Configure tes coordonnées bancaires pour recevoir tes revenus automatiquement.
                </p>
                <Button variant="secondary" className="text-sm py-2 px-5">Configurer Stripe Connect</Button>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
