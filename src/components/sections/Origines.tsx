"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

export function Origines() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const { t } = useI18n();

  const FACTS = [
    { number: t("origines.fact1_num"), text: t("origines.fact1_text"), color: "#FF2DA0" },
    { number: t("origines.fact2_num"), text: t("origines.fact2_text"), color: "#7A2BF0" },
    { number: t("origines.fact3_num"), text: t("origines.fact3_text"), color: "#2323C4" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 overflow-hidden bg-[#0e0818]"
    >
      {/* Prism top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #FF2DA060, #7A2BF060, #2323C460, transparent)" }}
      />

      {/* Ambient glow · purple left */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: "#7A2BF0" }}
      />
      {/* Ambient glow · teal right */}
      <div
        className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ background: "#2323C4" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Eyebrow */}
        <div
          className="mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
        >
          <span className="font-mono text-[11px] tracking-wide text-[#2323C4] block mb-6">
            {t("origines.eyebrow")}
          </span>

          <blockquote className="font-fraunces text-3xl md:text-4xl lg:text-5xl text-[#101014] leading-[1.2] max-w-3xl">
            {t("origines.quote_main")}{" "}
            <span className="text-[#101014]/40">{t("origines.quote_dim")}</span>{" "}
            <span className="italic text-[#FF2DA0]">{t("origines.quote_em")}</span>
          </blockquote>
        </div>

        {/* Facts grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#101014]/6 rounded-2xl overflow-hidden mb-16 transition-all duration-700 delay-200"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)" }}
        >
          {FACTS.map((fact, i) => (
            <div
              key={i}
              className="bg-[#0e0818] p-8 hover:bg-[#FFFFFF] transition-colors duration-300"
            >
              <div
                className="font-fraunces text-4xl md:text-5xl mb-4 leading-none"
                style={{ color: fact.color }}
              >
                {fact.number}
              </div>
              <p className="font-hanken text-sm text-[#101014]/55 leading-relaxed">
                {fact.text}
              </p>
            </div>
          ))}
        </div>

        {/* The response */}
        <div
          className="grid md:grid-cols-2 gap-12 items-center transition-all duration-700 delay-400"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
        >
          <div className="space-y-5">
            <p className="font-hanken text-lg text-[#101014]/65 leading-relaxed">
              {t("origines.p1")}
            </p>
            <p className="font-hanken text-lg text-[#101014]/65 leading-relaxed">
              {t("origines.p2_before")}{" "}
              <strong className="text-[#101014]/90">{t("origines.p2_em")}</strong>{" "}
              {t("origines.p2_after")}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: t("origines.check1"), check: true },
              { label: t("origines.check2"), check: true },
              { label: t("origines.check3"), check: true },
              { label: t("origines.check4"), check: true },
              { label: t("origines.cross1"), check: false },
            ].map(({ label, check }) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{
                    background: check ? "#2323C420" : "#FF2DA015",
                    border: `1px solid ${check ? "#2323C440" : "#FF2DA030"}`,
                    color: check ? "#2323C4" : "#FF2DA060",
                  }}
                >
                  {check ? "✓" : "✕"}
                </span>
                <span
                  className="font-hanken text-sm"
                  style={{ color: check ? "#10101480" : "#10101430", textDecoration: check ? "none" : "line-through" }}
                >
                  {label}
                </span>
              </div>
            ))}

            <Link
              href="/rejoindre"
              className="inline-flex items-center gap-2 mt-4 font-mono text-xs tracking-wide text-[#FF2DA0] hover:text-[#FF2DA0] transition-colors"
            >
              {t("origines.cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
