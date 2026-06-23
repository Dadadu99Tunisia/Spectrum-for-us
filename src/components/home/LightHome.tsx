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
import { ScatterText } from "@/components/ui/ScatterText";
import { FounderBanner } from "@/components/founder/FounderBanner";
import { useI18n } from "@/contexts/I18nContext";

const T = { bg: "#FBFAF8", ink: "#101014", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF2DA0" };
const CAT: Record<string, { tint: string; ink: string }> = {
  Mode: { tint: "#FBE3EC", ink: "#C23B6B" }, Bijoux: { tint: "#FBEAD3", ink: "#B5742A" },
  Zines: { tint: "#D9EEF3", ink: "#1E7E91" }, Corps: { tint: "#DCF0E5", ink: "#1B8155" },
  Art: { tint: "#EAE0FB", ink: "#6A44D6" }, Services: { tint: "#E3E6FB", ink: "#4A56C6" },
};
const tintFor = (c: string) => CAT[Object.keys(CAT).find(k => (c || "").toLowerCase().includes(k.toLowerCase())) ?? "Mode"] ?? CAT.Mode;

interface Product { id: string; name: string; title: string; price: number; images: string[] | null; image_url: string | null; slug: string; category: string; shops: { name: string } | null; }

const CONTENT = {
  fr: {
    heroEyebrow: "La marketplace par et pour les communautés queer",
    heroSub: "Créations, prestataires, associations et événements · un seul endroit, tenu pour tout le spectre.",
    founder: ["Tu crées ? ", "Ouvre ta boutique fondateur·ice", " — abonnement offert 12 mois, 0 % de commission 6 mois."],
    reassure: ["Livraison suivie", "Retours 14 jours", "Paiement sécurisé · Stripe", "Vendeur·ses vérifié·es"],
    collectionsTitle: "Collections", newTitle: "Nouveautés", seeAll: "Voir tout",
    emptyTitle: "Les premières créations arrivent",
    emptyDesc: "Spectrum se construit avec ses premier·es créateur·ices. Prends ta place de fondateur·ice avant tout le monde.",
    becomeFounder: "Devenir fondateur·ice", openShop: "Ouvrir ma boutique",
    sellTitle: "Tu crées ? Vends ici.", sellSub: "Boutique en ligne, communauté queer, 0 % de commission les premiers mois.",
    listAssociation: "Référencer mon association",
    verticals: [
      { label: "Acheter", desc: "Créations queer", href: "/decouvrir", icon: ShoppingCart },
      { label: "Prestataires", desc: "Pros & services", href: "/services", icon: Briefcase },
      { label: "Associations", desc: "Soutien LGBTQIA+", href: "/annuaire", icon: Heart },
      { label: "Événements", desc: "Près de chez toi", href: "/evenements", icon: CalendarDays },
    ],
    collections: [
      { title: "Pride 2026", sub: "Pièces qui affirment", cat: "Mode" },
      { title: "Art queer", sub: "Créateur·ices à suivre", cat: "Art" },
      { title: "Fait main", sub: "Bijoux & artisanat", cat: "Bijoux" },
      { title: "Corps & soin", sub: "Doux, inclusif", cat: "Corps" },
    ],
  },
  en: {
    heroEyebrow: "The marketplace by and for queer communities",
    heroSub: "Creations, providers, associations and events · one place, held for the whole spectrum.",
    founder: ["You create? ", "Open your founder shop", " — 12 months subscription free, 0% commission for 6 months."],
    reassure: ["Tracked shipping", "14-day returns", "Secure payment · Stripe", "Verified sellers"],
    collectionsTitle: "Collections", newTitle: "New in", seeAll: "See all",
    emptyTitle: "The first creations are coming",
    emptyDesc: "Spectrum is being built with its first creators. Take your founder spot before everyone else.",
    becomeFounder: "Become a founder", openShop: "Open my shop",
    sellTitle: "You create? Sell here.", sellSub: "Online shop, queer community, 0% commission for the first months.",
    listAssociation: "List my association",
    verticals: [
      { label: "Shop", desc: "Queer creations", href: "/decouvrir", icon: ShoppingCart },
      { label: "Providers", desc: "Pros & services", href: "/services", icon: Briefcase },
      { label: "Associations", desc: "LGBTQIA+ support", href: "/annuaire", icon: Heart },
      { label: "Events", desc: "Near you", href: "/evenements", icon: CalendarDays },
    ],
    collections: [
      { title: "Pride 2026", sub: "Pieces that affirm", cat: "Mode" },
      { title: "Queer art", sub: "Creators to follow", cat: "Art" },
      { title: "Handmade", sub: "Jewelry & craft", cat: "Bijoux" },
      { title: "Body & care", sub: "Gentle, inclusive", cat: "Corps" },
    ],
  },
} as const;

export function LightHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const VERTICALS = C.verticals;
  const COLLECTIONS = C.collections;

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
        <p className="text-[13px] mb-5" style={{ color: T.faint }}>{C.heroEyebrow}</p>
        <h1 className="font-fraunces font-extrabold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: "clamp(48px,7vw,92px)" }}>
          B<span style={{ color: T.mag }}>(u)</span>y us,<br />
          <ScatterText text="for us." intensity={0.8} className="align-baseline" />
        </h1>
        <p className="max-w-xl mx-auto mt-6 text-[16px] leading-relaxed" style={{ color: T.soft }}>
          {C.heroSub}
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

        {/* Parcours CRÉATEUR · rareté fondateur·ice (cold-start = priorité acquisition) */}
        <div className="max-w-2xl mx-auto mt-6">
          <FounderBanner compact />
          <p className="text-[12.5px] mt-2" style={{ color: T.faint }}>
            {C.founder[0]}<Link href="/vendre" className="font-semibold underline" style={{ color: T.mag }}>{C.founder[1]}</Link>{C.founder[2]}
          </p>
        </div>
      </section>

      {/* ── Réassurance ── */}
      <section className="max-w-4xl mx-auto px-8 pb-16">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-[13px]" style={{ color: T.soft }}>
          <span className="flex items-center gap-2"><Truck size={16} /> {C.reassure[0]}</span>
          <span className="flex items-center gap-2"><RefreshCw size={16} /> {C.reassure[1]}</span>
          <span className="flex items-center gap-2"><ShieldCheck size={16} /> {C.reassure[2]}</span>
          <span className="flex items-center gap-2"><Heart size={16} /> {C.reassure[3]}</span>
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="max-w-6xl mx-auto px-8 pb-16">
        <h2 className="font-fraunces text-[26px] mb-6">{C.collectionsTitle}</h2>
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
          <h2 className="font-fraunces text-[26px]">{C.newTitle}</h2>
          <Link href="/decouvrir" className="text-[14px] font-semibold flex items-center gap-1" style={{ color: T.mag }}>{C.seeAll} <ArrowRight size={14} /></Link>
        </div>
        {products.length === 0 ? (
          <div className="rounded-3xl px-8 py-12 text-center" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            <span className="text-3xl">🚀</span>
            <h3 className="font-fraunces text-[24px] mt-3 mb-2" style={{ color: T.ink }}>{C.emptyTitle}</h3>
            <p className="max-w-md mx-auto text-[15px] mb-6" style={{ color: T.soft }}>{C.emptyDesc}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/programme-fondateur" className="rounded-full px-6 py-3 font-semibold text-[15px] text-white" style={{ background: T.ink }}>{C.becomeFounder}</Link>
              <Link href="/vendeur/onboarding" className="rounded-full px-6 py-3 font-semibold text-[15px]" style={{ color: T.ink, boxShadow: `inset 0 0 0 1.5px ${T.line}` }}>{C.openShop}</Link>
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
          <h2 className="font-fraunces text-[32px] mb-3">{C.sellTitle}</h2>
          <p className="max-w-md mx-auto text-[15px] mb-7" style={{ color: "rgba(255,255,255,.7)" }}>{C.sellSub}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/vendeur/onboarding" className="rounded-full font-semibold text-[15px] px-7 py-3.5" style={{ background: T.mag, color: "#fff" }}>{C.openShop}</Link>
            <Link href="/rejoindre" className="rounded-full font-semibold text-[15px] px-7 py-3.5" style={{ color: "#fff", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.3)" }}>{C.listAssociation}</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
