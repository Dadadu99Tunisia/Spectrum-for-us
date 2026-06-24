import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title_fr, excerpt_fr, cover_url, tags, published_at, category")
    .eq("slug", slug)
    .single();

  if (!article) return { title: "Article introuvable" };

  return {
    title: article.title_fr,
    description: (article.excerpt_fr ?? "").slice(0, 160),
    keywords: article.tags ?? [],
    openGraph: {
      title: article.title_fr,
      description: article.excerpt_fr ?? "",
      images: article.cover_url ? [{ url: article.cover_url, width: 1200, height: 630, alt: article.title_fr }] : [],
      type: "article",
      publishedTime: article.published_at,
      tags: article.tags ?? [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title_fr,
      description: article.excerpt_fr ?? "",
      images: article.cover_url ? [article.cover_url] : [],
    },
    alternates: { canonical: `https://spectrumforus.com/media/${slug}` },
  };
}

// Données structurées JSON-LD (BlogPosting) — générées automatiquement par article
// pour les rich snippets Google (s'ajoute à generateMetadata : OG/Twitter/canonical).
export default async function Layout(
  { children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: a } = await supabase
    .from("articles")
    .select("title_fr, excerpt_fr, cover_url, published_at, updated_at, category, tags")
    .eq("slug", slug)
    .maybeSingle();

  const jsonLd = a ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title_fr,
    description: (a.excerpt_fr ?? "").slice(0, 200),
    image: a.cover_url ? [a.cover_url] : undefined,
    datePublished: a.published_at,
    dateModified: a.updated_at ?? a.published_at,
    articleSection: a.category,
    keywords: (a.tags ?? []).join(", "),
    inLanguage: "fr",
    author: { "@type": "Organization", name: "Spectrum For Us", url: "https://spectrumforus.com" },
    publisher: {
      "@type": "Organization", name: "Spectrum For Us",
      logo: { "@type": "ImageObject", url: "https://spectrumforus.com/logo-dark.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://spectrumforus.com/media/${slug}` },
  } : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {children}
    </>
  );
}
