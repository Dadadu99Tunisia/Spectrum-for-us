"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";

export function Manifeste() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

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
          Notre manifeste
        </span>

        <h2
          className="font-fraunces text-4xl md:text-5xl lg:text-6xl text-[#F3EADB] leading-[1.05] mb-10 transition-all duration-700 delay-100"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          Cultiver les différences pour une société{" "}
          <span className="italic text-[#F2B79E]">plus ouverte.</span>
        </h2>

        <div
          className="space-y-5 text-[#F3EADB]/70 text-lg leading-relaxed transition-all duration-700 delay-200"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p>
            La communauté queer représente la{" "}
            <span className="text-[#F2B79E] font-semibold">4ᵉ économie mondiale</span>.
            Pourtant, presque aucune marketplace ne lui est réellement dédiée — ni pensée par elle,
            ni construite pour elle.
          </p>
          <p>
            Spectrum For Us est cet espace. Un lieu où chaque achat est un geste de soin envers
            quelqu&apos;un·e de ta communauté. Où chaque création porte une histoire vraie.
            Où appartenir est suffisant pour être ici.
          </p>
          <p>
            Pas un site marchand. Un{" "}
            <span className="text-[#F3EADB] font-semibold">refuge prismatique</span> — ouvert,
            tenu, traversé de lumière.
          </p>
        </div>

        <div
          className="mt-12 pt-8 border-t border-[#F3EADB]/10 flex flex-wrap gap-8 transition-all duration-700 delay-400"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {[
            { num: "4ème", label: "économie mondiale" },
            { num: "100%", label: "communautaire" },
            { num: "3", label: "types d'offres" },
            { num: "Safe", label: "space garanti" },
          ].map(({ num, label }) => (
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
