"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

type Article = {
  id: string; slug: string; title_fr: string; title_en: string; title_ar: string;
  excerpt_fr: string; cover_url: string | null; category: string;
  published_at: string; tags: string[] | null;
};

const CATEGORIES = ["Tous", "editorial", "lifestyle", "culture", "news", "guide"];
const CAT_LABELS: Record<string, string> = {
  editorial: "Éditorial", lifestyle: "Lifestyle", culture: "Culture", news: "Actualités", guide: "Guide"
};

export default function MediaPage() {
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
    <div className="min-h-screen bg-[#3D1F5C] text-[#F3EADB]">
      <Header />
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <p className="font-mono text-xs tracking-widest text-[#E0337E] uppercase mb-4">Média Spectrum</p>
        <h1 className="font-fraunces text-5xl md:text-7xl font-light mb-4">
          Histoires, <span className="text-[#E0337E]">modes de vie</span>,<br />actualités queer.
        </h1>
        <p className="font-hanken text-[#F3EADB]/60 max-w-xl mx-auto">
          Des récits authentiques, des guides pratiques, une culture qui nous ressemble.
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
                ? "bg-[#E0337E] border-[#E0337E] text-white"
                : "border-[#F3EADB]/15 text-[#F3EADB]/50 hover:border-[#E0337E]/40"
            }`}
          >
            {cat === "Tous" ? "Tous" : CAT_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#F3EADB]/5 h-80 animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-[#F3EADB]/30 font-hanken">
            Aucun article pour le moment. Revenez bientôt ✨
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link key={article.id} href={`/media/${article.slug}`} className="group">
                <article className="rounded-2xl overflow-hidden border border-[#F3EADB]/8 hover:border-[#E0337E]/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-52 bg-gradient-to-br from-[#E0533A]/20 to-[#6D2DB5]/20">
                    {article.cover_url ? (
                      <Image src={article.cover_url} alt={article.title_fr} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-fraunces text-4xl text-[#E0337E]/30">✦</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#3D1F5C]/80 backdrop-blur px-2 py-1 rounded-full font-mono text-[10px] text-[#E0337E] uppercase tracking-wider">
                      {CAT_LABELS[article.category] ?? article.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-fraunces text-lg text-[#F3EADB] mb-2 group-hover:text-[#E0337E] transition-colors line-clamp-2">
                      {article.title_fr}
                    </h2>
                    {article.excerpt_fr && (
                      <p className="font-hanken text-sm text-[#F3EADB]/50 line-clamp-2 mb-3">{article.excerpt_fr}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#F3EADB]/30">
                        {new Date(article.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="font-hanken text-xs text-[#E0337E] group-hover:underline">Lire →</span>
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
