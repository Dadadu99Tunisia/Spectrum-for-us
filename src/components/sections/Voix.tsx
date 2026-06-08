"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";

const TESTIMONIALS = [
  {
    quote: "Pour la première fois, j'ai acheté un cadeau à ma partenaire sans avoir honte du regard du vendeur.",
    name: "Sarah",
    location: "Paris",
    role: "acheteuse",
    color: "#FF2DA0",
  },
  {
    quote: "En 3 semaines sur Spectrum, j'ai vendu plus que mes 6 mois sur une plateforme mainstream. L'audience, elle comprend ce que je fais.",
    name: "Collectif Roseau",
    location: "Lyon",
    role: "créateur·ice·s",
    color: "#7A2BF0",
  },
  {
    quote: "J'ai grandi dans une famille qui ne voulait pas de moi tel que je suis. Créer ici, c'est une façon de dire que j'existe quand même.",
    name: "Théo",
    location: "Tunis",
    role: "artisan bijoutier",
    color: "#2323C4",
  },
  {
    quote: "Je ne cherchais pas une marketplace. Je cherchais un endroit où mes produits de soin trans-affirmants n'auraient pas à se justifier.",
    name: "Alex",
    location: "Bruxelles",
    role: "formulateur·ice",
    color: "#FFD400",
  },
];

export function Voix() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
    >
      {/* Subtle top border */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 opacity-20"
        style={{ background: "linear-gradient(180deg, transparent, #FF2DA0)" }}
      />

      <div className="max-w-6xl mx-auto">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <span className="font-mono text-[11px] tracking-wide text-[#FF2DA0] block mb-4">
            ✦ Voix du spectre
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl text-[#101014]">
            Ce qu&apos;on entend{" "}
            <span className="italic text-[#FF2DA0]">ici.</span>
          </h2>
        </div>

        {/* Masonry-style quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-8 transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 80 + 100}ms`,
                background: `linear-gradient(135deg, ${t.color}08 0%, transparent 60%)`,
                border: `1px solid ${t.color}18`,
              }}
            >
              {/* Large opening quote */}
              <div
                className="absolute top-4 right-6 font-fraunces text-7xl leading-none opacity-10 select-none"
                style={{ color: t.color }}
              >
                "
              </div>

              <p className="font-fraunces text-xl md:text-2xl text-[#101014] leading-snug mb-6 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-fraunces font-semibold shrink-0"
                  style={{ background: `${t.color}20`, color: t.color }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bricolage font-semibold text-[#101014]/80 text-sm">
                    {t.name}
                  </p>
                  <p className="font-mono text-[10px] text-[#101014]/30">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          className="mt-12 text-center transition-all duration-700 delay-500"
          style={{ opacity: inView ? 1 : 0 }}
        >
          <p className="font-hanken text-[#101014]/30 text-sm">
            Des histoires réelles. Des voix qui ont choisi de rester.
          </p>
        </div>
      </div>
    </section>
  );
}
