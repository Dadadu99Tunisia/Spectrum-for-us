"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";

const DECLARATIONS = [
  {
    text: "On n'a pas construit une marketplace.",
    emphasis: "On a construit un refus.",
    delay: 0,
  },
  {
    text: "Le refus de disparaître des algorithmes.",
    emphasis: "Le refus d'être une niche rentable pour d'autres.",
    delay: 120,
  },
  {
    text: "Le refus que nos créations soient shadowbannées.",
    emphasis: "Que nos corps soient modérés.",
    delay: 240,
  },
  {
    text: "Le refus que l'argent de nos achats finance des espaces qui nous tolèrent",
    emphasis: "mais ne nous appartiennent pas.",
    delay: 360,
  },
];

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
          className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-12 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          ✦ Notre manifeste
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
              <p className="font-fraunces text-xl md:text-2xl text-[#F3EADB] leading-relaxed italic">
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
            Spectrum For Us, c&apos;est l&apos;espace{" "}
            <span className="italic text-[#E0337E]">qu&apos;on s&apos;est fait.</span>
          </p>
          <p className="font-hanken text-lg text-[#F3EADB]/60 leading-relaxed max-w-2xl">
            Un endroit où chaque achat va directement dans les mains d&apos;une personne
            qui a décidé que son identité était une force. Où chaque boutique est
            un acte de visibilité. Où chaque vente dit : <em className="text-[#F3EADB]/80 not-italic font-medium">nous existons, et nous créons.</em>
          </p>
          <p className="font-hanken text-lg text-[#F3EADB]/60 leading-relaxed max-w-2xl">
            Ce n&apos;est pas une alternative à Amazon ou Etsy.{" "}
            <strong className="text-[#F3EADB]/90 font-semibold">C&apos;est leur réponse.</strong>
          </p>
        </div>

        {/* Stats — reframed as facts, not features */}
        <div
          className="mt-14 pt-8 border-t border-[#F3EADB]/8 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 delay-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {[
            { value: "100%", label: "des revenus restent\nchez les créateur·ices" },
            { value: "0", label: "tolérance pour\nla discrimination" },
            { value: "3", label: "façons d'exister\nici (produit, service, expérience)" },
            { value: "Safe", label: "pour toi,\nquoi que tu sois" },
          ].map(({ value, label }) => (
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
