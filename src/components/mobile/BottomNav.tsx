"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const TABS = [
  { href: "/",          emoji: "◈",  label: "Home" },
  { href: "/decouvrir", emoji: "✦",  label: "Explorer" },
  { href: "/publier",   emoji: null, label: "Publier", isPrimary: true },
  { href: "/favoris",   emoji: "♡",  label: "Favoris" },
  { href: "/compte",    emoji: "○",  label: "Moi" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="h-20 md:hidden" aria-hidden />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(32, 10, 55, 0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(243,234,219,0.07)",
        }}
      >
        {/* Prism rainbow line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, #E0533A, #E0901E, #CF3F7C, #6D2DB5, #1C9C95)" }}
        />

        <div className="flex items-end justify-around px-3 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))]">
          {TABS.map((tab) => {
            const { href, label } = tab;
            const emoji = "emoji" in tab ? tab.emoji : null;
            const isPrimary = "isPrimary" in tab && tab.isPrimary;
            const active = isActive(href);
            const dest   = isPrimary && !user ? "/auth?redirect=/publier" : href;

            if (isPrimary) {
              return (
                <Link key={href} href={dest}
                  className="flex flex-col items-center gap-1 -mt-5"
                >
                  <span
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-[22px] shadow-lg transition-transform active:scale-90"
                    style={{
                      background: "linear-gradient(135deg, #6D2DB5, #E0337E)",
                      boxShadow: "0 4px 24px rgba(224,51,126,.45), 0 0 0 3px rgba(32,10,55,1)",
                    }}
                  >
                    +
                  </span>
                  <span className="font-mono text-[8px] tracking-wider uppercase"
                    style={{ color: "rgba(243,234,219,0.30)" }}>
                    {label}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={href} href={dest ?? href}
                className="flex flex-col items-center gap-1 px-2 py-0.5 transition-all active:scale-90"
              >
                <span
                  className="text-[19px] leading-none transition-all"
                  style={{
                    color: active ? "#E0337E" : "rgba(243,234,219,0.28)",
                    textShadow: active ? "0 0 12px rgba(224,51,126,.6)" : "none",
                    transform: active ? "scale(1.15)" : "scale(1)",
                    display: "block",
                    transition: "all 0.15s ease",
                  }}
                >
                  {emoji}
                </span>
                <span
                  className="font-mono text-[8px] tracking-wider uppercase"
                  style={{ color: active ? "#E0337E" : "rgba(243,234,219,0.25)" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
