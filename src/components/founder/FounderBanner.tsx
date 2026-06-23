"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const FB_TX = {
  fr: {
    founderSpotsLeft: (n: number) => `${n} place${n > 1 ? "s" : ""}`, founderLeftSuffix: (n: number) => ` de Fondateur·ice restante${n > 1 ? "s" : ""}`,
    earlySpotsLeft: (n: number) => `${n} place${n > 1 ? "s" : ""}`, earlyLeftSuffix: (n: number) => ` Pionnier·e restante${n > 1 ? "s" : ""}`,
    join: "Rejoindre", joinProgram: "Rejoindre le programme",
    progTitle: "Programme Fondateur Spectrum", progSub: "Rejoins les premier·es à bâtir cette communauté · des avantages exclusifs à vie.",
    founder: "Fondateur·ice", pioneer: "Pionnier·e", full: "complet",
    rankFounder: (s: string) => `Rang 1-20 · ${s}`, rankPioneer: (s: string) => `Rang 21-120 · ${s}`,
    remaining: (n: number) => `${n} restante${n > 1 ? "s" : ""}`,
    founderPerks: ["Abonnement offert 12 mois", "0 % de commission 6 mois", "Mise en avant prioritaire à vie", "Badge exclusif à vie"],
    earlyPerks: ["Abonnement offert 6 mois", "0 % de commission 3 mois", "Priorité dans la recherche", "Badge Pionnier·e à vie"],
    enrolled: (n: number) => `${n} vendeur·ses déjà inscrit·es · Places non transférables`,
  },
  en: {
    founderSpotsLeft: (n: number) => `${n}`, founderLeftSuffix: (n: number) => ` Founder spot${n > 1 ? "s" : ""} left`,
    earlySpotsLeft: (n: number) => `${n}`, earlyLeftSuffix: (n: number) => ` Pioneer spot${n > 1 ? "s" : ""} left`,
    join: "Join", joinProgram: "Join the program",
    progTitle: "Spectrum Founder Program", progSub: "Join the first to build this community · exclusive lifetime perks.",
    founder: "Founder", pioneer: "Pioneer", full: "full",
    rankFounder: (s: string) => `Rank 1-20 · ${s}`, rankPioneer: (s: string) => `Rank 21-120 · ${s}`,
    remaining: (n: number) => `${n} left`,
    founderPerks: ["12 months subscription free", "0% commission for 6 months", "Priority spotlight for life", "Exclusive lifetime badge"],
    earlyPerks: ["6 months subscription free", "0% commission for 3 months", "Search priority", "Lifetime Pioneer badge"],
    enrolled: (n: number) => `${n} sellers already enrolled · Spots non-transferable`,
  },
} as const;

interface Counts {
  founder_count: number;
  early_adopter_count: number;
  founder_slots: number;
  early_adopter_slots: number;
  founder_remaining: number;
  early_remaining: number;
}

interface FounderBannerProps {
  /** Compact 1-line banner for use inside dashboard header */
  compact?: boolean;
  /** Allow user to dismiss (stored in sessionStorage) */
  dismissible?: boolean;
  /** Hide the CTA button (e.g. when already inside onboarding) */
  hideCta?: boolean;
}

