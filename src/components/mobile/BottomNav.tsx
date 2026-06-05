"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart";
import { Home, Compass, ShoppingBag, Heart, User } from "lucide-react";

const TABS = [
  { href: "/",          icon: Home,        label: "Accueil"  },
  { href: "/decouvrir", icon: Compass,     label: "Explorer" },
  { href: "/panier",    icon: ShoppingBag, label: "Panier", isCart: true },
  { href: "/favoris",   icon: Heart,       label: "Favoris"  },
  { href: "/compte",    icon: User,        label: "Moi"      },
] as const;

export function BottomNav() {
  const pathname  = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/checkout") ||
    pathname === "/vendeur"
  ) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="h-[70px] md:hidden" aria-hidden />

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ background: "linear-gradient(to top,#FBF9F5 64%,rgba(251,249,245,0))", paddingTop: 8 }}>
        <div className="flex items-center justify-around px-2 pb-[max(22px,env(safe-area-inset-bottom))]">
          {TABS.map(tab => {
            const active = isActive(tab.href);
            const Icon = tab.icon;
            return (
              <Link key={tab.href} href={tab.href}
                className="relative flex flex-col items-center gap-[3px] px-2.5 py-1 active:scale-95 transition-transform">
                <span className="relative">
                  <Icon size={23} strokeWidth={active ? 2.2 : 1.7}
                    style={{ color: active ? "#FF3D7F" : "#9B9285" }} />
                  {"isCart" in tab && tab.isCart && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white"
                      style={{ background: "#FF3D7F" }}>
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </span>
                <span className="font-mono text-[9.5px] tracking-[0.02em]"
                  style={{ color: active ? "#FF3D7F" : "#9B9285", fontWeight: active ? 700 : 400 }}>
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
