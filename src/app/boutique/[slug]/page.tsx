import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { MapPin, Package, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { ShopOwnerBar } from "@/components/ShopOwnerBar";
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

  const title       = `${shop.name} — Boutique sur Spectrum For Us`;
  const description = shop.tagline ?? shop.description ?? `Découvrez la boutique ${shop.name} sur Spectrum For Us — la marketplace queer.`;
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

  const [{ data: products }, { data: kyc }] = await Promise.all([
    supabase.from("products")
      .select("id, name, title, price, images, image_url, category, slug, type, quantity")
      .eq("shop_id", shop.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase.from("vendor_kyc")
      .select("kyc_status")
      .eq("shop_id", shop.id)
      .maybeSingle(),
  ]);

  const isVerified   = kyc?.kyc_status === "verified";
  const productList  = products ?? [];
  const logoUrl      = shop.logo_url as string | null;
  const bannerUrl    = shop.banner_url as string | null;
  const contactEmail = shop.contact_email as string | null;
  const ownerId      = shop.owner_id as string;

  const TYPE_LABELS: Record<string, string> = { service: "Service", event: "Événement" };

  return (
    <>
      <div className="hidden md:block"><Header /></div>
      <MobilePageHeader title={shop.name as string} backHref="/decouvrir" />

      {/* Owner edit bar — rendered client-side, only shows if current user = owner */}
      <ShopOwnerBar ownerId={ownerId} shopSlug={slug} />

      <main className="min-h-screen pb-20">

        {/* ── Banner — starts from top, sits behind transparent header ── */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "clamp(220px, 30vw, 320px)" }}
        >
          {bannerUrl ? (
            <img src={bannerUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #F1ECE3 0%, #F1ECE3 40%, #0e1e1f 100%)",
              }}
            >
              {/* Glows */}
              <div className="absolute inset-0 opacity-40"
                style={{ background: "radial-gradient(ellipse at 25% 60%, #FF3D7F30, transparent 55%)" }} />
              <div className="absolute inset-0 opacity-25"
                style={{ background: "radial-gradient(ellipse at 75% 40%, #6D2DB540, transparent 55%)" }} />
              {/* Prism particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="absolute rounded-full opacity-20"
                    style={{
                      width: `${4 + (i % 4) * 3}px`,
                      height: `${4 + (i % 4) * 3}px`,
                      left: `${(i * 31 + 7) % 95}%`,
                      top: `${(i * 17 + 11) % 85}%`,
                      background: ["#FF3D7F", "#6D2DB5", "#1C9C95", "#E0901E"][i % 4],
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Prism line bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />
          {/* Gradient fade at bottom for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: "linear-gradient(to top, #FBF9F5, transparent)" }} />
        </div>

        <div className="max-w-6xl mx-auto px-6">

          {/* ── Shop header — overlaps banner bottom ── */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-14 mb-10 relative z-10">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl border-4 border-[#FBF9F5] overflow-hidden bg-gradient-to-br from-[#FF3D7F]/20 to-[#6D2DB5]/20 flex items-center justify-center shrink-0 shadow-xl shadow-black/30">
              {logoUrl
                ? <img src={logoUrl} alt={shop.name as string} className="w-full h-full object-cover" />
                : <span className="font-fraunces text-4xl text-[#FF3D7F]">{String(shop.name)[0]?.toUpperCase()}</span>
              }
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-fraunces text-3xl md:text-4xl text-[#1A1612]">{shop.name as string}</h1>
                {isVerified && (
                  <span className="flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 border border-[#1C9C95]/40 text-[#1C9C95] rounded-full bg-[#1C9C95]/8">
                    <CheckCircle size={10} /> Vérifié·e
                  </span>
                )}
              </div>
              {shop.tagline && (
                <p className="font-hanken text-[#1A1612]/60 text-base mb-2">{shop.tagline as string}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[#1A1612]/35 uppercase tracking-widest">
                {shop.city && (
                  <span className="flex items-center gap-1"><MapPin size={10} />{shop.city as string}</span>
                )}
                <span className="flex items-center gap-1">
                  <Package size={10} />{productList.length} création{productList.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Contact */}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1A1612]/15 text-[#1A1612]/60 font-hanken text-sm hover:border-[#FF3D7F]/40 hover:text-[#FF3D7F] transition-all duration-200"
              >
                <Mail size={14} /> Contacter
              </a>
            )}
          </div>

          {/* Description */}
          {shop.description && (
            <div className="max-w-2xl mb-10">
              <p className="font-hanken text-[#1A1612]/65 leading-relaxed">{shop.description as string}</p>
            </div>
          )}

          {/* ── Products ── */}
          <h2 className="font-fraunces text-xl text-[#1A1612] mb-5">
            Créations ({productList.length})
          </h2>

          {productList.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 border border-dashed border-[#1A1612]/10 rounded-2xl px-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(255,61,127,0.08)", border: "1px dashed rgba(255,61,127,0.2)" }}>
                <Package size={28} className="text-[#FF3D7F]/40" />
              </div>
              <p className="font-fraunces text-lg text-[#1A1612]/50 mb-2">Bientôt disponible</p>
              <p className="font-hanken text-sm text-[#1A1612]/30 leading-relaxed max-w-xs">
                Cette boutique prépare ses créations. Revenez dans quelques jours ✦
              </p>
              {contactEmail && (
                <a href={`mailto:${contactEmail}`}
                  className="mt-6 font-mono text-[10px] tracking-widest uppercase text-[#FF3D7F]/50 hover:text-[#FF3D7F] transition-colors">
                  Contacter la boutique →
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productList.map((p) => {
                const img   = (p.images as string[] | null)?.[0] ?? (p.image_url as string | null);
                const href  = p.slug ? `/produit/${p.slug}` : "#";
                const name  = String(p.name || p.title || "Produit");
                const ptype = (p.type as string | null) ?? "product";

                return (
                  <Link key={p.id as string} href={href}
                    className="group rounded-2xl border border-[#1A1612]/8 overflow-hidden hover:border-[#FF3D7F]/30 transition-all">
                    <div className="aspect-square bg-[#F1ECE3] relative overflow-hidden">
                      {img ? (
                        <img src={img} alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={28} className="text-[#1A1612]/15" />
                        </div>
                      )}
                      {ptype !== "product" && (
                        <div className="absolute top-2 left-2">
                          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FBF9F5]/80 text-[#E0901E] border border-[#E0901E]/30">
                            {TYPE_LABELS[ptype] ?? ptype}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-hanken text-sm text-[#1A1612] truncate">{name}</p>
                      {p.category && (
                        <p className="font-mono text-[9px] text-[#1A1612]/30 uppercase tracking-wide mt-0.5">
                          {p.category as string}
                        </p>
                      )}
                      <p className="font-fraunces text-base text-[#FF3D7F] mt-1">
                        {Number(p.price).toFixed(2)} €
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <div className="hidden md:block"><Footer /></div>
    </>
  );
}
