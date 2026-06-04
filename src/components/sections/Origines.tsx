"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import Link from "next/link";

const FACTS = [
  {
    number: "73%",
    text: "des créateur·ices LGBTQIA+ déclarent avoir subi une modération arbitraire sur les plateformes mainstream.",
    color: "#E0337E",
  },
  {
    number: "−40%",
    text: "de revenus en moyenne lorsqu'un contenu est tagué LGBTQ+ sur les algorithmes publicitaires.",
    color: "#6D2DB5",
  },
  {
    number: "Invisible",
    text: "C'est le mot que revient le plus souvent quand on demande à nos créateur·ices comment elles et ils se sentaient avant.",
    color: "#1C9C95",
  },
];

export function Origines() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 overflow-hidden bg-[#0e0818]"
    >
      {/* Prism top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #E0337E60, #6D2DB560, #1C9C9560, transparent)" }}
      />

      {/* Ambient glow — purple left */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: "#6D2DB5" }}
      />
      {/* Ambient glow — teal right */}
      <div
        className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ background: "#1C9C95" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Eyebrow */}
        <div
          className="mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
        >
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#1C9C95] block mb-6">
            ◈ Pourquoi ça existe
          </span>

          <blockquote className="font-fraunces text-3xl md:text-4xl lg:text-5xl text-[#F3EADB] leading-[1.2] max-w-3xl">
            On nous a dit que nos histoires ne valaient pas assez.{" "}
            <span className="text-[#F3EADB]/40">Que nos corps dérangeaient.</span>{" "}
            <span className="italic text-[#F2B79E]">On a construit un endroit où c&apos;est faux.</span>
          </blockquote>
        </div>

        {/* Facts grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F3EADB]/6 rounded-2xl overflow-hidden mb-16 transition-all duration-700 delay-200"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)" }}
        >
          {FACTS.map((fact, i) => (
            <div
              key={i}
              className="bg-[#0e0818] p-8 hover:bg-[#1a0d28] transition-colors duration-300"
            >
              <div
                className="font-fraunces text-4xl md:text-5xl mb-4 leading-none"
                style={{ color: fact.color }}
              >
                {fact.number}
              </div>
              <p className="font-hanken text-sm text-[#F3EADB]/55 leading-relaxed">
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
            <p className="font-hanken text-lg text-[#F3EADB]/65 leading-relaxed">
              Les plateformes mainstream ne sont pas neutres. Leurs algorithmes
              apprennent de millions de biais. Leurs équipes de modération
              ont des angles morts. Leurs règles publicitaires punissent
              ce qui dérange la majorité.
            </p>
            <p className="font-hanken text-lg text-[#F3EADB]/65 leading-relaxed">
              Spectrum For Us a été construit pour que ces règles ne nous concernent plus.
              Ici, <strong className="text-[#F3EADB]/90">la communauté est le produit principal.</strong>{" "}
              Pas le problème à gérer.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Modération humaine et queer", check: true },
              { label: "Aucun shadowban algorithmique", check: true },
              { label: "Commission reversée directement aux créateur·ices", check: true },
              { label: "Charte inclusive, sans compromis", check: true },
              { label: "\"Vos contenus violent nos standards\"", check: false },
            ].map(({ label, check }) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{
                    background: check ? "#1C9C9520" : "#E0337E15",
                    border: `1px solid ${check ? "#1C9C9540" : "#E0337E30"}`,
                    color: check ? "#1C9C95" : "#E0337E60",
                  }}
                >
                  {check ? "✓" : "✕"}
                </span>
                <span
                  className="font-hanken text-sm"
                  style={{ color: check ? "#F3EADB80" : "#F3EADB30", textDecoration: check ? "none" : "line-through" }}
                >
                  {label}
                </span>
              </div>
            ))}

            <Link
              href="/rejoindre"
              className="inline-flex items-center gap-2 mt-4 font-mono text-xs tracking-widest uppercase text-[#E0337E] hover:text-[#F2B79E] transition-colors"
            >
              Rejoindre le mouvement →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
