"use client";
import {
  useState, useMemo, useCallback, useRef, useEffect,
} from "react";
import Image from "next/image";
import {
  Search, X, SlidersHorizontal, ExternalLink,
  Phone, Globe, Mail, MapPin, Calendar,
  ChevronDown, ChevronRight, Shuffle, ArrowUpRight,
} from "lucide-react";
import { ORGS, CATEGORIES, type OrgCategory, type OrgEntry } from "@/data/annuaire-orgs";

// ─── Overrides ────────────────────────────────────────────────────────────────
type Override = {
  org_id: string;
  logo_url?: string | null;
  custom_name?: string | null;
  custom_desc?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  accent?: string | null;
  is_featured?: boolean;
  is_hidden?: boolean;
};

function useOverrides() {
  const [overrides, setOverrides] = useState<Map<string, Override>>(new Map());
  useEffect(() => {
    fetch("/api/annuaire/overrides")
      .then(r => r.json())
      .then(({ data }: { data: Override[] }) => {
        const map = new Map<string, Override>();
        for (const o of data ?? []) map.set(o.org_id, o);
        setOverrides(map);
      })
      .catch(() => {});
  }, []);
  return overrides;
}

function applyOverride(org: OrgEntry, ov: Override | undefined): OrgEntry {
  if (!ov) return org;
  return {
    ...org,
    name:        ov.custom_name  ?? org.name,
    description: ov.custom_desc  ?? org.description,
    website:     ov.website      ?? org.website,
    phone:       ov.phone        ?? org.phone,
    email:       ov.email        ?? org.email,
    accent:      ov.accent       ?? org.accent,
    logo:        ov.logo_url     ?? org.logo,
  };
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function codeToFlag(code: string) {
  return [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("");
}
function domain(url?: string) {
  if (!url) return null;
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function OrgLogo({ org, size = 52 }: { org: OrgEntry; size?: number }) {
  const [err, setErr] = useState(false);
  // org.logo may be an override URL (absolute) or clearbit domain, or emoji fallback
  const customUrl = org.logo?.startsWith("http") ? org.logo : null;
  const d = domain(org.website);
  const radius = Math.round(size * 0.28);
  const imgSrc = customUrl ?? (d ? `https://logo.clearbit.com/${d}` : null);
  if (!err && imgSrc) return (
    <div className="shrink-0 bg-white flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size, borderRadius: radius }}>
      <Image src={imgSrc} alt={`Logo ${org.name}`}
        width={size} height={size} className="object-contain" onError={() => setErr(true)} unoptimized />
    </div>
  );
  return (
    <div className="shrink-0 flex items-center justify-center font-bold"
      style={{ width: size, height: size, borderRadius: radius, background: `${org.accent}22`, border: `1.5px solid ${org.accent}44`, fontSize: size * 0.38, color: org.accent }}>
      {org.logo ?? codeToFlag(org.countryCode)}
    </div>
  );
}

// ─── Card (horizontal) ────────────────────────────────────────────────────────
function Card({ org, onClick }: { org: OrgEntry; onClick: () => void }) {
  const cats = org.categories.map(c => CATEGORIES.find(x => x.value === c)).filter(Boolean);
  return (
    <article onClick={onClick} tabIndex={0} role="button" aria-label={`Voir : ${org.name}`}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="group flex gap-4 rounded-2xl border border-[#F3EADB]/8 bg-[#0d0a1a] hover:bg-[#110e20] hover:border-[#F3EADB]/16 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 p-4"
      style={{ ["--tw-ring-color" as string]: org.accent }}
    >
      {/* Left: logo + accent bar */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <OrgLogo org={org} size={56} />
        <div className="w-1 flex-1 rounded-full min-h-[20px]" style={{ background: `${org.accent}30` }} />
      </div>

      {/* Right: content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Name + arrow */}
        <div className="flex items-start gap-2">
          <h3 className="font-bricolage font-bold text-[#F3EADB] text-sm leading-snug flex-1 min-w-0">
            {org.name}
          </h3>
          <ChevronRight size={14} className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
            style={{ color: org.accent }} />
        </div>

        {/* Location + founded */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 font-mono text-[10px] text-[#F3EADB]/40">
            <MapPin size={9} style={{ color: org.accent }} />
            {codeToFlag(org.countryCode)} {org.city}, {org.country}
          </span>
          {org.founded && (
            <span className="flex items-center gap-0.5 font-mono text-[9px] text-[#F3EADB]/20">
              <Calendar size={8} />{org.founded}
            </span>
          )}
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1">
          {cats.map(c => c && (
            <span key={c.value} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-mono"
              style={{ fontSize: 9, background: `${org.accent}14`, color: org.accent, border: `1px solid ${org.accent}25` }}>
              <span>{c.emoji}</span>{c.label}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="font-hanken text-[11px] text-[#F3EADB]/40 leading-relaxed line-clamp-2">
          {org.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-3">
            {org.phone && (
              <a href={`tel:${org.phone}`} onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 font-mono text-[9px] opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: org.accent }}>
                <Phone size={9} /><span className="hidden sm:inline">{org.phone}</span>
              </a>
            )}
            {org.website && (
              <a href={org.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 font-mono text-[9px] opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: org.accent }}>
                <Globe size={9} />{domain(org.website)}
              </a>
            )}
          </div>
          <span className="font-hanken text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"
            style={{ color: org.accent }}>
            Voir la fiche <ArrowUpRight size={9} />
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function OrgModal({ org, onClose }: { org: OrgEntry; onClose: () => void }) {
  const cats = org.categories.map(c => CATEGORIES.find(x => x.value === c)).filter(Boolean);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ background: "#0d0a1a", border: `1px solid ${org.accent}35`, boxShadow: `0 40px 100px rgba(0,0,0,0.9), 0 0 80px ${org.accent}15` }}>

        {/* Gradient header */}
        <div className="relative shrink-0 px-6 pt-7 pb-6 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${org.accent}18 0%, ${org.accent}08 50%, transparent 100%)` }}>
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl sm:rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${org.accent}, ${org.accent}55, transparent)` }} />

          <div className="flex items-start gap-4">
            <OrgLogo org={org} size={68} />
            <div className="flex-1 min-w-0">
              <h2 className="font-bricolage font-bold text-[#F3EADB] text-xl leading-tight">{org.name}</h2>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-xs text-[#F3EADB]/40">
                  <MapPin size={10} />{org.city}, {org.country}
                </span>
                {org.founded && (
                  <span className="font-mono text-[10px] text-[#F3EADB]/25">· Fondée en {org.founded}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {cats.map(c => c && (
                  <span key={c.value} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px]"
                    style={{ background: `${org.accent}18`, color: org.accent, border: `1px solid ${org.accent}33` }}>
                    {c.emoji} {c.label}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={onClose} aria-label="Fermer"
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#F3EADB]/30 hover:text-[#F3EADB] hover:bg-[#F3EADB]/8 transition-all">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 pb-8 space-y-5">
          <p className="font-hanken text-sm text-[#F3EADB]/65 leading-relaxed">
            {org.description}
          </p>

          <div className="space-y-2.5">
            {org.phone && (
              <a href={`tel:${org.phone}`}
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all group"
                style={{ background: `${org.accent}07`, border: `1px solid ${org.accent}20` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${org.accent}1a` }}>
                  <Phone size={16} style={{ color: org.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] text-[#F3EADB]/25 tracking-wide mb-0.5">Téléphone</p>
                  <p className="font-hanken text-sm text-[#F3EADB]/80 font-medium">{org.phone}</p>
                </div>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-50 transition-opacity shrink-0" style={{ color: org.accent }} />
              </a>
            )}
            {org.email && (
              <a href={`mailto:${org.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all group"
                style={{ background: `${org.accent}07`, border: `1px solid ${org.accent}20` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${org.accent}1a` }}>
                  <Mail size={16} style={{ color: org.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] text-[#F3EADB]/25 tracking-wide mb-0.5">E-mail</p>
                  <p className="font-hanken text-sm text-[#F3EADB]/80 font-medium truncate">{org.email}</p>
                </div>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-50 transition-opacity shrink-0" style={{ color: org.accent }} />
              </a>
            )}
            {org.website && (
              <a href={org.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all group"
                style={{ background: `${org.accent}07`, border: `1px solid ${org.accent}20` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${org.accent}1a` }}>
                  <Globe size={16} style={{ color: org.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] text-[#F3EADB]/25 tracking-wide mb-0.5">Site web</p>
                  <p className="font-hanken text-sm text-[#F3EADB]/80 font-medium truncate">{domain(org.website)}</p>
                </div>
                <ExternalLink size={11} className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: org.accent }} />
              </a>
            )}
          </div>

          {org.website && (
            <a href={org.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-hanken font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.99]"
              style={{ background: `linear-gradient(135deg, ${org.accent}ee, ${org.accent}99)`, color: "#fff" }}>
              Visiter {org.shortName ?? org.name} <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar filter section ───────────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#F3EADB]/6 pb-4 mb-4">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full mb-3 group">
        <span className="font-mono text-[10px] tracking-wide text-[#F3EADB]/35 group-hover:text-[#F3EADB]/60 transition-colors">{title}</span>
        <ChevronDown size={12} className="text-[#F3EADB]/20 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type SortKey = "name" | "country" | "founded";

export function AnnuaireClient() {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<OrgCategory[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("country");
  const [modalOrg, setModalOrg] = useState<OrgEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreCountries, setShowMoreCountries] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const overrides = useOverrides();

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape") { setSearch(""); setModalOrg(null); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Merge overrides into static org data, hide hidden orgs, feature first
  const mergedOrgs = useMemo(() => {
    const list = ORGS
      .filter(o => !overrides.get(o.id)?.is_hidden)
      .map(o => applyOverride(o, overrides.get(o.id)));
    list.sort((a, b) => {
      const af = overrides.get(a.id)?.is_featured ? 0 : 1;
      const bf = overrides.get(b.id)?.is_featured ? 0 : 1;
      return af - bf;
    });
    return list;
  }, [overrides]);

  const allCountries = useMemo(() =>
    [...new Set(mergedOrgs.map(o => o.country))].sort(), [mergedOrgs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = mergedOrgs.filter(o => {
      const ms = !q || o.name.toLowerCase().includes(q) || o.city.toLowerCase().includes(q)
        || o.country.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
        || o.categories.some(c => c.toLowerCase().includes(q));
      const mc = selectedCats.length === 0 || selectedCats.some(c => o.categories.includes(c));
      const mk = selectedCountries.length === 0 || selectedCountries.includes(o.country);
      return ms && mc && mk;
    });
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "founded") list = [...list].sort((a, b) => (a.founded ?? 9999) - (b.founded ?? 9999));
    else list = [...list].sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));
    return list;
  }, [search, selectedCats, selectedCountries, sort]);

  const grouped = useMemo(() => {
    if (sort !== "country") return null;
    const map = new Map<string, { orgs: typeof ORGS; code: string }>();
    filtered.forEach(o => {
      if (!map.has(o.country)) map.set(o.country, { orgs: [], code: o.countryCode });
      map.get(o.country)!.orgs.push(o);
    });
    return [...map.entries()].map(([country, { orgs, code }]) => ({ country, code, orgs }));
  }, [filtered, sort]);

  const toggleCat = useCallback((c: OrgCategory) => {
    setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }, []);
  const toggleCountry = useCallback((c: string) => {
    setSelectedCountries(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }, []);

  const activeFilters = selectedCats.length + selectedCountries.length;
  const resetAll = () => { setSearch(""); setSelectedCats([]); setSelectedCountries([]); };

  const pickRandom = useCallback(() => {
    if (!filtered.length) return;
    setModalOrg(filtered[Math.floor(Math.random() * filtered.length)]);
  }, [filtered]);

  const visibleCountries = showMoreCountries ? allCountries : allCountries.slice(0, 12);

  return (
    <>
      <div className="flex min-h-0 h-full">

        {/* ── SIDEBAR ── */}
        <aside className={`
          ${showFilters ? "flex" : "hidden"} md:flex
          flex-col w-full md:w-72 lg:w-80 shrink-0
          border-r border-[#F3EADB]/8
          bg-[#080612] overflow-y-auto
          absolute md:relative inset-0 z-30 md:z-auto
        `}>
          <div className="p-5">
            {/* Sidebar header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#E0337E]" />
                <span className="font-bricolage font-bold text-[#F3EADB] text-sm">Filtres</span>
                {activeFilters > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#E0337E] text-white font-mono text-[9px] tabular-nums">
                    {activeFilters}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFilters > 0 && (
                  <button onClick={resetAll} className="font-mono text-[10px] text-[#E0337E]/70 hover:text-[#E0337E] transition-colors">
                    Tout effacer
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className="md:hidden text-[#F3EADB]/30 hover:text-[#F3EADB]">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/25 pointer-events-none" />
              <input ref={searchRef} type="search" placeholder="Rechercher… ( / )"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.04] text-[#F3EADB]/80 placeholder-[#F3EADB]/20 text-sm font-hanken outline-none focus:border-[#E0337E]/50 transition-all" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 hover:text-[#E0337E]">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category filter */}
            <FilterSection title="Type d'organisation">
              <div className="space-y-1.5">
                {CATEGORIES.map(cat => {
                  const active = selectedCats.includes(cat.value);
                  const count = mergedOrgs.filter(o => o.categories.includes(cat.value)).length;
                  return (
                    <button key={cat.value} onClick={() => toggleCat(cat.value)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 group text-left"
                      style={{
                        background: active ? `${cat.value === "association" ? "#E0337E" : "#1C9C95"}15` : "transparent",
                        border: `1px solid ${active ? (cat.value === "association" ? "#E0337E" : "#1C9C95") + "40" : "transparent"}`,
                      }}>
                      <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-sm"
                        style={{ background: active ? "#1C9C9520" : "rgba(243,234,219,0.06)" }}>
                        {cat.emoji}
                      </span>
                      <span className="flex-1 font-hanken text-xs" style={{ color: active ? "#F3EADB" : "rgba(243,234,219,0.50)" }}>
                        {cat.label}
                      </span>
                      <span className="font-mono text-[9px] tabular-nums" style={{ color: active ? "#1C9C95" : "rgba(243,234,219,0.20)" }}>
                        {count}
                      </span>
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1C9C95] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {/* Country filter */}
            <FilterSection title="Pays">
              <div className="space-y-1">
                {visibleCountries.map(c => {
                  const active = selectedCountries.includes(c);
                  const code = mergedOrgs.find(o => o.country === c)?.countryCode ?? "";
                  const count = mergedOrgs.filter(o => o.country === c).length;
                  return (
                    <button key={c} onClick={() => toggleCountry(c)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all text-left"
                      style={{
                        background: active ? "#E0337E12" : "transparent",
                        border: `1px solid ${active ? "#E0337E40" : "transparent"}`,
                      }}>
                      <span className="text-base leading-none w-6 text-center shrink-0">{codeToFlag(code)}</span>
                      <span className="flex-1 font-hanken text-xs truncate" style={{ color: active ? "#F3EADB" : "rgba(243,234,219,0.50)" }}>
                        {c}
                      </span>
                      <span className="font-mono text-[9px] tabular-nums shrink-0" style={{ color: active ? "#E0337E" : "rgba(243,234,219,0.20)" }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
                {allCountries.length > 12 && (
                  <button onClick={() => setShowMoreCountries(v => !v)}
                    className="w-full text-center font-mono text-[10px] text-[#F3EADB]/25 hover:text-[#F3EADB]/60 transition-colors py-1.5">
                    {showMoreCountries ? "- Voir moins" : `+ ${allCountries.length - 12} pays`}
                  </button>
                )}
              </div>
            </FilterSection>

            {/* Random */}
            <button onClick={pickRandom}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#F3EADB]/10 font-hanken text-xs text-[#F3EADB]/40 hover:text-[#E0901E] hover:border-[#E0901E]/40 transition-all">
              <Shuffle size={13} /> Découvrir une organisation
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Topbar */}
          <div className="sticky top-0 z-10 bg-[#0d0d16]/95 backdrop-blur-md border-b border-[#F3EADB]/8 px-5 py-3 flex items-center gap-3 shrink-0">
            {/* Mobile filter toggle */}
            <button onClick={() => setShowFilters(v => !v)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#F3EADB]/10 text-[#F3EADB]/50 hover:text-[#E0337E] hover:border-[#E0337E]/40 transition-all text-xs font-mono shrink-0">
              <SlidersHorizontal size={13} />
              {activeFilters > 0 && <span className="text-[#E0337E]">{activeFilters}</span>}
            </button>

            {/* Result count */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bricolage font-bold text-[#F3EADB] text-sm tabular-nums">{filtered.length}</span>
              <span className="font-hanken text-xs text-[#F3EADB]/35 truncate">
                organisation{filtered.length > 1 ? "s" : ""}
                {selectedCountries.length > 0 && ` · ${selectedCountries.length} pays`}
                {selectedCats.length > 0 && ` · ${selectedCats.length} type${selectedCats.length > 1 ? "s" : ""}`}
              </span>
            </div>

            {/* Active filter chips */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-none">
              {search && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#E0337E]/15 border border-[#E0337E]/30 font-mono text-[10px] text-[#E0337E] shrink-0">
                  "{search}"
                  <button onClick={() => setSearch("")}><X size={9} /></button>
                </span>
              )}
              {selectedCats.map(c => {
                const cat = CATEGORIES.find(x => x.value === c);
                return cat && (
                  <span key={c} className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1C9C95]/15 border border-[#1C9C95]/30 font-mono text-[10px] text-[#1C9C95] shrink-0">
                    {cat.emoji} {cat.label}
                    <button onClick={() => toggleCat(c)}><X size={9} /></button>
                  </span>
                );
              })}
              {selectedCountries.map(c => (
                <span key={c} className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#CF3F7C]/15 border border-[#CF3F7C]/30 font-mono text-[10px] text-[#CF3F7C] shrink-0">
                  {codeToFlag(mergedOrgs.find(o => o.country === c)?.countryCode ?? "")} {c}
                  <button onClick={() => toggleCountry(c)}><X size={9} /></button>
                </span>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1 shrink-0 border border-[#F3EADB]/10 rounded-xl overflow-hidden">
              {([["country", "Pays"], ["name", "A-Z"], ["founded", "Ancienneté"]] as [SortKey, string][]).map(([k, label]) => (
                <button key={k} onClick={() => setSort(k)}
                  className="px-2.5 py-1.5 font-mono text-[10px] transition-all"
                  style={{
                    background: sort === k ? "#E0337E18" : "transparent",
                    color: sort === k ? "#E0337E" : "rgba(243,234,219,0.30)",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
                <span className="text-4xl">🔍</span>
                <p className="font-hanken text-[#F3EADB]/40 text-sm">Aucune organisation pour cette recherche.</p>
                <button onClick={resetAll} className="text-xs font-mono text-[#E0337E] hover:underline">
                  Réinitialiser les filtres
                </button>
              </div>
            ) : sort === "country" && grouped ? (
              <div className="p-5 space-y-10">
                {grouped.map(({ country, code, orgs }) => (
                  <div key={country}>
                    <div className="flex items-center gap-3 mb-4 sticky top-0 py-2 bg-[#0d0d16]/95 backdrop-blur-sm -mx-5 px-5 z-[5]">
                      <span className="text-xl leading-none">{codeToFlag(code)}</span>
                      <h2 className="font-bricolage font-bold text-[#F3EADB] text-base">{country}</h2>
                      <span className="font-mono text-[10px] text-[#F3EADB]/25 px-2 py-0.5 rounded-full bg-[#F3EADB]/5 tabular-nums">
                        {orgs.length}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-[#F3EADB]/8 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      {orgs.map(org => <Card key={org.id} org={org} onClick={() => setModalOrg(org)} />)}
                    </div>
                  </div>
                ))}
                <Footer count={filtered.length} groupCount={grouped.length} />
              </div>
            ) : (
              <div className="p-5">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {filtered.map(org => <Card key={org.id} org={org} onClick={() => setModalOrg(org)} />)}
                </div>
                <Footer count={filtered.length} />
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOrg && <OrgModal org={modalOrg} onClose={() => setModalOrg(null)} />}
    </>
  );
}

function Footer({ count, groupCount }: { count: number; groupCount?: number }) {
  return (
    <div className="pt-6 pb-10 text-center border-t border-[#F3EADB]/6 space-y-2 mt-4">
      <p className="font-mono text-[10px] text-[#F3EADB]/20">
        {count} organisations{groupCount ? ` · ${groupCount} pays` : ""}
      </p>
      <a href="mailto:contact@spectrumforus.com?subject=Référencement annuaire"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E0337E]/50 hover:text-[#E0337E] transition-colors">
        + Référencer mon organisation <ArrowUpRight size={11} />
      </a>
    </div>
  );
}
