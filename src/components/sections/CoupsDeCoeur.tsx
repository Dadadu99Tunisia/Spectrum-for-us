"use client";
import { useRef, useState, useCallback } from "react";
import { useInView } from "@/lib/useInView";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import Link from "next/link";

const PRODUCTS = [
  { id: 1, name: "Bague Spectre",     creator: "Atelier Lumis",    price: "68 €",  tag: "Bijoux",       tagVariant: "teal"    as const, bg: "#F1ECE3", accentColor: "#1C9C95" },
  { id: 2, name: "Tote Bag « Exist »",creator: "Studio Queer",     price: "34 €",  tag: "Mode",         tagVariant: "magenta" as const, bg: "#1e1030", accentColor: "#FF3D7F" },
  { id: 3, name: "Zine « Corps libres »", creator: "Collectif Roseau", price: "12 €", tag: "Zines", tagVariant: "peach" as const, bg: "#F1ECE3", accentColor: "#1A1612" },
  { id: 4, name: "Sérum Douceur",     creator: "Bare Lab",         price: "45 €",  tag: "Corps & Soin", tagVariant: "teal"    as const, bg: "#111f20", accentColor: "#1C9C95" },
  { id: 5, name: "Print « Prisme »",  creator: "Maëlis Artwork",   price: "28 €",  tag: "Art",          tagVariant: "magenta" as const, bg: "#2a1040", accentColor: "#6D2DB5" },
  { id: 6, name: "Bougie Feu Doux",   creator: "La Flamme",        price: "22 €",  tag: "Maison",       tagVariant: "peach"   as const, bg: "#1f1008", accentColor: "#E0901E" },
];

// ── 3D Tilt card ──────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -8;  // max ±8deg
    const ry = ((x - cx) / cx) * 8;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    cardRef.current.style.transition = "transform 0.1s ease-out";

    // Glow follows mouse
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(255,61,127,0.12), transparent)`;
    }
  }, []);

  const onLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    cardRef.current.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    if (glowRef.current) glowRef.current.style.background = "none";
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Dynamic glow overlay */}
      <div ref={glowRef} className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-none" />
      {children}
    </div>
  );
}

function ProductCard({ product, delay }: { product: typeof PRODUCTS[0]; delay: number }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  const handleAdd = () => {
    add({ id: String(product.id), name: product.name, creator: product.creator, price: parseFloat(product.price), quantity: 1, type: "product" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

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
      <TiltCard>
        <Card className="group overflow-hidden h-full">
          {/* Product visual */}
          <div
            className="relative h-56 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: product.bg }}
          >
            {/* Animated glow blob */}
            <div
              className="absolute w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 group-hover:scale-125 transition-all duration-700"
              style={{ background: product.accentColor }}
            />
            <span
              className="font-fraunces text-6xl font-light leading-none select-none opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"
              style={{ color: product.accentColor }}
            >
              (u)
            </span>

            {/* Favorite button */}
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-[#FBF9F5]/60 backdrop-blur-sm transition-all duration-300 hover:scale-110"
              aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart
                size={16}
                className={liked ? "fill-[#FF3D7F] text-[#FF3D7F]" : "text-[#1A1612]/50"}
                style={liked ? { filter: "drop-shadow(0 0 4px #FF3D7F)" } : {}}
              />
            </button>

            {/* Hover overlay reveal */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9F5]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-4">
              <span className="font-mono text-[10px] tracking-widest text-[#1A1612]/60 uppercase">
                Vue rapide
              </span>
            </div>
          </div>

          <div className="p-4">
            <Tag variant={product.tagVariant} className="mb-2">
              {product.tag}
            </Tag>
            <h3 className="font-bricolage font-semibold text-[#1A1612] text-base leading-tight mt-2">
              {product.name}
            </h3>
            <p className="font-mono text-xs text-[#1A1612]/40 mt-1">{product.creator}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[#1A1612]">
                {product.price}
              </span>
              <button
                onClick={handleAdd}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-hanken font-medium transition-all duration-200 ${
                  added ? "bg-green-500/20 text-green-400 scale-95" : "bg-[#FF3D7F]/10 text-[#FF3D7F] hover:bg-[#FF3D7F]/20 hover:scale-105"
                }`}
              >
                {added ? <Check size={12} /> : <ShoppingBag size={12} />}
                {added ? "Ajouté !" : "Ajouter"}
              </button>
            </div>
          </div>
        </Card>
      </TiltCard>
    </div>
  );
}

export function CoupsDeCoeur() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} id="coups-de-coeur" className="py-24 px-6 bg-[#1A1612]/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div
          className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <div>
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#FF3D7F] block mb-3">
              Sélection
            </span>
            <h2 className="font-fraunces text-4xl md:text-5xl text-[#1A1612] leading-tight">
              Coups de{" "}
              <span className="italic text-[#1A1612]">cœur</span>
            </h2>
          </div>
          <Link
            href="/decouvrir"
            className="font-mono text-xs tracking-widest uppercase text-[#1A1612]/40 hover:text-[#FF3D7F] transition-colors duration-200 whitespace-nowrap"
          >
            ( Tout voir )
          </Link>
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
