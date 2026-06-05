"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, X } from "lucide-react";
import { useCart } from "@/store/cart";

const CHIPS = ["Tout", "Mode", "Art & Culture", "Bijoux", "Zines", "Corps & Soin", "Services", "Expériences"];

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

const PAGE_SIZE = 12;

function Skeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: "rgba(243,234,219,0.05)" }}>
      <div className="aspect-square" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 rounded w-3/4" style={{ background: "rgba(243,234,219,0.08)" }} />
        <div className="h-3 rounded w-1/3" style={{ background: "rgba(243,234,219,0.06)" }} />
      </div>
    </div>
  );
}

function Card({ p }: { p: Product }) {
  const img     = p.images?.[0] ?? p.image_url;
  const shop    = !Array.isArray(p.shops) ? p.shops?.name : null;
  const [liked, setLiked] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]").includes(p.id); }
    catch { return false; }
  });
  const { add } = useCart();

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const favs: string[] = JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]");
    const next = liked ? favs.filter(f => f !== p.id) : [...favs, p.id];
    localStorage.setItem("spectrum_favorites", JSON.stringify(next));
    setLiked(!liked);
  };

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(243,234,219,0.04)", border: "1px solid rgba(243,234,219,0.07)" }}>
      <Link href={`/produit/${p.slug}`} className="block">
        <div className="aspect-square relative overflow-hidden"
          style={{ background: "rgba(243,234,219,0.04)" }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={p.name || p.title}
              className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-10">✦</span>
            </div>
          )}
          {/* Like */}
          <button onClick={toggleLike}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: liked ? "rgba(224,51,126,.90)" : "rgba(32,10,55,.70)",
              border: `1px solid ${liked ? "transparent" : "rgba(243,234,219,.15)"}`,
            }}>
            <span className="text-[14px]">{liked ? "♥" : "♡"}</span>
          </button>
          {/* Type badge */}
          {p.type && p.type !== "product" && (
            <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: "rgba(32,10,55,.80)", color: "rgba(243,234,219,.50)", border: "1px solid rgba(243,234,219,.10)" }}>
              {p.type === "service" ? "Service" : "Événement"}
            </span>
          )}
        </div>
      </Link>
      <div className="p-3">
        <p className="font-hanken text-[11px] text-[#F3EADB]/75 line-clamp-2 leading-tight">{p.name || p.title}</p>
        {shop && <p className="font-mono text-[8px] text-[#F3EADB]/28 mt-0.5">{shop}</p>}
        <div className="flex items-center justify-between mt-2">
          <p className="font-fraunces text-[14px]" style={{ color: "#F2B79E" }}>{p.price.toFixed(2)} €</p>
          <button
            onClick={() => add({ id: p.id, name: p.name || p.title, price: p.price, image: img ?? undefined, creator: shop ?? "", quantity: 1, type: (p.type as "product" | "service" | "event") ?? "product" })}
            className="font-mono text-[8px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg active:scale-90 transition-transform"
            style={{ background: "rgba(224,51,126,.12)", color: "#E0337E", border: "1px solid rgba(224,51,126,.20)" }}>
            + Panier
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExploreFeed() {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [chip,        setChip]        = useState("Tout");
  const [page,        setPage]        = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const pageRef   = useRef(0);

  const fetch_ = useCallback(async (reset: boolean) => {
    const p = reset ? 0 : pageRef.current;
    if (reset) setLoading(true); else setLoadingMore(true);

    const supabase = createClient();
    let q = supabase
      .from("products")
      .select("id,name,title,price,images,image_url,slug,category,type,shops(name,slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(p * PAGE_SIZE, (p + 1) * PAGE_SIZE - 1);

    if (chip !== "Tout") q = q.ilike("category", `%${chip}%`);
    if (search.trim())   q = q.or(`name.ilike.%${search}%,title.ilike.%${search}%`);

    const { data } = await q;
    const rows = (data ?? []) as unknown as Product[];

    if (reset) {
      setProducts(rows);
      pageRef.current = 1;
    } else {
      setProducts(prev => [...prev, ...rows]);
      pageRef.current = p + 1;
    }
    setHasMore(rows.length === PAGE_SIZE);
    setPage(pageRef.current);
    setLoading(false);
    setLoadingMore(false);
  }, [chip, search]);

  useEffect(() => { fetch_(true); }, [chip, search, fetch_]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasMore && !loadingMore && !loading) fetch_(false); },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading, fetch_]);

  return (
    <div className="md:hidden min-h-screen text-[#F3EADB]" style={{ background: "#3D1F5C" }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(110,45,181,0.18) 0%, transparent 65%)" }} />

      {/* Sticky header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3 relative"
        style={{
          background: "rgba(45,16,78,0.97)",
          backdropFilter: "blur(20px)",
        }}>
        {/* Top prism line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, #E0533A, #CF3F7C, #6D2DB5, #1C9C95)" }} />

        <h1 className="font-fraunces text-[20px] text-[#F3EADB] mb-3">Explorer ✦</h1>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="search"
            placeholder="Rechercher une création…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-4 pr-8 py-2.5 rounded-xl font-hanken text-[13px] text-[#F3EADB] placeholder-[#F3EADB]/25 outline-none"
            style={{ background: "rgba(243,234,219,0.06)", border: "1px solid rgba(243,234,219,0.09)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={12} className="text-[#F3EADB]/35" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 pb-0.5">
          {CHIPS.map(c => (
            <button key={c} onClick={() => setChip(c)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all active:scale-90"
              style={{
                background: chip === c ? "#E0337E" : "rgba(243,234,219,0.07)",
                color: chip === c ? "white" : "rgba(243,234,219,0.40)",
                border: `1px solid ${chip === c ? "transparent" : "rgba(243,234,219,0.09)"}`,
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10 px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-5">✦</p>
            <p className="font-fraunces text-[22px] text-[#F3EADB] mb-2">
              {search || chip !== "Tout" ? "Aucune création trouvée" : "Le spectre se remplit"}
            </p>
            <p className="font-hanken text-[13px] text-[#F3EADB]/40 mb-8 leading-relaxed max-w-xs mx-auto">
              {search || chip !== "Tout"
                ? "Essaie une autre catégorie ou efface ta recherche."
                : "Sois parmi les premiers créateur·ices à rejoindre la marketplace queer."}
            </p>
            {(!search && chip === "Tout") && (
              <Link href="/vendeur/onboarding"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-fraunces text-[15px] text-white"
                style={{ background: "linear-gradient(135deg,#6D2DB5,#E0337E)" }}>
                Ouvrir ma boutique <ArrowRight size={15} />
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {products.map(p => <Card key={p.id} p={p} />)}
            </div>
            {loadingMore && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Skeleton /><Skeleton />
              </div>
            )}
            <div ref={loaderRef} className="h-10" />
            {!hasMore && products.length > 0 && (
              <p className="text-center font-mono text-[8px] text-[#F3EADB]/18 py-4 tracking-widest">
                ✦ Fin du spectre ✦
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
