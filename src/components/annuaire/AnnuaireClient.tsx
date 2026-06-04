"use client";
import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Search, SlidersHorizontal, X, MapPin, List } from "lucide-react";
import { ORGS, COUNTRIES, CATEGORIES, type OrgCategory } from "@/data/annuaire-orgs";
import { OrgCard } from "./OrgCard";

const AnnuaireMap = lazy(() =>
  import("./AnnuaireMap").then((m) => ({ default: m.AnnuaireMap }))
);

export function AnnuaireClient() {
  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<OrgCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"split" | "list" | "map">("split");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return ORGS.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.country.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q);

      const matchCountry =
        selectedCountries.length === 0 || selectedCountries.includes(o.country);

      const matchCat =
        selectedCategories.length === 0 ||
        selectedCategories.some((c) => o.categories.includes(c));

      return matchSearch && matchCountry && matchCat;
    });
  }, [search, selectedCountries, selectedCategories]);

  const selectedOrg = useMemo(
    () => ORGS.find((o) => o.id === selectedId) ?? null,
    [selectedId]
  );

  const toggleCountry = useCallback((c: string) => {
    setSelectedCountries((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }, []);

  const toggleCategory = useCallback((c: OrgCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }, []);

  const activeFilterCount = selectedCountries.length + selectedCategories.length;

  return (
    <div className="flex flex-col h-full">
      {/* ─── Toolbar ─── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3EADB]/8 shrink-0">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30" />
          <input
            type="text"
            placeholder="Rechercher une organisation, ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.04] text-[#F3EADB]/80 placeholder-[#F3EADB]/25 text-sm font-hanken outline-none focus:border-[#E0337E]/40 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={13} className="text-[#F3EADB]/30 hover:text-[#F3EADB]/70" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-hanken transition-all"
          style={{
            borderColor: activeFilterCount > 0 ? "#E0337E" : "rgba(243,234,219,0.10)",
            color: activeFilterCount > 0 ? "#E0337E" : "rgba(243,234,219,0.60)",
            background: activeFilterCount > 0 ? "#E0337E15" : "transparent",
          }}
        >
          <SlidersHorizontal size={13} />
          Filtrer
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#E0337E] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View switcher */}
        <div className="flex items-center border border-[#F3EADB]/10 rounded-xl overflow-hidden ml-auto">
          {(["split", "list", "map"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-2 text-xs font-mono transition-all"
              style={{
                background: view === v ? "#E0337E20" : "transparent",
                color: view === v ? "#E0337E" : "rgba(243,234,219,0.40)",
              }}
            >
              {v === "split" && "⊞"}
              {v === "list" && <List size={13} />}
              {v === "map" && <MapPin size={13} />}
            </button>
          ))}
        </div>

        {/* Count */}
        <span className="font-mono text-xs text-[#F3EADB]/30 shrink-0">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ─── Filter panel ─── */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-[#F3EADB]/8 bg-[#F3EADB]/[0.015] shrink-0">
          <div className="flex flex-wrap gap-6">
            {/* Countries */}
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/30 mb-2">
                Pays
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCountry(c)}
                    className="px-2.5 py-1 rounded-full text-xs font-hanken transition-all border"
                    style={{
                      borderColor: selectedCountries.includes(c) ? "#E0337E" : "rgba(243,234,219,0.12)",
                      color: selectedCountries.includes(c) ? "#E0337E" : "rgba(243,234,219,0.55)",
                      background: selectedCountries.includes(c) ? "#E0337E15" : "transparent",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/30 mb-2">
                Type
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className="px-2.5 py-1 rounded-full text-xs font-hanken transition-all border flex items-center gap-1"
                    style={{
                      borderColor: selectedCategories.includes(cat.value) ? "#1C9C95" : "rgba(243,234,219,0.12)",
                      color: selectedCategories.includes(cat.value) ? "#1C9C95" : "rgba(243,234,219,0.55)",
                      background: selectedCategories.includes(cat.value) ? "#1C9C9515" : "transparent",
                    }}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setSelectedCountries([]);
                setSelectedCategories([]);
              }}
              className="mt-3 text-xs font-mono text-[#F3EADB]/30 hover:text-[#E0337E] transition-colors"
            >
              × Effacer les filtres
            </button>
          )}
        </div>
      )}

      {/* ─── Main content ─── */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* List panel */}
        {(view === "split" || view === "list") && (
          <div
            className="overflow-y-auto p-4 flex flex-col gap-3 shrink-0"
            style={{ width: view === "list" ? "100%" : "380px" }}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <span className="text-3xl mb-3">🔍</span>
                <p className="font-hanken text-[#F3EADB]/40 text-sm">
                  Aucun résultat pour cette recherche.
                </p>
              </div>
            ) : (
              filtered.map((org) => (
                <OrgCard
                  key={org.id}
                  org={org}
                  selected={selectedId === org.id}
                  onClick={() => setSelectedId((id) => (id === org.id ? null : org.id))}
                  compact={view === "split"}
                />
              ))
            )}
          </div>
        )}

        {/* Divider */}
        {view === "split" && (
          <div className="w-px bg-[#F3EADB]/8 shrink-0" />
        )}

        {/* Map panel */}
        {(view === "split" || view === "map") && (
          <div className="flex-1 p-4 min-w-0">
            <Suspense
              fallback={
                <div className="w-full h-full rounded-xl bg-[#0a0a14] flex items-center justify-center">
                  <span className="font-mono text-xs text-[#F3EADB]/30 animate-pulse">
                    Chargement de la carte…
                  </span>
                </div>
              }
            >
              <AnnuaireMap
                orgs={filtered}
                selected={selectedId}
                onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
              />
            </Suspense>
          </div>
        )}

        {/* Selected org detail (map-only view) */}
        {view === "map" && selectedOrg && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-[1000]">
            <OrgCard
              org={selectedOrg}
              selected
              onClick={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
