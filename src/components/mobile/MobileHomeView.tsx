"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Sparkles, Store, Heart } from "lucide-react";

interface Counts {
  founder_count: number;
  early_adopter_count: number;
  founder_remaining: number;
  early_remaining: number;
  founder_slots: number;
  early_adopter_slots: number;
}

interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  images: string[] | null;
  image_url: string | null;
  slug: string;
  shops: { name: string; slug: string } | null;
}

function FounderCounterCompact({ counts }: { counts: Counts | null }) {
  const remaining = (counts?.founder_remaining ?? 20) + (counts?.early_remaining ?? 100);
  const total = (counts?.founder_slots ?? 20) + (counts?.early_adopter_slots ?? 100);
  const pct = Math.round(((total - remaining) / total) * 100);

  return (
    <Link
      href="/programme-fondateur"
      className="block rounded-2xl overflow-hidden border relative"
      style={{
        background: "linear-gradient(135deg,rgba(109,45,181,.18),rgba(224,51,126,.10))",
        borderColor: "rgba(255,215,0,.2)",
      }}
    >
      <div className="px-4 py-3.5 flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <div className="flex-1 min-w-0">
          <p className="font-fraunces text-[13px] text-[#F3EADB] leading-tight">
            Programme Fondateur·ice
          </p>
          <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg,#FFD700,#E0337E)",
              }}
            />
          </div>
          <p className="font-mono text-[9px] text-[#F3EADB]/35 mt-1">
            {remaining} place{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""}
          </p>
        </div>
        <ArrowRight size={14} className="text-[#FFD700] shrink-0" />
      </div>
    </Link>
  );
}

function ProductCard({ p }: { p: Product }) {
  const img = (p.images?.[0]) ?? p.image_url;
  const shopName = p.shops && !Array.isArray(p.shops) ? p.shops.name : null;

  return (
    <Link
      href={`/produit/${p.slug}`}
      className="flex-shrink-0 w-[150px] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] active:scale-95 transition-transform"
    >
      <div className="w-full h-[150px] bg-white/5 relative overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={p.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store size={28} className="text-white/15" />
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="font-hanken text-[11px] text-[#F3EADB]/80 leading-tight line-clamp-2">{p.name || p.title}</p>
        {shopName && <p className="font-mono text-[9px] text-[#F3EADB]/30 mt-0.5">{shopName}</p>}
        <p className="font-fraunces text-[13px] text-[#E0337E] mt-1">{p.price.toFixed(2)} €</p>
      </div>
    </Link>
  );
}

