"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Counts {
  founder_count: number;
  early_adopter_count: number;
  founder_slots: number;
  early_adopter_slots: number;
  founder_remaining: number;
  early_remaining: number;
}

const DEFAULT: Counts = {
  founder_count: 0, early_adopter_count: 0,
  founder_slots: 20, early_adopter_slots: 100,
  founder_remaining: 20, early_remaining: 100,
};

export function FounderProgramSection() {
  const [counts, setCounts] = useState<Counts>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/founder-program")
      .then(r => r.json())
      .then(d => { setCounts(d); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const founderFull = counts.founder_remaining <= 0;
  const earlyFull   = counts.early_remaining   <= 0;
  if (founderFull && earlyFull) return null;

  const founderPct = Math.round((counts.founder_count / counts.founder_slots) * 100);
  const earlyPct   = Math.round(
    ((counts.founder_count + counts.early_adopter_count) / counts.early_adopter_slots) * 100
  );

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg,transparent,rgba(255,215,0,.3))" }} />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#FFD700]/60">
            ◈ Programme Fondateur·ice
          </span>
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg,rgba(255,215,0,.3),transparent)" }} />
        </div>

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

          <div className="relative z-10 p-8 md:p-12">
            {/* Header */}
            <div className="flex items-start gap-5 mb-10">
              <div className="text-5xl leading-none">🌈</div>
              <div>
                <h2 className="font-fraunces text-3xl md:text-4xl text-[#101014] leading-tight">
                  Programme Fondateur Spectrum
                </h2>
                <p className="font-hanken text-sm text-[#101014]/45 mt-2">
                  Rejoins les premiers à b-tir cette communauté · des avantages exclusifs à vie.
                </p>
              </div>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">

              {/* Founder */}
              <div className="rounded-2xl p-5 border"
                style={{
                  background: founderFull
                    ? "rgba(107,114,128,.06)"
                    : "linear-gradient(135deg,rgba(255,215,0,.06),rgba(255,107,53,.04))",
                  borderColor: founderFull ? "rgba(107,114,128,.15)" : "rgba(255,215,0,.2)",
                }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <div>
                      <p className="font-fraunces text-base text-[#FFD700]">Fondateur·ice</p>
                      <p className="font-mono text-[9px] text-[#101014]/30">Rang 1-20</p>
                    </div>
                  </div>
                  {founderFull ? (
                    <span className="font-mono text-[9px] px-2 py-1 rounded-full bg-[#101014]/5 text-[#101014]/30 border border-[#101014]/8">Complet</span>
                  ) : (
                    <span className="font-mono text-[10px] font-bold" style={{ color: "#FFD700" }}>
                      {loaded ? `${counts.founder_remaining} restante${counts.founder_remaining > 1 ? "s" : ""}` : "…"}
                    </span>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-[#101014]/8 overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${founderPct}%`,
                      background: founderFull ? "rgba(107,114,128,.4)" : "linear-gradient(90deg,#FFD700,#FFA500)",
                    }} />
                </div>
                {["Abonnement gratuit 12 mois", "0 % de commission 6 mois", "Mise en avant prioritaire", "Badge exclusif sur profil"].map(a => (
                  <p key={a} className="font-hanken text-xs flex items-center gap-1.5"
                    style={{ color: founderFull ? "rgba(243,234,219,.25)" : "rgba(243,234,219,.6)" }}>
                    <span style={{ color: founderFull ? "rgba(107,114,128,.4)" : "#FFD700" }}>✓</span> {a}
                  </p>
                ))}
              </div>

              {/* Pioneer */}
              <div className="rounded-2xl p-5 border"
                style={{
                  background: earlyFull
                    ? "rgba(107,114,128,.06)"
                    : "linear-gradient(135deg,rgba(167,139,250,.06),rgba(224,51,126,.04))",
                  borderColor: earlyFull ? "rgba(107,114,128,.15)" : "rgba(167,139,250,.2)",
                }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    <div>
                      <p className="font-fraunces text-base text-[#a78bfa]">Pionnier·e</p>
                      <p className="font-mono text-[9px] text-[#101014]/30">Rang 21-120</p>
                    </div>
                  </div>
                  {earlyFull ? (
                    <span className="font-mono text-[9px] px-2 py-1 rounded-full bg-[#101014]/5 text-[#101014]/30 border border-[#101014]/8">Complet</span>
                  ) : (
                    <span className="font-mono text-[10px] font-bold text-[#a78bfa]">
                      {loaded ? `${counts.early_remaining} restante${counts.early_remaining > 1 ? "s" : ""}` : "…"}
                    </span>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-[#101014]/8 overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${earlyPct}%`,
                      background: earlyFull ? "rgba(107,114,128,.4)" : "linear-gradient(90deg,#a78bfa,#FF2DA0)",
                    }} />
                </div>
                {["Abonnement gratuit 6 mois", "0 % de commission 3 mois", "Badge Pionnier·e sur profil", "Accès anticipé aux features"].map(a => (
                  <p key={a} className="font-hanken text-xs flex items-center gap-1.5"
                    style={{ color: earlyFull ? "rgba(243,234,219,.25)" : "rgba(243,234,219,.6)" }}>
                    <span style={{ color: earlyFull ? "rgba(107,114,128,.4)" : "#a78bfa" }}>✓</span> {a}
                  </p>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/vendeur/onboarding"
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-hanken font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg,#7A2BF0,#FF2DA0)", boxShadow: "0 8px 30px rgba(109,45,181,.4)" }}>
                Rejoindre le programme
                <ArrowRight size={15} />
              </Link>
              <Link href="/programme-fondateur"
                className="font-mono text-[11px] text-[#101014]/35 hover:text-[#101014]/70 transition-colors flex items-center gap-1">
                En savoir plus <ArrowRight size={10} />
              </Link>
              <p className="font-mono text-[10px] text-[#101014]/25 sm:ml-auto">
                {loaded ? `${counts.founder_count + counts.early_adopter_count} vendeur·ses inscrits` : "…"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
