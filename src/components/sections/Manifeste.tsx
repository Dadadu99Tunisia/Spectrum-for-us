"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { useSiteContent } from "@/lib/useSiteContent";

// Helper: lit une clé CMS et retourne la valeur ou le fallback
function useCMS(key: string, fallback: string) {
  const { value } = useSiteContent(key);
  return value ?? fallback;
}

export function Manifeste() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  // CMS values — fallback = texte d'origine (le site fonctionne même si la DB est vide)
  const eyebrow      = useCMS("manifeste_eyebrow",      "Notre manifeste");
  const title        = useCMS("manifeste_title",        "Cultiver les différences pour une société");
  const titleItalic  = useCMS("manifeste_title_italic", "plus ouverte.");
  const p1           = useCMS("manifeste_p1",           "La communauté queer représente la <strong>4ᵉ économie mondiale</strong>. Pourtant, presque aucune marketplace ne lui est réellement dédiée — ni pensée par elle, ni construite pour elle.");
  const p2           = useCMS("manifeste_p2",           "Spectrum For Us est cet espace. Un lieu où chaque achat est un geste de soin envers quelqu'un·e de ta communauté. Où chaque création porte une histoire vraie. Où appartenir est suffisant pour être ici.");
  const p3           = useCMS("manifeste_p3",           "Pas un site marchand. Un <strong>refuge prismatique</strong> — ouvert, tenu, traversé de lumière.");

  const stats = [
    { num: useCMS("manifeste_stat1_num", "4ème"),  label: useCMS("manifeste_stat1_label", "économie mondiale") },
    { num: useCMS("manifeste_stat2_num", "100%"),  label: useCMS("manifeste_stat2_label", "communautaire") },
    { num: useCMS("manifeste_stat3_num", "3"),     label: useCMS("manifeste_stat3_label", "types d'offres") },
    { num: useCMS("manifeste_stat4_num", "Safe"),  label: useCMS("manifeste_stat4_label", "space garanti") },
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

      <div className="max-w-3xl mx-auto">
        <span
          className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-8 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {eyebrow}
        </span>

        <h2
          className="font-fraunces text-4xl md:text-5xl lg:text-6xl text-[#F3EADB] leading-[1.05] mb-10 transition-all duration-700 delay-100"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {title}{" "}
          <span className="italic text-[#F2B79E]">{titleItalic}</span>
        </h2>

        <div
          className="space-y-5 text-[#F3EADB]/70 text-lg leading-relaxed transition-all duration-700 delay-200"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: p1 }} />
          <p dangerouslySetInnerHTML={{ __html: p2 }} />
          <p dangerouslySetInnerHTML={{ __html: p3 }} />
        </div>

        <div
          className="mt-12 pt-8 border-t border-[#F3EADB]/10 flex flex-wrap gap-8 transition-all duration-700 delay-400"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {stats.map(({ num, label }) => (
            <div key={label}>
              <div className="font-fraunces text-3xl text-[#E0337E] leading-none">{num}</div>
              <div className="font-mono text-xs tracking-wide text-[#F3EADB]/40 uppercase mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
