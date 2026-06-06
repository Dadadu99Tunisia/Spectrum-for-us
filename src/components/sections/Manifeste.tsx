"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { useI18n } from "@/contexts/I18nContext";

export function Manifeste() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const { t } = useI18n();

  const DECLARATIONS = [
    { text: t("manifeste.d1_text"), emphasis: t("manifeste.d1_em"), delay: 0 },
    { text: t("manifeste.d2_text"), emphasis: t("manifeste.d2_em"), delay: 120 },
    { text: t("manifeste.d3_text"), emphasis: t("manifeste.d3_em"), delay: 240 },
    { text: t("manifeste.d4_text"), emphasis: t("manifeste.d4_em"), delay: 360 },
  ];

  const STATS = [
    { value: t("manifeste.stat1_value"), label: t("manifeste.stat1_label") },
    { value: t("manifeste.stat2_value"), label: t("manifeste.stat2_label") },
    { value: t("manifeste.stat3_value"), label: t("manifeste.stat3_label") },
    { value: t("manifeste.stat4_value"), label: t("manifeste.stat4_label") },
  ];

  return (
    <section
      ref={ref}
      id="manifeste"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Left prism accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          background: "linear-gradient(180deg, #E0533A, #E0901E, #CF3F7C, #6D2DB5, #1C9C95)",
        }}
      />

      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="max-w-3xl mx-auto">
        <span
          className="font-mono text-[11px] tracking-wide text-[#E0337E] block mb-12 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {t("manifeste.eyebrow")}
        </span>

        {/* Declaration blocks */}
        <div className="space-y-10 mb-16">
          {DECLARATIONS.map((d, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${100 + d.delay}ms`,
              }}
            >
              <p className="font-hanken text-xl md:text-2xl text-[#F3EADB]/50 leading-relaxed">
                {d.text}
              </p>
              <p className="font-fraunces text-xl md:text-2xl text-[#F3EADB] leading-relaxed italic font-bold">
                {d.emphasis}
              </p>
            </div>
          ))}
        </div>

        {/* The turn */}
        <div
          className="pt-10 border-t border-[#F3EADB]/10 space-y-6 transition-all duration-700 delay-500"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="font-fraunces text-3xl md:text-4xl text-[#F3EADB] leading-tight">
            {t("manifeste.turn_title")}{" "}
            <span className="italic text-[#E0337E]">{t("manifeste.turn_em")}</span>
          </p>
          <p className="font-hanken text-lg text-[#F3EADB]/60 leading-relaxed max-w-2xl">
            {t("manifeste.turn_p1")} <em className="text-[#F3EADB]/80 not-italic font-medium">{t("manifeste.turn_p1_em")}</em>
          </p>
          <p className="font-hanken text-lg text-[#F3EADB]/60 leading-relaxed max-w-2xl">
            {t("manifeste.turn_p2")}{" "}
            <strong className="text-[#F3EADB]/90 font-semibold">{t("manifeste.turn_p2_em")}</strong>
          </p>
        </div>

        {/* Stats · reframed as facts, not features */}
        <div
          className="mt-14 pt-8 border-t border-[#F3EADB]/8 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 delay-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="font-fraunces text-3xl text-[#E0337E] leading-none tabular-nums mb-2">
                {value}
              </div>
              <div className="font-mono text-[10px] tracking-wide text-[#F3EADB]/35 uppercase leading-relaxed whitespace-pre-line">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
