"use client";

/**
 * LightAnnuaire · annuaire LGBTQIA+ en clair minimaliste, au standing de la
 * grille produit : gros sélecteur de pays déroulant, recherche, filtres
 * catégories, et fiches-cartes avec logo (façon carte produit).
 */

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ORGS, COUNTRIES, CATEGORIES, type OrgEntry } from "@/data/annuaire-orgs";
import { slugify, countryFlag } from "@/lib/annuaire";
import { Search, ChevronDown, MapPin, ArrowUpRight, Check, Globe } from "lucide-react";

const T = { bg: "#FBF9F5", ink: "#1A1612", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF3D7F" };

const flagFor = (country: string) => countryFlag(country);

export function LightAnnuaire() {
  const [country, setCountry] = useState<string>("Tous les pays");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("");
  const [open, setOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const o of ORGS) m[o.country] = (m[o.country] ?? 0) + 1;
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ORGS.filter((o) => {
      if (country !== "Tous les pays" && o.country !== country) return false;
      if (cat && !o.categories.includes(cat as OrgEntry["categories"][number])) return false;
      if (q && !(`${o.name} ${o.city} ${o.country} ${o.description}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [country, cat, query]);

  return (
    <div style={{ background: T.bg, color: T.ink }}>
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-28 pb-8">
        <p className="text-[13px] mb-3" style={{ color: T.faint }}>Annuaire LGBTQIA+</p>
        <h1 className="font-fraunces leading-[1] tracking-[-0.02em]" style={{ fontSize: "clamp(34px,5vw,58px)" }}>
          Les associations <span style={{ color: T.mag }}>près de toi.</span>
        </h1>
        <p className="max-w-xl mt-4 text-[15.5px] leading-relaxed" style={{ color: T.soft }}>
          {ORGS.length} organisations vérifiées dans {COUNTRIES.length} pays · associations, centres,
          santé, droit, refuges. Accès libre et gratuit.
        </p>
      </section>

      {/* ── Barre de contrôle : gros sélecteur pays + recherche ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Gros bouton pays déroulant */}
          <div ref={ddRef} className="relative md:w-[300px] shrink-0">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="listbox" aria-expanded={open}
              className="w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-left transition-all"
              style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}
            >
              <span className="text-2xl leading-none">{country === "Tous les pays" ? "🌍" : flagFor(country)}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[11px]" style={{ color: T.faint }}>Pays</span>
                <span className="block font-bricolage font-semibold text-[16px] truncate">{country}</span>
              </span>
              <ChevronDown size={20} style={{ color: T.soft }} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {open && (
              <div role="listbox"
                className="absolute z-30 mt-2 w-full rounded-2xl overflow-hidden max-h-[340px] overflow-y-auto"
                style={{ background: "#fff", boxShadow: "0 12px 40px rgba(26,22,18,.14), inset 0 0 0 1px " + T.line }}>
                {["Tous les pays", ...COUNTRIES].map((c) => {
                  const active = c === country;
                  return (
                    <button key={c} role="option" aria-selected={active}
                      onClick={() => { setCountry(c); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#FBF9F5]"
                      style={active ? { background: "#FBF9F5" } : undefined}>
                      <span className="text-lg leading-none">{c === "Tous les pays" ? "🌍" : flagFor(c)}</span>
                      <span className="flex-1 font-hanken text-[15px]">{c}</span>
                      <span className="font-mono text-[12px]" style={{ color: T.faint }}>
                        {c === "Tous les pays" ? ORGS.length : counts[c]}
                      </span>
                      {active && <Check size={16} style={{ color: T.mag }} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recherche */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: T.faint }} />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une association, une ville…"
              className="w-full rounded-2xl pl-11 pr-4 py-4 text-[15px] outline-none"
              style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }}
            />
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1">
          <Chip active={cat === ""} onClick={() => setCat("")}>Toutes</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.value} active={cat === c.value} onClick={() => setCat(cat === c.value ? "" : c.value)}>
              {c.emoji} {c.label}
            </Chip>
          ))}
        </div>

        <p className="font-hanken text-[13px] mt-4" style={{ color: T.faint }}>
          {filtered.length} organisation{filtered.length > 1 ? "s" : ""}
        </p>
      </section>

      {/* ── Grille de fiches ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-5 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: T.soft }}>
            <Globe size={32} className="mx-auto mb-3" style={{ color: T.faint }} />
            Aucune organisation pour ce filtre.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((o) => (
              <OrgCard key={o.id} o={o} />
            ))}
          </div>
        )}
      </section>

      {/* ── Parcourir par pays (SEO interne) ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pb-20">
        <h2 className="font-fraunces text-[22px] mb-4">Parcourir par pays</h2>
        <div className="flex flex-wrap gap-2">
          {[...new Set(ORGS.map((o) => o.country))].sort().map((c) => (
            <Link key={c} href={`/annuaire/pays/${slugify(c)}`}
              className="rounded-full px-4 py-2 font-hanken text-[14px]"
              style={{ background: "#fff", color: T.soft, boxShadow: `inset 0 0 0 1px ${T.line}` }}>
              {flagFor(c)} {c}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-hanken text-[14px] transition-all"
      style={active
        ? { background: T.ink, color: "#fff" }
        : { background: "#fff", color: T.soft, boxShadow: `inset 0 0 0 1px ${T.line}` }}>
      {children}
    </button>
  );
}

function OrgCard({ o }: { o: OrgEntry }) {
  const catLabels = o.categories
    .map((c) => CATEGORIES.find((x) => x.value === c)?.label)
    .filter(Boolean)
    .slice(0, 2);
  return (
    <div className="group rounded-2xl p-5 flex flex-col transition-all hover:-translate-y-0.5"
      style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
      <div className="flex items-start gap-3.5">
        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: o.accent + "1A" }}>
          {o.logo ?? "🏳️‍🌈"}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/annuaire/orga/${o.id}`} className="font-bricolage font-semibold text-[16.5px] leading-tight truncate block hover:text-[#FF3D7F] transition-colors">{o.name}</Link>
          <p className="flex items-center gap-1 text-[13px] mt-0.5" style={{ color: T.soft }}>
            <MapPin size={13} /> {o.city} <span>{o.flag}</span>
          </p>
        </div>
      </div>

      <p className="text-[13.5px] leading-relaxed mt-3 line-clamp-3 flex-1" style={{ color: T.soft }}>
        {o.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {catLabels.map((l) => (
          <span key={l} className="rounded-full px-2.5 py-1 font-mono text-[10.5px]"
            style={{ background: T.bg, color: o.accent, boxShadow: `inset 0 0 0 1px ${o.accent}33` }}>
            {l}
          </span>
        ))}
        {o.founded && (
          <span className="rounded-full px-2.5 py-1 font-mono text-[10.5px]" style={{ background: T.bg, color: T.faint }}>
            depuis {o.founded}
          </span>
        )}
      </div>

      <Link href={`/annuaire/orga/${o.id}`}
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 font-hanken font-semibold text-[14px] transition-all hover:brightness-95"
        style={{ background: T.ink, color: "#fff" }}>
        Voir la fiche <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}
