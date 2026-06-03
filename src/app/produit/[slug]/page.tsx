"use client";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Heart, Star, ArrowLeft, ShoppingBag, Check } from "lucide-react";

// Mock data — à remplacer par fetch Supabase
const MOCK = {
  id: "bague-spectre",
  name: "Bague Spectre",
  creator: "Atelier Lumis",
  creatorSlug: "atelier-lumis",
  price: 68,
  tag: "Bijoux",
  description: `Forgée à la main dans notre atelier. Chaque bague Spectre est une pièce unique : les reflets du métal changent selon la lumière, comme un prisme qui révèle le spectre caché dans l'ordinaire.

Matériaux : laiton recyclé, finition oxydée et polie. Taille ajustable. Livrée dans une pochette en tissu avec carte d'authenticité.`,
  variants: ["XS", "S", "M", "L", "XL"],
  images: ["#2d1545", "#1a0d28", "#0e1e1f"],
  rating: 4.8,
  reviews: 24,
  accent: "#1C9C95",
};

export default function ProduitPage() {
  const [selectedVariant, setSelectedVariant] = useState(MOCK.variants[2]);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { add } = useCart();

  const handleAdd = () => {
    add({
      id: MOCK.id,
      name: MOCK.name,
      creator: MOCK.creator,
      price: MOCK.price,
      quantity: qty,
      type: "product",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <a href="/" className="flex items-center gap-1.5 text-[#F3EADB]/40 hover:text-[#E0337E] text-sm font-hanken transition-colors">
              <ArrowLeft size={14} /> Accueil
            </a>
            <span className="text-[#F3EADB]/20">/</span>
            <span className="text-[#F3EADB]/40 text-sm font-hanken">{MOCK.tag}</span>
            <span className="text-[#F3EADB]/20">/</span>
            <span className="text-[#F3EADB]/60 text-sm font-hanken">{MOCK.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-3">
              <div
                className="relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center"
                style={{ backgroundColor: MOCK.images[activeImg] }}
              >
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `radial-gradient(circle at 40% 40%, ${MOCK.accent}30, transparent 60%)`
                }} />
                <span className="font-fraunces text-[8rem] font-light text-[#F3EADB]/10 select-none">(u)</span>
                <button
                  onClick={() => setLiked(!liked)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#1C0E29]/60 backdrop-blur-sm"
                >
                  <Heart size={18} className={liked ? "fill-[#E0337E] text-[#E0337E]" : "text-[#F3EADB]/50"} />
                </button>
              </div>
              <div className="flex gap-2">
                {MOCK.images.map((bg, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-1 aspect-square rounded-xl border-2 transition-all duration-200 ${activeImg === i ? "border-[#E0337E]" : "border-transparent"}`}
                    style={{ backgroundColor: bg }}
                  />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="lg:pt-4">
              <Tag variant="teal" className="mb-4">{MOCK.tag}</Tag>

              <h1 className="font-fraunces text-4xl md:text-5xl text-[#F3EADB] leading-tight mb-2">
                {MOCK.name}
              </h1>

              <a href={`/boutique/${MOCK.creatorSlug}`} className="font-mono text-sm text-[#F3EADB]/40 hover:text-[#E0337E] transition-colors block mb-4">
                par {MOCK.creator}
              </a>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={14} className={s <= Math.floor(MOCK.rating) ? "fill-[#E0901E] text-[#E0901E]" : "text-[#F3EADB]/20"} />
                  ))}
                </div>
                <span className="font-mono text-xs text-[#F3EADB]/40">{MOCK.rating} · {MOCK.reviews} avis</span>
              </div>

              <div className="text-3xl font-fraunces text-[#F3EADB] mb-8">{MOCK.price} €</div>

              {/* Variants */}
              <div className="mb-6">
                <p className="font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-3">
                  Taille — {selectedVariant}
                </p>
                <div className="flex flex-wrap gap-2">
                  {MOCK.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-12 h-12 rounded-xl border font-hanken text-sm font-medium transition-all duration-200 ${
                        selectedVariant === v
                          ? "border-[#E0337E] bg-[#E0337E]/10 text-[#E0337E]"
                          : "border-[#F3EADB]/15 text-[#F3EADB]/60 hover:border-[#F3EADB]/40"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-[#F3EADB]/15 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 text-[#F3EADB]/60 hover:text-[#F3EADB] text-xl transition-colors">−</button>
                  <span className="w-10 text-center font-mono text-sm text-[#F3EADB]">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-11 h-11 text-[#F3EADB]/60 hover:text-[#F3EADB] text-xl transition-colors">+</button>
                </div>
                <span className="font-mono text-sm text-[#F3EADB]/40">= {MOCK.price * qty} €</span>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-hanken font-semibold transition-all duration-300 ${
                    added
                      ? "bg-[#1C9C95] text-[#F3EADB]"
                      : "bg-[#E0337E] text-[#F3EADB] hover:brightness-110 active:scale-95"
                  }`}
                >
                  {added ? <><Check size={16} /> Ajouté au panier</> : <><ShoppingBag size={16} /> Ajouter au panier</>}
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className="p-4 border border-[#F3EADB]/15 rounded-full hover:border-[#E0337E]/40 transition-colors"
                >
                  <Heart size={18} className={liked ? "fill-[#E0337E] text-[#E0337E]" : "text-[#F3EADB]/50"} />
                </button>
              </div>

              {/* Description */}
              <div className="border-t border-[#F3EADB]/8 pt-6">
                <p className="font-hanken text-[#F3EADB]/60 leading-relaxed text-sm whitespace-pre-line">
                  {MOCK.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
