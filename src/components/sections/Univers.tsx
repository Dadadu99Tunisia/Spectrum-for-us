"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { Card } from "@/components/ui/Card";

const categories = [
  {
    slug: "mode",
    label: "Mode non-genrée",
    emoji: "✦",
    desc: "Vêtements, accessoires et pièces pensés sans genre.",
    color: "#E0337E",
  },
  {
    slug: "art",
    label: "Art & Culture",
    emoji: "◈",
    desc: "Œuvres originales, prints, illustrations et objets d'art.",
    color: "#CF3F7C",
  },
  {
    slug: "bijoux",
    label: "Bijoux",
    emoji: "◇",
    desc: "Créations artisanales, pièces uniques et séries limitées.",
    color: "#6D2DB5",
  },
  {
    slug: "zines",
    label: "Zines & Édition",
    emoji: "▣",
    desc: "Fanzines, livres indépendants, photographie et impression.",
    color: "#1C9C95",
  },
  {
    slug: "corps",
    label: "Corps & Soin",
    emoji: "○",
    desc: "Cosmétiques, soins, wellness et produits de beauté inclusifs.",
    color: "#F2B79E",
  },
  {
    slug: "intimite",
    label: "Intimité",
    emoji: "❋",
    desc: "Produits intimes dans un espace safe et bienveillant.",
    color: "#E0901E",
  },
  {
    slug: "maison",
    label: "Maison",
    emoji: "⬡",
    desc: "Déco, objets du quotidien et environnements qui te ressemblent.",
    color: "#E0533A",
  },
];

export function Univers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} id="creations" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <span className="font-mono text-[11px] tracking-wide text-[#E0337E] block mb-3">
            L&apos;univers
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl text-[#F3EADB] leading-tight">
            Tout le spectre,{" "}
            <span
              className="prism-text"
            >
              en un lieu.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.slug}
              className="transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <Card className="p-6 h-full group cursor-pointer">
                <div
                  className="text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: cat.color }}
                  aria-hidden
                >
                  {cat.emoji}
                </div>

                <h3
                  className="font-bricolage text-lg font-semibold text-[#F3EADB] mb-2 leading-tight"
                >
                  {cat.label}
                </h3>
                <p className="font-hanken text-sm text-[#F3EADB]/50 leading-relaxed">
                  {cat.desc}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-mono text-[#F3EADB]/30 group-hover:text-[#E0337E] transition-colors duration-200">
                  <span>(</span>
                  <span>Explorer</span>
                  <span>)</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
