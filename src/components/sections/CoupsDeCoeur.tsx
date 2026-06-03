"use client";
import { useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Heart, ShoppingBag } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Bague Spectre",
    creator: "Atelier Lumis",
    price: "68 €",
    tag: "Bijoux",
    tagVariant: "teal" as const,
    bg: "#2d1545",
    accentColor: "#1C9C95",
  },
  {
    id: 2,
    name: "Tote Bag « Exist »",
    creator: "Studio Queer",
    price: "34 €",
    tag: "Mode",
    tagVariant: "magenta" as const,
    bg: "#1e1030",
    accentColor: "#E0337E",
  },
  {
    id: 3,
    name: "Zine « Corps libres »",
    creator: "Collectif Roseau",
    price: "12 €",
    tag: "Zines",
    tagVariant: "peach" as const,
    bg: "#1a0d28",
    accentColor: "#F2B79E",
  },
  {
    id: 4,
    name: "Sérum Douceur",
    creator: "Bare Lab",
    price: "45 €",
    tag: "Corps & Soin",
    tagVariant: "teal" as const,
    bg: "#111f20",
    accentColor: "#1C9C95",
  },
  {
    id: 5,
    name: "Print « Prisme »",
    creator: "Maëlis Artwork",
    price: "28 €",
    tag: "Art",
    tagVariant: "magenta" as const,
    bg: "#2a1040",
    accentColor: "#6D2DB5",
  },
  {
    id: 6,
    name: "Bougie Feu Doux",
    creator: "La Flamme",
    price: "22 €",
    tag: "Maison",
    tagVariant: "peach" as const,
    bg: "#1f1008",
    accentColor: "#E0901E",
  },
];

function ProductCard({ product, delay }: { product: typeof PRODUCTS[0]; delay: number }) {
  const [liked, setLiked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <Card className="group overflow-hidden">
        {/* Product visual placeholder */}
        <div
          className="relative h-56 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: product.bg }}
        >
          {/* Decorative prism light */}
          <div
            className="absolute w-32 h-32 rounded-full blur-3xl opacity-30"
            style={{ background: product.accentColor }}
          />
          <span
            className="font-fraunces text-6xl font-light leading-none select-none opacity-20"
            style={{ color: product.accentColor }}
          >
            (u)
          </span>

          {/* Favorite button */}
          <button
            onClick={() => setLiked(!liked)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-[#1C0E29]/60 backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              size={16}
              className={liked ? "fill-[#E0337E] text-[#E0337E]" : "text-[#F3EADB]/50"}
              style={liked ? { filter: "drop-shadow(0 0 4px #E0337E)" } : {}}
            />
          </button>
        </div>

        <div className="p-4">
          <Tag variant={product.tagVariant} className="mb-2">
            {product.tag}
          </Tag>
          <h3 className="font-bricolage font-semibold text-[#F3EADB] text-base leading-tight mt-2">
            {product.name}
          </h3>
          <p className="font-mono text-xs text-[#F3EADB]/40 mt-1">{product.creator}</p>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-[#F3EADB]">
              {product.price}
            </span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E0337E]/10 text-[#E0337E] text-xs font-hanken font-medium hover:bg-[#E0337E]/20 transition-colors duration-200">
              <ShoppingBag size={12} />
              Ajouter
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function CoupsDeCoeur() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} id="coups-de-coeur" className="py-24 px-6 bg-[#F3EADB]/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div
          className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <div>
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-3">
              Sélection
            </span>
            <h2 className="font-fraunces text-4xl md:text-5xl text-[#F3EADB] leading-tight">
              Coups de{" "}
              <span className="italic text-[#F2B79E]">cœur</span>
            </h2>
          </div>
          <a
            href="#creations"
            className="font-mono text-xs tracking-widest uppercase text-[#F3EADB]/40 hover:text-[#E0337E] transition-colors duration-200 whitespace-nowrap"
          >
            ( Tout voir )
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
