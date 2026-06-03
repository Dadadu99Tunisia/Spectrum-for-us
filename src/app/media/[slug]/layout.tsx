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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