export function FounderBanner({ compact = false, dismissible = false, hideCta = false }: FounderBannerProps) {
  const [counts, setCounts]       = useState<Counts | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const { locale } = useI18n();
  const C = FB_TX[locale === "en" ? "en" : "fr"];

  useEffect(() => {
    if (dismissible && sessionStorage.getItem("founder_banner_dismissed")) {
      setDismissed(true);
      return;
    }
    fetch("/api/founder-program")
      .then(r => r.json())
      .then(setCounts)
      .catch(() => null);
  }, [dismissible]);

  const dismiss = () => {
    if (dismissible) sessionStorage.setItem("founder_banner_dismissed", "1");
    setDismissed(true);
  };

  if (dismissed || !counts) return null;

  // Hide if program is full (no founder OR early adopter spots left)
  const founderFull = counts.founder_remaining <= 0;
  const earlyFull   = counts.early_remaining   <= 0;
  if (founderFull && earlyFull) return null;

  const founderPct = Math.round((counts.founder_count / counts.founder_slots) * 100);
  const earlyPct   = Math.round(((counts.founder_count + counts.early_adopter_count) / counts.early_adopter_slots) * 100);

  // ── Compact mode (used in vendor dashboard header) ─────────────────────────
  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border"
        style={{
          background: "linear-gradient(135deg,rgba(109,45,181,.15),rgba(224,51,126,.08))",
          borderColor: "rgba(167,139,250,.2)",
        }}>
        <Sparkles size={14} className="text-[#a78bfa] shrink-0" />
        <div className="flex-1 min-w-0">
          {!founderFull ? (
            <p className="font-hanken text-sm text-[#101014]">
              🏆 <span className="text-[#FFD700] font-semibold">{C.founderSpotsLeft(counts.founder_remaining)}</span>
              {C.founderLeftSuffix(counts.founder_remaining)}
            </p>
          ) : (
            <p className="font-hanken text-sm text-[#101014]">
              🚀 <span className="text-[#a78bfa] font-semibold">{C.earlySpotsLeft(counts.early_remaining)}</span>
              {C.earlyLeftSuffix(counts.early_remaining)}
            </p>
          )}
        </div>
        <Link href="/vendeur/onboarding"
          className="flex items-center gap-1 font-mono text-[10px] text-[#a78bfa] hover:text-[#101014] transition-colors shrink-0 whitespace-nowrap">
          {C.join} <ArrowRight size={10} />
        </Link>
      </div>
    );
  }

  // ── Full banner ─────────────────────────────────────────────────────────────
  return (
    <div className="relative overflow-hidden rounded-3xl border"
      style={{
        background: "linear-gradient(135deg,#FFFFFF 0%,#1a0d35 50%,#0d1a2e 100%)",
        borderColor: "rgba(167,139,250,.2)",
        boxShadow: "0 0 60px rgba(109,45,181,.15), inset 0 1px 0 rgba(255,255,255,.05)",
      }}>

      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle,#7A2BF0,transparent)" }} />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle,#FF2DA0,transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-20 blur-3xl opacity-10"
          style={{ background: "radial-gradient(ellipse,#FFD700,transparent)" }} />
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button onClick={dismiss}
          className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full flex items-center justify-center bg-[#101014]/8 hover:bg-[#101014]/15 text-[#101014]/35 hover:text-[#101014] transition-all">
          <X size={12} />
        </button>
      )}

      <div className="relative z-10 p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="text-4xl leading-none">🚀</div>
          <div>
            <h2 className="font-fraunces text-2xl md:text-3xl text-[#101014] leading-tight">
              {C.progTitle}
            </h2>
            <p className="font-hanken text-sm text-[#101014]/45 mt-1">
              {C.progSub}
            </p>
          </div>
        </div>

        {/* Progress blocks */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">

          {/* Founder block */}
          <div className="rounded-2xl p-5 border"
            style={{
              background: founderFull
                ? "rgba(107,114,128,.06)"
                : "linear-gradient(135deg,rgba(255,215,0,.06),rgba(255,107,53,.04))",
              borderColor: founderFull ? "rgba(107,114,128,.15)" : "rgba(255,215,0,.2)",
            }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl shrink-0">🥇</span>
              <div className="min-w-0">
                <p className="font-fraunces text-base text-[#FFD700] truncate">{C.founder}</p>
                <p className="font-mono text-[9px] text-[#101014]/30">
                  {C.rankFounder(founderFull ? C.full : C.remaining(counts.founder_remaining))}
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-[#101014]/8 overflow-hidden mb-3">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${founderPct}%`,
                  background: founderFull
                    ? "rgba(107,114,128,.4)"
                    : "linear-gradient(90deg,#FFD700,#FFA500)",
                }} />
            </div>
            <div className="space-y-1">
              {C.founderPerks.map(a => (
                <p key={a} className="font-hanken text-xs flex items-center gap-1.5"
                  style={{ color: founderFull ? "rgba(243,234,219,.25)" : "rgba(243,234,219,.6)" }}>
                  <span style={{ color: founderFull ? "rgba(107,114,128,.4)" : "#FFD700" }}>✓</span>
                  {a}
                </p>
              ))}
            </div>
          </div>

          {/* Early adopter block */}
          <div className="rounded-2xl p-5 border"
            style={{
              background: earlyFull
                ? "rgba(107,114,128,.06)"
                : "linear-gradient(135deg,rgba(167,139,250,.06),rgba(224,51,126,.04))",
              borderColor: earlyFull ? "rgba(107,114,128,.15)" : "rgba(167,139,250,.2)",
            }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl shrink-0">🏆</span>
              <div className="min-w-0">
                <p className="font-fraunces text-base text-[#a78bfa] truncate">{C.pioneer}</p>
                <p className="font-mono text-[9px] text-[#101014]/30">
                  {C.rankPioneer(earlyFull ? C.full : C.remaining(counts.early_remaining))}
                </p>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-[#101014]/8 overflow-hidden mb-3">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${earlyPct}%`,
                  background: earlyFull
                    ? "rgba(107,114,128,.4)"
                    : "linear-gradient(90deg,#a78bfa,#FF2DA0)",
                }} />
            </div>
            <div className="space-y-1">
              {C.earlyPerks.map(a => (
                <p key={a} className="font-hanken text-xs flex items-center gap-1.5"
                  style={{ color: earlyFull ? "rgba(243,234,219,.25)" : "rgba(243,234,219,.6)" }}>
                  <span style={{ color: earlyFull ? "rgba(107,114,128,.4)" : "#a78bfa" }}>✓</span>
                  {a}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {!hideCta && (
            <Link href="/vendeur/onboarding"
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-hanken font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg,#7A2BF0,#FF2DA0)",
                boxShadow: "0 8px 30px rgba(109,45,181,.4)",
              }}>
              <span>{C.joinProgram}</span>
              <ArrowRight size={15} />
            </Link>
          )}
          <p className="font-mono text-[10px] text-[#101014]/30 text-center">
            {C.enrolled(counts.founder_count + counts.early_adopter_count)}
          </p>
        </div>
      </div>
    </div>
  );
}
