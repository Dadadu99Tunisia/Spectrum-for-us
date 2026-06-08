"use client";

/**
 * Header · barre unique claire minimaliste, identique sur toutes les pages.
 * Nav plate (Marketplace · Services · Associations · Événements · Média ·
 * Communauté) + recherche, langue, panier, compte, "Ouvrir ma boutique".
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ShoppingBag, Menu, X, Search, User, LogOut, Store,
  ChevronDown, LayoutDashboard, Heart, MessageSquare,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { useBanner } from "@/contexts/BannerContext";

const T = { bg: "#FBF9F5", ink: "#1A1612", soft: "#6B6258", line: "#ECE6DB", mag: "#FF3D7F" };

const NAV = [
  { label: "Marketplace", href: "/decouvrir" },
  { label: "Services",    href: "/services" },
  { label: "Associations", href: "/annuaire" },
  { label: "Événements",  href: "/evenements" },
  { label: "Média",       href: "/media" },
  { label: "Communauté",  href: "/communaute" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = useCart((s) => s.count());
  const { user, isAdmin, loading, signOut } = useAuth();
  const { visible: bannerVisible } = useBanner();
  const { t } = useI18n();
  const pseudo = user?.user_metadata?.pseudo || user?.email?.split("@")[0] || "Compte";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        bannerVisible ? "top-10" : "top-0",
      )}
        style={{
          background: scrolled ? "rgba(251,249,245,0.92)" : "rgba(251,249,245,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${scrolled ? T.line : "transparent"}`,
        }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Spectrum For Us · accueil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-dark.png" alt="Spectrum For Us" className="h-9 w-auto" />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-[14.5px]" aria-label="Navigation principale">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                className="transition-colors hover:text-[#FF3D7F]" style={{ color: T.soft }}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/decouvrir" aria-label="Rechercher"
              className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center transition-colors hover:text-[#FF3D7F]"
              style={{ color: T.soft }}>
              <Search size={18} />
            </Link>
            <div className="hidden lg:flex"><LocaleSwitcher /></div>

            {/* Panier */}
            <Link href="/panier" aria-label={`Panier · ${cartCount} article${cartCount > 1 ? "s" : ""}`}
              className="relative w-10 h-10 rounded-full flex items-center justify-center"
              style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-mono flex items-center justify-center text-white"
                  style={{ background: T.mag }}>{cartCount > 9 ? "9+" : cartCount}</span>
              )}
            </Link>

            {/* Compte */}
            {!loading && (user ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-haspopup="true" aria-expanded={userMenuOpen}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-[14px] transition-colors"
                  style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}>
                  <User size={15} /><span className="max-w-[90px] truncate">{pseudo}</span>
                  <ChevronDown size={13} className={cn("transition-transform", userMenuOpen && "rotate-180")} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden"
                    style={{ background: "#fff", boxShadow: "0 12px 40px rgba(26,22,18,.14), inset 0 0 0 1px " + T.line }}>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#FBF9F5] transition-colors"
                        style={{ color: T.mag, borderBottom: `1px solid ${T.line}` }}>
                        <LayoutDashboard size={15} /> Admin
                      </Link>
                    )}
                    <Link href="/compte" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#FBF9F5] transition-colors" style={{ color: T.soft }}>
                      <User size={15} /> Mon compte
                    </Link>
                    <Link href="/suivis" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#FBF9F5] transition-colors" style={{ color: T.soft }}>
                      <Heart size={15} /> Mes suivis
                    </Link>
                    <Link href="/messages" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#FBF9F5] transition-colors" style={{ color: T.soft }}>
                      <MessageSquare size={15} /> Messages
                    </Link>
                    <Link href="/vendeur" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#FBF9F5] transition-colors" style={{ color: T.soft }}>
                      <Store size={15} /> Espace vendeur
                    </Link>
                    <button onClick={() => { setUserMenuOpen(false); signOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#FBF9F5] transition-colors"
                      style={{ color: T.soft, borderTop: `1px solid ${T.line}` }}>
                      <LogOut size={15} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="hidden lg:block text-[14px]" style={{ color: T.soft }}>Connexion</Link>
            ))}

            {/* Ouvrir ma boutique */}
            <Link href="/vendeur/onboarding"
              className="hidden md:inline-flex rounded-full font-semibold text-[14px] text-white px-4 py-2"
              style={{ background: T.ink }}>
              Ouvrir ma boutique
            </Link>

            {/* Burger mobile */}
            <button className="lg:hidden w-10 h-10 flex items-center justify-center" style={{ color: T.ink }}
              onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Fermer" : "Menu"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      <div aria-hidden="true" onClick={() => setMobileOpen(false)}
        className={cn("fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none")} />
      <div role="dialog" aria-modal="true"
        className={cn("fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm flex flex-col lg:hidden transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full")}
        style={{ background: T.bg }}>
        <div className="flex items-center justify-between px-5 h-16 shrink-0" style={{ borderBottom: `1px solid ${T.line}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="Spectrum For Us" className="h-8 w-auto" />
          <button onClick={() => setMobileOpen(false)} aria-label="Fermer" style={{ color: T.soft }}><X size={22} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3.5 rounded-xl font-bricolage font-semibold text-[17px] hover:bg-white transition-colors"
              style={{ color: T.ink }}>{n.label}</Link>
          ))}
        </nav>
        <div className="px-5 py-4 space-y-3 shrink-0" style={{ borderTop: `1px solid ${T.line}` }}>
          <div className="flex items-center justify-between">
            <span className="font-hanken text-[14px]" style={{ color: T.soft }}>Langue & devise</span>
            <LocaleSwitcher />
          </div>
          {user ? (
            <>
              <Link href="/compte" onClick={() => setMobileOpen(false)} className="block text-[15px]" style={{ color: T.soft }}>Mon compte</Link>
              <Link href="/suivis" onClick={() => setMobileOpen(false)} className="block text-[15px]" style={{ color: T.soft }}>Mes suivis</Link>
              <Link href="/messages" onClick={() => setMobileOpen(false)} className="block text-[15px]" style={{ color: T.soft }}>Messages</Link>
              {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block text-[15px]" style={{ color: T.mag }}>Admin</Link>}
              <button onClick={() => { setMobileOpen(false); signOut(); }} className="block text-[15px]" style={{ color: T.soft }}>Déconnexion</button>
            </>
          ) : (
            <Link href="/auth" onClick={() => setMobileOpen(false)} className="block text-[15px]" style={{ color: T.soft }}>Connexion</Link>
          )}
          <Link href="/vendeur/onboarding" onClick={() => setMobileOpen(false)}
            className="block text-center rounded-full font-semibold text-[15px] text-white px-4 py-3" style={{ background: T.ink }}>
            Ouvrir ma boutique
          </Link>
        </div>
      </div>
    </>
  );
}
