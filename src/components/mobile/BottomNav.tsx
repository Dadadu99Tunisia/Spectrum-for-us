"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart";

const TABS = [
  { href: "/",          symbol: "◈",  label: "Accueil"  },
  { href: "/decouvrir", symbol: "✦",  label: "Explorer" },
  { href: "/panier",    symbol: null, label: "Panier",  isCart: true },
  { href: "/favoris",   symbol: "♡",  label: "Favoris"  },
  { href: "/compte",    symbol: "○",  label: "Moi"      },
] as const;

export function BottomNav() {
  const pathname  = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/checkout")
  ) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="h-[68px] md:hidden" aria-hidden />

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(20,6,40,0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(243,234,219,0.07)",
        }}>
        {/* Prism line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />

        <div className="flex items-center justify-around px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
          {TABS.map(tab => {
            const active = isActive(tab.href);

            if ("isCart" in tab && tab.isCart) {
              return (
                <Link key={tab.href} href={tab.href}
                  className="flex flex-col items-center gap-0.5 px-3 active:scale-90 transition-transform">
                  <div className="relative w-8 h-8 flex items-center justify-center rounded-xl"
                    style={{
                      background: active
                        ? "linear-gradient(135deg,#6D2DB5,#E0337E)"
                        : "rgba(243,234,219,0.07)",
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke={active ? "white" : "rgba(243,234,219,0.45)"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full text-[9px] font-mono flex items-center justify-center px-0.5 text-white"
                        style={{ background: "#E0337E" }}>
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[8px] tracking-wider uppercase"
                    style={{ color: active ? "#E0337E" : "rgba(243,234,219,0.28)" }}>
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={tab.href} href={tab.href}
                className="flex flex-col items-center gap-0.5 px-3 active:scale-90 transition-transform">
                <span className="text-[18px] leading-[28px] w-8 text-center transition-all"
                  style={{
                    color: active ? "#E0337E" : "rgba(243,234,219,0.28)",
                    textShadow: active ? "0 0 14px rgba(224,51,126,.7)" : "none",
                    transform: active ? "scale(1.2)" : "scale(1)",
                    display: "block",
                    transition: "all 0.15s",
                  }}>
                  {tab.symbol}
                </span>
                <span className="font-mono text-[8px] tracking-wider uppercase"
                  style={{ color: active ? "#E0337E" : "rgba(243,234,219,0.28)" }}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
