import React from "react";

export type FounderStatus = "FOUNDER" | "EARLY_ADOPTER" | "STANDARD";

const CONFIG: Record<FounderStatus, {
  label: string;
  icon: string;
  gradient: string;
  border: string;
  text: string;
  glow: string;
} | null> = {
  FOUNDER: {
    label: "Fondateur·ice Spectrum",
    icon: "🏆",
    gradient: "linear-gradient(135deg,#FFD700,#FFA500,#FF6B35)",
    border: "rgba(255,215,0,.35)",
    text: "#FFD700",
    glow: "rgba(255,215,0,.25)",
  },
  EARLY_ADOPTER: {
    label: "Pionnier·e Spectrum",
    icon: "🚀",
    gradient: "linear-gradient(135deg,#a78bfa,#7A2BF0)",
    border: "rgba(167,139,250,.35)",
    text: "#a78bfa",
    glow: "rgba(167,139,250,.2)",
  },
  STANDARD: null, // no badge
};

interface FounderBadgeProps {
  status: FounderStatus;
  rank?: number;
  size?: "sm" | "md" | "lg";
  showRank?: boolean;
  className?: string;
}

export function FounderBadge({
  status,
  rank,
  size = "md",
  showRank = false,
  className = "",
}: FounderBadgeProps) {
  const cfg = CONFIG[status];
  if (!cfg) return null;

  const sizes = {
    sm: { px: "px-2 py-0.5", text: "text-[9px]", icon: "text-[11px]" },
    md: { px: "px-3 py-1",   text: "text-[11px]", icon: "text-[13px]" },
    lg: { px: "px-4 py-1.5", text: "text-sm",     icon: "text-base" },
  };
  const s = sizes[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-hanken font-semibold tracking-tight ${s.px} ${s.text} ${className}`}
      style={{
        background: cfg.gradient,
        borderColor: cfg.border,
        color: status === "FOUNDER" ? "#1a0a00" : "#fff",
        boxShadow: `0 0 12px ${cfg.glow}`,
      }}
    >
      <span className={s.icon}>{cfg.icon}</span>
      {cfg.label}
      {showRank && rank != null && (
        <span className="opacity-60 font-mono text-[9px]">#{rank}</span>
      )}
    </span>
  );
}
