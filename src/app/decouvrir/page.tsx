"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { useCart } from "@/store/cart";
import { Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Toutes", "Mode non-genrée", "Art & Culture", "Bijoux", "Zines & Édition", "Corps & Soin", "Intimité", "Maison"];
const SORT_OPTIONS = [
  { value: "recent", label: "Plus récents" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

type Product = {
  id: string; name: string; title: string; description: string;
  price: number; category: string; slug: string; shop_id: string;
};

function DecouvrirContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("Toutes");
  const [sort, setSort] = useState("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const { add } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let q = supabase.from("products").select("*").eq("is_active", true).eq("listing_status", "approved");
    if (category !== "Toutes") q = q.eq("category", category);
    if (sort === "price_asc") q = q.order("price", { ascending: true });
    else if (sort === "price_desc") q = q.order("price", { ascending: false });
    else q = q.order("created_at", { ascending: false });
    q.then(({ data }) => { setProducts(data ?? []); setLoading(false); });
  }, [category, sort]);

  const filtered = products.filter((p) => {
    const n = (p.name || p.title || "").toLowerCase();
    const matchSearch = !search || n.includes(search.toLowerCase()) || (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchPrice = p.price <= maxPrice;
    return matchSearch && matchPrice;
  });

  const handleAdd = (p: Product) => {
    add({ id: p.id, name: p.name || p.title, creator: "", price: p.price, quantity: 1, type: "product" });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-2">Marketplace</span>
            <h1 className="font-fraunces text-4xl md:text-5xl text-[#F3EADB]">Découvrir</h1>
          </div>

          {/* Search + filters bar */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F3EADB]/30" />
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une création, un atelier, un zine…"
                className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-full pl-10 pr-4 py-2.5 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/30 focus:outline-none focus:border-[#E0337E]/50 transition-colors" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 hover:text-[#F3EADB]/60">
                  <X size={14} />
                </button>
              )}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-full px-4 py-2.5 text-[#F3EADB]/70 font-hanken text-sm focus:outline-none focus:border-[#E0337E]/50 transition-colors">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-[#1C0E29]">{o.label}</option>)}
            </select>
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-hanken text-sm transition-all duration-200 ${filtersOpen ? "border-[#E0337E] text-[#E0337E] bg-[#E0337E]/10" : "border-[#F3EADB]/15 text-[#F3EADB]/60 hover:border-[#F3EADB]/30"}`}>
              <SlidersHorizontal size={14} /> Filtres
            </button>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="mb-6 p-5 rounded-2xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.02]">
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-3">Prix max : {maxPrice} €</label>
                <input type="range" min={5} max={500} step={5} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full max-w-xs accent-[#E0337E]" />
              </div>
            </div>
          )}

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`shrink-0 px-4 py-1.5 rounded-full font-mono text-xs tracking-widest uppercase border transition-all duration-200 ${
                  category === c ? "border-[#E0337E] bg-[#E0337E]/10 text-[#E0337E]" : "border-[#F3EADB]/15 text-[#F3EADB]/50 hover:border-[#F3EADB]/30 hover:text-[#F3EADB]/70"
                }`}>{c}</button>
            ))}
          </div>

          {/* Results count */}
          <p className="font-mono text-xs text-[#F3EADB]/30 mb-6">
            {loading ? "Chargement…" : `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`}
          </p>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-[18px] border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02] overflow-hidden animate-pulse">
                  <div className="h-48 bg-[#F3EADB]/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-[#F3EADB]/8 rounded w-3/4" />
                    <div className="h-3 bg-[#F3EADB]/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-fraunces text-2xl text-[#F3EADB]/30 mb-3">Aucun résultat</p>
              <p className="font-hanken text-sm text-[#F3EADB]/25">Essaie d&apos;autres mots-clés ou une catégorie différente.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <Card key={p.id} className="overflow-hidden group">
                  <Link href={`/produit/${p.slug || p.id}`} className="block">
                    <div className="h-48 bg-[#2d1545] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 40% 40%, #E0337E40, transparent 60%)" }} />
                      <span className="font-fraunces text-5xl text-[#F3EADB]/10 group-hover:text-[#F3EADB]/20 transition-colors">(u)</span>
                    </div>
                    <div className="p-4">
                      {p.category && <Tag variant="magenta" className="mb-2 text-[10px]">{p.category}</Tag>}
                      <h3 className="font-bricolage font-semibold text-[#F3EADB] text-sm leading-tight mb-2 line-clamp-2">{p.name || p.title}</h3>
                    </div>
                  </Link>
                  <div className="px-4 pb-4 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#F3EADB]">{Number(p.price).toFixed(2)} €</span>
                    <button onClick={() => handleAdd(p)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-hanken font-medium transition-all duration-200 ${
                        added === p.id ? "bg-[#1C9C95]/10 text-[#1C9C95]" : "bg-[#E0337E]/10 text-[#E0337E] hover:bg-[#E0337E]/20"
                      }`}>
                      <ShoppingBag size={11} />
                      {added === p.id ? "✓" : "Ajouter"}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function DecouvrirPage() {
  return <Suspense><DecouvrirContent /></Suspense>;
}
