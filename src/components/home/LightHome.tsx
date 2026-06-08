"use client";

/**
 * LightHome · accueil desktop clair minimaliste (standing QueerMarket, mais
 * identité Spectrum : éditorial "B(u)y us, for us.", multi-vertical, parcours
 * par profil, confiance). Autonome (barre claire propre), zéro ornementation.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, ShoppingCart, Briefcase, Heart, CalendarDays, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Price } from "@/components/ui/Price";

const T = { bg: "#FBF9F5", ink: "#1A1612", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF3D7F" };
const CAT: Record<string, { tint: string; ink: string }> = {
  Mode: { tint: "#FBE3EC", ink: "#C23B6B" }, Bijoux: { tint: "#FBEAD3", ink: "#B5742A" },
  Zines: { tint: "#D9EEF3", ink: "#1E7E91" }, Corps: { tint: "#DCF0E5", ink: "#1B8155" },
  Art: { tint: "#EAE0FB", ink: "#6A44D6" }, Services: { tint: "#E3E6FB", ink: "#4A56C6" },
};
const tintFor = (c: string) => CAT[Object.keys(CAT).find(k => (c || "").toLowerCase().includes(k.toLowerCase())) ?? "Mode"] ?? CAT.Mode;

interface Product { id: string; name: string; title: string; price: number; images: string[] | null; image_url: string | null; slug: string; category: string; shops: { name: string } | null; }

const VERTICALS = [
  { label: "Acheter", desc: "Créations queer", href: "/decouvrir", icon: ShoppingCart },
  { label: "Prestataires", desc: "Pros & services", href: "/services", icon: Briefcase },
  { label: "Associations", desc: "Soutien LGBTQIA+", href: "/annuaire", icon: Heart },
  { label: "Événements", desc: "Près de chez toi", href: "/evenements", icon: CalendarDays },
];
const COLLECTIONS = [
  { title: "Pride 2026", sub: "Pièces qui affirment", cat: "Mode" },
  { title: "Art queer", sub: "Créateur·ices à suivre", cat: "Art" },
  { title: "Fait main", sub: "Bijoux & artisanat", cat: "Bijoux" },
  { title: "Corps & soin", sub: "Doux, inclusif", cat: "Corps" },
];

export function LightHome() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    createClient().from("products")
      .select("id,name,title,price,images,image_url,slug,category,shops(name)")
      .eq("is_active", true).order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setProducts((data ?? []) as unknown as Product[]));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: T.ink, fontFamily: "var(--font-hanken),sans-serif" }}>
      <Header />

      {/* ── Hero éditorial ── */}
      <section className="max-w-6xl mx-auto px-8 pt-36 pb-14 text-center">
        <p className="text-[13px] mb-5" style={{ color: T.faint }}>La marketplace par et pour les communautés queer</p>
        <h1 className="font-fraunces leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(48px,7vw,92px)" }}>
          B<span style={{ color: T.mag }}>(u)</span>y us,<br />for us.
        </h1>
        <p className="max-w-xl mx-auto mt-6 text-[16px] leading-relaxed" style={{ color: T.soft }}>
          Créations, prestataires, associations et événements · un seul endroit, tenu pour tout le spectre.
        </p>
        {/* Parcours par profil · quoi faire en 30s */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
          {VERTICALS.map(v => {
            const Icon = v.icon;
            return (
              <Link key={v.label} href={v.href} className="group flex flex-col items-center gap-2 py-6 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                <Icon size={22} style={{ color: T.mag }} strokeWidth={1.6} />
                <span className="font-bricolage font-semibold text-[15px]">{v.label}</span>
                <span className="text-[12px]" style={{ color: T.faint }}>{v.desc}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Réassurance ── */}
      <section className="max-w-4xl mx-auto px-8 pb-16">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-[13px]" style={{ color: T.soft }}>
          <span className="flex items-center gap-2"><Truck size={16} /> Livraison suivie</span>
          <span className="flex items-center gap-2"><RefreshCw size={16} /> Retours 14 jours</span>
          <span className="flex items-center gap-2"><ShieldCheck size={16} /> Paiement sécurisé · Stripe</span>
          <span className="flex items-center gap-2"><Heart size={16} /> Vendeur·ses vérifié·es</span>
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="max-w-6xl mx-auto px-8 pb-16">
        <h2 className="font-fraunces text-[26px] mb-6">Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLLECTIONS.map(c => {
            const t = tintFor(c.cat);
            return (
              <Link key={c.title} href={`/decouvrir?category=${encodeURIComponent(c.cat)}`}
                className="rounded-2xl p-5 h-40 flex flex-col justify-end transition-all hover:-translate-y-0.5" style={{ background: t.tint }}>
                <span className="font-bricolage font-bold text-[19px]" style={{ color: t.ink }}>{c.title}</span>
                <span className="text-[13px] mt-1" style={{ color: t.ink, opacity: 0.7 }}>{c.sub}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Produits ── */}
      <section className="max-w-6xl mx-auto px-8 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-fraunces text-[26px]">Nouveautés</h2>
          <Link href="/decouvrir" className="text-[14px] font-semibold flex items-center gap-1" style={{ color: T.mag }}>Voir tout <ArrowRight size={14} /></Link>
        </div>
        {products.length === 0 ? (
          <div className="rounded-3xl px-8 py-12 text-center" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            <span className="text-3xl">🏳️‍🌈</span>
            <h3 className="font-fraunces text-[24px] mt-3 mb-2" style={{ color: T.ink }}>Les premières créations arrivent</h3>
            <p className="max-w-md mx-auto text-[15px] mb-6" style={{ color: T.soft }}>Spectrum se construit avec ses premier·es créateur·ices. Prends ta place de fondateur·ice avant tout le monde.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/programme-fondateur" className="rounded-full px-6 py-3 font-semibold text-[15px] text-white" style={{ background: T.ink }}>Devenir fondateur·ice</Link>
              <Link href="/vendeur/onboarding" className="rounded-full px-6 py-3 font-semibold text-[15px]" style={{ color: T.ink, boxShadow: `inset 0 0 0 1.5px ${T.line}` }}>Ouvrir ma boutique</Link>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map(p => {
            const img = p.images?.[0] ?? p.image_url; const t = tintFor(p.category);
            const shop = !Array.isArray(p.shops) ? p.shops?.name : null;
            return (
              <Link key={p.id} href={`/produit/${p.slug}`} className="group">
                <div className="rounded-2xl overflow-hidden aspect-square" style={{ background: t.tint }}>
                  {img ? <img src={img} alt={p.name || p.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center p-8"><img src="/logo-dark.png" alt="Spectrum For Us" className="w-full h-full object-contain opacity-25" /></div>}
                </div>
                <p className="font-bricolage font-semibold text-[15px] mt-2.5 leading-tight">{p.name || p.title}</p>
                {shop && <p className="text-[12.5px]" style={{ color: T.faint }}>{shop}</p>}
                <Price eur={p.price} className="font-mono font-bold text-[15px] mt-1 block" />
              </Link>
            );
          })}
        </div>
        )}
      </section>

      {/* ── Vendre ── */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="rounded-3xl px-10 py-12 text-center" style={{ background: T.ink, color: "#fff" }}>
          <h2 className="font-fraunces text-[32px] mb-3">Tu crées ? Vends ici.</h2>
          <p className="max-w-md mx-auto text-[15px] mb-7" style={{ color: "rgba(255,255,255,.7)" }}>Boutique en ligne, communauté queer, 0 % de commission les premiers mois.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/vendeur/onboarding" className="rounded-full font-semibold text-[15px] px-7 py-3.5" style={{ background: T.mag, color: "#fff" }}>Ouvrir ma boutique</Link>
            <Link href="/rejoindre" className="rounded-full font-semibold text-[15px] px-7 py-3.5" style={{ color: "#fff", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.3)" }}>Référencer mon association</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
