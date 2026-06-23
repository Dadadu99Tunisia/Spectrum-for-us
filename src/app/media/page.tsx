"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { ScatterText } from "@/components/ui/ScatterText";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";

const CONTENT = {
  fr: {
    eyebrow: "Média Spectrum",
    titleA: "Histoires, ",
    titleB: "modes de vie",
    titleC: ",",
    titleD: "actualités ",
    subtitle: "Des récits authentiques, des guides pratiques, une culture qui nous ressemble.",
    all: "Tous",
    empty: "Aucun article pour le moment. Revenez bientôt ✨",
    read: "Lire →",
    catLabels: {
      editorial: "Éditorial", lifestyle: "Lifestyle", culture: "Culture", news: "Actualités", guide: "Guide",
    } as Record<string, string>,
    dateLocale: "fr-FR",
  },
  en: {
    eyebrow: "Spectrum Media",
    titleA: "Stories, ",
    titleB: "ways of life",
    titleC: ",",
    titleD: "news ",
    subtitle: "Authentic narratives, practical guides, a culture that looks like us.",
    all: "All",
    empty: "No articles yet. Come back soon ✨",
    read: "Read →",
    catLabels: {
      editorial: "Editorial", lifestyle: "Lifestyle", culture: "Culture", news: "News", guide: "Guide",
    } as Record<string, string>,
    dateLocale: "en-US",
  },
} as const;

type Article = {
  id: string; slug: string; title_fr: string; title_en: string; title_ar: string;
  excerpt_fr: string; cover_url: string | null; category: string;
  published_at: string; tags: string[] | null;
};

const CATEGORIES = ["Tous", "editorial", "lifestyle", "culture", "news", "guide"];

export default function MediaPage() {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tous");

  useEffect(() => {
    const supabase = createClient();
    let q = supabase.from("articles").select("*").eq("published", true).order("published_at", { ascending: false });
    if (category !== "Tous") q = q.eq("category", category);
    q.then(({ data }) => { setArticles(data ?? []); setLoading(false); });
  }, [category]);

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <p className="font-mono text-xs tracking-widest text-[#FF2DA0] uppercase mb-4">{C.eyebrow}</p>
        <h1 className="font-fraunces text-5xl md:text-7xl font-light mb-4">
          {C.titleA}<span className="text-[#FF2DA0]">{C.titleB}</span>{C.titleC}<br />{C.titleD}<ScatterText text="queer" intensity={0.7} className="font-extrabold align-baseline" />.
        </h1>
        <p className="font-hanken text-[#101014]/60 max-w-xl mx-auto">
          {C.subtitle}
        </p>
      </section>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap justify-center px-6 pb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all border ${
              category === cat
                ? "bg-[#FF2DA0] border-[#FF2DA0] text-white"
                : "border-[#101014]/15 text-[#101014]/50 hover:border-[#FF2DA0]/40"
            }`}
          >
            {cat === "Tous" ? C.all : C.catLabels[cat]}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#101014]/5 h-80 animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-[#101014]/30 font-hanken">
            {C.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link key={article.id} href={`/media/${article.slug}`} className="group">
                <article className="rounded-2xl overflow-hidden border border-[#101014]/8 hover:border-[#FF2DA0]/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-52 bg-gradient-to-br from-[#F93C2C]/20 to-[#7A2BF0]/20">
                    {article.cover_url ? (
                      <Image src={article.cover_url} alt={article.title_fr} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-fraunces text-4xl text-[#FF2DA0]/30">✦</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#FBFAF8]/80 backdrop-blur px-2 py-1 rounded-full font-mono text-[10px] text-[#FF2DA0] tracking-wide">
                      {C.catLabels[article.category] ?? article.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-fraunces text-lg text-[#101014] mb-2 group-hover:text-[#FF2DA0] transition-colors line-clamp-2">
                      {article.title_fr}
                    </h2>
                    {article.excerpt_fr && (
                      <p className="font-hanken text-sm text-[#101014]/50 line-clamp-2 mb-3">{article.excerpt_fr}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#101014]/30">
                        {new Date(article.published_at).toLocaleDateString(C.dateLocale, { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="font-hanken text-xs text-[#FF2DA0] group-hover:underline">{C.read}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
