"use client";
import {
  useState, useMemo, useCallback, useRef, useEffect,
} from "react";
import Image from "next/image";
import {
  Search, X, Shuffle, ArrowUpRight, ExternalLink,
  Phone, Globe, Mail, MapPin, Calendar, ChevronRight,
} from "lucide-react";
import { ORGS, CATEGORIES, type OrgCategory, type OrgEntry } from "@/data/annuaire-orgs";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function codeToFlag(code: string) {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join("");
}

function domainFromUrl(url?: string) {
  if (!url) return null;
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

// ─── Logo component — tries clearbit, fallback to emoji ──────────────────────
function OrgLogo({ org, size = 48 }: { org: OrgEntry; size?: number }) {
  const [err, setErr] = useState(false);
  const domain = domainFromUrl(org.website);

  if (!err && domain) {
    return (
      <div
        className="rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-white"
        style={{ width: size, height: size }}
      >
        <Image
          src={`https://logo.clearbit.com/${domain}`}
          alt={`Logo ${org.name}`}
          width={size}
          height={size}
          className="object-contain"
          onError={() => setErr(true)}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl shrink-0 flex items-center justify-center font-bold"
      style={{
        width: size,
        height: size,
        background: `${org.accent}20`,
        border: `1.5px solid ${org.accent}40`,
        fontSize: size * 0.42,
        color: org.accent,
      }}
    >
      {org.logo ?? codeToFlag(org.countryCode)}
    </div>
  );
}

// ─── Org Card ─────────────────────────────────────────────────────────────────
function OrgCard({ org, onClick }: { org: OrgEntry; onClick: () => void }) {
  const catDefs = org.categories.map((c) => CATEGORIES.find((x) => x.value === c)).filter(Boolean);

  return (
    <article
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Voir la fiche : ${org.name}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="group relative rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02] hover:border-[#F3EADB]/20 cursor-pointer outline-none focus-visible:ring-2 transition-all duration-200 overflow-hidden flex flex-col"
      style={{ ["--tw-ring-color" as string]: org.accent }}
    >
      {/* Hero gradient strip */}
      <div
        className="h-1.5 w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${org.accent}, ${org.accent}55, transparent)` }}
      />

      {/* Card header with gradient bg */}
      <div
        className="px-4 pt-4 pb-3 shrink-0"
        style={{ background: `linear-gradient(135deg, ${org.accent}10 0%, transparent 70%)` }}
      >
        <div className="flex items-start gap-3">
          <OrgLogo org={org} size={52} />

          <div className="flex-1 min-w-0">
            <h3 className="font-bricolage font-bold text-[#F3EADB] text-sm leading-snug line-clamp-2">
              {org.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-sm leading-none">{codeToFlag(org.countryCode)}</span>
              <span className="font-mono text-[10px] text-[#F3EADB]/40">{org.city}</span>
              {org.founded && (
                <>
                  <span className="text-[#F3EADB]/15">·</span>
                  <span className="flex items-center gap-0.5 font-mono text-[9px] text-[#F3EADB]/25">
                    <Calendar size={7} />
                    {org.founded}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Visit arrow — always visible */}
          <div
            className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200"
            style={{ background: `${org.accent}20`, color: org.accent }}
          >
            <ChevronRight size={13} />
          </div>
        </div>
      </div>

      {/* Category tags */}
      <div className="px-4 pb-2 flex flex-wrap gap-1 shrink-0">
        {catDefs.map((c) => c && (
          <span
            key={c.value}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-mono"
            style={{ fontSize: 9, background: `${org.accent}12`, color: org.accent, border: `1px solid ${org.accent}22` }}
          >
            <span aria-hidden>{c.emoji}</span>{c.label}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="px-4 pb-3 font-hanken text-xs text-[#F3EADB]/45 leading-relaxed line-clamp-2 flex-1">
        {org.description}
      </p>

      {/* Footer CTA */}
      <div
        className="mx-4 mb-4 flex items-center justify-between gap-2 rounded-xl px-3 py-2 transition-all duration-200"
        style={{ background: `${org.accent}10`, border: `1px solid ${org.accent}20` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {org.phone && (
            <a href={`tel:${org.phone}`} onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: org.accent }}>
              <Phone size={10} />
              <span className="font-mono text-[9px] hidden lg:inline truncate max-w-[90px]">{org.phone}</span>
            </a>
          )}
          {org.website && (
            <a href={org.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity min-w-0"
              style={{ color: org.accent }}>
              <Globe size={10} />
              <span className="font-mono text-[9px] truncate max-w-[110px]">
                {domainFromUrl(org.website)}
              </span>
            </a>
          )}
        </div>
        <span
          className="shrink-0 font-hanken font-semibold text-[10px] flex items-center gap-0.5 transition-all duration-200 group-hover:gap-1"
          style={{ color: org.accent }}
        >
          Voir la fiche <ArrowUpRight size={9} />
        </span>
      </div>
    </article>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function OrgModal({ org, onClose }: { org: OrgEntry; onClose: () => void }) {
  const catDefs = org.categories.map((c) => CATEGORIES.find((x) => x.value === c)).filter(Boolean);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal
      aria-label={`Fiche : ${org.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          background: "#0d0d16",
          border: `1px solid ${org.accent}33`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px ${org.accent}15, 0 0 60px ${org.accent}18`,
        }}
      >
        {/* Accent top bar */}
        <div className="h-1.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${org.accent}, ${org.accent}44)` }} />

        {/* Hero section */}
        <div
          className="px-6 pt-6 pb-5 shrink-0"
          style={{ background: `linear-gradient(135deg, ${org.accent}15 0%, ${org.accent}05 60%, transparent 100%)` }}
        >
          <div className="flex items-start gap-4">
            <OrgLogo org={org} size={64} />

            <div className="flex-1 min-w-0">
              <h2 className="font-bricolage font-bold text-[#F3EADB] text-xl leading-snug">
                {org.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-xs text-[#F3EADB]/45">
                  <MapPin size={10} />{org.city}, {org.country}
                </span>
                {org.founded && (
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[#F3EADB]/30">
                    <Calendar size={9} />Fondée en {org.founded}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {catDefs.map((c) => c && (
                  <span key={c.value}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px]"
                    style={{ background: `${org.accent}15`, color: org.accent, border: `1px solid ${org.accent}30` }}>
                    <span>{c.emoji}</span>{c.label}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={onClose} aria-label="Fermer"
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#F3EADB]/30 hover:text-[#F3EADB] hover:bg-[#F3EADB]/8 transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">

          {/* Description */}
          <p className="font-hanken text-sm text-[#F3EADB]/65 leading-relaxed mb-6">
            {org.description}
          </p>

          {/* Contact cards */}
          <div className="space-y-2.5">
            {org.phone && (
              <a href={`tel:${org.phone}`}
                className="flex items-center gap-4 rounded-2xl px-4 py-3 border transition-all duration-200 hover:border-opacity-60 group"
                style={{ background: `${org.accent}08`, border: `1px solid ${org.accent}20` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${org.accent}18` }}>
                  <Phone size={15} style={{ color: org.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase tracking-widest">Téléphone</p>
                  <p className="font-hanken text-sm text-[#F3EADB]/80 font-medium mt-0.5">{org.phone}</p>
                </div>
                <ExternalLink size={12} className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: org.accent }} />
              </a>
            )}

            {org.email && (
              <a href={`mailto:${org.email}`}
                className="flex items-center gap-4 rounded-2xl px-4 py-3 border transition-all duration-200 group"
                style={{ background: `${org.accent}08`, border: `1px solid ${org.accent}20` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${org.accent}18` }}>
                  <Mail size={15} style={{ color: org.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase tracking-widest">E-mail</p>
                  <p className="font-hanken text-sm text-[#F3EADB]/80 font-medium mt-0.5 truncate">{org.email}</p>
                </div>
                <ExternalLink size={12} className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: org.accent }} />
              </a>
            )}

            {org.website && (
              <a href={org.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl px-4 py-3 border transition-all duration-200 group"
                style={{ background: `${org.accent}08`, border: `1px solid ${org.accent}20` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${org.accent}18` }}>
                  <Globe size={15} style={{ color: org.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-[#F3EADB]/30 uppercase tracking-widest">Site web</p>
                  <p className="font-hanken text-sm text-[#F3EADB]/80 font-medium mt-0.5 truncate">
                    {domainFromUrl(org.website)}
                  </p>
                </div>
                <ExternalLink size={12} className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: org.accent }} />
              </a>
            )}
          </div>

          {/* Primary CTA */}
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-hanken font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${org.accent}, ${org.accent}bb)`, color: "#fff" }}
            >
              Visiter {org.shortName ?? org.name} <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main client ──────────────────────────────────────────────────────────────
export function AnnuaireClient() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<OrgCategory[]>([]);
  const [modalOrg, setModalOrg] = useState<OrgEntry | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const countrySectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") { setSearch(""); setModalOrg(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ORGS.filter((o) => {
      const matchSearch = !q ||
        o.name.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.country.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.categories.some((c) => c.toLowerCase().includes(q));
      const matchCat = selectedCategories.length === 0 ||
        selectedCategories.some((c) => o.categories.includes(c));
      return matchSearch && matchCat;
    });
  }, [search, selectedCategories]);

  const grouped = useMemo(() => {
    const map = new Map<string, { orgs: typeof ORGS; code: string }>();
    filtered.forEach((o) => {
      if (!map.has(o.country)) map.set(o.country, { orgs: [], code: o.countryCode });
      map.get(o.country)!.orgs.push(o);
    });
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([country, { orgs, code }]) => ({ country, code, orgs }));
  }, [filtered]);

  const toggleCategory = useCallback((c: OrgCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }, []);

  const pickRandom = useCallback(() => {
    if (!filtered.length) return;
    const org = filtered[Math.floor(Math.random() * filtered.length)];
    setModalOrg(org);
  }, [filtered]);

  const scrollToCountry = (country: string) => {
    setActiveCountry(country);
    setTimeout(() => {
      countrySectionRefs.current.get(country)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  return (
    <>
      <div className="flex flex-col min-h-0" role="main" aria-label="Annuaire LGBTQIA+">

        {/* ── SEARCH BAR ── */}
        <div className="sticky top-0 z-20 bg-[#0d0d16]/95 backdrop-blur-md border-b border-[#F3EADB]/8 px-5 py-3 flex flex-wrap gap-3 items-center shrink-0">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 pointer-events-none" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Rechercher une organisation, un pays, une ville… ( / )"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher"
              className="w-full pl-8 pr-8 py-2 rounded-xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.04] text-[#F3EADB]/80 placeholder-[#F3EADB]/20 text-sm font-hanken outline-none focus:border-[#E0337E]/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 hover:text-[#E0337E]">
                <X size={13} />
              </button>
            )}
          </div>

          <button onClick={pickRandom} title="Organisation aléatoire"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#F3EADB]/10 text-[#F3EADB]/40 hover:text-[#E0901E] hover:border-[#E0901E]/40 transition-all text-xs font-mono">
            <Shuffle size={13} /><span className="hidden sm:inline">Hasard</span>
          </button>

          <div aria-live="polite" className="font-mono text-xs text-[#F3EADB]/25 tabular-nums shrink-0">
            <span className="text-[#F3EADB]/60 font-semibold">{filtered.length}</span>/{ORGS.length}
          </div>
        </div>

        {/* ── CATEGORY FILTERS ── */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-[#F3EADB]/6 shrink-0">
          <span className="font-mono text-[10px] text-[#F3EADB]/20 uppercase tracking-widest shrink-0">Type</span>
          {CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat.value);
            return (
              <button key={cat.value} onClick={() => toggleCategory(cat.value)} aria-pressed={active}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-hanken border transition-all duration-200"
                style={{
                  borderColor: active ? "#1C9C95" : "rgba(243,234,219,0.10)",
                  color: active ? "#1C9C95" : "rgba(243,234,219,0.45)",
                  background: active ? "#1C9C9518" : "transparent",
                  transform: active ? "scale(1.05)" : "scale(1)",
                }}>
                <span>{cat.emoji}</span>{cat.label}
              </button>
            );
          })}
          {selectedCategories.length > 0 && (
            <button onClick={() => setSelectedCategories([])}
              className="text-xs font-mono text-[#F3EADB]/20 hover:text-[#E0337E] transition-colors ml-1">
              × tout effacer
            </button>
          )}
        </div>

        {/* ── COUNTRY FLAGS ── */}
        {grouped.length > 0 && (
          <div className="px-5 py-3 border-b border-[#F3EADB]/6 shrink-0">
            <div className="flex flex-wrap gap-2">
              {grouped.map(({ country, code, orgs }) => {
                const isActive = activeCountry === country;
                return (
                  <button key={country} onClick={() => scrollToCountry(country)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200"
                    style={{
                      borderColor: isActive ? "#E0337E" : "rgba(243,234,219,0.09)",
                      background: isActive ? "#E0337E12" : "rgba(243,234,219,0.02)",
                      color: isActive ? "#E0337E" : "rgba(243,234,219,0.50)",
                    }}>
                    <span className="text-base leading-none">{codeToFlag(code)}</span>
                    <span className="font-hanken text-xs hidden sm:inline">{country}</span>
                    <span className="font-mono text-[9px] px-1 rounded-full tabular-nums"
                      style={{
                        background: isActive ? "#E0337E22" : "rgba(243,234,219,0.07)",
                        color: isActive ? "#E0337E" : "rgba(243,234,219,0.30)",
                      }}>
                      {orgs.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ORG GRID ── */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span className="text-4xl">🔍</span>
              <p className="font-hanken text-[#F3EADB]/40 text-sm">Aucune organisation pour cette recherche.</p>
              <button onClick={() => { setSearch(""); setSelectedCategories([]); }}
                className="text-xs font-mono text-[#E0337E] hover:underline">Réinitialiser</button>
            </div>
          ) : (
            <div className="space-y-12">
              {grouped.map(({ country, code, orgs }) => (
                <div key={country} ref={(el) => { if (el) countrySectionRefs.current.set(country, el); }}>

                  {/* Country heading */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl leading-none">{codeToFlag(code)}</span>
                    <h2 className="font-bricolage font-bold text-[#F3EADB] text-lg">{country}</h2>
                    <span className="font-mono text-[10px] text-[#F3EADB]/25 px-2 py-0.5 rounded-full bg-[#F3EADB]/5 tabular-nums">
                      {orgs.length} org{orgs.length > 1 ? "s" : ""}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#F3EADB]/10 to-transparent" />
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {orgs.map((org) => (
                      <OrgCard key={org.id} org={org} onClick={() => setModalOrg(org)} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="pt-6 pb-10 text-center border-t border-[#F3EADB]/6 space-y-3">
                <p className="font-mono text-[10px] text-[#F3EADB]/20">
                  {filtered.length} organisations · {grouped.length} pays
                </p>
                <a href="mailto:contact@spectrumforus.com?subject=Référencement annuaire"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E0337E]/60 hover:text-[#E0337E] transition-colors">
                  + Référencer mon organisation <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {modalOrg && <OrgModal org={modalOrg} onClose={() => setModalOrg(null)} />}
    </>
  );
}
