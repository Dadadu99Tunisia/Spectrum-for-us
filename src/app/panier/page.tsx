"use client";
import { useCart } from "@/store/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PanierPage() {
  const { items, remove, update, total, clear } = useCart();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-2">Mon panier</span>
            <h1 className="font-fraunces text-4xl text-[#F3EADB]">
              {items.length === 0 ? "Ton panier est vide" : `${items.length} article${items.length > 1 ? "s" : ""}`}
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto mb-6 text-[#F3EADB]/20" />
              <p className="font-hanken text-[#F3EADB]/40 mb-8">
                Tu n&apos;as pas encore ajouté d&apos;article.
              </p>
              <Button variant="primary" href="/">
                Explorer la marketplace
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.02]"
                  >
                    <div className="w-20 h-20 rounded-xl bg-[#2d1545] flex items-center justify-center shrink-0">
                      <span className="font-fraunces text-2xl text-[#E0337E]/40">(u)</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bricolage font-semibold text-[#F3EADB] truncate">{item.name}</h3>
                      <p className="font-mono text-xs text-[#F3EADB]/40 mb-3">{item.creator}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#F3EADB]/15 rounded-lg overflow-hidden">
                          <button onClick={() => update(item.id, item.quantity - 1)} className="w-8 h-8 text-[#F3EADB]/60 hover:text-[#F3EADB] text-sm transition-colors">−</button>
                          <span className="w-8 text-center font-mono text-xs text-[#F3EADB]">{item.quantity}</span>
                          <button onClick={() => update(item.id, item.quantity + 1)} className="w-8 h-8 text-[#F3EADB]/60 hover:text-[#F3EADB] text-sm transition-colors">+</button>
                        </div>
                        <span className="font-mono text-sm font-bold text-[#F3EADB]">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                    <button onClick={() => remove(item.id)} className="p-2 text-[#F3EADB]/30 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={clear} className="text-xs font-mono text-[#F3EADB]/25 hover:text-red-400 transition-colors tracking-widest uppercase">
                  ( Vider le panier )
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.03] p-6">
                  <div className="prism-line mb-6" />
                  <h2 className="font-bricolage font-bold text-[#F3EADB] text-lg mb-6">Récapitulatif</h2>

                  <div className="space-y-3 mb-6 text-sm font-hanken">
                    <div className="flex justify-between text-[#F3EADB]/60">
                      <span>Sous-total</span>
                      <span>{total().toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-[#F3EADB]/60">
                      <span>Livraison</span>
                      <span className="text-[#1C9C95]">Calculée à l&apos;étape suivante</span>
                    </div>
                    <div className="border-t border-[#F3EADB]/10 pt-3 flex justify-between text-[#F3EADB] font-semibold text-base">
                      <span>Total estimé</span>
                      <span>{total().toFixed(2)} €</span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <button className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#E0337E] text-[#F3EADB] font-hanken font-semibold hover:brightness-110 transition-all active:scale-95">
                      Commander <ArrowRight size={16} />
                    </button>
                  </Link>

                  <p className="text-center mt-4 font-mono text-[10px] text-[#F3EADB]/25 tracking-wide">
                    Paiement sécurisé · Stripe
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
