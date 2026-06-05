"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/store/cart";
import { Search, ShoppingBag, ArrowRight, Heart } from "lucide-react";

const CATS = ["Tout", "Mode", "Art", "Bijoux", "Zines", "Corps & Soin", "Services"];

interface Product {
  id: string; name: string; title: string; price: number;
  images: string[] | null; image_url: string | null; slug: string; category: string;
  shops: { name: string; slug: string } | null;
}
interface Shop {
  id: string; name: string; slug: string; logo_url: string | null; tagline: string | null;
}
interface FounderCounts {
  founder_remaining: number; early_remaining: number;
  founder_slots: number; early_adopter_slots: number;
  founder_count: number; early_adopter_count: number;
}

function ProductCard({ p }: { p: Product }) {
  const img      = p.images?.[0] ?? p.image_url;
  const shopName = !Array.isArray(p.shops) ? p.shops?.name : null;
  const { add }  = useCart();
  const [liked,  setLiked]  = useState(() => {
    if (typeof window === "undefined") return false;
    try { return JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]").includes(p.id); }
    catch { return false; }
  });
  const [added,  setAdded]  = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    add({ id: p.id, name: p.name || p.title, price: p.price, creator: shopName ?? "", quantity: 1, type: "product", image: img ?? undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const favs: string[] = JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]");
    const next = liked ? favs.filter(f => f !== p.id) : [...favs, p.id];
    localStorage.setItem("spectrum_favorites", JSON.stringify(next));
    setLiked(!liked);
  };

  return (
    <Link href={`/produit/${p.slug}`}
      className="rounded-2xl overflow-hidden active:scale-[0.97] transition-transform block"
      style={{ background: "rgba(243,234,219,0.04)", border: "1px solid rgba(243,234,219,0.08)" }}>
      <div className="aspect-square relative overflow-hidden"
        style={{ background: "rgba(243,234,219,0.04)" }}>
        {img
          ? <img src={img} alt={p.name || p.title} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl opacity-10">✦</span></div>
        }
        {/* Like */}
        <button onClick={toggleLike}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center active:scale-90"
          style={{ background: liked ? "rgba(224,51,126,.9)" : "rgba(20,6,40,.65)", border: "1px solid rgba(243,234,219,.1)" }}>
          <span className="text-[12px] leading-none">{liked ? "♥" : "♡"}</span>
        </button>
      </div>
      <div className="p-2.5">
        <p className="font-hanken text-[11px] text-[#F3EADB]/80 line-clamp-2 leading-tight">{p.name || p.title}</p>
        {shopName && <p className="font-mono text-[8px] text-[#F3EADB]/28 mt-0.5">{shopName}</p>}
        <div className="flex items-center justify-between mt-2">
          <p className="font-fraunces text-[14px]" style={{ color: "#F2B79E" }}>{Number(p.price).toFixed(2)} €</p>
          <button onClick={handleAdd}
            className="px-2 py-1 rounded-lg font-mono text-[8px] uppercase tracking-wider active:scale-90 transition-all"
            style={{
              background: added ? "rgba(28,156,149,.2)" : "rgba(224,51,126,.12)",
              color: added ? "#1C9C95" : "#E0337E",
              border: `1px solid ${added ? "rgba(28,156,149,.3)" : "rgba(224,51,126,.2)"}`,
            }}>
            {added ? "✓" : "+ Panier"}
          </button>
        </div>
      </div>
    </Link>
  );
}

function ShopCard({ s }: { s: Shop }) {
  return (
    <Link href={`/boutique/${s.slug}`}
      className="flex-shrink-0 w-[130px] rounded-2xl overflow-hidden active:scale-95 transition-transform"
      style={{ background: "rgba(243,234,219,0.04)", border: "1px solid rgba(243,234,219,0.08)" }}>
      <div className="h-[80px] relative overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,rgba(109,45,181,.12),rgba(224,51,126,.08))" }}>
        {s.logo_url
          ? <img src={s.logo_url} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
          : <span className="font-fraunces text-2xl text-[#F3EADB]/20">{s.name[0]}</span>
        }
      </div>
      <div className="p-2.5">
        <p className="font-hanken text-[11px] text-[#F3EADB]/80 font-medium truncate">{s.name}</p>
        {s.tagline && <p className="font-mono text-[8px] text-[#F3EADB]/28 mt-0.5 line-clamp-1">{s.tagline}</p>}
      </div>
    </Link>
  );
}

