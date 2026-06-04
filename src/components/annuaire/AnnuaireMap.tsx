"use client";
import { useMemo } from "react";
import type { OrgEntry } from "@/data/annuaire-orgs";

interface Props {
  orgs: OrgEntry[];
  selected: string | null;
  onSelect: (id: string) => void;
}

// Europe bounding box: lng -11 to 40, lat 34 to 72
// SVG viewport: 0 0 600 500
function lngLatToXY(lng: number, lat: number): [number, number] {
  const x = ((lng + 11) / 51) * 600;
  const y = ((72 - lat) / 38) * 500;
  return [x, y];
}

// Simplified Europe SVG path (approximate coastlines)
const EUROPE_PATH = `
M 80,80 L 100,60 L 120,55 L 140,50 L 160,48 L 180,52 L 200,50
L 220,45 L 240,48 L 260,52 L 280,50 L 300,48 L 320,52 L 340,55
L 360,52 L 380,58 L 400,60 L 420,65 L 440,70 L 460,78
L 470,90 L 465,105 L 455,115 L 445,125 L 440,140
L 430,155 L 425,170 L 420,185 L 415,200 L 410,215
L 405,225 L 395,235 L 385,245 L 370,255 L 355,265
L 340,270 L 325,275 L 310,280 L 295,285 L 280,290
L 265,295 L 250,298 L 235,300 L 220,302 L 205,305
L 190,308 L 175,310 L 160,312 L 145,315 L 130,318
L 115,320 L 100,315 L 90,305 L 82,295 L 78,280
L 75,265 L 73,250 L 72,235 L 73,220 L 75,205
L 76,190 L 77,175 L 78,160 L 79,145 L 80,130
L 80,115 L 80,100 L 80,80 Z
`;

// Country-level dot positions (approximate, based on capital/center)
// Used to group multiple orgs in same country
function getCountryCenter(countryCode: string): [number, number] {
  const centers: Record<string, [number, number]> = {
    FR: [2.35, 46.8],
    BE: [4.35, 50.5],
    ES: [-3.7, 40.4],
    DE: [10.4, 51.2],
    NL: [5.3, 52.1],
    SE: [18.0, 59.5],
    GB: [-1.5, 52.5],
    IT: [12.5, 42.5],
    PT: [-8.2, 39.5],
    CH: [8.2, 46.8],
    PL: [19.5, 52.1],
    AT: [14.5, 47.5],
    DK: [10.0, 56.0],
    NO: [10.7, 59.9],
    FI: [25.0, 61.5],
    GR: [21.8, 39.0],
    UA: [31.0, 49.0],
    RO: [25.0, 45.5],
    IS: [-19.0, 64.5],
  };
  return centers[countryCode] ?? [15, 50];
}

export function AnnuaireMap({ orgs, selected, onSelect }: Props) {
  // Group orgs by country
  const byCountry = useMemo(() => {
    const map = new Map<string, OrgEntry[]>();
    orgs.forEach((org) => {
      const key = org.countryCode;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(org);
    });
    return map;
  }, [orgs]);

  const selectedOrg = orgs.find((o) => o.id === selected);

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#080812" }}>
      <svg
        viewBox="0 0 600 500"
        className="w-full flex-1"
        style={{ minHeight: 0 }}
      >
        {/* Grid lines */}
        {[...Array(6)].map((_, i) => (
          <line
            key={`h${i}`}
            x1={0} y1={i * 83} x2={600} y2={i * 83}
            stroke="#F3EADB" strokeOpacity={0.03} strokeWidth={1}
          />
        ))}
        {[...Array(7)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 86} y1={0} x2={i * 86} y2={500}
            stroke="#F3EADB" strokeOpacity={0.03} strokeWidth={1}
          />
        ))}

        {/* Ambient glow */}
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6D2DB5" stopOpacity={0.08} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x={0} y={0} width={600} height={500} fill="url(#bgGlow)" />

        {/* Country markers */}
        {[...byCountry.entries()].map(([code, countryOrgs]) => {
          const [lng, lat] = getCountryCenter(code);
          const [x, y] = lngLatToXY(lng, lat);
          const hasSelected = selected && countryOrgs.some((o) => o.id === selected);
          const accent = countryOrgs[0].accent;
          const count = countryOrgs.length;

          return (
            <g
              key={code}
              onClick={() => onSelect(countryOrgs[0].id)}
              style={{ cursor: "pointer" }}
              filter={hasSelected ? "url(#glow)" : undefined}
            >
              {/* Pulse ring when selected */}
              {hasSelected && (
                <circle
                  cx={x} cy={y} r={22}
                  fill="none"
                  stroke={accent}
                  strokeOpacity={0.35}
                  strokeWidth={2}
                />
              )}

              {/* Outer ring */}
              <circle
                cx={x} cy={y} r={hasSelected ? 16 : 12}
                fill={`${accent}22`}
                stroke={accent}
                strokeWidth={hasSelected ? 2 : 1.5}
                strokeOpacity={hasSelected ? 1 : 0.7}
                style={{ transition: "all 0.3s" }}
              />

              {/* Flag emoji */}
              <text
                x={x} y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={hasSelected ? 14 : 11}
                style={{ transition: "font-size 0.3s", userSelect: "none" }}
              >
                {countryOrgs[0].flag}
              </text>

              {/* Count badge */}
              {count > 1 && (
                <g>
                  <circle
                    cx={x + 10} cy={y - 10} r={8}
                    fill={accent}
                  />
                  <text
                    x={x + 10} y={y - 9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={9}
                    fontWeight="bold"
                    fill="white"
                    style={{ userSelect: "none" }}
                  >
                    {count}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Selected org tooltip */}
        {selectedOrg && (() => {
          const [lng, lat] = lngLatToXY(selectedOrg.lng, selectedOrg.lat);
          const tipX = lng > 450 ? lng - 160 : lng + 20;
          const tipY = lat > 400 ? lat - 80 : lat + 10;

          return (
            <g>
              <rect
                x={tipX} y={tipY}
                width={155} height={58}
                rx={8}
                fill="#1a0d28"
                stroke={selectedOrg.accent}
                strokeOpacity={0.5}
                strokeWidth={1}
              />
              <text x={tipX + 10} y={tipY + 18} fontSize={11} fontWeight="bold" fill="#F3EADB">
                {selectedOrg.shortName ?? selectedOrg.name.slice(0, 22)}
              </text>
              <text x={tipX + 10} y={tipY + 32} fontSize={9} fill="#F3EADB" opacity={0.5}>
                {selectedOrg.city}, {selectedOrg.country}
              </text>
              <text x={tipX + 10} y={tipY + 46} fontSize={8} fill={selectedOrg.accent}>
                {selectedOrg.website?.replace(/^https?:\/\//, "").slice(0, 28)}
              </text>
            </g>
          );
        })()}

        {/* Legend */}
        <text x={10} y={490} fontSize={9} fill="#F3EADB" opacity={0.2} fontFamily="monospace">
          Carte LGBTQIA+ Europe · Spectrum For Us
        </text>
      </svg>
    </div>
  );
}
