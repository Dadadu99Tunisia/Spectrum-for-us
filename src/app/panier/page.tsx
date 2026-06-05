"use client";
import { useCart } from "@/store/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import Link from "next/link";

export default function PanierPage() {
  const { items, remove, update, total, clear } = useCart();

  return (
    <>
      <div className="hidden md:block"><Header /></div>
      <MobilePageHeader title="Mon panier" backHref="/decouvrir" showCart={false} />

      <main className="min-h-screen md:pt-24 pb-32 md:pb-20 px-4 md:px-6 bg-[#FBF9F5] text-[#1A1612]">
        <div className="max-w-4xl mx-auto">
          {/* Title — desktop only */}
          <div className="hidden md:block mb-10">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#FF3D7F] block mb-2">Mon panier</span>
            <h1 className="font-fraunces text-4xl text-[#1A1612]">
              {items.length === 0 ? "Ton panier est vide" : `${items.length} article${items.length > 1 ? "s" : ""}`}
            </h1>
          </div>

          {/* Mobile title */}
          <div className="md:hidden pt-4 pb-3">
            <p className="font-fraunces text-[26px] text-[#1A1612]">
              {items.length === 0 ? "Panier vide" : `${items.length} article${items.length > 1 ? "s" : ""}`}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center py-16 max-w-sm mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,rgba(224,51,126,0.12),rgba(109,45,181,0.12))", border: "1px solid rgba(224,51,126,0.2)" }}>
                  <ShoppingBag size={40} className="text-[#FF3D7F]/50" />
                </div>
                <span className="absolute -top-2 -right-2 text-2xl">✦</span>
              </div>
              <h2 className="font-fraunces text-2xl text-[#1A1612] mb-3">Ton panier t&apos;attend</h2>
              <p className="font-hanken text-[#1A1612]/50 mb-8 leading-relaxed text-sm">
                Des créateur·ices queer talentueux·ses ont des choses à te montrer.
              </p>
              <div className="h-px w-16 mx-auto mb-8 rounded-full"
                style={{ background: "linear-gradient(90deg,#E0533A,#CF3F7C,#6D2DB5,#1C9C95)" }} />
              <Button variant="primary" href="/decouvrir">
                Explorer <ArrowRight size={14} />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

              {/* Items */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 md:p-4 rounded-2xl"
                    style={{ border: "1px solid rgba(243,234,219,0.09)", background: "rgba(243,234,219,0.025)" }}>
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ background: "#F1ECE3" }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <Package size={20} className="text-[#1A1612]/15" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-hanken font-semibold text-[#1A1612] text-[13px] md:text-sm truncate">{item.name}</p>
                      {item.creator && <p className="font-mono text-[10px] text-[#1A1612]/35">{item.creator}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center rounded-lg overflow-hidden"
                          style={{ border: "1px solid rgba(243,234,219,0.12)" }}>
                          <button onClick={() => update(item.id, item.quantity - 1)}
                            className="w-7 h-7 text-[#1A1612]/55 text-base active:bg-white/5 transition-colors">−</button>
                          <span className="w-6 text-center font-mono text-[11px] text-[#1A1612]">{item.quantity}</span>
                          <button onClick={() => update(item.id, item.quantity + 1)}
                            className="w-7 h-7 text-[#1A1612]/55 text-base active:bg-white/5 transition-colors">+</button>
                        </div>
                        <span className="font-fraunces text-[14px] text-[#1A1612]">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                    <button onClick={() => remove(item.id)}
                      className="p-2 text-[#1A1612]/20 active:text-red-400 transition-colors shrink-0 self-start">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-1">
                  <button onClick={clear} className="font-mono text-[10px] text-[#1A1612]/20 tracking-widest uppercase active:text-red-400 transition-colors">
                    Vider le panier
                  </button>
                  <Link href="/decouvrir" className="font-mono text-[10px] text-[#1A1612]/30 tracking-widest uppercase hover:text-[#FF3D7F] transition-colors">
                    ← Continuer
                  </Link>
                </div>
              </div>

              {/* Summary — desktop sticky sidebar */}
              <div className="lg:col-span-1 hidden md:block">
                <div className="sticky top-24 rounded-2xl border border-[#1A1612]/10 bg-[#1A1612]/[0.03] p-6">
                  <div className="prism-line mb-6" />
                  <h2 className="font-fraunces text-xl text-[#1A1612] mb-5">Récapitulatif</h2>
                  <div className="space-y-3 mb-6 text-sm font-hanken">
                    <div className="flex justify-between text-[#1A1612]/60">
                      <span>Sous-total</span><span>{total().toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-[#1A1612]/60">
                      <span>Livraison</span>
                      <span className="text-[#1C9C95] text-[11px]">Calculée ensuite</span>
                    </div>
                    <div className="border-t border-[#1A1612]/10 pt-3 flex justify-between text-[#1A1612] font-semibold">
                      <span>Total estimé</span><span>{total().toFixed(2)} €</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <button className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-hanken font-semibold hover:brightness-110 transition-all active:scale-95"
                      style={{ background: "linear-gradient(135deg,#6D2DB5,#FF3D7F)", boxShadow: "0 6px 24px rgba(224,51,126,.3)" }}>
                      Commander <ArrowRight size={16} />
                    </button>
                  </Link>
                  <p className="text-center mt-3 font-mono text-[10px] text-[#1A1612]/22 tracking-wide">
                    Paiement sécurisé · Stripe
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Mobile sticky checkout bar ── */}
      {items.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3"
          style={{
            background: "rgba(251,249,245,0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(243,234,219,0.09)",
          }}>
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <p className="font-mono text-[9px] text-[#1A1612]/35 uppercase tracking-wider">Total</p>
              <p className="font-fraunces text-[22px] leading-tight text-[#1A1612]">{total().toFixed(2)} €</p>
            </div>
            <Link href="/checkout" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-fraunces text-[16px] text-white active:scale-[0.97] transition-transform"
                style={{ background: "linear-gradient(135deg,#6D2DB5,#FF3D7F)", boxShadow: "0 4px 20px rgba(109,45,181,.4)" }}>
                Commander <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          <p className="text-center mt-2 font-mono text-[9px] text-[#1A1612]/20 tracking-wide">
            🔒 Paiement sécurisé · Stripe
          </p>
        </div>
      )}

      <div className="hidden md:block"><Footer /></div>
    </>
  );
}