export function MobileHomeView() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // Fetch founder counts
    fetch("/api/founder-program")
      .then(r => r.json())
      .then(setCounts)
      .catch(() => null);

    // Fetch recent products
    const supabase = createClient();
    supabase
      .from("products")
      .select("id,name,title,price,images,image_url,slug,shops(name,slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setProducts((data ?? []) as unknown as Product[]);
        setLoadingProducts(false);
      });
  }, []);

  return (
    <div className="md:hidden min-h-screen bg-[#3D1F5C] text-[#F3EADB]">

      {/* ── Mobile header ── */}
      <header className="sticky top-0 z-40 px-5 pt-[max(16px,env(safe-area-inset-top))] pb-3"
        style={{
          background: "rgba(45,16,78,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(243,234,219,0.06)",
        }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-fraunces text-[22px] leading-none text-[#F3EADB]">
              Spectrum <span className="text-[#E0337E]">🌈</span>
            </p>
            <p className="font-mono text-[9px] text-[#F3EADB]/30 uppercase tracking-widest mt-0.5">
              B(u)y us, for us
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/compte" className="w-8 h-8 rounded-full bg-[#E0337E]/20 border border-[#E0337E]/30 flex items-center justify-center">
                <span className="font-fraunces text-xs text-[#E0337E]">
                  {(user.email?.[0] ?? "?").toUpperCase()}
                </span>
              </Link>
            ) : (
              <Link href="/auth"
                className="px-4 py-1.5 rounded-full font-mono text-[10px] border transition-all active:scale-95"
                style={{ borderColor: "rgba(224,51,126,.4)", color: "#E0337E" }}>
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">

        {/* ── Founder counter ── */}
        <FounderCounterCompact counts={counts} />

        {/* ── Main CTA ── */}
        <Link href={user ? "/vendeur/onboarding" : "/auth?mode=vendor"}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-hanken font-semibold text-[15px] text-white active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg,#6D2DB5,#E0337E)",
            boxShadow: "0 8px 28px rgba(109,45,181,.45)",
          }}>
          <Sparkles size={16} />
          Rejoindre le programme
        </Link>

        {/* ── Recent products ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-fraunces text-[16px] text-[#F3EADB]">Créations récentes</h2>
            <Link href="/decouvrir" className="font-mono text-[10px] text-[#E0337E] flex items-center gap-1">
              Tout voir <ArrowRight size={10} />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[150px] h-[230px] rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
              {products.map(p => <ProductCard key={p.id} p={p} />)}
              <Link
                href="/decouvrir"
                className="flex-shrink-0 w-[150px] h-[150px] rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center gap-2 text-center active:scale-95 transition-transform"
              >
                <ArrowRight size={20} className="text-[#E0337E]" />
                <span className="font-mono text-[10px] text-[#F3EADB]/40">Voir tout</span>
              </Link>
            </div>
          )}
        </section>

        {/* ── Discover CTA ── */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/decouvrir"
            className="flex flex-col items-center gap-2 py-5 rounded-2xl border border-white/10 bg-white/[0.04] active:scale-95 transition-transform">
            <span className="text-2xl">🔎</span>
            <span className="font-hanken text-xs text-[#F3EADB]/70">Explorer</span>
          </Link>
          <Link href="/evenements"
            className="flex flex-col items-center gap-2 py-5 rounded-2xl border border-white/10 bg-white/[0.04] active:scale-95 transition-transform">
            <span className="text-2xl">🌈</span>
            <span className="font-hanken text-xs text-[#F3EADB]/70">Événements</span>
          </Link>
          <Link href="/communaute"
            className="flex flex-col items-center gap-2 py-5 rounded-2xl border border-white/10 bg-white/[0.04] active:scale-95 transition-transform">
            <span className="text-2xl">✦</span>
            <span className="font-hanken text-xs text-[#F3EADB]/70">Communauté</span>
          </Link>
          <Link href={user ? "/vendeur" : "/vendre"}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl border border-white/10 bg-white/[0.04] active:scale-95 transition-transform">
            <Store size={22} className="text-[#E0337E]" />
            <span className="font-hanken text-xs text-[#F3EADB]/70">Ma boutique</span>
          </Link>
        </div>

        {/* ── Manifeste mini ── */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
          style={{ borderColor: "rgba(224,51,126,.12)" }}>
          <p className="font-mono text-[9px] tracking-widest uppercase text-[#E0337E]/60 mb-3">◈ Notre manifeste</p>
          <p className="font-fraunces text-[18px] text-[#F3EADB] leading-snug">
            On n&apos;a pas construit une marketplace.{" "}
            <em className="text-[#E0337E]">On a construit un refus.</em>
          </p>
          <p className="font-hanken text-[12px] text-[#F3EADB]/45 mt-3 leading-relaxed">
            Le refus de disparaître des algorithmes. Le refus de l&apos;effacement.
          </p>
          <Link href="/rejoindre" className="flex items-center gap-1.5 mt-4 font-mono text-[10px] text-[#E0337E]">
            Rejoindre <ArrowRight size={10} />
          </Link>
        </div>

        {/* Liked shortcut for logged users */}
        {user && (
          <Link href="/favoris"
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-white/8 bg-white/[0.04] active:scale-95 transition-transform">
            <Heart size={18} className="text-[#E0337E]" />
            <span className="font-hanken text-[13px] text-[#F3EADB]/70">Mes favoris</span>
            <ArrowRight size={12} className="ml-auto text-[#F3EADB]/25" />
          </Link>
        )}
      </div>
    </div>
  );
}
