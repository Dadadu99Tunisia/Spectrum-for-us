"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { FillImage } from "@/components/ui/FillImage";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, X, Search, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";

const T = { bg: "#FBFAF8", ink: "#101014", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF2DA0" };
const CAT: Record<string, { tint: string; ink: string; dot: string }> = {
  Mode: { tint: "#FBE3EC", ink: "#C23B6B", dot: "#FF6FA3" },
  Bijoux: { tint: "#FBEAD3", ink: "#B5742A", dot: "#F2A03D" },
  Zines: { tint: "#D9EEF3", ink: "#1E7E91", dot: "#1FB6C9" },
  Corps: { tint: "#DCF0E5", ink: "#1B8155", dot: "#16A06A" },
  Art: { tint: "#EAE0FB", ink: "#6A44D6", dot: "#8B5CF6" },
  Services: { tint: "#E3E6FB", ink: "#4A56C6", dot: "#6B5CFF" },
};
const tintFor = (c: string) => CAT[Object.keys(CAT).find(k => (c || "").toLowerCase().includes(k.toLowerCase())) ?? "Mode"] ?? CAT.Mode;

const CHIPS = ["Tout", "Mode", "Art & Culture", "Bijoux", "Zines", "Corps & Soin", "Services", "Expériences"];
const PAGE_SIZE = 12;

interface Product {
  id: string; name: string; title: string; price: number;
  images: string[] | null; image_url: string | null; slug: string; category: string;
  type: string | null; shops: { name: string; slug: string } | null;
}

function Ph({ category, h }: { category: string; h: number }) {
  const c = tintFor(category);
  return (
    <div className="relative w-full overflow-hidden" style={{ height: h, background: c.tint }}>
      <div className="absolute inset-0 opacity-50" style={{ background: `repeating-linear-gradient(135deg,transparent,transparent 11px,${c.ink}10 11px,${c.ink}10 12px)` }} />
      <span className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full" style={{ background: c.dot }} />
      <div className="absolute inset-0 flex items-center justify-center font-bricolage font-bold text-3xl" style={{ color: c.ink, opacity: 0.5 }}>{(category || "✦")[0]?.toUpperCase()}</div>
    </div>
  );
}

function Card({ p }: { p: Product }) {
  const img = p.images?.[0] ?? p.image_url;
  const shop = !Array.isArray(p.shops) ? p.shops?.name : null;
  const { add } = useCart();
  const c = tintFor(p.category);
  const tall = (p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1)) % 2 === 0;
  const [liked, setLiked] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]").includes(p.id); } catch { return false; }
  });
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const favs: string[] = JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]");
    const next = liked ? favs.filter(f => f !== p.id) : [...favs, p.id];
    localStorage.setItem("spectrum_favorites", JSON.stringify(next));
    setLiked(!liked);
  };
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    add({ id: p.id, name: p.name || p.title, price: p.price, image: img ?? undefined, creator: shop ?? "", quantity: 1, type: (p.type as "product" | "service" | "event") ?? "product" });
  };
  return (
    <Link href={`/produit/${p.slug}`} className="block active:scale-[0.98] transition-transform">
      <div className="relative rounded-2xl overflow-hidden" style={{ height: tall ? 210 : 158 }}>
        {img ? <FillImage src={img} alt={p.name || p.title} sizes="50vw" className="object-cover" /> : <Ph category={p.category} h={tall ? 210 : 158} />}
        <button onClick={toggleLike} aria-label="Favori" className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,.85)", backdropFilter: "blur(6px)" }}>
          <Heart size={17} style={{ color: liked ? T.mag : T.ink }} fill={liked ? T.mag : "none"} />
        </button>
        {p.type && p.type !== "product" && (
          <span className="absolute left-2 bottom-2 font-mono text-[10px] uppercase px-2 py-0.5 rounded-full text-white" style={{ background: T.ink }}>{p.type === "service" ? "Service" : "Événement"}</span>
        )}
      </div>
      <div className="px-0.5 pt-2">
        <p className="font-bricolage font-semibold text-[15px] leading-tight" style={{ color: T.ink }}>{p.name || p.title}</p>
        {shop && (
          <span className="flex items-center gap-1.5 mt-0.5">
            <span className="w-[17px] h-[17px] rounded-full flex items-center justify-center font-bricolage font-bold text-[8px]" style={{ background: c.tint, color: c.ink }}>{shop[0]?.toUpperCase()}</span>
            <span className="text-[12.5px]" style={{ color: T.soft }}>{shop}</span>
          </span>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="font-mono font-bold text-[15px]" style={{ color: T.ink }}>{p.price.toFixed(2)}&nbsp;€</span>
          <button onClick={handleAdd} aria-label="Ajouter au panier" className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90" style={{ background: T.ink }}><ShoppingBag size={15} color="#fff" /></button>
        </div>
      </div>
    </Link>
  );
}

