"use client";
import { useRef } from "react";
import Link from "next/link";
import { useInView } from "@/lib/useInView";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const PROFILES = [
  { emoji: "🎨", title: "Créateur·ices", desc: "Mode, bijoux, art, zines, cosmétiques…" },
  { emoji: "🎭", title: "Artistes", desc: "Musique, danse, performance, photo…" },
  { emoji: "🌿", title: "Thérapeutes", desc: "Sophrologie, psy, bien-être, coaching…" },
  { emoji: "⚖️", title: "Avocat·es", desc: "Droit de la famille, identité, discrimination…" },
  { emoji: "💻", title: "Freelances", desc: "Graphisme, vidéo, dev, traduction…" },
  { emoji: "🩺", title: "Soignant·es alliés", desc: "Médecins, sages-femmes, dentistes…" },
];

export function RejoindreCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const { t } = useI18n();

  return (
    <section ref={ref} className="py-24 px-6 bg-[#2A1540]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <span className="inline-block font-mono text-[11px] tracking-widest uppercase text-[#E0337E] mb-4 px-4 py-1.5 rounded-full border border-[#E0337E]/20 bg-[#E0337E]/8">
            {t("rejoindre_cta.eyebrow")}
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl font-light mb-4">
            {t("rejoindre_cta.title")}{" "}
            <span className="italic text-[#F2B79E]">{t("rejoindre_cta.title_em")}</span>
          </h2>
          <p className="font-hanken text-[#F3EADB]/55 max-w-xl mx-auto leading-relaxed">
            {t("rejoindre_cta.subtitle")}
          </p>
        </div>

        {/* Profiles grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {PROFILES.map((p, i) => (
            <div
              key={p.title}
              className="rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.025] p-5 hover:border-[#E0337E]/25 hover:bg-[#E0337E]/5 transition-all duration-300"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(16px)",
                transition: `opacity 0.6s ease ${i * 60 + 200}ms, transform 0.6s ease ${i * 60 + 200}ms, border-color 0.3s, background-color 0.3s`,
              }}
            >
              <div className="text-2xl mb-3">{p.emoji}</div>
              <div className="font-bricolage font-semibold text-[#F3EADB] text-base mb-1">{p.title}</div>
              <div className="font-hanken text-xs text-[#F3EADB]/45 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center transition-all duration-700 delay-500"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)" }}
        >
          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#E0337E] text-white font-hanken font-semibold text-base hover:bg-[#E0337E]/85 hover:scale-[1.02] transition-all duration-200 shadow-xl shadow-[#E0337E]/20"
          >
            {t("rejoindre_cta.cta")} <ArrowRight size={16} />
          </Link>
          <p className="font-hanken text-xs text-[#F3EADB]/30 mt-4">
            {t("rejoindre_cta.disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