export function MobileHomeView() {
  const { user } = useAuth();
  const { items } = useCart();
  const router = useRouter();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const [products,  setProducts]  = useState<Product[]>([]);
  const [shops,     setShops]     = useState<Shop[]>([]);
  const [counts,    setCounts]    = useState<FounderCounts | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [cat,       setCat]       = useState("Tout");
  const [search,    setSearch]    = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // Products
    let q = supabase
      .from("products")
      .select("id,name,title,price,images,image_url,slug,category,shops(name,slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(12);
    if (cat !== "Tout") q = q.ilike("category", `%${cat}%`);
    if (search.trim()) q = q.or(`name.ilike.%${search}%,title.ilike.%${search}%`);

    // Shops
    const qShops = supabase
      .from("shops")
      .select("id,name,slug,logo_url,tagline")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6);

    Promise.all([q, qShops]).then(([{ data: prods }, { data: shops }]) => {
      setProducts((prods ?? []) as unknown as Product[]);
      setShops((shops ?? []) as unknown as Shop[]);
      setLoading(false);
    });

    // Founder counts (background, non-blocking)
    fetch("/api/founder-program").then(r => r.json()).then(setCounts).catch(() => null);
  }, [cat, search]);

  const remaining = (counts?.founder_remaining ?? 20) + (counts?.early_remaining ?? 100);

  return (
    <div className="md:hidden min-h-screen text-[#F3EADB]" style={{ background: "#3D1F5C" }}>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(110,45,181,0.15) 0%, transparent 60%)" }} />

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-40 px-4 pt-[max(14px,env(safe-area-inset-top))] pb-3 relative"
        style={{ background: "rgba(28,8,50,0.97)", backdropFilter: "blur(20px)" }}>
        {/* Prism bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(224,51,126,.25),rgba(109,45,181,.25),transparent)" }} />

        {/* Top row: logo + cart */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-fraunces text-[20px] leading-none">
            Spectrum <span style={{ color: "#E0337E" }}>✦</span>
          </p>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/compte"
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(243,234,219,0.07)" }}>
                <span className="font-fraunces text-sm" style={{ color: "#E0337E" }}>
                  {(user.email?.[0] ?? "?").toUpperCase()}
                </span>
              </Link>
            ) : (
              <Link href="/auth"
                className="px-3 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider"
                style={{ border: "1px solid rgba(243,234,219,0.15)", color: "rgba(243,234,219,0.45)" }}>
                Connexion
              </Link>
            )}
            <Link href="/panier" className="relative w-8 h-8 flex items-center justify-center rounded-xl"
              style={{ background: "rgba(243,234,219,0.07)" }}>
              <ShoppingBag size={15} className="text-[#F3EADB]/60" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full text-[9px] font-mono flex items-center justify-center px-0.5 text-white"
                  style={{ background: "#E0337E" }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F3EADB]/25 pointer-events-none" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Rechercher une création, une boutique…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl font-hanken text-[13px] text-[#F3EADB] placeholder-[#F3EADB]/25 outline-none"
            style={{ background: "rgba(243,234,219,0.07)", border: "1px solid rgba(243,234,219,0.09)" }}
          />
        </div>
      </header>

      <div className="relative z-10">

        {/* ── Category chips ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-3">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all active:scale-90"
              style={{
                background: cat === c ? "#E0337E" : "rgba(243,234,219,0.07)",
                color: cat === c ? "white" : "rgba(243,234,219,0.40)",
                border: `1px solid ${cat === c ? "transparent" : "rgba(243,234,219,0.09)"}`,
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* ── Products grid ── */}
        <section className="px-4 pb-2">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-fraunces text-[17px] text-[#F3EADB]">
              {search ? `Résultats` : cat !== "Tout" ? cat : "Toutes les créations"}
            </h2>
            <Link href={`/decouvrir${cat !== "Tout" ? `?category=${cat}` : ""}`}
              className="font-mono text-[9px] uppercase tracking-wider flex items-center gap-1"
              style={{ color: "#E0337E" }}>
              Voir tout <ArrowRight size={9} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: "rgba(243,234,219,0.05)" }}>
                  <div className="aspect-square" />
                  <div className="p-2.5 space-y-1.5">
                    <div className="h-2.5 rounded w-3/4" style={{ background: "rgba(243,234,219,0.08)" }} />
                    <div className="h-3 rounded w-1/3" style={{ background: "rgba(243,234,219,0.06)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-fraunces text-[20px] text-[#F3EADB]/30 mb-2">
                {search ? "Aucune création trouvée" : "Le spectre se remplit"}
              </p>
              <p className="font-hanken text-[12px] text-[#F3EADB]/20 mb-6">
                {search ? `Aucun résultat pour "${search}"` : "Sois parmi les premiers à créer ici"}
              </p>
              {!search && (
                <Link href="/vendeur/onboarding"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-fraunces text-[14px] text-white"
                  style={{ background: "linear-gradient(135deg,#6D2DB5,#E0337E)" }}>
                  Ouvrir ma boutique
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </section>

        {/* ── Shops ── */}
        {shops.length > 0 && (
          <section className="mt-6 px-4">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-fraunces text-[17px] text-[#F3EADB]">Boutiques</h2>
              <Link href="/decouvrir" className="font-mono text-[9px] uppercase tracking-wider flex items-center gap-1"
                style={{ color: "#E0337E" }}>
                Toutes <ArrowRight size={9} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pb-2">
              {shops.map(s => <ShopCard key={s.id} s={s} />)}
            </div>
          </section>
        )}

        {/* ── Divider ── */}
        <div className="mx-4 my-6 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(224,51,126,.2),rgba(109,45,181,.2),transparent)" }} />

        {/* ── Founder program — compact, secondary ── */}
        {counts && remaining > 0 && (
          <section className="px-4 pb-4">
            <Link href="/programme-fondateur"
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
              style={{ background: "rgba(255,215,0,.05)", border: "1px solid rgba(255,215,0,.15)" }}>
              <span className="text-xl">🏆</span>
              <div className="flex-1 min-w-0">
                <p className="font-hanken text-[12px] text-[#F3EADB]/80 leading-tight">
                  Programme Fondateur·ice ·{" "}
                  <span className="font-semibold" style={{ color: "#FFD700" }}>{remaining} places restantes</span>
                </p>
                <div className="h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: "rgba(243,234,219,0.08)" }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${Math.round(((120 - remaining) / 120) * 100)}%`,
                      background: "linear-gradient(90deg,#FFD700,#E0337E)",
                    }} />
                </div>
              </div>
              <ArrowRight size={13} className="text-[#FFD700]/60 shrink-0" />
            </Link>
          </section>
        )}

        {/* ── CTA sell — for non-vendors ── */}
        {!loading && (
          <section className="px-4 pb-6">
            <div className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: "rgba(243,234,219,0.03)", border: "1px solid rgba(243,234,219,0.07)" }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,#E0533A,#CF3F7C,#6D2DB5,#1C9C95)" }} />
              <p className="font-mono text-[8px] uppercase tracking-widest mb-2"
                style={{ color: "rgba(224,51,126,0.55)" }}>◈ Tu crées ?</p>
              <p className="font-fraunces text-[16px] text-[#F3EADB] mb-1">Vends tes créations ici</p>
              <p className="font-hanken text-[11px] text-[#F3EADB]/40 mb-4 leading-relaxed">
                Boutique en ligne, communauté queer, 0 % de commission les premiers mois.
              </p>
              <Link href="/vendeur/onboarding"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-fraunces text-[13px] text-white"
                style={{ background: "linear-gradient(135deg,#6D2DB5,#E0337E)", boxShadow: "0 4px 16px rgba(109,45,181,.35)" }}>
                Ouvrir ma boutique <ArrowRight size={13} />
              </Link>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
