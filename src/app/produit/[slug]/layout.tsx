import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, title, description, price, category, type, images, image_url, shops(name, slug)")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Produit introuvable" };

  const name     = (product.name ?? product.title ?? "Produit") as string;
  const shop     = (Array.isArray(product.shops) ? product.shops[0] : product.shops) as { name: string; slug?: string } | null;
  const shopName = shop?.name ?? "Spectrum For Us";
  const price    = product.price ? `${Number(product.price).toFixed(2)} €` : null;
  const desc     = product.description
    ? (product.description as string).slice(0, 155)
    : `Découvrez "${name}" par ${shopName} sur Spectrum For Us.`;
  const url      = `https://spectrumforus.com/produit/${slug}`;
  const ogTitle  = `${name}${price ? ` · ${price}` : ""} | ${shopName}`;

  // L'image OG dynamique est générée par opengraph-image.tsx dans ce même dossier.
  // Next.js l'injecte automatiquement · pas besoin de la passer manuellement.

  return {
    title: ogTitle,
    description: desc,
    openGraph: {
      title: ogTitle,
      description: desc,
      url,
      type: "website",
      siteName: "Spectrum For Us",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
    },
    alternates: { canonical: url },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
