"use client";
import { useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight } from "lucide-react";

const CREATORS = [
  {
    id: 1,
    name: "Maëlis",
    pronouns: "iel/elle",
    shop: "Maëlis Artwork",
    category: "Art & Illustration",
    categoryVariant: "magenta" as const,
    quote: "J'ai été shadowbanné trois fois pour avoir dessiné deux hommes qui s'embrassaient. Ici, c'est mon œuvre principale.",
    bio: "Créations numériques et prints autour de l'identité queer, du corps et de la joie radicale.",
    accentColor: "#6D2DB5",
    bgColor: "#F1ECE3",
  },
  {
    id: 2,
    name: "Théo",
    pronouns: "il/lui",
    shop: "Atelier Lumis",
    category: "Bijoux",
    categoryVariant: "teal" as const,
    quote: "Mes bijoux ont une histoire. Ils ont été portés à des mariages que la loi ne reconnaissait pas encore.",
    bio: "Bijoux forgés à la main, pièces uniques. Chaque métal porte la trace d'une célébration.",
    accentColor: "#1C9C95",
    bgColor: "#0a1a1b",
  },
  {
    id: 3,
    name: "Nour",
    pronouns: "iel",
    shop: "Bare Lab",
    category: "Corps & Soin",
    categoryVariant: "peach" as const,
    quote: "J'ai commencé à formuler pour moi. Parce que je ne me reconnaissais pas dans les soins qu'on me vendait.",
    bio: "Formulations naturelles pour des rituels de soin inclusifs, faits pour tous les corps, sans exception.",
    accentColor: "#1A1612",
    bgColor: "#1f1408",
  },
  {
    id: 4,
    name: "Collectif Roseau",
    pronouns: "iel·le·s",
    shop: "Collectif Roseau",
    category: "Zines & Édition",
    categoryVariant: "magenta" as const,
    quote: "On publie des histoires que les maisons d'édition trouvent \"trop spécifiques\". Trop spécifiques pour qui ?",
    bio: "Fanzines, publications indépendantes et ateliers d'écriture queer. La marge est un endroit.",
    accentColor: "#FF3D7F",
    bgColor: "#F1ECE3",
  },
];

function CreatorCard({
  creator,
  index,
  inView,
}: {
  creator: typeof CREATORS[0];
  index: number;
  inView: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="transition-all duration-700 cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${index * 100}ms`,
      }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="relative h-full" style={{ perspective: "1000px" }}>
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="rounded-2xl overflow-hidden border border-[#1A1612]/8 hover:border-[#1A1612]/15 transition-colors"
            style={{ backfaceVisibility: "hidden", background: creator.bgColor }}
          >
            {/* Quote strip */}
            <div className="relative px-6 pt-8 pb-5">
              <div
                className="absolute top-5 left-5 font-fraunces text-5xl leading-none opacity-20"
                style={{ color: creator.accentColor }}
              >
                "
              </div>
              <p
                className="font-fraunces text-base text-[#1A1612] leading-snug pl-4 italic relative z-10"
              >
                {creator.quote}
              </p>
            </div>

            {/* Divider */}
            <div
              className="mx-6 h-px opacity-20"
              style={{ background: creator.accentColor }}
            />

            {/* Identity */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-fraunces font-semibold"
                    style={{ background: `${creator.accentColor}25`, color: creator.accentColor }}
                  >
                    {creator.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bricolage font-bold text-[#1A1612] text-sm leading-tight">
                      {creator.name}
                    </h3>
                    <span className="font-mono text-[10px] text-[#1A1612]/30">
                      {creator.pronouns}
                    </span>
                  </div>
                </div>
              </div>
              <Tag variant={creator.categoryVariant} className="mb-3 text-[10px]">
                {creator.category}
              </Tag>
              <p className="font-hanken text-xs text-[#1A1612]/45 leading-relaxed">
                {creator.bio}
              </p>
              <div
                className="mt-4 flex items-center gap-1 font-mono text-[10px] tracking-wider transition-colors duration-200"
                style={{ color: `${creator.accentColor}70` }}
              >
                <span>Voir la boutique</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#FF3D7F] block mb-3">
            Les visages
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl text-[#1A1612] leading-tight">
            Iels créent.{" "}
            <span className="italic text-[#1A1612]">Iels racontent.</span>
          </h2>
          <p className="font-hanken text-[#1A1612]/50 mt-3 max-w-xl text-lg leading-relaxed">
            Derrière chaque boutique, une personne qui a décidé que son art
            méritait un espace à lui.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CREATORS.map((creator, i) => (
            <CreatorCard key={creator.id} creator={creator} index={i} inView={inView} />
          ))}
        </div>

        <div
          className="mt-10 text-center transition-all duration-700 delay-500"
          style={{ opacity: inView ? 1 : 0 }}
        >
          <a
            href="/decouvrir"
            className="font-mono text-xs tracking-widest uppercase text-[#1A1612]/40 hover:text-[#FF3D7F] transition-colors duration-200"
          >
            ( Toutes les boutiques )
          </a>
        </div>
      </div>
    </section>
  );
}
