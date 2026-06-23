import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { ShopOwnerBar } from "@/components/ShopOwnerBar";
import { BoutiqueView } from "./BoutiqueView";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: shop } = await supabase
    .from("shops")
    .select("name, tagline, description, city")
    .eq("slug", slug)
    .single();

  if (!shop) return {};

  const title       = `${shop.name} · Boutique sur Spectrum For Us`;
  const description = shop.tagline ?? shop.description ?? `Découvrez la boutique ${shop.name} sur Spectrum For Us · la marketplace queer.`;
  const url         = `https://spectrumforus.com/boutique/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Spectrum For Us",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BoutiquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!shop) notFound();

  const [{ data: products }, { data: kyc }, { data: founder }] = await Promise.all([
    supabase.from("products")
      .select("id, name, title, price, images, image_url, category, slug, type, quantity, is_adult")
      .eq("shop_id", shop.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase.from("vendor_kyc")
      .select("kyc_status")
      .eq("shop_id", shop.id)
      .maybeSingle(),
    supabase.from("founder_program_members")
      .select("rank")
      .eq("user_id", shop.owner_id)
      .maybeSingle(),
  ]);

  const isVerified   = kyc?.kyc_status === "verified";
  const founderRank  = founder?.rank as number | undefined;
  const founderStatus: "FOUNDER" | "EARLY_ADOPTER" | "STANDARD" =
    founderRank == null ? "STANDARD" : founderRank <= 20 ? "FOUNDER" : "EARLY_ADOPTER";
  const productList  = products ?? [];
  const contactEmail = shop.contact_email as string | null;
  const ownerId      = shop.owner_id as string;

  return (
    <>
      <div className="hidden md:block"><Header /></div>
      <MobilePageHeader title={shop.name as string} backHref="/decouvrir" />

      {/* Owner edit bar · rendered client-side, only shows if current user = owner */}
      <ShopOwnerBar ownerId={ownerId} shopSlug={slug} />

      <BoutiqueView
        shop={{
          id: shop.id as string,
          name: shop.name as string,
          tagline: (shop.tagline as string | null) ?? null,
          description: (shop.description as string | null) ?? null,
          city: (shop.city as string | null) ?? null,
          is_adult: (shop.is_adult as boolean | null) ?? null,
          logo_url: (shop.logo_url as string | null) ?? null,
          banner_url: (shop.banner_url as string | null) ?? null,
        }}
        productList={productList}
        isVerified={isVerified}
        founderRank={founderRank}
        founderStatus={founderStatus}
        contactEmail={contactEmail}
        ownerId={ownerId}
      />
      <Footer />
    </>
  );
}
