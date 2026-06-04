"use client";
import { useEffect, useRef } from "react";
import type { OrgEntry } from "@/data/annuaire-orgs";

interface Props {
  orgs: OrgEntry[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function AnnuaireMap({ orgs, selected, onSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<Map<string, unknown>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR issues with leaflet
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix leaflet default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [52, 12],
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Dark tile layer matching site aesthetic
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);

      // Add markers
      orgs.forEach((org) => {
        const markerHtml = `
          <div class="annuaire-marker" data-id="${org.id}" style="
            width: 36px; height: 36px;
            border-radius: 50%;
            background: ${org.accent}22;
            border: 2px solid ${org.accent};
            display: flex; align-items: center; justify-content: center;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 0 12px ${org.accent}44;
          ">${org.flag}</div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: "",
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([org.lat, org.lng], { icon })
          .addTo(map)
          .on("click", () => onSelect(org.id));

        markersRef.current.set(org.id, marker);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to selected org
  useEffect(() => {
    if (!mapInstanceRef.current || !selected) return;
    const org = orgs.find((o) => o.id === selected);
    if (!org) return;
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapInstanceRef.current as any).flyTo([org.lat, org.lng], 7, { duration: 1.2 });

      // Update marker styles
      markersRef.current.forEach((marker, id) => {
        const el = (marker as ReturnType<typeof L.marker>).getElement();
        if (!el) return;
        const inner = el.querySelector(".annuaire-marker") as HTMLElement | null;
        if (!inner) return;
        const o = orgs.find((x) => x.id === id);
        if (!o) return;
        inner.style.transform = id === selected ? "scale(1.3)" : "scale(1)";
        inner.style.zIndex = id === selected ? "999" : "auto";
        inner.style.background = id === selected ? `${o.accent}55` : `${o.accent}22`;
        inner.style.borderWidth = id === selected ? "3px" : "2px";
      });
    });
  }, [selected, orgs]);

  return (
    <div className="relative w-full h-full">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={mapRef}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ background: "#0a0a14" }}
      />
    </div>
  );
}
