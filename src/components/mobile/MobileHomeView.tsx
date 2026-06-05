"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight } from "lucide-react";

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

// Animated number counter
function AnimatedNumber({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (target === 0) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    ref.current = setInterval(() => {
      current = Math.min(current + step, target);
      setVal(current);
      if (current >= target && ref.current) clearInterval(ref.current);
    }, 30);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [target]);
  return <>{val}</>;
}

export function MobileHomeView() {
  const { user } = useAuth();
  const [counts, setCounts]   = useState<Counts | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProds, setLoadingProds] = useState(true);

  useEffect(() => {
    fetch("/api/founder-program")
      .then(r => r.json())
      .then(setCounts)
      .catch(() => null);

    createClient()
      .from("products")
      .select("id,name,title,price,images,image_url,slug,shops(name,slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setProducts((data ?? []) as unknown as Product[]);
        setLoadingProds(false);
      });
  }, []);

  const remaining = (counts?.founder_remaining ?? 20) + (counts?.early_remaining ?? 100);
  const total     = (counts?.founder_slots ?? 20) + (counts?.early_adopter_slots ?? 100);
  const taken     = total - remaining;
  const pct       = Math.round((taken / total) * 100);

  return (
    <div className="md:hidden min-h-screen text-[#F3EADB] overflow-x-hidden"
      style={{ background: "#3D1F5C" }}>

      {/* ─── Ambient glow background ─── */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(110,45,181,0.22) 0%, transparent 70%)" }} />

      {/* ─── Header ─── */}
      <header className="relative z-10 px-5 pt-[max(20px,env(safe-area-inset-top))] pb-4 flex items-center justify-between">
        <div>
          <p className="font-fraunces text-[26px] leading-none tracking-tight">
            Spectrum <span style={{ color: "#E0337E" }}>✦</span>
          </p>
          <p className="font-mono text-[8px] text-[#F3EADB]/30 tracking-[0.18em] uppercase mt-0.5">
            B(u)y us, for us
          </p>
        </div>

        {user ? (
          <Link href="/compte"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(224,51,126,.15)", border: "1px solid rgba(224,51,126,.25)" }}>
            <span className="font-fraunces text-sm" style={{ color: "#E0337E" }}>
              {(user.email?.[0] ?? "?").toUpperCase()}
            </span>
          </Link>
        ) : (
          <Link href="/auth"
            className="px-4 py-1.5 rounded-full font-mono text-[9px] tracking-wider uppercase"
            style={{ border: "1px solid rgba(243,234,219,0.18)", color: "rgba(243,234,219,0.50)" }}>
            Connexion
          </Link>
        )}
      </header>

      <div className="relative z-10 px-5 space-y-8 pb-4">

        {/* ─── Hero text ─── */}
        <section className="pt-2">
          <p className="font-mono text-[9px] tracking-[0.20em] uppercase mb-3"
            style={{ color: "#E0337E" }}>
            ◈ Programme Fondateur·ice
          </p>
          <h1 className="font-fraunces text-[34px] leading-[1.05] tracking-tight text-[#F3EADB]">
            Rejoins les premiers<br />
            <em className="not-italic" style={{ color: "#F2B79E" }}>à bâtir Spectrum.</em>
          </h1>
          <p className="font-hanken text-[13px] text-[#F3EADB]/50 mt-3 leading-relaxed">
            Des avantages exclusifs à vie — 3 ans d&apos;abonnement offert, 0&nbsp;% de commission.
          </p>
        </section>

        {/* ─── Live counter ─── */}
        <section>
          <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{
              background: "rgba(243,234,219,0.04)",
              border: "1px solid rgba(243,234,219,0.08)",
            }}>
            {/* Count */}
            <div className="text-center">
              <p className="font-fraunces text-[36px] leading-none" style={{ color: "#FFD700" }}>
                {counts ? <AnimatedNumber target={taken} /> : "…"}
              </p>
              <p className="font-mono text-[8px] text-[#F3EADB]/35 tracking-widest uppercase mt-1">
                inscrits
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-10 self-center" style={{ background: "rgba(243,234,219,0.10)" }} />

            {/* Progress */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] text-[#F3EADB]/40">
                  {remaining} place{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""}
                </span>
                <span className="font-mono text-[9px]" style={{ color: "#FFD700" }}>
                  {pct}%
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(243,234,219,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg,#FFD700,#E0337E)",
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono text-[8px] text-[#FFD700]/60">🏆 Fondateur·ice</span>
                <span className="font-mono text-[8px] text-[#a78bfa]/60">🚀 Pionnier·e</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Primary CTA ─── */}
        <section>
          <Link
            href={user ? "/vendeur/onboarding" : "/auth?mode=vendor"}
            className="flex items-center justify-between w-full px-6 py-4 rounded-2xl font-fraunces text-[17px] text-white active:scale-[0.97] transition-transform"
            style={{
              background: "linear-gradient(135deg, #6D2DB5 0%, #E0337E 100%)",
              boxShadow: "0 8px 32px rgba(109,45,181,.45), inset 0 1px 0 rgba(255,255,255,.1)",
            }}
          >
            <span>Rejoindre le programme</span>
            <ArrowRight size={18} />
          </Link>
          <p className="text-center font-mono text-[8px] text-[#F3EADB]/25 mt-2 tracking-wide">
            Places numérotées · Non transférables
          </p>
        </section>

        {/* ─── Prism divider ─── */}
        <div className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(224,51,126,.3), rgba(109,45,181,.3), transparent)" }} />

        {/* ─── Recent creations ─── */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-fraunces text-[20px] text-[#F3EADB]">Créations récentes</h2>
            <Link href="/decouvrir" className="font-mono text-[9px] text-[#E0337E] tracking-wider uppercase flex items-center gap-1">
              Tout <ArrowRight size={9} />
            </Link>
          </div>

          {loadingProds ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[140px] rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: "rgba(243,234,219,0.05)" }}>
                  <div className="h-[140px]" />
                  <div className="p-3 space-y-2">
                    <div className="h-2.5 rounded w-3/4" style={{ background: "rgba(243,234,219,0.08)" }} />
                    <div className="h-3 rounded w-1/2" style={{ background: "rgba(243,234,219,0.06)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <Link href="/vendeur/onboarding"
              className="flex items-center gap-4 px-5 py-4 rounded-2xl active:scale-[0.98] transition-transform"
              style={{ background: "rgba(243,234,219,0.04)", border: "1px dashed rgba(243,234,219,0.12)" }}>
              <span className="text-3xl">✦</span>
              <div>
                <p className="font-fraunces text-[14px] text-[#F3EADB]">Sois le premier à vendre ici</p>
                <p className="font-mono text-[9px] text-[#F3EADB]/35 mt-0.5">Ouvre ta boutique · Gratuit</p>
              </div>
              <ArrowRight size={14} className="ml-auto text-[#E0337E]" />
            </Link>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none">
              {products.map(p => {
                const img = p.images?.[0] ?? p.image_url;
                const shopName = p.shops && !Array.isArray(p.shops) ? p.shops.name : null;
                return (
                  <Link key={p.id} href={`/produit/${p.slug}`}
                    className="flex-shrink-0 w-[140px] rounded-2xl overflow-hidden active:scale-95 transition-transform"
                    style={{ background: "rgba(243,234,219,0.04)", border: "1px solid rgba(243,234,219,0.07)" }}>
                    <div className="h-[140px] relative overflow-hidden"
                      style={{ background: "rgba(243,234,219,0.04)" }}>
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.name || p.title}
                          className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl opacity-20">✦</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-hanken text-[11px] text-[#F3EADB]/75 line-clamp-2 leading-tight">{p.name || p.title}</p>
                      {shopName && <p className="font-mono text-[8px] text-[#F3EADB]/28 mt-0.5">{shopName}</p>}
                      <p className="font-fraunces text-[14px] mt-1.5" style={{ color: "#F2B79E" }}>
                        {p.price.toFixed(2)} €
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── Explore & Actions grid ─── */}
        <section className="grid grid-cols-2 gap-3">
          {[
            { href: "/decouvrir",  label: "Explorer",       emoji: "✦",  sub: "Toutes les créations" },
            { href: "/evenements", label: "Événements",     emoji: "🌈", sub: "Pride, ateliers, expos" },
            { href: "/communaute", label: "Communauté",     emoji: "◈",  sub: "Rejoindre le mouvement" },
            { href: user ? "/vendeur" : "/vendre", label: "Ma boutique", emoji: "○",  sub: user ? "Gérer mes produits" : "Ouvrir ma boutique" },
          ].map(({ href, label, emoji, sub }) => (
            <Link key={href} href={href}
              className="flex flex-col gap-1.5 p-4 rounded-2xl active:scale-95 transition-transform"
              style={{ background: "rgba(243,234,219,0.04)", border: "1px solid rgba(243,234,219,0.07)" }}>
              <span className="text-[22px] leading-none">{emoji}</span>
              <p className="font-fraunces text-[14px] text-[#F3EADB]">{label}</p>
              <p className="font-mono text-[8px] text-[#F3EADB]/30 leading-tight">{sub}</p>
            </Link>
          ))}
        </section>

        {/* ─── Manifeste fragment ─── */}
        <section className="pb-2">
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: "rgba(243,234,219,0.025)",
              border: "1px solid rgba(243,234,219,0.06)",
            }}>
            {/* Prism line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, #E0533A, #E0901E, #CF3F7C, #6D2DB5, #1C9C95)" }} />

            <p className="font-mono text-[8px] tracking-[0.18em] uppercase mb-4"
              style={{ color: "rgba(224,51,126,0.60)" }}>
              ◈ Notre manifeste
            </p>
            <blockquote className="font-fraunces text-[20px] leading-snug text-[#F3EADB]">
              On n&apos;a pas construit une marketplace.{" "}
              <em style={{ color: "#F2B79E" }}>On a construit un refus.</em>
            </blockquote>
            <p className="font-hanken text-[12px] text-[#F3EADB]/40 mt-3 leading-relaxed">
              Le refus de disparaître des algorithmes.<br />
              Le refus de l&apos;effacement.
            </p>
            <Link href="/rejoindre"
              className="inline-flex items-center gap-1.5 mt-4 font-mono text-[9px] tracking-wider uppercase"
              style={{ color: "#E0337E" }}>
              Rejoindre <ArrowRight size={10} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
