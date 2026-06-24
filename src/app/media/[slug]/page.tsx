"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import DOMPurify from "isomorphic-dompurify";

type Article = {
  id: string; slug: string; title_fr: string; title_en: string; title_ar: string;
  content_fr: string; cover_url: string | null; cover_position: string | null; category: string;
  published_at: string; tags: string[] | null; excerpt_fr: string;
};

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("articles").select("*").eq("slug", slug).eq("published", true).single()
      .then(({ data }) => { setArticle(data); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center">
      <SpectrumLoader size="md" />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014] flex flex-col items-center justify-center gap-4">
      <p className="font-fraunces text-2xl">Article introuvable</p>
      <Link href="/media" className="font-hanken text-[#FF2DA0] hover:underline">← Retour au média</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />
      <article className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <Link href="/media" className="inline-flex items-center gap-2 text-[#101014]/40 hover:text-[#FF2DA0] transition-colors font-hanken text-sm mb-8">
          <ArrowLeft size={14} /> Retour au média
        </Link>

        {article.cover_url && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image src={article.cover_url} alt={article.title_fr} fill className="object-cover"
              style={{ objectPosition: `center ${article.cover_position ?? "50"}%` }} />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#FF2DA0] tracking-wide border border-[#FF2DA0]/30 px-2 py-0.5 rounded-full">
            {article.category}
          </span>
          <span className="font-mono text-[10px] text-[#101014]/30">
            {new Date(article.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        <h1 className="font-fraunces text-4xl md:text-5xl font-light mb-6 leading-tight">{article.title_fr}</h1>

        {article.excerpt_fr && (
          <p className="font-hanken text-lg text-[#101014]/60 mb-8 leading-relaxed border-l-2 border-[#FF2DA0]/40 pl-4">
            {article.excerpt_fr}
          </p>
        )}

        <div
          className="font-hanken text-[#101014]/80 leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(
            (article.content_fr ?? "").replace(/\n/g, "<br/>"),
            { ALLOWED_TAGS: ["p","br","strong","em","h2","h3","h4","ul","ol","li","a","blockquote","code","pre","span"], ALLOWED_ATTR: ["href","target","rel"] }
          ) }}
        />

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-[#101014]/8">
            {article.tags.map(tag => (
              <span key={tag} className="font-mono text-[11px] bg-[#101014]/5 text-[#101014]/40 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
