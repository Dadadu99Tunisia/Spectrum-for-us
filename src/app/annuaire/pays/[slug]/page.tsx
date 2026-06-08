import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, ArrowUpRight, ArrowLeft } from "lucide-react";
import { COUNTRY_SLUGS, countryFromSlug, orgsByCountry, categoryLabels, slugify } from "@/lib/annuaire";

const BASE = "https://spectrumforus.com";
const T = { ink: "#1A1612", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF3D7F" };

export const dynamicParams = false;
export function generateStaticParams() {
  return COUNTRY_SLUGS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = countryFromSlug(slug);
  if (!country) return {};
  const orgs = orgsByCountry(country);
  const title = `Associations LGBTQIA+ en ${country} (${orgs.length}) · Spectrum For Us`;
  const description = `Annuaire des associations, centres communautaires et ressources LGBTQIA+ en ${country}. ${orgs.length} organisations vérifiées : ${orgs.slice(0, 4).map((o) => o.name).join(", ")}…`;
  const url = `${BASE}/annuaire/pays/${slug}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website" } };
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = countryFromSlug(slug);
  if (!country) notFound();
  const orgs = orgsByCountry(country);
  const flag = orgs[0]?.flag ?? "🏳️‍🌈";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Associations LGBTQIA+ en ${country}`,
    url: `${BASE}/annuaire/pays/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Annuaire", item: `${BASE}/annuaire` },
        { "@type": "ListItem", position: 2, name: country, item: `${BASE}/annuaire/pays/${slug}` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: orgs.length,
      itemListElement: orgs.map((o, i) => ({
        "@type": "ListItem", position: i + 1, name: o.name, url: `${BASE}/annuaire/orga/${o.id}`,
      })),
    },
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen" style={{ background: "#FBF9F5", color: T.ink }}>
        <section className="max-w-6xl mx-auto px-6 md:px-8 pt-28 pb-8">
          <Link href="/annuaire" className="inline-flex items-center gap-1.5 text-[13px] mb-4" style={{ color: T.soft }}>
            <ArrowLeft size={14} /> Annuaire
          </Link>
          <h1 className="font-fraunces leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(30px,5vw,52px)" }}>
            {flag} Associations LGBTQIA+ en {country}
          </h1>
          <p className="max-w-2xl mt-4 text-[15.5px] leading-relaxed" style={{ color: T.soft }}>
            {orgs.length} organisations vérifiées en {country} : associations, centres communautaires,
            santé, droit et hébergement pour les personnes LGBTQIA+. Accès libre et gratuit.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 md:px-8 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgs.map((o) => (
              <Link key={o.id} href={`/annuaire/orga/${o.id}`}
                className="group rounded-2xl p-5 flex flex-col transition-all hover:-translate-y-0.5"
                style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: o.accent + "1A" }}>{o.logo ?? "🏳️‍🌈"}</div>
                  <div className="min-w-0">
                    <h2 className="font-bricolage font-semibold text-[16px] leading-tight truncate">{o.name}</h2>
                    <p className="flex items-center gap-1 text-[13px] mt-0.5" style={{ color: T.soft }}><MapPin size={13} /> {o.city}</p>
                  </div>
                </div>
                <p className="text-[13.5px] leading-relaxed mt-3 line-clamp-3" style={{ color: T.soft }}>{o.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: T.mag }}>Voir la fiche <ArrowUpRight size={14} /></span>
              </Link>
            ))}
          </div>
        </section>

        {/* Autres pays */}
        <section className="max-w-6xl mx-auto px-6 md:px-8 pb-20">
          <h2 className="font-fraunces text-[22px] mb-4">Autres pays</h2>
          <div className="flex flex-wrap gap-2">
            {COUNTRY_SLUGS.filter((c) => c.slug !== slug).map((c) => (
              <Link key={c.slug} href={`/annuaire/pays/${c.slug}`}
                className="rounded-full px-4 py-2 font-hanken text-[14px]"
                style={{ background: "#fff", color: T.soft, boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                {c.country}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
