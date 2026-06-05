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

export function MobilePageHeader({ title, backHref, showCart = true, rightSlot }: Props) {
  const router = useRouter();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header
      className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 h-14"
      style={{
        background: "rgba(32,10,55,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(243,234,219,0.07)",
      }}
    >
      {/* Prism line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(224,51,126,.3),rgba(109,45,181,.3),transparent)" }} />

      <button
        onClick={() => backHref ? router.push(backHref) : router.back()}
        className="w-8 h-8 flex items-center justify-center rounded-xl active:scale-90 transition-transform"
        style={{ background: "rgba(243,234,219,0.07)" }}
      >
        <ArrowLeft size={16} className="text-[#F3EADB]/70" />
      </button>

      {title && (
        <p className="flex-1 font-fraunces text-[15px] text-[#F3EADB] truncate">{title}</p>
      )}

      <div className="ml-auto flex items-center gap-2">
        {rightSlot}
        {showCart && (
          <Link href="/panier" className="relative w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(243,234,219,0.07)" }}>
            <ShoppingBag size={15} className="text-[#F3EADB]/70" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-mono flex items-center justify-center text-white"
                style={{ background: "#E0337E" }}>
                {cartCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
