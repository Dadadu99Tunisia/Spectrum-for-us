"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

const CREATORS = [
  {
    id: 1,
    name: "Maëlis",
    pronouns: "iel/elle",
    shop: "Maëlis Artwork",
    category: "Art & Illustration",
    categoryVariant: "magenta" as const,
    bio: "Créations numériques et prints autour de l'identité queer, du corps et de la joie.",
    bg: "#2a1040",
    accent: "#6D2DB5",
  },
  {
    id: 2,
    name: "Théo",
    pronouns: "il/lui",
    shop: "Atelier Lumis",
    category: "Bijoux",
    categoryVariant: "teal" as const,
    bio: "Bijoux forgés à la main, pièces uniques et petites séries. Matériaux durables.",
    bg: "#0e1e1f",
    accent: "#1C9C95",
  },
  {
    id: 3,
    name: "Nour",
    pronouns: "iel",
    shop: "Bare Lab",
    category: "Corps & Soin",
    categoryVariant: "peach" as const,
    bio: "Formulations naturelles pour des rituels de soin inclusifs et sans compromis.",
    bg: "#1f1408",
    accent: "#F2B79E",
  },
  {
    id: 4,
    name: "Collectif Roseau",
    pronouns: "iel·le·s",
    shop: "Collectif Roseau",
    category: "Zines & Édition",
    categoryVariant: "magenta" as const,
    bio: "Fanzines, publications indépendantes et ateliers d'écriture queer.",
    bg: "#1a0d28",
    accent: "#E0337E",
  },
];

export function Createurs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} id="createurs" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-3">
            Les visages
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl text-[#F3EADB] leading-tight">
            Créateur·rice·s{" "}
            <span className="italic text-[#F2B79E]">du spectre</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CREATORS.map((c, i) => (
            <div
              key={c.id}
              className="transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <Card className="overflow-hidden group cursor-pointer">
                {/* Avatar area */}
                <div
                  className="relative h-48 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: c.bg }}
                >
                  <div
                    className="w-20 h-20 rounded-full border-2 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                    style={{ borderColor: c.accent, backgroundColor: `${c.accent}20` }}
                  >
                    <span className="font-fraunces text-2xl font-semibold" style={{ color: c.accent }}>
                      {c.name[0]}
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      background: `radial-gradient(circle at 50% 70%, ${c.accent}40, transparent 60%)`,
                    }}
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bricolage font-bold text-[#F3EADB] text-lg leading-tight">
                      {c.name}
                    </h3>
                    <span className="font-mono text-[10px] text-[#F3EADB]/35 whitespace-nowrap mt-1">
                      {c.pronouns}
                    </span>
                  </div>
                  <Tag variant={c.categoryVariant} className="mb-3">
                    {c.category}
                  </Tag>
                  <p className="font-hanken text-sm text-[#F3EADB]/55 leading-relaxed">
                    {c.bio}
                  </p>
                  <div className="mt-4 font-mono text-xs text-[#F3EADB]/30 group-hover:text-[#E0337E] transition-colors duration-200">
                    ( Voir la boutique )
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div
          className="mt-10 text-center transition-all duration-700 delay-500"
          style={{ opacity: inView ? 1 : 0 }}
        >
          <a
            href="#"
            className="font-mono text-xs tracking-widest uppercase text-[#F3EADB]/40 hover:text-[#E0337E] transition-colors duration-200"
          >
            ( Tous les créateur·rice·s )
          </a>
        </div>
      </div>
    </section>
  );
}
