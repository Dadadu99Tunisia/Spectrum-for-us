"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";

interface Props {
  title?: string;
  backHref?: string;
  showCart?: boolean;
  rightSlot?: React.ReactNode;
}

const T = { bg: "#FBF9F5", ink: "#1A1612", line: "#ECE6DB", mag: "#FF3D7F" };

export function MobilePageHeader({ title, backHref, showCart = true, rightSlot }: Props) {
  const router = useRouter();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header
      className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 h-14"
      style={{ background: "rgba(251,249,245,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.line}` }}
    >
      <button
        onClick={() => (backHref ? router.push(backHref) : router.back())}
        className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
        style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}
      >
        <ArrowLeft size={17} style={{ color: T.ink }} />
      </button>

      {title && <p className="flex-1 font-bricolage font-bold text-[16px] truncate" style={{ color: T.ink }}>{title}</p>}

      <div className="ml-auto flex items-center gap-2">
        {rightSlot}
        {showCart && (
          <Link href="/panier" className="relative w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            <ShoppingBag size={16} style={{ color: T.ink }} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-mono font-bold flex items-center justify-center text-white"
                style={{ background: T.mag }}>
                {cartCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
