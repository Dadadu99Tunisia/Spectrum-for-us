"use client";
import {
  useState, useMemo, useCallback, useRef, useEffect,
} from "react";
import {
  Search, X, Shuffle, ArrowUpRight, ExternalLink,
  Phone, Globe, Mail, Calendar,
} from "lucide-react";
import { ORGS, CATEGORIES, type OrgCategory, type OrgEntry } from "@/data/annuaire-orgs";

// Derive flag emoji from ISO 3166-1 alpha-2 code
function codeToFlag(code: string) {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join("");
}

// ── Org card (standalone, no OrgCard import) ─────────────────────────────────
function Card({ org, onClick, selected }: { org: OrgEntry; onClick: () => void; selected: boolean }) {
  return (
    <article
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="group relative rounded-2xl border cursor-pointer outline-none focus-visible:ring-2 transition-all duration-200 overflow-hidden"
      style={{
        borderColor: selected ? org.accent : "rgba(243,234,219,0.08)",
        background: selected ? `${org.accent}0d` : "rgba(243,234,219,0.02)",
        boxShadow: selected ? `0 0 0 1px ${org.accent}33, 0 8px 32px ${org.accent}18` : "none",
        // @ts-expect-error CSS custom property
        "--tw-ring-color": org.accent,
      }}
    >
      {/* Accent top bar */}
      <div
        className="h-1 w-full transition-opacity duration-200"
        style={{
          background: `linear-gradient(90deg, ${org.accent}, ${org.accent}44)`,
          opacity: selected ? 1 : 0.4,
        }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl"
            style={{ background: `${org.accent}18`, border: `1px solid ${org.accent}30` }}
            aria-hidden
          >
            {org.logo ?? org.flag}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bricolage font-bold text-[#F3EADB] text-sm leading-tight truncate">
              {org.shortName ?? org.name}
            </h3>
            <p className="font-mono text-[10px] text-[#F3EADB]/35 mt-0.5">
              {org.flag} {org.city}
              {org.founded && <span className="ml-1.5 opacity-60">· {org.founded}</span>}
            </p>
          </div>
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Visiter ${org.name}`}
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[#F3EADB]/8"
              style={{ color: org.accent }}
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {org.categories.map((cat) => {
            const c = CATEGORIES.find((x) => x.value === cat);
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-mono"
                style={{ fontSize: 9, background: `${org.accent}14`, color: org.accent, border: `1px solid ${org.accent}22` }}
              >
                <span aria-hidden>{c?.emoji}</span>
                {c?.label}
              </span>
            );
          })}
        </div>

        {/* Description */}
        <p className="font-hanken text-xs text-[#F3EADB]/45 leading-relaxed mb-3 line-clamp-2">
          {org.description}
        </p>

        {/* Contact */}
        <div className="flex items-center gap-3 flex-wrap">
          {org.phone && (
            <a href={`tel:${org.phone}`} onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 font-mono transition-colors opacity-50 hover:opacity-100"
              style={{ fontSize: 10, color: org.accent }}>
              <Phone size={10} aria-hidden />{org.phone}
            </a>
          )}
          {org.email && (
            <a href={`mailto:${org.email}`} onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 font-mono transition-colors opacity-50 hover:opacity-100 truncate"
              style={{ fontSize: 10, color: org.accent }}>
              <Mail size={10} aria-hidden /><span className="truncate">{org.email}</span>
            </a>
          )}
          {org.website && (
            <a href={org.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 font-mono transition-colors opacity-50 hover:opacity-100 truncate ml-auto"
              style={{ fontSize: 10, color: org.accent }}>
              <Globe size={10} aria-hidden />
              <span className="truncate">{org.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Main client ───────────────────────────────────────────────────────────────
export function AnnuaireClient() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<OrgCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const countrySectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") { setSearch(""); setSelectedId(null); }
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
    setSelectedId(org.id);
    setActiveCountry(org.country);
    setTimeout(() => {
      countrySectionRefs.current.get(org.country)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [filtered]);

  const scrollToCountry = (country: string) => {
    setActiveCountry(country);
    setTimeout(() => {
      countrySectionRefs.current.get(country)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  return (
    <div className="flex flex-col min-h-0" role="main" aria-label="Annuaire LGBTQIA+ Europe">

      {/* ── SEARCH + FILTERS BAR ── */}
      <div className="sticky top-0 z-20 bg-[#0d0d16]/95 backdrop-blur-md border-b border-[#F3EADB]/8 px-5 py-3 flex flex-wrap gap-3 items-center shrink-0">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 pointer-events-none" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            placeholder="Rechercher… ( / )"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher une organisation"
            className="w-full pl-8 pr-8 py-2 rounded-xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.04] text-[#F3EADB]/80 placeholder-[#F3EADB]/20 text-sm font-hanken outline-none focus:border-[#E0337E]/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Effacer" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 hover:text-[#E0337E]">
              <X size={13} />
            </button>
          )}
        </div>

        <button onClick={pickRandom} aria-label="Organisation aléatoire"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#F3EADB]/10 text-[#F3EADB]/40 hover:text-[#E0901E] hover:border-[#E0901E]/40 transition-all text-xs font-mono">
          <Shuffle size={13} /><span className="hidden sm:inline">Hasard</span>
        </button>

        <div aria-live="polite" aria-atomic="true" className="font-mono text-xs text-[#F3EADB]/25 tabular-nums shrink-0">
          <span className="text-[#F3EADB]/60 font-semibold">{filtered.length}</span>/{ORGS.length}
        </div>
      </div>

      {/* ── CATEGORY PILLS ── */}
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
              }}>
              <span aria-hidden>{cat.emoji}</span>{cat.label}
            </button>
          );
        })}
        {selectedCategories.length > 0 && (
          <button onClick={() => setSelectedCategories([])} className="text-xs font-mono text-[#F3EADB]/20 hover:text-[#E0337E] transition-colors">
            × effacer
          </button>
        )}
      </div>

      {/* ── COUNTRY FLAG GRID ── */}
      {grouped.length > 0 && (
        <div className="px-5 py-4 border-b border-[#F3EADB]/6 shrink-0">
          <p className="font-mono text-[10px] text-[#F3EADB]/20 uppercase tracking-widest mb-3">Pays</p>
          <div className="flex flex-wrap gap-2">
            {grouped.map(({ country, code, orgs }) => {
              const isActive = activeCountry === country;
              return (
                <button
                  key={country}
                  onClick={() => scrollToCountry(country)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 group"
                  style={{
                    borderColor: isActive ? "#E0337E" : "rgba(243,234,219,0.09)",
                    background: isActive ? "#E0337E12" : "rgba(243,234,219,0.02)",
                    color: isActive ? "#E0337E" : "rgba(243,234,219,0.55)",
                  }}
                >
                  <span className="text-base leading-none">{codeToFlag(code)}</span>
                  <span className="font-hanken text-xs hidden sm:inline">{country}</span>
                  <span
                    className="font-mono text-[9px] px-1 rounded-full tabular-nums"
                    style={{
                      background: isActive ? "#E0337E22" : "rgba(243,234,219,0.07)",
                      color: isActive ? "#E0337E" : "rgba(243,234,219,0.30)",
                    }}
                  >
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
          <div className="space-y-10">
            {grouped.map(({ country, code, orgs }) => (
              <div
                key={country}
                ref={(el) => { if (el) countrySectionRefs.current.set(country, el); }}
              >
                {/* Country heading */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl leading-none">{codeToFlag(code)}</span>
                  <h2 className="font-bricolage font-bold text-[#F3EADB] text-lg">{country}</h2>
                  <span className="font-mono text-[10px] text-[#F3EADB]/25 px-2 py-0.5 rounded-full bg-[#F3EADB]/5">
                    {orgs.length} org{orgs.length > 1 ? "s" : ""}
                  </span>
                  <div className="flex-1 h-px bg-[#F3EADB]/6" />
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {orgs.map((org) => (
                    <Card
                      key={org.id}
                      org={org}
                      selected={selectedId === org.id}
                      onClick={() => setSelectedId((prev) => prev === org.id ? null : org.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="pt-4 pb-8 text-center border-t border-[#F3EADB]/6">
              <p className="font-mono text-[10px] text-[#F3EADB]/20 mb-3">
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
  );
}
