"use client";
import { Phone, Globe, Mail, MapPin, Calendar } from "lucide-react";
import type { OrgEntry, OrgCategory } from "@/data/annuaire-orgs";
import { CATEGORIES } from "@/data/annuaire-orgs";

interface Props {
  org: OrgEntry;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const categoryLabel = (cat: OrgCategory) =>
  CATEGORIES.find((c) => c.value === cat);

export function OrgCard({ org, selected, onClick, compact }: Props) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        borderColor: selected ? org.accent : "rgba(243,234,219,0.08)",
        background: selected
          ? `${org.accent}10`
          : "rgba(243,234,219,0.02)",
        boxShadow: selected ? `0 0 0 1px ${org.accent}44, 0 8px 32px ${org.accent}22` : "none",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${org.accent}, transparent)`,
          opacity: selected ? 1 : 0,
        }}
      />

      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${org.accent}15, transparent 60%)`,
        }}
      />

      <div className={compact ? "p-4" : "p-5"}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: `${org.accent}20`, border: `1px solid ${org.accent}40` }}
          >
            {org.logo ?? org.flag}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bricolage font-bold text-[#F3EADB] text-sm leading-tight truncate">
              {org.shortName ?? org.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs">{org.flag}</span>
              <span className="font-mono text-[10px] text-[#F3EADB]/40 truncate">
                {org.city}, {org.country}
              </span>
            </div>
          </div>
          {org.founded && !compact && (
            <div className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-[#F3EADB]/25">
              <Calendar size={9} />
              {org.founded}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {org.categories.map((cat) => {
            const c = categoryLabel(cat);
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
                style={{
                  background: `${org.accent}18`,
                  color: org.accent,
                  border: `1px solid ${org.accent}30`,
                }}
              >
                {c?.emoji} {c?.label}
              </span>
            );
          })}
        </div>

        {/* Description */}
        {!compact && (
          <p className="font-hanken text-xs text-[#F3EADB]/55 leading-relaxed mb-4 line-clamp-3">
            {org.description}
          </p>
        )}

        {/* Contact */}
        <div className="flex flex-col gap-1.5">
          {org.phone && (
            <a
              href={`tel:${org.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-xs font-mono text-[#F3EADB]/50 hover:text-[#F3EADB]/90 transition-colors"
            >
              <Phone size={11} style={{ color: org.accent }} />
              {org.phone}
            </a>
          )}
          {org.email && !compact && (
            <a
              href={`mailto:${org.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-xs font-mono text-[#F3EADB]/50 hover:text-[#F3EADB]/90 transition-colors truncate"
            >
              <Mail size={11} style={{ color: org.accent }} />
              {org.email}
            </a>
          )}
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-xs font-mono hover:underline transition-colors"
              style={{ color: org.accent }}
            >
              <Globe size={11} />
              {org.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
