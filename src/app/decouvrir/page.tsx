"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tag } from "@/components/ui/Tag";
import { useCart } from "@/store/cart";
import { Search, ShoppingBag, SlidersHorizontal, X, Package, Layers } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { ExploreFeed } from "@/components/mobile/ExploreFeed";

const ALL_CATEGORIES = ["Toutes", ...Object.keys(CATEGORIES)];

const SORT_OPTIONS = [
  { value: "recent",     label: "Plus récents" },
  { value: "price_asc",  label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

const TYPE_LABELS: Record<string, string> = {
  product: "Produit",
  service: "Service",
  event:   "Événement",
};

type Product = {
  id: string; name: string; title: string; description: string;
  price: number; category: string; subcategory: string | null;
  slug: string; shop_id: string; quantity: number | null;
  images: string[] | null; image_url: string | null;
  type: string | null;
  shops: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

function DecouvrirContent() {
  const searchParams = useSearchParams();

  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState(searchParams.get("q") ?? "");
  const [category,    setCategory]    = useState(searchParams.get("category") ?? "Toutes");
  const [subcategory, setSubcategory] = useState(searchParams.get("subcategory") ?? "");
  const [sort,        setSort]        = useState("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice,    setMaxPrice]    = useState(500);
  const { add } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── Fetch ─────────────────────────────────────────────────── */
  useEffect(() => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase
      .from("products")
      .select("id,name,title,description,price,category,subcategory,slug,shop_id,quantity,images,image_url,type,shops(name,slug)")
      .eq("is_active", true);

    if (category !== "Toutes") q = q.eq("category", category);
    if (subcategory)           q = q.eq("subcategory", subcategory);
    if (sort === "price_asc")        q = q.order("price", { ascending: true });
    else if (sort === "price_desc")  q = q.order("price", { ascending: false });
    else                             q = q.order("created_at", { ascending: false });

    q.then(({ data }) => { setProducts((data as Product[]) ?? []); setLoading(false); });
  }, [category, subcategory, sort]);

  /* Reset subcategory when category changes */
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSubcategory("");
  };

  /* ── Client-side filter ─────────────────────────────────────── */
  const filtered = products.filter((p) => {
    const n = (p.name || p.title || "").toLowerCase();
    const matchSearch = !search || n.includes(search.toLowerCase()) || (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchPrice  = p.price <= maxPrice;
    return matchSearch && matchPrice;
  });

  /* ── Helpers ────────────────────────────────────────────────── */
  const getShop = (p: Product) =>
    p.shops ? (Array.isArray(p.shops) ? p.shops[0] : p.shops) : null;

  const getImage = (p: Product) =>
    p.images?.length ? p.images[0] : (p.image_url ?? null);

  const isOutOfStock = (p: Product) =>
    p.type !== "service" && p.type !== "event" && p.quantity !== null && p.quantity <= 0;

  const handleAdd = (p: Product) => {
    if (isOutOfStock(p)) return;
    const shop = getShop(p);
    add({
      id: p.id,
      name: p.name || p.title,
      creator: shop?.name ?? "",
      price: p.price,
      quantity: 1,
      type: (p.type as "product" | "service" | "event") ?? "product",
      image: getImage(p) ?? undefined,
    });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const subcats = category !== "Toutes" ? (CATEGORIES[category] ?? []) : [];

  /* ── Render ─────────────────────────────────────────────────── */
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

          {/* Search + sort + filters */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F3EADB]/30" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une création, un atelier, un zine…"
                className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-full pl-10 pr-4 py-2.5 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/30 focus:outline-none focus:border-[#E0337E]/50 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 hover:text-[#F3EADB]/60">
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-full px-4 py-2.5 text-[#F3EADB]/70 font-hanken text-sm focus:outline-none focus:border-[#E0337E]/50 transition-colors"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-[#3D1F5C]">{o.label}</option>)}
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-hanken text-sm transition-all duration-200 ${
                filtersOpen ? "border-[#E0337E] text-[#E0337E] bg-[#E0337E]/10" : "border-[#F3EADB]/15 text-[#F3EADB]/60 hover:border-[#F3EADB]/30"
              }`}
            >
              <SlidersHorizontal size={14} /> Filtres
            </button>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="mb-4 p-5 rounded-2xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.02]">
              <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-3">
                Prix max : {maxPrice} €
              </label>
              <input
                type="range" min={5} max={500} step={5} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full max-w-xs accent-[#E0337E]"
              />
            </div>
          )}

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`shrink-0 px-4 py-1.5 rounded-full font-mono text-xs tracking-widest uppercase border transition-all duration-200 ${
                  category === c
                    ? "border-[#E0337E] bg-[#E0337E]/10 text-[#E0337E]"
                    : "border-[#F3EADB]/15 text-[#F3EADB]/50 hover:border-[#F3EADB]/30 hover:text-[#F3EADB]/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Subcategory pills */}
          {subcats.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              <button
                onClick={() => setSubcategory("")}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] tracking-widest uppercase border transition-all duration-200 ${
                  !subcategory
                    ? "border-[#6D2DB5]/60 bg-[#6D2DB5]/10 text-[#9B6DD5]"
                    : "border-[#F3EADB]/10 text-[#F3EADB]/35 hover:border-[#F3EADB]/25"
                }`}
              >
                <Layers size={10} /> Toutes
              </button>
              {subcats.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubcategory(s)}
                  className={`shrink-0 px-3 py-1 rounded-full font-mono text-[11px] tracking-widest uppercase border transition-all duration-200 ${
                    subcategory === s
                      ? "border-[#6D2DB5]/60 bg-[#6D2DB5]/10 text-[#9B6DD5]"
                      : "border-[#F3EADB]/10 text-[#F3EADB]/35 hover:border-[#F3EADB]/25"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          <p className="font-mono text-xs text-[#F3EADB]/30 mb-6">
            {loading ? "Chargement…" : `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`}
            {subcategory && <span className="ml-2 text-[#9B6DD5]">· {subcategory}</span>}
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
            <div className="flex flex-col items-center text-center py-24 max-w-md mx-auto">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(109,45,181,0.1)", border: "1px solid rgba(109,45,181,0.2)" }}>
                  <Search size={32} className="text-[#6D2DB5]/60" />
                </div>
                <span className="absolute -top-1 -right-1 text-xl">✦</span>
              </div>
              <h2 className="font-fraunces text-2xl text-[#F3EADB] mb-3">Aucun résultat</h2>
              <p className="font-hanken text-[#F3EADB]/50 mb-6 leading-relaxed">
                {search
                  ? `Aucune création ne correspond à "${search}". Essaie d'autres mots ou explore une catégorie.`
                  : "Aucune création dans cette catégorie pour le moment. Revenez bientôt ✦"}
              </p>
              <button
                onClick={() => { setSearch(""); setCategory(""); setSubcategory(""); }}
                className="font-mono text-xs tracking-widest uppercase text-[#E0337E]/70 hover:text-[#E0337E] transition-colors border border-[#E0337E]/20 hover:border-[#E0337E]/40 px-4 py-2 rounded-xl"
              >
                Effacer les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => {
                const shop    = getShop(p);
                const img     = getImage(p);
                const oos     = isOutOfStock(p);
                const ptype   = p.type ?? "product";
                return (
                  <div key={p.id} className="rounded-[18px] border border-[#F3EADB]/10 bg-[#F3EADB]/[0.02] overflow-hidden flex flex-col transition-all duration-200 hover:border-[#E0337E]/30">
                    <Link href={`/produit/${p.slug || p.id}`} className="block">
                      <div className="h-48 bg-[#2d1545] relative overflow-hidden group">
                        {img ? (
                          <img src={img} alt={p.name || p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <>
                            <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 40% 40%, #E0337E40, transparent 60%)" }} />
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={32} className="text-[#F3EADB]/10" />
                            </div>
                          </>
                        )}

                        {ptype !== "product" && (
                          <div className="absolute top-2 left-2">
                            <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#3D1F5C]/80 backdrop-blur-sm text-[#E0901E] border border-[#E0901E]/30">
                              {TYPE_LABELS[ptype]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 pb-2">
                        {p.category && <Tag variant="magenta" className="mb-2 text-[10px]">{p.category}</Tag>}
                        <h3 className="font-bricolage font-semibold text-[#F3EADB] text-sm leading-tight mb-1 line-clamp-2">{p.name || p.title}</h3>
                        {shop && (
                          <p className="font-hanken text-xs text-[#F3EADB]/40 truncate">par {shop.name}</p>
                        )}
                      </div>
                    </Link>
                    <div className="px-4 pb-4 mt-auto flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#F3EADB]">{Number(p.price).toFixed(2)} €</span>
                      <button
                        onClick={() => handleAdd(p)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-hanken font-medium transition-all duration-200 ${
                          added === p.id
                            ? "bg-[#1C9C95]/10 text-[#1C9C95]"
                            : "bg-[#E0337E]/10 text-[#E0337E] hover:bg-[#E0337E]/20"
                        }`}
                      >
                        <ShoppingBag size={11} />
                        {added === p.id ? "✓" : ptype === "service" ? "Réserver" : ptype === "event" ? "S'inscrire" : "Ajouter"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function DecouvrirPage() {
  return (
    <>
      {/* Mobile: app-like infinite feed */}
      <ExploreFeed />
      {/* Desktop: standard layout */}
      <div className="hidden md:block">
        <Suspense><DecouvrirContent /></Suspense>
      </div>
    </>
  );
}
