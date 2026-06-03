"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Euro, Package, BarChart3, Star, Plus, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";

type Shop = { id: string; name: string; slug: string; is_active: boolean };
type Product = { id: string; name: string; title: string; price: number; quantity: number; category: string; is_active: boolean; created_at: string };

const TABS = ["Vue d'ensemble", "Produits", "Commandes", "Finances"] as const;
type Tab = typeof TABS[number];

export default function VendeurPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Vue d'ensemble");
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) { router.push("/auth?redirect=/vendeur"); return; }
    if (!user) return;
    const supabase = createClient();
    supabase.from("shops").select("*").eq("owner_id", user.id).single()
      .then(({ data }) => {
        if (!data) { router.push("/vendeur/onboarding"); return; }
        setShop(data);
        return supabase.from("products").select("*").eq("shop_id", data.id).order("created_at", { ascending: false });
      })
      .then((res) => { if (res) setProducts(res.data ?? []); setLoadingData(false); });
  }, [user, loading, router]);

  if (loading || loadingData) return (
    <div className="min-h-screen bg-[#1C0E29] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#E0337E] border-t-transparent animate-spin" />
    </div>
  );

  if (!shop) return null;

  const activeProducts = products.filter((p) => p.is_active);
  const totalRevenue = 0; // viendra de orders

  return (
    <div className="min-h-screen bg-[#1C0E29]">
      <Header />
      <div className="pt-20 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 border-r border-[#F3EADB]/8 min-h-screen pt-8 px-4 gap-1 shrink-0">
          <div className="mb-6 px-2">
            <div className="w-12 h-12 rounded-full bg-[#E0337E]/10 border border-[#E0337E]/30 flex items-center justify-center mb-3">
              <span className="font-fraunces text-xl text-[#E0337E]">{shop.name[0]}</span>
            </div>
            <p className="font-bricolage font-bold text-[#F3EADB] text-sm leading-tight">{shop.name}</p>
            <Link href={`/boutique/${shop.slug}`} className="font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#E0337E] transition-colors tracking-widest">
              ( voir ma boutique )
            </Link>
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
            <Link href="/compte"
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-hanken text-[#F3EADB]/40 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-colors">
              <Settings size={14} /> Paramètres
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 py-8 overflow-auto">
          {/* Mobile tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-hanken border transition-all ${
                  tab === t ? "border-[#E0337E] text-[#E0337E] bg-[#E0337E]/10" : "border-[#F3EADB]/15 text-[#F3EADB]/50"
                }`}>{t}</button>
            ))}
          </div>

          {tab === "Vue d'ensemble" && (
            <>
              <div className="mb-6">
                <h1 className="font-fraunces text-3xl text-[#F3EADB]">
                  Bonjour <span className="text-[#E0337E]">✦</span>
                </h1>
                <p className="font-hanken text-[#F3EADB]/40 text-sm mt-1">{shop.name} · Tableau de bord</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Revenus", value: `${totalRevenue.toFixed(2)} €`, icon: Euro, color: "#E0337E" },
                  { label: "Produits actifs", value: String(activeProducts.length), icon: Package, color: "#1C9C95" },
                  { label: "Note moyenne", value: "—", icon: Star, color: "#E0901E" },
                  { label: "Vues boutique", value: "—", icon: BarChart3, color: "#6D2DB5" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <Card key={label} hoverable={false} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                    </div>
                    <div className="font-fraunces text-2xl text-[#F3EADB] mb-1">{value}</div>
                    <div className="font-hanken text-xs text-[#F3EADB]/40">{label}</div>
                  </Card>
                ))}
              </div>
              {products.length === 0 && (
                <Card hoverable={false} className="p-8 text-center">
                  <Package size={36} className="mx-auto mb-4 text-[#F3EADB]/20" />
                  <p className="font-hanken text-[#F3EADB]/40 mb-4">Tu n&apos;as pas encore de produits.</p>
                  <Button variant="primary" href="/vendeur/nouveau-produit">
                    <Plus size={14} /> Ajouter mon premier produit
                  </Button>
                </Card>
              )}
            </>
          )}

          {tab === "Produits" && (
            <>
              <div className="flex items-center justify-between mb-6">
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
                          {["Nom", "Prix", "Stock", "Catégorie", "Statut"].map((h) => (
                            <th key={h} className="text-left px-5 py-3 font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/30">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id} className="border-b border-[#F3EADB]/6 last:border-0 hover:bg-[#F3EADB]/[0.02] transition-colors">
                            <td className="px-5 py-4 font-hanken text-sm text-[#F3EADB]">{p.name || p.title}</td>
                            <td className="px-5 py-4 font-mono text-sm text-[#F3EADB]">{Number(p.price).toFixed(2)} €</td>
                            <td className="px-5 py-4 font-mono text-sm"><span className={p.quantity === 0 ? "text-red-400" : "text-[#F3EADB]/60"}>{p.quantity}</span></td>
                            <td className="px-5 py-4"><Tag variant="default">{p.category || "—"}</Tag></td>
                            <td className="px-5 py-4"><Tag variant={p.is_active ? "teal" : "default"}>{p.is_active ? "actif" : "inactif"}</Tag></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          )}

          {tab === "Commandes" && (
            <div>
              <h1 className="font-fraunces text-3xl text-[#F3EADB] mb-6">Commandes</h1>
              <Card hoverable={false} className="p-8 text-center">
                <Package size={36} className="mx-auto mb-4 text-[#F3EADB]/20" />
                <p className="font-hanken text-[#F3EADB]/40">Tes commandes apparaîtront ici.</p>
              </Card>
            </div>
          )}

          {tab === "Finances" && (
            <div>
              <h1 className="font-fraunces text-3xl text-[#F3EADB] mb-6">Finances</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Solde disponible", value: "0,00 €", color: "#E0337E" },
                  { label: "En attente", value: "0,00 €", color: "#E0901E" },
                  { label: "Total reversé", value: "0,00 €", color: "#1C9C95" },
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
