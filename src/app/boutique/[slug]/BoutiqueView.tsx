"use client";

import { MapPin, Package, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Price } from "@/components/ui/Price";
import { FollowButton } from "@/components/FollowButton";
import { ContactSellerButton } from "@/components/ContactSellerButton";
import { FounderBadge } from "@/components/founder/FounderBadge";
import { ShareButton } from "@/components/ui/ShareButton";
import { useI18n } from "@/contexts/I18nContext";

const CONTENT = {
  fr: {
    verified: "Vérifié·e",
    adult: "🔞 Réservé aux 18+",
    creationsCountSingular: "création",
    creationsCountPlural: "créations",
    creationsHeading: (n: number) => `Créations (${n})`,
    emptyTitle: "Bientôt disponible",
    emptyBody: "Cette boutique prépare ses créations. Revenez dans quelques jours ✦",
    contactShop: "Contacter la boutique →",
    fallbackProduct: "Produit",
    share: "Partager",
    shareText: (name: string) => `Découvre la boutique ${name} sur Spectrum For Us`,
    typeLabels: { service: "Service", event: "Événement" } as Record<string, string>,
  },
  en: {
    verified: "Verified",
    adult: "🔞 18+ only",
    creationsCountSingular: "creation",
    creationsCountPlural: "creations",
    creationsHeading: (n: number) => `Creations (${n})`,
    emptyTitle: "Coming soon",
    emptyBody: "This shop is preparing its creations. Check back in a few days ✦",
    contactShop: "Contact the shop →",
    fallbackProduct: "Product",
    share: "Share",
    shareText: (name: string) => `Check out ${name} on Spectrum For Us`,
    typeLabels: { service: "Service", event: "Event" } as Record<string, string>,
  },
} as const;

type Product = {
  id: string;
  name: string | null;
  title: string | null;
  price: number | null;
  images: string[] | null;
  image_url: string | null;
  category: string | null;
  slug: string | null;
  type: string | null;
  quantity: number | null;
  is_adult: boolean | null;
};

interface BoutiqueViewProps {
  shop: {
    id: string;
    name: string;
    tagline: string | null;
    description: string | null;
    city: string | null;
    is_adult: boolean | null;
    logo_url: string | null;
    banner_url: string | null;
  };
  productList: Product[];
  isVerified: boolean;
  founderRank: number | undefined;
  founderStatus: "FOUNDER" | "EARLY_ADOPTER" | "STANDARD";
  contactEmail: string | null;
  ownerId: string;
}

