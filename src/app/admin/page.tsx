"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Store, ShoppingBag, Users, Euro, CheckCircle, XCircle, Clock, FileText, Star } from "lucide-react";

type Tab = "overview" | "produits" | "vendeurs" | "commissions" | "articles" | "ambassadeurs";

type Stats = { vendors: number; products: number; orders: number; revenue: number; pending_products: number; };

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats>({ vendors: 0, products: 0, orders: 0, revenue: 0, pending_products: 0 });
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [vendors, setVendors] = useState<Record<string, unknown>[]>([]);
  const [commissions, setCommissions] = useState<Record<string, unknown>[]>([]);
  const [articles, setArticles] = useState<Record<string, unknown>[]>([]);
  const [ambassadors, setAmbassadors] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from("profiles").select("is_admin").eq("id", user.id).single().then(({ data }) => {
      if (!data?.is_admin) { router.push("/"); return; }
      setIsAdmin(true);
      // Load stats
      Promise.all([
        supabase.from("shops").select("id", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("orders").select("id,total", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }).eq("is_available", false),
      ]).then(([shops, prods, orders, pendingProds]) => {
        const revenue = (orders.data ?? []).reduce((s, o) => s + (Number((o as Record<string, unknown>).total) || 0), 0);
        setStats({
          vendors: shops.count ?? 0,
          products: prods.count ?? 0,
          orders: orders.count ?? 0,
          revenue,
          pending_products: pendingProds.count ?? 0,
        });
      });
      setLoading(false);
    });
  }, [user, router]);

  useEffect(() => {
    if (!isAdmin) return;
    const supabase = createClient();
    if (tab === "produits") supabase.from("products").select("*, shops(name)").order("created_at", { ascending: false }).limit(50).then(({ data }) => setProducts(data ?? []));
    if (tab === "vendeurs") supabase.from("shops").select("*, profiles(username,email)").order("created_at", { ascending: false }).limit(50).then(({ data }) => setVendors(data ?? []));
    if (tab === "commissions") supabase.from("commissions").select("*, shops(name)").order("created_at", { ascending: false }).limit(50).then(({ data }) => setCommissions(data ?? []));
    if (tab === "articles") supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => setArticles(data ?? []));
    if (tab === "ambassadeurs") supabase.from("ambassadors").select("*, profiles(username)").order("created_at", { ascending: false }).limit(50).then(({ data }) => setAmbassadors(data ?? []));
  }, [tab, isAdmin]);

  const toggleProductAvailability = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("products").update({ is_available: !current }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_available: !current } : p));
  };

  const toggleArticlePublished = async (id: string, current: boolean) => {
    const supabase = createClient();
    const update = { published: !current, ...(!current ? { published_at: new Date().toISOString() } : {}) };
    await supabase.from("articles").update(update).eq("id", id);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...update } : a));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1C0E29] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#E0337E] border-t-transparent animate-spin" />
    </div>
  );

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: Euro },
    { id: "produits", label: "Produits", icon: ShoppingBag },
    { id: "vendeurs", label: "Vendeur·ses", icon: Store },
    { id: "commissions", label: "Commissions", icon: Euro },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "ambassadeurs", label: "Ambassadeur·rices", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#1C0E29] text-[#F3EADB]">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#E0337E] animate-pulse" />
          <h1 className="font-fraunces text-3xl">Back-office Admin</h1>
          <span className="font-mono text-[10px] text-[#F3EADB]/30 bg-[#F3EADB]/5 px-2 py-1 rounded">ACCÈS RESTREINT</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap mb-8 border-b border-[#F3EADB]/8 pb-4">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-hanken text-sm transition-all ${
                tab === t.id ? "bg-[#E0337E]/20 text-[#E0337E]" : "text-[#F3EADB]/50 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5"
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Vendeur·ses", value: stats.vendors, icon: Store, color: "#E0337E" },
              { label: "Produits", value: stats.products, icon: ShoppingBag, color: "#6D2DB5" },
              { label: "Commandes", value: stats.orders, icon: Users, color: "#1C9C95" },
              { label: "CA Total", value: `${stats.revenue.toFixed(0)}€`, icon: Euro, color: "#E0901E" },
            ].map(s => (
              <div key={s.label} className="p-6 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02]">
                <s.icon size={20} style={{ color: s.color }} className="mb-3" />
                <p className="font-fraunces text-3xl mb-1">{s.value}</p>
                <p className="font-mono text-[10px] text-[#F3EADB]/40 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Produits */}
        {tab === "produits" && (
          <div className="rounded-2xl border border-[#F3EADB]/8 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F3EADB]/5">
                <tr>
                  {["Produit", "Boutique", "Prix", "Stock", "Statut", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-[#F3EADB]/40 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EADB]/5">
                {products.map(p => (
                  <tr key={String(p.id)} className="hover:bg-[#F3EADB]/[0.02]">
                    <td className="px-4 py-3 font-hanken text-sm">{String(p.name)}</td>
                    <td className="px-4 py-3 font-hanken text-sm text-[#F3EADB]/50">{String((p.shops as Record<string, unknown>)?.name ?? "—")}</td>
                    <td className="px-4 py-3 font-mono text-sm">{Number(p.price).toFixed(2)}€</td>
                    <td className="px-4 py-3 font-mono text-sm">{String(p.stock_quantity ?? "∞")}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                        p.is_available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {p.is_available ? "En ligne" : "Hors ligne"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleProductAvailability(String(p.id), Boolean(p.is_available))}
                        className="p-1.5 rounded-lg border border-[#F3EADB]/10 hover:border-[#E0337E]/30 transition-all"
                      >
                        {p.is_available ? <XCircle size={14} className="text-red-400" /> : <CheckCircle size={14} className="text-green-400" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vendeurs */}
        {tab === "vendeurs" && (
          <div className="rounded-2xl border border-[#F3EADB]/8 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F3EADB]/5">
                <tr>
                  {["Boutique", "Propriétaire", "Abonnement", "Expire le", "Statut"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-[#F3EADB]/40 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EADB]/5">
                {vendors.map(v => (
                  <tr key={String(v.id)} className="hover:bg-[#F3EADB]/[0.02]">
                    <td className="px-4 py-3 font-hanken text-sm font-medium">{String(v.name)}</td>
                    <td className="px-4 py-3 font-hanken text-sm text-[#F3EADB]/50">{String((v.profiles as Record<string, unknown>)?.username ?? "—")}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                        v.subscription_status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {String(v.subscription_status ?? "inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#F3EADB]/40">
                      {v.subscription_current_period_end ? new Date(String(v.subscription_current_period_end)).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                        v.is_active ? "bg-green-500/20 text-green-400" : "bg-[#F3EADB]/10 text-[#F3EADB]/40"
                      }`}>
                        {v.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Commissions */}
        {tab === "commissions" && (
          <div className="rounded-2xl border border-[#F3EADB]/8 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F3EADB]/5">
                <tr>
                  {["Boutique", "Montant brut", "Commission", "Frais", "Statut", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-[#F3EADB]/40 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EADB]/5">
                {commissions.map(c => (
                  <tr key={String(c.id)} className="hover:bg-[#F3EADB]/[0.02]">
                    <td className="px-4 py-3 font-hanken text-sm">{String((c.shops as Record<string, unknown>)?.name ?? "—")}</td>
                    <td className="px-4 py-3 font-mono text-sm">{Number(c.gross_amount).toFixed(2)}€</td>
                    <td className="px-4 py-3 font-mono text-sm text-[#E0337E]">{Number(c.commission_amount).toFixed(2)}€</td>
                    <td className="px-4 py-3 font-mono text-sm text-[#F3EADB]/50">{Number(c.platform_fee).toFixed(2)}€</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                        c.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {c.status === "paid" ? "Payé" : "En attente"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#F3EADB]/40">
                      {new Date(String(c.created_at)).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Articles */}
        {tab === "articles" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => router.push("/admin/blog/nouveau")} className="text-sm">+ Nouvel article</Button>
            </div>
            <div className="rounded-2xl border border-[#F3EADB]/8 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F3EADB]/5">
                  <tr>
                    {["Titre", "Catégorie", "Statut", "Date", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-[#F3EADB]/40 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EADB]/5">
                  {articles.map(a => (
                    <tr key={String(a.id)} className="hover:bg-[#F3EADB]/[0.02]">
                      <td className="px-4 py-3 font-hanken text-sm">{String(a.title_fr)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#F3EADB]/50">{String(a.category)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                          a.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {a.published ? "Publié" : "Brouillon"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#F3EADB]/40">
                        {a.published_at ? new Date(String(a.published_at)).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => toggleArticlePublished(String(a.id), Boolean(a.published))}
                          className="p-1.5 rounded border border-[#F3EADB]/10 hover:border-[#E0337E]/30 transition-all">
                          {a.published ? <Clock size={13} className="text-yellow-400" /> : <CheckCircle size={13} className="text-green-400" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ambassadeurs */}
        {tab === "ambassadeurs" && (
          <div className="rounded-2xl border border-[#F3EADB]/8 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F3EADB]/5">
                <tr>
                  {["Utilisateur·rice", "Code", "Commission", "Gains", "Statut"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-[#F3EADB]/40 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EADB]/5">
                {ambassadors.map(a => (
                  <tr key={String(a.id)} className="hover:bg-[#F3EADB]/[0.02]">
                    <td className="px-4 py-3 font-hanken text-sm">{String((a.profiles as Record<string, unknown>)?.username ?? "—")}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#E0337E]">{String(a.referral_code)}</td>
                    <td className="px-4 py-3 font-mono text-sm">{(Number(a.commission_rate) * 100).toFixed(0)}%</td>
                    <td className="px-4 py-3 font-mono text-sm">{Number(a.total_earnings).toFixed(2)}€</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                        a.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>{String(a.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Button({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 bg-[#E0337E] text-white rounded-lg font-hanken text-sm hover:bg-[#E0337E]/80 transition-all ${className}`}>
      {children}
    </button>
  );
}
