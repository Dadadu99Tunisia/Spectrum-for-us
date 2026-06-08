"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tag } from "@/components/ui/Tag";
import { useCart } from "@/store/cart";
import { Search, ShoppingBag, SlidersHorizontal, X, Layers, ArrowRight } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { ScatterText } from "@/components/ui/ScatterText";
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
      <main className="min-h-screen pt-24 pb-20 px-6 bg-[#FBFAF8] text-[#101014]">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <span className="font-mono text-[11px] tracking-wide text-[#FF2DA0] block mb-2">Marketplace</span>
            <h1 className="font-fraunces font-extrabold text-4xl md:text-5xl text-[#101014] leading-[1.15]"><ScatterText text="Découvrir" intensity={0.7} /></h1>
          </div>

          {/* Search + sort + filters */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#101014]/30" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une création, un atelier, un zine…"
                className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-full pl-10 pr-4 py-2.5 text-[#101014] font-hanken text-sm placeholder-[#101014]/30 focus:outline-none focus:border-[#FF2DA0]/50 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#101014]/30 hover:text-[#101014]/60">
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#101014]/5 border border-[#101014]/15 rounded-full px-4 py-2.5 text-[#101014]/70 font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/50 transition-colors"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-[#FBFAF8]">{o.label}</option>)}
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-hanken text-sm transition-all duration-200 ${
                filtersOpen ? "border-[#FF2DA0] text-[#FF2DA0] bg-[#FF2DA0]/10" : "border-[#101014]/15 text-[#101014]/60 hover:border-[#101014]/30"
              }`}
            >
              <SlidersHorizontal size={14} /> Filtres
            </button>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="mb-4 p-5 rounded-2xl border border-[#101014]/10 bg-[#101014]/[0.02]">
              <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-3">
                Prix max : {maxPrice} €
              </label>
              <input
                type="range" min={5} max={500} step={5} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full max-w-xs accent-[#FF2DA0]"
              />
            </div>
          )}

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`shrink-0 px-4 py-2 rounded-full font-hanken text-[13.5px] font-medium border transition-all duration-200 ${
                  category === c
                    ? "border-[#FF2DA0] bg-[#FF2DA0]/10 text-[#FF2DA0]"
                    : "border-[#101014]/15 text-[#101014]/50 hover:border-[#101014]/30 hover:text-[#101014]/70"
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
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full font-hanken text-[12px] font-medium border transition-all duration-200 ${
                  !subcategory
                    ? "border-[#7A2BF0]/60 bg-[#7A2BF0]/10 text-[#9B6DD5]"
                    : "border-[#101014]/10 text-[#101014]/35 hover:border-[#101014]/25"
                }`}
              >
                <Layers size={10} /> Toutes
              </button>
              {subcats.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubcategory(s)}
                  className={`shrink-0 px-3 py-1 rounded-full font-hanken text-[12px] font-medium border transition-all duration-200 ${
                    subcategory === s
                      ? "border-[#7A2BF0]/60 bg-[#7A2BF0]/10 text-[#9B6DD5]"
                      : "border-[#101014]/10 text-[#101014]/35 hover:border-[#101014]/25"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          <p className="font-mono text-xs text-[#101014]/30 mb-6">
            {loading ? "Chargement…" : `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`}
            {subcategory && <span className="ml-2 text-[#9B6DD5]">· {subcategory}</span>}
          </p>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-[18px] border border-[#101014]/8 bg-[#101014]/[0.02] overflow-hidden animate-pulse">
                  <div className="h-48 bg-[#101014]/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-[#101014]/8 rounded w-3/4" />
                    <div className="h-3 bg-[#101014]/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            (search || category || subcategory) ? (
              <div className="flex flex-col items-center text-center py-24 max-w-md mx-auto">
                <h2 className="font-fraunces text-2xl text-[#101014] mb-3">Aucun résultat</h2>
                <p className="font-hanken text-[#101014]/50 mb-6 leading-relaxed">
                  {search ? `Aucune création ne correspond à "${search}".` : "Aucune création dans cette catégorie pour le moment."}
                </p>
                <button
                  onClick={() => { setSearch(""); setCategory(""); setSubcategory(""); }}
                  className="font-mono text-xs tracking-wide text-[#FF2DA0]/70 hover:text-[#FF2DA0] transition-colors border border-[#FF2DA0]/20 hover:border-[#FF2DA0]/40 px-4 py-2 rounded-xl"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-20 max-w-lg mx-auto">
                <span className="text-4xl mb-5">🚀</span>
                <h2 className="font-fraunces text-3xl text-[#101014] mb-3 leading-tight">La marketplace ouvre ses portes</h2>
                <p className="font-hanken text-[15.5px] text-[#101014]/55 mb-8 leading-relaxed">
                  Spectrum se construit avec ses premier·es créateur·ices. Sois parmi les <strong className="text-[#101014]">120 fondateur·ices</strong> et prends une place avant tout le monde — abonnement offert et 0 % de commission.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a href="/programme-fondateur" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-[15px] text-white" style={{ background: "#101014" }}>
                    Devenir fondateur·ice <ArrowRight size={16} />
                  </a>
                  <a href="/vendeur/onboarding" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-[15px]" style={{ color: "#101014", boxShadow: "inset 0 0 0 1.5px #ECE6DB" }}>
                    Ouvrir ma boutique
                  </a>
                </div>
                <p className="font-hanken text-[13px] text-[#101014]/40 mt-6">Tu cherches plutôt à soutenir ? <a href="/annuaire" className="text-[#FF2DA0] font-semibold">Découvre les associations</a></p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => {
                const shop    = getShop(p);
                const img     = getImage(p);
                const oos     = isOutOfStock(p);
                const ptype   = p.type ?? "product";
                return (
                  <div key={p.id} className="overflow-hidden flex flex-col group">
                    <Link href={`/produit/${p.slug || p.id}`} className="block">
                      <div className="aspect-square rounded-2xl bg-[#F1ECE3] relative overflow-hidden">
                        {img ? (
                          <img src={img} alt={p.name || p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo-dark.png" alt="Spectrum For Us" className="w-full h-full object-contain opacity-25" />
                          </div>
                        )}

                        {ptype !== "product" && (
                          <div className="absolute top-2 left-2">
                            <span className="font-mono text-[9px] tracking-wide px-2 py-0.5 rounded-full bg-[#FBFAF8]/80 backdrop-blur-sm text-[#FFD400] border border-[#FFD400]/30">
                              {TYPE_LABELS[ptype]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 pb-1">
                        {p.category && <Tag variant="magenta" className="mb-2 text-[10px]">{p.category}</Tag>}
                        <h3 className="font-bricolage font-semibold text-[#101014] text-sm leading-tight mb-1 line-clamp-2">{p.name || p.title}</h3>
                        {shop && (
                          <p className="font-hanken text-xs text-[#101014]/40 truncate">par {shop.name}</p>
                        )}
                      </div>
                    </Link>
                    <div className="pb-4 mt-auto flex items-center justify-between">
                      <Price eur={p.price} className="font-mono text-sm font-bold text-[#101014]" />
                      <button
                        onClick={() => handleAdd(p)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-hanken font-medium transition-all duration-200 ${
                          added === p.id
                            ? "bg-[#2323C4]/10 text-[#2323C4]"
                            : "bg-[#FF2DA0]/10 text-[#FF2DA0] hover:bg-[#FF2DA0]/20"
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
