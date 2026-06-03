import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description, price, images, shops(name)")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Produit introuvable" };

  const shop = (Array.isArray(product.shops) ? product.shops[0] : product.shops) as { name: string } | null;
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;

  return {
    title: `${product.name} — ${shop?.name ?? "Spectrum For Us"}`,
    description: (product.description ?? "").slice(0, 160),
    openGraph: {
      title: product.name,
      description: `${(product.description ?? "").slice(0, 120)} — ${product.price}€`,
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: `Disponible sur Spectrum For Us — ${product.price}€`,
      images: image ? [image] : [],
    },
    alternates: { canonical: `https://spectrumforus.com/produit/${slug}` },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
