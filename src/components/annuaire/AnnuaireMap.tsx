"use client";
import { useRef, useEffect, useState } from "react";
import type { OrgEntry } from "@/data/annuaire-orgs";

interface Props {
  orgs: OrgEntry[];
  selected: string | null;
  hovered: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export function AnnuaireMap({ orgs, selected, hovered, onSelect, onHover }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<Map<string, { marker: unknown; el: HTMLDivElement }>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const orgsRef = useRef(orgs);
  orgsRef.current = orgs;

  // Init map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    let destroyed = false;

    import("mapbox-gl").then((mapboxgl) => {
      if (destroyed || !mapContainer.current || mapRef.current) return;

      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [13, 51],
        zoom: 3.4,
        minZoom: 2,
        maxZoom: 12,
        attributionControl: false,
        logoPosition: "bottom-right",
        antialias: true,
      });

      mapRef.current = map;

      map.on("load", () => {
        if (destroyed) return;

        // Atmospheric glow
        map.setFog({
          color: "rgb(8, 6, 18)",
          "high-color": "rgb(18, 8, 36)",
          "horizon-blend": 0.04,
          "space-color": "rgb(4, 3, 12)",
          "star-intensity": 0.5,
        });

        map.addControl(new mapboxgl.default.AttributionControl({ compact: true }), "bottom-right");
        map.addControl(new mapboxgl.default.NavigationControl({ showCompass: false }), "bottom-right");

        setMapLoaded(true);
      });
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        import("mapbox-gl").then((mapboxgl) => {
          (mapRef.current as InstanceType<typeof mapboxgl.default.Map>).remove();
          mapRef.current = null;
        });
      }
    };
  }, []);

  // Sync markers
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    import("mapbox-gl").then((mapboxgl) => {
      const map = mapRef.current as InstanceType<typeof mapboxgl.default.Map>;

      // Remove markers no longer in orgs
      const orgIds = new Set(orgs.map((o) => o.id));
      markersRef.current.forEach(({ marker }, id) => {
        if (!orgIds.has(id)) {
          (marker as InstanceType<typeof mapboxgl.default.Marker>).remove();
          markersRef.current.delete(id);
        }
      });

      // Add new markers
      orgs.forEach((org) => {
        if (markersRef.current.has(org.id)) return;

        const el = document.createElement("div");
        el.className = "annuaire-marker";
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", `${org.name}, ${org.city}`);
        el.setAttribute("tabindex", "0");
        el.style.cssText = `
          width: 38px; height: 38px;
          border-radius: 50%;
          background: ${org.accent}1a;
          border: 1.5px solid ${org.accent}99;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 12px ${org.accent}33;
          position: relative;
        `;
        el.innerHTML = org.flag;

        el.addEventListener("click", () => onSelect(org.id));
        el.addEventListener("mouseenter", () => onHover(org.id));
        el.addEventListener("mouseleave", () => onHover(null));
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(org.id); }
        });

        const marker = new mapboxgl.default.Marker({ element: el, anchor: "center" })
          .setLngLat([org.lng, org.lat])
          .addTo(map);

        markersRef.current.set(org.id, { marker, el });
      });
    });
  }, [orgs, mapLoaded, onSelect, onHover]);

  // Update marker styles on selection/hover change
  useEffect(() => {
    markersRef.current.forEach(({ el }, id) => {
      const org = orgsRef.current.find((o) => o.id === id);
      if (!org) return;
      const isSelected = id === selected;
      const isHovered = id === hovered;
      const active = isSelected || isHovered;

      el.style.width = isSelected ? "48px" : "38px";
      el.style.height = isSelected ? "48px" : "38px";
      el.style.fontSize = isSelected ? "20px" : "17px";
      el.style.background = active ? `${org.accent}2e` : `${org.accent}1a`;
      el.style.borderColor = active ? org.accent : `${org.accent}99`;
      el.style.borderWidth = isSelected ? "2px" : "1.5px";
      el.style.boxShadow = isSelected
        ? `0 0 28px ${org.accent}66, 0 0 0 6px ${org.accent}18`
        : isHovered ? `0 0 18px ${org.accent}44` : `0 0 12px ${org.accent}33`;
      el.style.transform = active ? "scale(1.1)" : "scale(1)";
      el.style.zIndex = isSelected ? "100" : isHovered ? "50" : "auto";
    });
  }, [selected, hovered]);

  // Fly to selected
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selected) return;
    const org = orgsRef.current.find((o) => o.id === selected);
    if (!org) return;

    import("mapbox-gl").then((mapboxgl) => {
      const map = mapRef.current as InstanceType<typeof mapboxgl.default.Map>;
      map.flyTo({
        center: [org.lng, org.lat],
        zoom: 6,
        duration: 1200,
        essential: true,
        curve: 1.4,
      });
    });
  }, [selected, mapLoaded]);

  const selectedOrg = orgs.find((o) => o.id === selected);

  return (
    <>
      <style>{`
        .mapboxgl-ctrl-bottom-right { bottom: 8px !important; right: 8px !important; }
        .mapboxgl-ctrl-group { background: rgba(10,8,20,0.85) !important; border: 1px solid rgba(26,22,18,0.10) !important; border-radius: 12px !important; }
        .mapboxgl-ctrl-group button { background: transparent !important; color: rgba(26,22,18,0.5) !important; }
        .mapboxgl-ctrl-group button:hover { background: rgba(26,22,18,0.07) !important; color: rgba(26,22,18,0.9) !important; }
        .mapboxgl-ctrl-attrib { background: rgba(10,8,20,0.7) !important; border-radius: 8px !important; color: rgba(26,22,18,0.25) !important; font-size: 9px !important; }
        .mapboxgl-ctrl-attrib a { color: rgba(26,22,18,0.35) !important; }
      `}</style>

      <div className="relative w-full h-full rounded-xl overflow-hidden" style={{ minHeight: 300 }}>
        <div ref={mapContainer} className="w-full h-full" aria-label="Carte LGBTQIA+ Europe" role="img" />

        {/* Loading */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: "#FBF9F5" }}>
            <div className="w-6 h-6 rounded-full border-2 border-[#FF3D7F] border-t-transparent animate-spin" />
            <span className="font-mono text-xs text-[#1A1612]/30">Chargement de la carte…</span>
          </div>
        )}

        {/* Selected org popup */}
        {selectedOrg && (
          <div
            className="absolute bottom-4 left-4 w-72 rounded-2xl overflow-hidden z-10 transition-all duration-300"
            style={{
              background: "rgba(8,6,18,0.94)",
              border: `1px solid ${selectedOrg.accent}44`,
              backdropFilter: "blur(20px)",
              boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${selectedOrg.accent}22`,
            }}
            role="dialog"
            aria-label={`Détails : ${selectedOrg.name}`}
          >
            {/* Accent header */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${selectedOrg.accent}, ${selectedOrg.accent}44)` }} />

            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${selectedOrg.accent}20`, border: `1px solid ${selectedOrg.accent}40` }}
                  aria-hidden
                >
                  {selectedOrg.logo ?? selectedOrg.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bricolage font-bold text-[#1A1612] text-sm leading-tight">
                    {selectedOrg.name}
                  </p>
                  <p className="font-mono text-[10px] text-[#1A1612]/40 mt-0.5">
                    {selectedOrg.flag} {selectedOrg.city}, {selectedOrg.country}
                    {selectedOrg.founded && ` · ${selectedOrg.founded}`}
                  </p>
                </div>
                <button
                  onClick={() => onSelect(selected!)}
                  aria-label="Fermer"
                  className="text-[#1A1612]/25 hover:text-[#1A1612]/70 transition-colors text-xl leading-none shrink-0"
                >×</button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedOrg.categories.map((cat) => (
                  <span key={cat} className="px-1.5 py-0.5 rounded-full font-mono text-[9px]"
                    style={{ background: `${selectedOrg.accent}18`, color: selectedOrg.accent, border: `1px solid ${selectedOrg.accent}25` }}>
                    {cat}
                  </span>
                ))}
              </div>

              <p className="font-hanken text-[11px] text-[#1A1612]/55 leading-relaxed mb-3 line-clamp-3">
                {selectedOrg.description}
              </p>

              <div className="flex flex-col gap-1.5">
                {selectedOrg.phone && (
                  <a href={`tel:${selectedOrg.phone}`}
                    className="flex items-center gap-2 text-[11px] font-mono transition-colors group/link"
                    style={{ color: selectedOrg.accent }}>
                    <span aria-hidden>📞</span>
                    <span className="group-hover/link:underline">{selectedOrg.phone}</span>
                  </a>
                )}
                {selectedOrg.website && (
                  <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[11px] font-mono transition-colors group/link"
                    style={{ color: selectedOrg.accent }}>
                    <span aria-hidden>🌐</span>
                    <span className="group-hover/link:underline truncate">
                      {selectedOrg.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
