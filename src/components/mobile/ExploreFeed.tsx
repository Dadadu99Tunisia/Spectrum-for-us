"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Search, X, Store, Heart, SlidersHorizontal } from "lucide-react";
import { useCart } from "@/store/cart";

const CATEGORIES = ["Tout", "Mode", "Art", "Bijoux", "Zines", "Corps & Soin", "Services", "Expériences"];

interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  images: string[] | null;
  image_url: string | null;
  slug: string;
  category: string;
  type: string | null;
  shops: { name: string; slug: string } | null;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 animate-pulse">
      <div className="aspect-square bg-white/8" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/8 rounded w-3/4" />
        <div className="h-3 bg-white/8 rounded w-1/2" />
        <div className="h-4 bg-white/8 rounded w-1/3" />
      </div>
    </div>
  );
}

function FeedCard({ p }: { p: Product }) {
  const img = p.images?.[0] ?? p.image_url;
  const shopName = p.shops && !Array.isArray(p.shops) ? p.shops.name : null;
  const [liked, setLiked] = useState(false);
  const { add } = useCart();

  return (
    <div className="rounded-2xl overflow-hidden border border-white/8 bg-[#2d1050]/60">
      <Link href={`/produit/${p.slug}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-white/5">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={p.name || p.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store size={32} className="text-white/10" />
            </div>
          )}
          {/* Type badge */}
          {p.type && p.type !== "product" && (
            <span className="absolute top-2 left-2 font-mono text-[8px] uppercase tracking-wider px-2 py-1 rounded-full"
              style={{ background: "rgba(28,12,48,.8)", color: "rgba(243,234,219,.6)", border: "1px solid rgba(243,234,219,.12)" }}>
              {p.type === "service" ? "Service" : "Événement"}
            </span>
          )}
          {/* Like button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: liked ? "rgba(224,51,126,.9)" : "rgba(28,12,48,.7)", border: "1px solid rgba(224,51,126,.3)" }}
          >
            <Heart size={14} fill={liked ? "white" : "none"} className="text-white" />
          </button>
        </div>
      </Link>
      <div className="p-3">
        <p className="font-hanken text-[12px] text-[#F3EADB]/80 leading-tight line-clamp-2">{p.name || p.title}</p>
        {shopName && <p className="font-mono text-[9px] text-[#F3EADB]/30 mt-0.5">{shopName}</p>}
        <div className="flex items-center justify-between mt-2">
          <p className="font-fraunces text-[15px] text-[#E0337E]">{p.price.toFixed(2)} €</p>
          <button
            onClick={() => add({ id: p.id, name: p.name || p.title, price: p.price, image: img ?? undefined, creator: "", quantity: 1, type: (p.type as "product" | "service" | "event") ?? "product" })}
            className="font-mono text-[9px] px-2.5 py-1.5 rounded-xl active:scale-90 transition-transform"
            style={{ background: "rgba(224,51,126,.15)", color: "#E0337E", border: "1px solid rgba(224,51,126,.25)" }}
          >
            + Panier
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 12;

export function ExploreFeed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tout");
  const [page, setPage] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(async (reset = false) => {
    const currentPage = reset ? 0 : page;
    if (reset) setLoading(true); else setLoadingMore(true);

    const supabase = createClient();
    let q = supabase
      .from("products")
      .select("id,name,title,price,images,image_url,slug,category,type,shops(name,slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

    if (category !== "Tout") q = q.ilike("category", `%${category}%`);
    if (search.trim()) q = q.or(`name.ilike.%${search}%,title.ilike.%${search}%`);

    const { data } = await q;
    const rows = (data ?? []) as unknown as Product[];

    if (reset) {
      setProducts(rows);
      setPage(1);
    } else {
      setProducts(prev => [...prev, ...rows]);
      setPage(p => p + 1);
    }
    setHasMore(rows.length === PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  }, [category, search, page]);

  // Reset on filter change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchProducts(false);
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading, fetchProducts]);

  return (
    <div className="md:hidden min-h-screen bg-[#3D1F5C] text-[#F3EADB]">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3"
        style={{
          background: "rgba(45,16,78,0.97)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(243,234,219,0.07)",
        }}>
        <p className="font-fraunces text-[17px] mb-3">Explorer</p>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F3EADB]/25" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-2xl font-hanken text-[13px] text-[#F3EADB] placeholder-[#F3EADB]/25 outline-none"
            style={{ background: "rgba(243,234,219,0.07)", border: "1px solid rgba(243,234,219,0.10)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={13} className="text-[#F3EADB]/35" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-[10px] transition-all active:scale-90"
              style={{
                background: category === cat ? "#E0337E" : "rgba(243,234,219,0.07)",
                color: category === cat ? "white" : "rgba(243,234,219,0.45)",
                border: `1px solid ${category === cat ? "transparent" : "rgba(243,234,219,0.10)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-fraunces text-[17px] text-[#F3EADB]/40 mb-2">Aucun résultat</p>
            <p className="font-hanken text-[12px] text-[#F3EADB]/25">Essaie une autre catégorie</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {products.map(p => <FeedCard key={p.id} p={p} />)}
            </div>
            {loadingMore && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}
            <div ref={loaderRef} className="h-8" />
            {!hasMore && products.length > 0 && (
              <p className="text-center font-mono text-[9px] text-[#F3EADB]/20 py-4">
                ✦ Fin du catalogue ✦
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
