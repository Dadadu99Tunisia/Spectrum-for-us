"use client";
import {
  useState, useMemo, useCallback, lazy, Suspense, useRef, useEffect,
} from "react";
import {
  Search, X, MapPin, List, LayoutGrid, Globe, Phone,
  ChevronDown, Shuffle, ArrowUpRight,
} from "lucide-react";
import { ORGS, CATEGORIES, type OrgCategory } from "@/data/annuaire-orgs";
import { OrgCard } from "./OrgCard";

const AnnuaireMap = lazy(() =>
  import("./AnnuaireMap").then((m) => ({ default: m.AnnuaireMap }))
);

type View = "split" | "list" | "map";

export function AnnuaireClient() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<OrgCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [view, setView] = useState<View>("split");
  const [showAllCountries, setShowAllCountries] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearch("");
        setSelectedId(null);
      }
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

  // Group filtered orgs by country
  const grouped = useMemo(() => {
    const map = new Map<string, typeof ORGS>();
    filtered.forEach((o) => {
      if (!map.has(o.country)) map.set(o.country, []);
      map.get(o.country)!.push(o);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  // Countries with counts for filter pills
  const countryCounts = useMemo(() => {
    const map = new Map<string, { count: number; flag: string }>();
    filtered.forEach((o) => {
      if (!map.has(o.country)) map.set(o.country, { count: 0, flag: o.flag });
      map.get(o.country)!.count++;
    });
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [filtered]);

  const visibleCountries = showAllCountries ? countryCounts : countryCounts.slice(0, 8);

  const toggleCategory = useCallback((c: OrgCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }, []);

  // Pick a random org
  const pickRandom = useCallback(() => {
    if (filtered.length === 0) return;
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setSelectedId(random.id);
    if (view === "list") setView("split");
  }, [filtered, view]);

  // Scroll list to selected card
  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => prev === id ? null : id);
    // Scroll card into view
    setTimeout(() => {
      const el = cardRefs.current.get(id);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  }, []);

  const selectedOrg = useMemo(() => ORGS.find((o) => o.id === selectedId) ?? null, [selectedId]);
  const activeFilterCount = selectedCategories.length;

  return (
    <div className="flex flex-col h-full" role="main" aria-label="Annuaire LGBTQIA+ Europe">

      {/* ── TOP BAR ── */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-[#F3EADB]/8 shrink-0">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 pointer-events-none" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            placeholder='Rechercher… (/ pour chercher)'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher une organisation"
            className="w-full pl-8 pr-8 py-2 rounded-xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.04] text-[#F3EADB]/80 placeholder-[#F3EADB]/20 text-sm font-hanken outline-none focus:border-[#E0337E]/50 focus:ring-1 focus:ring-[#E0337E]/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 hover:text-[#E0337E] transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Random */}
        <button
          onClick={pickRandom}
          title="Organisation aléatoire"
          aria-label="Découvrir une organisation au hasard"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#F3EADB]/10 text-[#F3EADB]/50 hover:text-[#E0901E] hover:border-[#E0901E]/40 transition-all text-xs font-mono"
        >
          <Shuffle size={13} />
          <span className="hidden sm:inline">Aléatoire</span>
        </button>

        {/* Result count */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="font-mono text-xs text-[#F3EADB]/30 px-1 shrink-0 tabular-nums"
        >
          <span className="text-[#F3EADB]/70 font-semibold">{filtered.length}</span>
          <span> / {ORGS.length}</span>
        </div>

        {/* View switcher */}
        <div
          className="flex items-center border border-[#F3EADB]/10 rounded-xl overflow-hidden shrink-0"
          role="group"
          aria-label="Mode d'affichage"
        >
          {([
            { v: "split" as View, icon: <LayoutGrid size={13} />, label: "Vue mixte" },
            { v: "list" as View, icon: <List size={13} />, label: "Vue liste" },
            { v: "map" as View, icon: <MapPin size={13} />, label: "Vue carte" },
          ]).map(({ v, icon, label }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={label}
              aria-pressed={view === v}
              className="px-3 py-2 transition-all"
              style={{
                background: view === v ? "#E0337E18" : "transparent",
                color: view === v ? "#E0337E" : "rgba(243,234,219,0.35)",
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-[#F3EADB]/6 shrink-0">
        <span className="font-mono text-[10px] text-[#F3EADB]/25 uppercase tracking-widest shrink-0">Type</span>
        {CATEGORIES.map((cat) => {
          const active = selectedCategories.includes(cat.value);
          return (
            <button
              key={cat.value}
              onClick={() => toggleCategory(cat.value)}
              aria-pressed={active}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-hanken border transition-all duration-200"
              style={{
                borderColor: active ? "#1C9C95" : "rgba(243,234,219,0.10)",
                color: active ? "#1C9C95" : "rgba(243,234,219,0.50)",
                background: active ? "#1C9C9518" : "transparent",
                transform: active ? "scale(1.04)" : "scale(1)",
              }}
            >
              <span aria-hidden>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
        {activeFilterCount > 0 && (
          <button
            onClick={() => setSelectedCategories([])}
            className="text-xs font-mono text-[#F3EADB]/25 hover:text-[#E0337E] transition-colors ml-1"
            aria-label="Effacer les filtres"
          >
            × tout effacer
          </button>
        )}
      </div>

      {/* ── COUNTRY PILLS ── */}
      {countryCounts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-[#F3EADB]/6 shrink-0">
          <span className="font-mono text-[10px] text-[#F3EADB]/25 uppercase tracking-widest shrink-0">Pays</span>
          {visibleCountries.map(([country, { count, flag }]) => (
            <button
              key={country}
              onClick={() => {
                setSearch(country);
                searchRef.current?.focus();
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-hanken border border-[#F3EADB]/8 text-[#F3EADB]/45 hover:border-[#CF3F7C]/40 hover:text-[#CF3F7C] transition-all"
              title={`Filtrer : ${country}`}
            >
              <span>{flag}</span>
              <span className="hidden sm:inline">{country}</span>
              <span className="ml-0.5 text-[9px] opacity-60">({count})</span>
            </button>
          ))}
          {countryCounts.length > 8 && (
            <button
              onClick={() => setShowAllCountries((v) => !v)}
              className="flex items-center gap-1 text-[11px] font-mono text-[#F3EADB]/25 hover:text-[#F3EADB]/60 transition-colors"
            >
              {showAllCountries ? "− moins" : `+ ${countryCounts.length - 8} pays`}
              <ChevronDown size={10} style={{ transform: showAllCountries ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
          )}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-hidden flex min-h-0">

        {/* LIST PANEL */}
        {(view === "split" || view === "list") && (
          <div
            ref={listRef}
            className="overflow-y-auto shrink-0 flex flex-col"
            style={{ width: view === "list" ? "100%" : "clamp(300px, 35%, 420px)" }}
            role="list"
            aria-label="Liste des organisations"
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 px-6 text-center">
                <span className="text-3xl">🔍</span>
                <p className="font-hanken text-[#F3EADB]/40 text-sm">
                  Aucune organisation pour cette recherche.
                </p>
                <button
                  onClick={() => { setSearch(""); setSelectedCategories([]); }}
                  className="text-xs font-mono text-[#E0337E] hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="p-3 space-y-6">
                {grouped.map(([country, orgs]) => (
                  <div key={country} role="group" aria-label={country}>
                    {/* Country header */}
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <span className="text-base">{orgs[0].flag}</span>
                      <span className="font-mono text-[10px] text-[#F3EADB]/30 uppercase tracking-widest">{country}</span>
                      <span className="font-mono text-[9px] text-[#F3EADB]/20">({orgs.length})</span>
                      <div className="flex-1 h-px bg-[#F3EADB]/6" />
                    </div>
                    {/* Org cards */}
                    <div className="space-y-2">
                      {orgs.map((org) => (
                        <div
                          key={org.id}
                          ref={(el) => { if (el) cardRefs.current.set(org.id, el); }}
                          role="listitem"
                        >
                          <OrgCard
                            org={org}
                            selected={selectedId === org.id}
                            hovered={hoveredId === org.id}
                            compact={view === "split"}
                            onClick={() => handleSelect(org.id)}
                            onHover={(id) => setHoveredId(id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div className="pt-4 pb-2 text-center">
                  <p className="font-mono text-[10px] text-[#F3EADB]/20">
                    {filtered.length} organisations · {grouped.length} pays
                  </p>
                  <a
                    href="mailto:contact@spectrumforus.com?subject=Référencement annuaire"
                    className="inline-flex items-center gap-1 mt-2 text-[11px] font-mono text-[#E0337E]/60 hover:text-[#E0337E] transition-colors"
                  >
                    + Référencer mon organisation <ArrowUpRight size={10} />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DIVIDER */}
        {view === "split" && (
          <div className="w-px bg-[#F3EADB]/6 shrink-0" />
        )}

        {/* MAP PANEL */}
        {(view === "split" || view === "map") && (
          <div className="flex-1 p-3 min-w-0 relative">
            <Suspense fallback={
              <div className="w-full h-full rounded-xl flex items-center justify-center" style={{ background: "#0a0814" }}>
                <span className="font-mono text-xs text-[#F3EADB]/30 animate-pulse">Chargement de la carte…</span>
              </div>
            }>
              <AnnuaireMap
                orgs={filtered}
                selected={selectedId}
                hovered={hoveredId}
                onSelect={handleSelect}
                onHover={(id) => setHoveredId(id)}
              />
            </Suspense>

            {/* Map hint */}
            {!selectedId && view === "map" && (
              <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-[10px] font-mono text-[#F3EADB]/40 pointer-events-none"
                style={{ background: "rgba(10,8,20,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(243,234,219,0.08)" }}>
                Clique sur un marqueur
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SELECTED ORG BOTTOM BAR (mobile) ── */}
      {selectedOrg && view === "map" && (
        <div
          className="md:hidden shrink-0 border-t border-[#F3EADB]/8 p-4"
          style={{ background: "rgba(10,8,20,0.95)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedOrg.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bricolage font-bold text-[#F3EADB] text-sm truncate">{selectedOrg.name}</p>
              <p className="font-mono text-[10px] text-[#F3EADB]/40">{selectedOrg.city}</p>
            </div>
            <div className="flex gap-2">
              {selectedOrg.phone && (
                <a href={`tel:${selectedOrg.phone}`} aria-label="Appeler"
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#F3EADB]/15 text-[#F3EADB]/50 hover:text-[#1C9C95] hover:border-[#1C9C95]/40 transition-all">
                  <Phone size={13} />
                </a>
              )}
              {selectedOrg.website && (
                <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" aria-label="Visiter le site"
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[#F3EADB]/15 text-[#F3EADB]/50 hover:text-[#E0337E] hover:border-[#E0337E]/40 transition-all">
                  <Globe size={13} />
                </a>
              )}
            </div>
            <button onClick={() => setSelectedId(null)} aria-label="Fermer"
              className="text-[#F3EADB]/30 hover:text-[#F3EADB]/70 text-xl leading-none">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