export function BoutiqueView({
  shop,
  productList,
  isVerified,
  founderRank,
  founderStatus,
  contactEmail,
  ownerId,
}: BoutiqueViewProps) {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];

  const logoUrl = shop.logo_url;
  const bannerUrl = shop.banner_url;

  return (
    <main className="min-h-screen pb-20 bg-[#FBFAF8] text-[#101014]">

      {/* ── Banner · starts from top, sits behind transparent header ── */}
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
                "linear-gradient(135deg, #F1ECE3 0%, #F1ECE3 40%, #F1ECE3 100%)",
            }}
          >
            {/* Glows */}
            <div className="absolute inset-0 opacity-40"
              style={{ background: "radial-gradient(ellipse at 25% 60%, #FF2DA030, transparent 55%)" }} />
            <div className="absolute inset-0 opacity-25"
              style={{ background: "radial-gradient(ellipse at 75% 40%, #7A2BF040, transparent 55%)" }} />
            {/* Prism particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute rounded-full opacity-20"
                  style={{
                    width: `${4 + (i % 4) * 3}px`,
                    height: `${4 + (i % 4) * 3}px`,
                    left: `${(i * 31 + 7) % 95}%`,
                    top: `${(i * 17 + 11) % 85}%`,
                    background: ["#FF2DA0", "#7A2BF0", "#2323C4", "#FFD400"][i % 4],
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {/* Prism line bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg,#2323C4, #7A2BF0, #FF2DA0, #F93C2C, #FFD400)" }} />
        {/* Gradient fade at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20"
          style={{ background: "linear-gradient(to top, #FBFAF8, transparent)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* ── Shop header · overlaps banner bottom ── */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-14 mb-10 relative z-10">
          {/* Logo */}
          <div className="w-24 h-24 rounded-2xl border-4 border-[#FBFAF8] overflow-hidden bg-gradient-to-br from-[#FF2DA0]/20 to-[#7A2BF0]/20 flex items-center justify-center shrink-0 shadow-xl shadow-black/30">
            {logoUrl
              ? <img src={logoUrl} alt={shop.name} className="w-full h-full object-cover" />
              : <span className="font-fraunces text-4xl text-[#FF2DA0]">{String(shop.name)[0]?.toUpperCase()}</span>
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="font-fraunces text-3xl md:text-4xl text-[#101014]">{shop.name}</h1>
              {isVerified && (
                <span className="flex items-center gap-1 font-mono text-[10px] tracking-wide px-2.5 py-1 border border-[#2323C4]/40 text-[#2323C4] rounded-full bg-[#2323C4]/8">
                  <CheckCircle size={10} /> {C.verified}
                </span>
              )}
              {shop.is_adult && (
                <span className="font-mono text-[10px] tracking-wide px-2.5 py-1 border border-[#FF2DA0]/40 text-[#FF2DA0] rounded-full bg-[#FF2DA0]/8">
                  {C.adult}
                </span>
              )}
              {founderStatus !== "STANDARD" && (
                <FounderBadge status={founderStatus} rank={founderRank} size="sm" />
              )}
            </div>
            {shop.tagline && (
              <p className="font-hanken text-[#101014]/60 text-base mb-2">{shop.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[#101014]/35 tracking-wide">
              {shop.city && (
                <span className="flex items-center gap-1"><MapPin size={10} />{shop.city}</span>
              )}
              <span className="flex items-center gap-1">
                <Package size={10} />{productList.length} {productList.length !== 1 ? C.creationsCountPlural : C.creationsCountSingular}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="self-start md:self-auto flex items-center gap-2">
            <FollowButton shopId={shop.id} />
            <ContactSellerButton ownerId={ownerId} shopName={shop.name} />
            <ShareButton title={`${shop.name} · Spectrum For Us`} text={C.shareText(shop.name)}
              label={C.share} iconOnly
              className="w-9 h-9 rounded-full border border-[#101014]/12 text-[#101014]/55 hover:text-[#FF2DA0] transition-colors" />
          </div>
        </div>

        {/* Description */}
        {shop.description && (
          <div className="max-w-2xl mb-10">
            <p className="font-hanken text-[#101014]/65 leading-relaxed">{shop.description}</p>
          </div>
        )}

        {/* ── Products ── */}
        <h2 className="font-fraunces text-xl text-[#101014] mb-5">
          {C.creationsHeading(productList.length)}
        </h2>

        {productList.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 border border-dashed border-[#101014]/10 rounded-2xl px-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(255,61,127,0.08)", border: "1px dashed rgba(255,61,127,0.2)" }}>
              <Package size={28} className="text-[#FF2DA0]/40" />
            </div>
            <p className="font-fraunces text-lg text-[#101014]/50 mb-2">{C.emptyTitle}</p>
            <p className="font-hanken text-sm text-[#101014]/30 leading-relaxed max-w-xs">
              {C.emptyBody}
            </p>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`}
                className="mt-6 font-mono text-[10px] tracking-wide text-[#FF2DA0]/50 hover:text-[#FF2DA0] transition-colors">
                {C.contactShop}
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productList.map((p) => {
              const img   = p.images?.[0] ?? p.image_url;
              const href  = p.slug ? `/produit/${p.slug}` : "#";
              const name  = String(p.name || p.title || C.fallbackProduct);
              const ptype = p.type ?? "product";

              return (
                <Link key={p.id} href={href} className="group">
                  <div className="aspect-square rounded-2xl bg-[#F1ECE3] relative overflow-hidden">
                    {img ? (
                      <img src={img} alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo-dark.png" alt="Spectrum For Us" className="w-full h-full object-contain opacity-25" />
                      </div>
                    )}
                    {p.is_adult && (
                      <span className="absolute top-2 right-2 font-mono text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(16,16,20,.78)", color: "#fff" }}>🔞 18+</span>
                    )}
                    {ptype !== "product" && (
                      <div className="absolute top-2 left-2">
                        <span className="font-mono text-[9px] tracking-wide px-2 py-0.5 rounded-full bg-[#FBFAF8]/80 backdrop-blur-sm text-[#FFD400] border border-[#FFD400]/30">
                          {C.typeLabels[ptype] ?? ptype}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-3">
                    {p.category && (
                      <span className="inline-block font-mono text-[10px] tracking-wide text-[#FF2DA0] mb-1.5">
                        {p.category}
                      </span>
                    )}
                    <p className="font-bricolage font-semibold text-[#101014] text-sm leading-tight line-clamp-2">{name}</p>
                    <Price eur={Number(p.price)} className="font-mono text-sm font-bold text-[#101014] mt-1.5 block" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
