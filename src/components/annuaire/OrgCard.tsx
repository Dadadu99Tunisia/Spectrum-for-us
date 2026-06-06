"use client";
import { Phone, Globe, Mail, Calendar, ExternalLink } from "lucide-react";
import type { OrgEntry, OrgCategory } from "@/data/annuaire-orgs";
import { CATEGORIES } from "@/data/annuaire-orgs";

interface Props {
  org: OrgEntry;
  selected?: boolean;
  hovered?: boolean;
  onClick?: () => void;
  onHover?: (id: string | null) => void;
  compact?: boolean;
}

const categoryLabel = (cat: OrgCategory) => CATEGORIES.find((c) => c.value === cat);

export function OrgCard({ org, selected, hovered, onClick, onHover, compact }: Props) {
  const active = selected || hovered;

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => onHover?.(org.id)}
      onMouseLeave={() => onHover?.(null)}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`${org.name}, ${org.city}, ${org.country}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
      className="group relative rounded-2xl border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2"
      style={{
        borderColor: selected ? org.accent : hovered ? `${org.accent}55` : "rgba(243,234,219,0.07)",
        background: selected ? `${org.accent}0d` : hovered ? `${org.accent}06` : "rgba(243,234,219,0.015)",
        boxShadow: selected
          ? `0 0 0 1px ${org.accent}33, 0 6px 24px ${org.accent}18`
          : hovered ? `0 2px 12px ${org.accent}10` : "none",
        // @ts-expect-error CSS custom property
        "--tw-ring-color": org.accent,
        transform: selected ? "translateX(2px)" : "none",
      }}
    >
      {/* Accent top line */}
      <div
        className="absolute top-0 left-4 right-4 h-px transition-all duration-200"
        style={{
          background: `linear-gradient(90deg, transparent, ${org.accent}, transparent)`,
          opacity: active ? 0.6 : 0,
        }}
      />

      <div className={compact ? "p-3" : "p-4"}>
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div
            className="shrink-0 rounded-xl flex items-center justify-center text-xl transition-all duration-200"
            style={{
              width: compact ? 36 : 42,
              height: compact ? 36 : 42,
              background: `${org.accent}18`,
              border: `1px solid ${org.accent}${active ? "55" : "25"}`,
              fontSize: compact ? 16 : 20,
            }}
            aria-hidden="true"
          >
            {org.logo ?? org.flag}
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bricolage font-bold text-[#F3EADB] leading-tight truncate"
              style={{ fontSize: compact ? 13 : 15 }}>
              {org.shortName ?? org.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs" aria-hidden>{org.flag}</span>
              <span className="font-mono text-[10px] text-[#F3EADB]/35 truncate">
                {org.city}{!compact && `, ${org.country}`}
              </span>
              {org.founded && !compact && (
                <span className="flex items-center gap-0.5 font-mono text-[9px] text-[#F3EADB]/20 ml-auto shrink-0">
                  <Calendar size={8} />
                  {org.founded}
                </span>
              )}
            </div>
          </div>

          {/* External link on hover */}
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
        <div className="flex flex-wrap gap-1 mt-2.5">
          {org.categories.map((cat) => {
            const c = categoryLabel(cat);
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-mono"
                style={{
                  fontSize: 9,
                  background: `${org.accent}14`,
                  color: org.accent,
                  border: `1px solid ${org.accent}22`,
                }}
              >
                <span aria-hidden>{c?.emoji}</span>
                {c?.label}
              </span>
            );
          })}
        </div>

        {/* Description — only expanded or non-compact */}
        {(selected || !compact) && (
          <p className="font-hanken text-xs text-[#F3EADB]/50 leading-relaxed mt-2.5 line-clamp-2">
            {org.description}
          </p>
        )}

        {/* Contact row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {org.phone && (
            <a
              href={`tel:${org.phone}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Appeler ${org.name}`}
              className="flex items-center gap-1.5 font-mono transition-colors hover:opacity-100 opacity-60"
              style={{ fontSize: 10, color: org.accent }}
            >
              <Phone size={10} aria-hidden />
              <span className={compact ? "hidden sm:inline" : ""}>{org.phone}</span>
            </a>
          )}
          {org.email && !compact && (
            <a
              href={`mailto:${org.email}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Email ${org.name}`}
              className="flex items-center gap-1.5 font-mono transition-colors hover:opacity-100 opacity-60 truncate"
              style={{ fontSize: 10, color: org.accent }}
            >
              <Mail size={10} aria-hidden />
              <span className="truncate">{org.email}</span>
            </a>
          )}
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Site de ${org.name}`}
              className="flex items-center gap-1.5 font-mono transition-colors hover:opacity-100 opacity-60 truncate ml-auto"
              style={{ fontSize: 10, color: org.accent }}
            >
              <Globe size={10} aria-hidden />
              <span className="truncate hidden sm:inline">
                {org.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
