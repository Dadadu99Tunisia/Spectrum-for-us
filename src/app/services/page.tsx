"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/contexts/I18nContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { FillImage } from "@/components/ui/FillImage";
import { Price } from "@/components/ui/Price";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";

interface Service {
  id: string; name: string; title: string; price: number;
  images: string[] | null; image_url: string | null; slug: string;
  subcategory: string | null; event_city: string | null;
  shops: { name: string; slug: string } | null;
}

// Les `value` servent de filtre Supabase (.ilike sur subcategory) → restent en FR.
const CHIPS: { value: string; fr: string; en: string }[] = [
  { value: "Tout", fr: "Tout", en: "All" },
  { value: "Coaching & Psy", fr: "Coaching & Psy", en: "Coaching & Therapy" },
  { value: "Tatouage", fr: "Tatouage", en: "Tattoo" },
  { value: "Coiffure", fr: "Coiffure", en: "Hair" },
  { value: "Maquillage", fr: "Maquillage", en: "Makeup" },
  { value: "Création & Freelance", fr: "Création & Freelance", en: "Creative & Freelance" },
  { value: "Événementiel", fr: "Événementiel", en: "Events" },
  { value: "Juridique & Admin", fr: "Juridique & Admin", en: "Legal & Admin" },
  { value: "Formation", fr: "Formation", en: "Training" },
];

const CONTENT = {
  fr: {
    headerTitle: "Services",
    eyebrow: "PRESTATAIRES QUEER & ALLIÉ·ES",
    h1: "Trouve le bon·ne professionnel·le",
    intro: "Coaching, thérapie, tatouage, design, événementiel… des prestataires engagé·es pour toi et ta communauté.",
    emptyTitle: "Les premières prestations arrivent",
    emptyBody: "Tu es thérapeute, tatoueur·se, coach, designer… ? Sois parmi les premier·es prestataires de Spectrum et touche une communauté qui te cherche.",
    emptyCta: "Proposer mon service",
    serviceBadge: "Service",
  },
  en: {
    headerTitle: "Services",
    eyebrow: "QUEER & ALLY PROVIDERS",
    h1: "Find the right professional for you",
    intro: "Coaching, therapy, tattoo, design, events… providers who show up for you and your community.",
    emptyTitle: "The first services are on their way",
    emptyBody: "Are you a therapist, tattoo artist, coach, designer…? Be one of the first Spectrum providers and reach a community that's looking for you.",
    emptyCta: "Offer my service",
    serviceBadge: "Service",
  },
} as const;

export default function ServicesPage() {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [chip, setChip] = useState("Tout");

  useEffect(() => {
    const supabase = createClient();
    let q = supabase
      .from("products")
      .select("id,name,title,price,images,image_url,slug,subcategory,event_city,shops(name,slug)")
      .eq("type", "service").eq("is_active", true)
      .order("created_at", { ascending: false });
    if (chip !== "Tout") q = q.ilike("subcategory", `%${chip}%`);
    q.then(({ data }) => { setServices((data ?? []) as unknown as Service[]); setLoading(false); });
  }, [chip]);

  return (
    <>
      <div className="hidden md:block"><Header /></div>
      <MobilePageHeader title={C.headerTitle} backHref="/" />

      <main className="min-h-screen bg-[#FBFAF8] text-[#101014]">
        <section className="max-w-6xl mx-auto px-5 md:px-8 pt-6 md:pt-28 pb-6">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-[#FF2DA0] mb-3">
            <Briefcase size={13} /> {C.eyebrow}
          </div>
          <h1 className="font-fraunces text-3xl md:text-5xl leading-tight mb-2">{C.h1}</h1>
          <p className="font-hanken text-[#101014]/55 max-w-2xl">
            {C.intro}
          </p>

          {/* Filtres catégories */}
          <div className="flex gap-2 overflow-x-auto pb-1 mt-6" style={{ scrollbarWidth: "none" }}>
            {CHIPS.map(c => (
              <button key={c.value} onClick={() => setChip(c.value)}
                className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 font-hanken text-[13px] transition-colors"
                style={chip === c.value ? { background: "#101014", color: "#fff" } : { background: "#fff", color: "#6B6258", boxShadow: "inset 0 0 0 1px #ECE6DB" }}>
                {locale === "en" ? c.en : c.fr}
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-[#101014]/5 animate-pulse" />
                  <div className="py-2.5 space-y-2"><div className="h-3 bg-[#101014]/5 rounded w-3/4" /><div className="h-3 bg-[#101014]/5 rounded w-1/3" /></div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 max-w-lg mx-auto">
              <span className="text-4xl mb-5">🛎️</span>
              <h2 className="font-fraunces text-2xl md:text-3xl mb-3">{C.emptyTitle}</h2>
              <p className="font-hanken text-[15px] text-[#101014]/55 mb-8 leading-relaxed">
                {C.emptyBody}
              </p>
              <Link href="/vendeur/onboarding" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-[15px] text-white" style={{ background: "#FF2DA0" }}>
                {C.emptyCta} <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map(s => {
                const img = s.images?.[0] ?? s.image_url;
                const shop = s.shops && !Array.isArray(s.shops) ? s.shops.name : null;
                return (
                  <Link key={s.id} href={`/produit/${s.slug}`} className="group">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F1ECE3]">
                      {img ? <FillImage src={img} alt={s.name || s.title} sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center"><Briefcase size={28} className="text-[#101014]/10" /></div>}
                      <span className="absolute left-2 bottom-2 font-mono text-[10px] uppercase px-2 py-0.5 rounded-full text-white" style={{ background: "#101014" }}>{C.serviceBadge}</span>
                    </div>
                    <div className="pt-2">
                      <p className="font-bricolage font-semibold text-[14.5px] leading-tight line-clamp-1">{s.name || s.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Price eur={s.price} className="font-mono text-sm font-bold text-[#101014]" />
                        {(s.event_city || shop) && (
                          <span className="font-mono text-[10px] text-[#101014]/35 flex items-center gap-1 truncate">
                            {s.event_city ? <><MapPin size={9} />{s.event_city}</> : shop}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <div className="hidden md:block"><Footer /></div>
    </>
  );
}
