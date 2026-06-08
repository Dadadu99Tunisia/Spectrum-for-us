import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, ArrowUpRight, ArrowLeft, Mail, Phone, Globe } from "lucide-react";
import { ORGS, orgById, orgsByCountry, categoryLabels, slugify } from "@/lib/annuaire";

const BASE = "https://spectrumforus.com";
const T = { ink: "#1A1612", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF3D7F" };

export const dynamicParams = false;
export function generateStaticParams() {
  return ORGS.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const o = orgById(id);
  if (!o) return {};
  const cats = categoryLabels(o.categories).join(", ");
  const title = `${o.name} · Association LGBTQIA+ à ${o.city}, ${o.country}`;
  const description = `${o.name} (${o.city}, ${o.country}) : ${o.description}`.slice(0, 300);
  const url = `${BASE}/annuaire/orga/${o.id}`;
  return { title, description, keywords: [o.name, o.city, o.country, "LGBTQIA+", cats], alternates: { canonical: url }, openGraph: { title, description, url, type: "profile" } };
}

export default async function OrgPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = orgById(id);
  if (!o) notFound();
  const cats = categoryLabels(o.categories);
  const related = orgsByCountry(o.country).filter((x) => x.id !== o.id).slice(0, 6);
  const countrySlug = slugify(o.country);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: o.name,
    description: o.description,
    url: o.website || `${BASE}/annuaire/orga/${o.id}`,
    ...(o.website ? { sameAs: [o.website] } : {}),
    ...(o.email ? { email: o.email } : {}),
    ...(o.phone ? { telephone: o.phone } : {}),
    ...(o.founded ? { foundingDate: String(o.founded) } : {}),
    address: { "@type": "PostalAddress", addressLocality: o.city, addressCountry: o.country },
    areaServed: o.country,
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen" style={{ background: "#FBF9F5", color: T.ink }}>
        <section className="max-w-3xl mx-auto px-6 md:px-8 pt-28 pb-6">
          <nav className="flex items-center gap-2 text-[13px] mb-5" style={{ color: T.soft }}>
            <Link href="/annuaire" className="hover:text-[#FF3D7F]">Annuaire</Link>
            <span>/</span>
            <Link href={`/annuaire/pays/${countrySlug}`} className="hover:text-[#FF3D7F]">{o.country}</Link>
          </nav>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: o.accent + "1A" }}>{o.logo ?? "🏳️‍🌈"}</div>
            <div className="min-w-0">
              <h1 className="font-fraunces leading-tight tracking-[-0.01em]" style={{ fontSize: "clamp(26px,4vw,40px)" }}>{o.name}</h1>
              <p className="flex items-center gap-1.5 text-[14px] mt-1" style={{ color: T.soft }}>
                <MapPin size={14} /> {o.city}, {o.country} {o.flag}{o.founded ? ` · depuis ${o.founded}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {cats.map((l) => (
              <span key={l} className="rounded-full px-3 py-1 font-mono text-[11px]" style={{ background: "#fff", color: o.accent, boxShadow: `inset 0 0 0 1px ${o.accent}33` }}>{l}</span>
            ))}
          </div>

          <p className="text-[16px] leading-relaxed mt-6" style={{ color: T.soft }}>{o.description}</p>

          <div className="flex flex-wrap gap-3 mt-7">
            {o.website && (
              <a href={o.website} target="_blank" rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-hanken font-semibold text-[14px] text-white" style={{ background: T.ink }}>
                <Globe size={15} /> Site officiel <ArrowUpRight size={14} />
              </a>
            )}
            {o.email && <a href={`mailto:${o.email}`} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-hanken text-[14px]" style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}><Mail size={15} /> Email</a>}
            {o.phone && <a href={`tel:${o.phone}`} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-hanken text-[14px]" style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}><Phone size={15} /> {o.phone}</a>}
          </div>
        </section>

        {related.length > 0 && (
          <section className="max-w-3xl mx-auto px-6 md:px-8 py-10">
            <h2 className="font-fraunces text-[22px] mb-4">Autres associations en {o.country}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link key={r.id} href={`/annuaire/orga/${r.id}`}
                  className="flex items-center gap-3 rounded-2xl p-4" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: r.accent + "1A" }}>{r.logo ?? "🏳️‍🌈"}</div>
                  <div className="min-w-0">
                    <p className="font-bricolage font-semibold text-[14.5px] truncate">{r.name}</p>
                    <p className="text-[12.5px]" style={{ color: T.faint }}>{r.city}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href={`/annuaire/pays/${countrySlug}`} className="inline-flex items-center gap-1 mt-5 text-[14px] font-semibold" style={{ color: T.mag }}>
              Toutes les associations en {o.country} <ArrowUpRight size={14} />
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
