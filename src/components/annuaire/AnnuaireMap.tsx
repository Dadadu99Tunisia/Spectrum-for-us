"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import type { OrgEntry } from "@/data/annuaire-orgs";

interface Props {
  orgs: OrgEntry[];
  selected: string | null;
  onSelect: (id: string) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Custom dark style inspired by site's palette
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

export function AnnuaireMap({ orgs, selected, onSelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<Map<string, unknown>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Init map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    import("mapbox-gl").then((mapboxgl) => {
      if (!mapContainer.current || mapRef.current) return;

      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: [12, 52],
        zoom: 3.5,
        minZoom: 2,
        maxZoom: 10,
        attributionControl: false,
        logoPosition: "bottom-right",
      });

      mapRef.current = map;

      map.on("load", () => {
        // Override map background/fog for site aesthetic
        map.setFog({
          color: "rgb(10, 8, 20)",
          "high-color": "rgb(20, 10, 40)",
          "horizon-blend": 0.05,
          "space-color": "rgb(5, 4, 14)",
          "star-intensity": 0.4,
        });

        // Add attribution
        map.addControl(
          new mapboxgl.default.AttributionControl({ compact: true }),
          "bottom-right"
        );
        map.addControl(
          new mapboxgl.default.NavigationControl({ showCompass: false }),
          "bottom-right"
        );

        setMapLoaded(true);
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    });
  }, []);

  // Add/update markers when orgs or mapLoaded changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    import("mapbox-gl").then((mapboxgl) => {
      const map = mapRef.current as InstanceType<typeof mapboxgl.default.Map>;

      // Clear old markers
      markersRef.current.forEach((m) => {
        (m as InstanceType<typeof mapboxgl.default.Marker>).remove();
      });
      markersRef.current.clear();

      orgs.forEach((org) => {
        const isSelected = org.id === selected;

        // Build marker element
        const el = document.createElement("div");
        el.style.cssText = `
          width: ${isSelected ? "48px" : "36px"};
          height: ${isSelected ? "48px" : "36px"};
          border-radius: 50%;
          background: ${isSelected ? org.accent + "33" : org.accent + "18"};
          border: ${isSelected ? "2.5px" : "1.5px"} solid ${org.accent};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isSelected ? "20px" : "16px"};
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 0 ${isSelected ? "20px" : "8px"} ${org.accent}${isSelected ? "66" : "33"};
          position: relative;
        `;
        el.innerHTML = org.flag;
        el.title = org.name;

        // Pulse ring for selected
        if (isSelected) {
          const ring = document.createElement("div");
          ring.style.cssText = `
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            border: 1.5px solid ${org.accent};
            opacity: 0.4;
            animation: pulse 1.5s ease-in-out infinite;
          `;
          el.appendChild(ring);
        }

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelect(org.id);
        });

        // Hover effect
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.15)";
          el.style.zIndex = "10";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
          el.style.zIndex = "auto";
        });

        const marker = new mapboxgl.default.Marker({ element: el, anchor: "center" })
          .setLngLat([org.lng, org.lat])
          .addTo(map);

        markersRef.current.set(org.id, marker);
      });
    });
  }, [orgs, mapLoaded, selected, onSelect]);

  // Fly to selected org
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selected) return;
    const org = orgs.find((o) => o.id === selected);
    if (!org) return;

    import("mapbox-gl").then((mapboxgl) => {
      const map = mapRef.current as InstanceType<typeof mapboxgl.default.Map>;
      map.flyTo({
        center: [org.lng, org.lat],
        zoom: 6,
        duration: 1400,
        essential: true,
      });
    });
  }, [selected, orgs, mapLoaded]);

  return (
    <>
      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.1; }
        }
      `}</style>

      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Loading overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "#0a0814" }}>
            <span className="font-mono text-xs text-[#F3EADB]/30 animate-pulse">
              Chargement de la carte…
            </span>
          </div>
        )}

        {/* Selected org popup card */}
        {selected && (() => {
          const org = orgs.find((o) => o.id === selected);
          if (!org) return null;
          return (
            <div
              className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-72 rounded-2xl p-4 z-10"
              style={{
                background: "rgba(10,8,20,0.92)",
                border: `1px solid ${org.accent}44`,
                backdropFilter: "blur(16px)",
                boxShadow: `0 8px 32px ${org.accent}22`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${org.accent}20`, border: `1px solid ${org.accent}40` }}
                >
                  {org.logo ?? org.flag}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bricolage font-bold text-[#F3EADB] text-sm leading-tight">
                    {org.name}
                  </p>
                  <p className="font-mono text-[10px] text-[#F3EADB]/40 mt-0.5">
                    {org.flag} {org.city}, {org.country}
                  </p>
                </div>
                <button
                  onClick={() => onSelect(selected)}
                  className="text-[#F3EADB]/30 hover:text-[#F3EADB]/70 text-lg leading-none shrink-0"
                >×</button>
              </div>

              <p className="font-hanken text-xs text-[#F3EADB]/50 leading-relaxed mt-3 line-clamp-2">
                {org.description}
              </p>

              <div className="flex flex-col gap-1 mt-3">
                {org.phone && (
                  <a href={`tel:${org.phone}`}
                    className="font-mono text-[10px] flex items-center gap-1.5"
                    style={{ color: org.accent }}>
                    📞 {org.phone}
                  </a>
                )}
                {org.website && (
                  <a href={org.website} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] flex items-center gap-1.5 hover:underline"
                    style={{ color: org.accent }}>
                    🌐 {org.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}
