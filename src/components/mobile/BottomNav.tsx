"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Search, PlusCircle, Heart, User } from "lucide-react";

const TABS = [
  { href: "/",          icon: Home,       label: "Home" },
  { href: "/decouvrir", icon: Search,     label: "Explorer" },
  { href: "/publier",   icon: PlusCircle, label: "Publier",  highlight: true },
  { href: "/favoris",   icon: Heart,      label: "Favoris" },
  { href: "/compte",    icon: User,       label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide on admin pages and auth pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Spacer so page content isn't hidden behind nav */}
      <div className="h-20 md:hidden" aria-hidden="true" />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(28, 12, 48, 0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(243,234,219,0.10)",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.40)",
        }}
      >
        {/* Prism line top */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: "linear-gradient(90deg,transparent,#E0337E60,#6D2DB560,#1C9C9560,transparent)" }}
        />

        <div className="flex items-center justify-around px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
          {TABS.map(({ href, icon: Icon, label, highlight }) => {
            const active = isActive(href);
            // Publish button — always guest-accessible (redirects to auth if needed)
            return (
              <Link
                key={href}
                href={href === "/publier" && !user ? "/auth?redirect=/publier" : href}
                className="flex flex-col items-center gap-0.5 relative px-3 py-1 rounded-xl transition-all duration-150 active:scale-90"
                style={{
                  minWidth: 52,
                }}
              >
                {highlight ? (
                  // Publish — pill accent button
                  <span
                    className="flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-150"
                    style={{
                      background: "linear-gradient(135deg,#6D2DB5,#E0337E)",
                      boxShadow: active
                        ? "0 0 20px rgba(224,51,126,.55)"
                        : "0 4px 15px rgba(109,45,181,.4)",
                    }}
                  >
                    <Icon size={22} className="text-white" strokeWidth={2} />
                  </span>
                ) : (
                  <>
                    <span
                      className="flex items-center justify-center w-7 h-7 rounded-xl transition-all"
                      style={active ? {
                        background: "rgba(224,51,126,.15)",
                      } : {}}
                    >
                      <Icon
                        size={20}
                        strokeWidth={active ? 2.2 : 1.6}
                        style={{ color: active ? "#E0337E" : "rgba(243,234,219,0.40)" }}
                      />
                    </span>
                    <span
                      className="font-mono text-[9px] tracking-tight leading-none"
                      style={{ color: active ? "#E0337E" : "rgba(243,234,219,0.30)" }}
                    >
                      {label}
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
