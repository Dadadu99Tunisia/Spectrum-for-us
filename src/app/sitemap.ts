import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = "https://spectrumforus.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/decouvrir`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/media`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/ambassadeurs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/vendre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/rejoindre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/legal/cgu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/legal/confidentialite`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/auth`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Products
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_active", true);

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE}/produit/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Shops
  const { data: shops } = await supabase
    .from("shops")
    .select("slug, updated_at")
    .eq("is_active", true);

  const shopPages: MetadataRoute.Sitemap = (shops ?? []).map((s) => ({
    url: `${BASE}/boutique/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("published", true);

  const articlePages: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE}/media/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...shopPages, ...articlePages];
}