export function ExploreFeed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("Tout");
  const loaderRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);

  const fetch_ = useCallback(async (reset: boolean) => {
    const p = reset ? 0 : pageRef.current;
    if (reset) setLoading(true); else setLoadingMore(true);
    const supabase = createClient();
    let q = supabase
      .from("products")
      .select("id,name,title,price,images,image_url,slug,category,type,shops(name,slug)")
      .eq("is_active", true).order("created_at", { ascending: false })
      .range(p * PAGE_SIZE, (p + 1) * PAGE_SIZE - 1);
    if (chip !== "Tout") q = q.ilike("category", `%${chip}%`);
    if (search.trim()) q = q.or(`name.ilike.%${search}%,title.ilike.%${search}%`);
    const { data } = await q;
    const rows = (data ?? []) as unknown as Product[];
    if (reset) { setProducts(rows); pageRef.current = 1; }
    else { setProducts(prev => [...prev, ...rows]); pageRef.current = p + 1; }
    setHasMore(rows.length === PAGE_SIZE);
    setLoading(false); setLoadingMore(false);
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
    <div className="md:hidden min-h-screen" style={{ background: T.bg, color: T.ink, fontFamily: "var(--font-hanken),sans-serif" }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-40 px-4 pb-3" style={{ background: T.bg, paddingTop: "max(14px,env(safe-area-inset-top))" }}>
        <h1 className="font-bricolage font-extrabold text-[26px] mb-3">Explorer</h1>
        <div className="relative mb-3 flex items-center gap-2.5 h-[46px] rounded-[14px] px-3.5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
          <Search size={18} style={{ color: T.faint }} />
          <input type="search" placeholder="Rechercher une création…" value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-0 bg-transparent outline-none text-[14px]" style={{ color: T.ink }} />
          {search && <button onClick={() => setSearch("")}><X size={15} style={{ color: T.faint }} /></button>}
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
          {CHIPS.map(c => (
            <button key={c} onClick={() => setChip(c)}
              className="shrink-0 whitespace-nowrap font-semibold text-[13.5px] px-3.5 py-2 rounded-full active:scale-95"
              style={chip === c ? { background: T.ink, color: "#fff" } : { background: "#fff", color: T.ink, boxShadow: `inset 0 0 0 1px ${T.line}` }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 py-4">
        {loading ? (
          <div style={{ columnCount: 2, columnGap: 12 }}>
            {[...Array(8)].map((_, i) => <div key={i} className="mb-[18px] rounded-2xl animate-pulse" style={{ height: i % 2 ? 210 : 158, background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-bricolage font-bold text-[20px] mb-2">{search || chip !== "Tout" ? "Aucune création trouvée" : "Le spectre se remplit"}</p>
            <p className="text-[13px] mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: T.soft }}>
              {search || chip !== "Tout" ? "Essaie une autre catégorie ou efface ta recherche." : "Sois parmi les premier·es à rejoindre la marketplace queer."}
            </p>
            {(!search && chip === "Tout") && (
              <Link href="/vendeur/onboarding" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[15px] text-white" style={{ background: T.mag }}>
                Ouvrir ma boutique <ArrowRight size={15} />
              </Link>
            )}
          </div>
        ) : (
          <>
            <div style={{ columnCount: 2, columnGap: 12 }}>
              {products.map(p => <div key={p.id} className="mb-[18px]" style={{ breakInside: "avoid" }}><Card p={p} /></div>)}
            </div>
            {loadingMore && <div style={{ columnCount: 2, columnGap: 12 }} className="mt-1"><div className="mb-[18px] rounded-2xl animate-pulse" style={{ height: 158, background: "#fff" }} /><div className="mb-[18px] rounded-2xl animate-pulse" style={{ height: 210, background: "#fff" }} /></div>}
            <div ref={loaderRef} className="h-10" />
            {!hasMore && products.length > 0 && <p className="text-center font-mono text-[10px] py-4 tracking-widest" style={{ color: T.faint }}>✦ Fin du spectre ✦</p>}
          </>
        )}
      </div>
    </div>
  );
}
