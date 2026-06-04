"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBag, Menu, X, Search, User, LogOut, Store,
  ChevronDown, Briefcase, Palette, CalendarDays, MapPin,
  Users, BookOpen, Sparkles, LayoutDashboard, ArrowRight,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/contexts/AuthContext";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { CATEGORIES } from "@/lib/categories";
import { useBanner } from "@/contexts/BannerContext";

// ── Mega menu data aligné sur les vraies catégories DB ──────────
const NAV_MEGA = [
  {
    label: "Boutique",
    href: "/decouvrir",
    icon: ShoppingBag,
    sections: [
      {
        heading: "Mode & Bijoux",
        color: "#E0337E",
        cats: ["Mode non-genrée", "Bijoux"],
      },
      {
        heading: "Art & Édition",
        color: "#6D2DB5",
        cats: ["Art & Culture", "Zines & Édition"],
      },
      {
        heading: "Corps & Maison",
        color: "#1C9C95",
        cats: ["Corps & Soin", "Intimité", "Maison"],
      },
    ],
  },
  {
    label: "Services & Ateliers",
    href: "/services",
    icon: Briefcase,
    sections: [
      {
        heading: "Services",
        color: "#E0901E",
        cats: ["Services"],
      },
      {
        heading: "Expériences",
        color: "#6D2DB5",
        cats: ["Expériences"],
      },
    ],
  },
];

const NAV_SIMPLE = [
  { label: "Art & Culture",  href: "/art",        icon: Palette },
  { label: "Événements",     href: "/evenements", icon: CalendarDays },
  { label: "Annuaire",       href: "/annuaire",   icon: MapPin },
  { label: "Communauté",     href: "/communaute", icon: Users },
  { label: "Ressources",     href: "/ressources", icon: BookOpen },
  { label: "Emploi",         href: "/emploi",     icon: Sparkles },
];

const PRIMARY_MEGA = NAV_MEGA;
const MORE = NAV_SIMPLE;

export function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu]   = useState<string | null>(null);
  const [moreOpen, setMoreOpen]       = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navRef      = useRef<HTMLDivElement>(null);
  const closeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartCount   = useCart((s) => s.count());
  const { user, isAdmin, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (navRef.current && !navRef.current.contains(e.target as Node)) { setActiveMenu(null); setMoreOpen(false); }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ── Hover avec délai anti-gap ──────────────────────────────────
  const openMenu = useCallback((key: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setActiveMenu(key);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimer.current = setTimeout(() => { setActiveMenu(null); }, 120);
  }, []);

  const openMore = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setMoreOpen(true);
  }, []);

  const closeMore = useCallback(() => {
    closeTimer.current = setTimeout(() => { setMoreOpen(false); }, 120);
  }, []);

  const pseudo = user?.user_metadata?.pseudo || user?.email?.split("@")[0] || "Mon compte";
  const { visible: bannerVisible } = useBanner();

  return (
    <header className={cn(
      "fixed left-0 right-0 z-50 transition-all duration-500",
      bannerVisible ? "top-10" : "top-0",
      scrolled ? "bg-[#3D1F5C]/95 backdrop-blur-md border-b border-[#F3EADB]/8" : "bg-transparent"
    )}>
      {/* Prism line */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Image src="/logo.png" alt="Spectrum For Us" width={36} height={36} className="object-contain transition-opacity duration-300 group-hover:opacity-80" />
          <span className="font-fraunces text-lg font-semibold text-[#F3EADB] hidden sm:block leading-none tracking-tight">
            Spectrum <span className="text-[#E0337E] font-light">For Us</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden md:flex items-center gap-0.5" aria-label="Navigation principale">
          {PRIMARY_MEGA.map((item) => (
            <div key={item.href} className="relative"
              onMouseEnter={() => openMenu(item.href)}
              onMouseLeave={closeMenu}>
              <button
                onClick={() => setActiveMenu(activeMenu === item.href ? null : item.href)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-lg font-hanken text-sm transition-colors duration-200",
                  activeMenu === item.href ? "text-[#F3EADB] bg-[#F3EADB]/8" : "text-[#F3EADB]/70 hover:text-[#F3EADB]"
                )}>
                {item.label}
                <ChevronDown size={11} className={cn("transition-transform duration-200", activeMenu === item.href && "rotate-180")} />
              </button>

              {/* Mega menu */}
              {activeMenu === item.href && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  {/* Pont invisible pour éviter le gap */}
                  <div className="absolute -top-2 left-0 right-0 h-2" />
                  <div className="bg-[#2a1545] border border-[#F3EADB]/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
                    style={{ minWidth: "640px" }}>
                    {/* Header du mega menu */}
                    <div className="px-6 pt-5 pb-3 border-b border-[#F3EADB]/8 flex items-center justify-between">
                      <Link href={item.href} onClick={() => setActiveMenu(null)}
                        className="flex items-center gap-2 font-fraunces text-base text-[#F3EADB] hover:text-[#E0337E] transition-colors">
                        {item.label}
                        <ArrowRight size={14} />
                      </Link>
                      <Link href="/vendre" onClick={() => setActiveMenu(null)}
                        className="font-mono text-[10px] text-[#E0337E]/60 hover:text-[#E0337E] uppercase tracking-widest transition-colors">
                        + Vendre ici
                      </Link>
                    </div>

                    {/* Grille catégories */}
                    <div className="p-5 grid gap-5" style={{ gridTemplateColumns: `repeat(${item.sections.length}, 1fr)` }}>
                      {item.sections.map((section) => (
                        <div key={section.heading}>
                          <p className="font-mono text-[9px] tracking-widest uppercase mb-3"
                            style={{ color: section.color }}>{section.heading}</p>
                          <div className="space-y-3">
                            {section.cats.map((catName) => {
                              const subs = CATEGORIES[catName] ?? [];
                              return (
                                <div key={catName}>
                                  {/* Catégorie principale */}
                                  <Link
                                    href={`/decouvrir?category=${encodeURIComponent(catName)}`}
                                    onClick={() => setActiveMenu(null)}
                                    className="flex items-center gap-1.5 font-hanken text-sm text-[#F3EADB]/80 hover:text-[#F3EADB] font-medium mb-1.5 transition-colors group"
                                  >
                                    <span className="w-1 h-1 rounded-full flex-shrink-0 transition-colors"
                                      style={{ background: section.color }} />
                                    {catName}
                                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-60 transition-opacity ml-auto" />
                                  </Link>
                                  {/* Sous-catégories */}
                                  <ul className="space-y-1 pl-3">
                                    {subs.slice(0, 5).map((sub) => (
                                      <li key={sub}>
                                        <Link
                                          href={`/decouvrir?category=${encodeURIComponent(catName)}&subcategory=${encodeURIComponent(sub)}`}
                                          onClick={() => setActiveMenu(null)}
                                          className="font-hanken text-xs text-[#F3EADB]/45 hover:text-[#F3EADB]/80 transition-colors block py-0.5"
                                        >
                                          {sub}
                                        </Link>
                                      </li>
                                    ))}
                                    {subs.length > 5 && (
                                      <li>
                                        <Link
                                          href={`/decouvrir?category=${encodeURIComponent(catName)}`}
                                          onClick={() => setActiveMenu(null)}
                                          className="font-mono text-[9px] text-[#F3EADB]/25 hover:text-[#E0337E] transition-colors"
                                        >
                                          + {subs.length - 5} autres →
                                        </Link>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Liens simples */}
          {MORE.slice(0, 3).map((item) => (
            <Link key={item.href} href={item.href}
              className="px-3 py-1.5 rounded-lg font-hanken text-sm text-[#F3EADB]/70 hover:text-[#F3EADB] transition-colors duration-200 block">
              {item.label}
            </Link>
          ))}

          {/* "Plus" dropdown */}
          <div className="relative"
            onMouseEnter={openMore}
            onMouseLeave={closeMore}>
            <button className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-lg font-hanken text-sm transition-colors duration-200",
              moreOpen ? "text-[#F3EADB] bg-[#F3EADB]/8" : "text-[#F3EADB]/50 hover:text-[#F3EADB]"
            )}>
              Plus <ChevronDown size={11} className={cn("transition-transform duration-200", moreOpen && "rotate-180")} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full pt-2 z-50">
                <div className="absolute -top-2 left-0 right-0 h-2" />
                <div className="bg-[#2a1545] border border-[#F3EADB]/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50 min-w-[180px]">
                  {MORE.slice(3).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-hanken text-sm text-[#F3EADB]/70 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-colors">
                        <Icon size={14} className="text-[#E0337E]/70" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/decouvrir" aria-label="Rechercher" className="p-2 text-[#F3EADB]/60 hover:text-[#F3EADB] transition-colors hidden md:flex">
            <Search size={18} />
          </Link>
          <div className="hidden md:flex">
            <LocaleSwitcher />
          </div>
          <Link href="/panier" aria-label={`Panier — ${cartCount} article${cartCount > 1 ? "s" : ""}`}
            className="p-2 text-[#F3EADB]/60 hover:text-[#F3EADB] transition-colors relative hidden md:flex">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E0337E] text-[#F3EADB] text-[9px] font-mono flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {!loading && (
            user ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F3EADB]/15 text-[#F3EADB]/70 hover:text-[#F3EADB] hover:border-[#F3EADB]/30 transition-all duration-200 text-sm font-hanken">
                  <User size={14} />
                  <span className="max-w-[80px] truncate">{pseudo}</span>
                  <ChevronDown size={12} className={cn("transition-transform duration-200", userMenuOpen && "rotate-180")} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#2a1545] border border-[#F3EADB]/15 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                    <div className="px-4 py-3 border-b border-[#F3EADB]/8">
                      <p className="font-hanken text-xs text-[#F3EADB]/40">Connecté·e en tant que</p>
                      <p className="font-bricolage font-semibold text-[#F3EADB] text-sm truncate">{pseudo}</p>
                    </div>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 font-hanken text-sm text-[#E0337E] hover:text-[#E0337E]/80 hover:bg-[#E0337E]/5 transition-colors border-b border-[#F3EADB]/8">
                        <LayoutDashboard size={14} /> Back-office Admin
                      </Link>
                    )}
                    <Link href="/compte" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 font-hanken text-sm text-[#F3EADB]/70 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-colors">
                      <User size={14} /> Mon compte
                    </Link>
                    <Link href="/vendeur" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 font-hanken text-sm text-[#F3EADB]/70 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-colors">
                      <Store size={14} /> Espace vendeur
                    </Link>
                    <button onClick={() => { setUserMenuOpen(false); signOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 font-hanken text-sm text-[#F3EADB]/50 hover:text-red-400 hover:bg-[#F3EADB]/5 transition-colors border-t border-[#F3EADB]/8">
                      <LogOut size={14} /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" href="/auth" className="text-sm px-4 py-2">Connexion</Button>
                <Button variant="primary" href="/auth" className="text-xs px-5 py-2">S&apos;inscrire</Button>
              </div>
            )
          )}

          {/* Mobile burger */}
          <button className="md:hidden p-2 text-[#F3EADB]/80" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#2a1545]/98 backdrop-blur-md border-t border-[#F3EADB]/8 px-6 py-4 flex flex-col gap-0 max-h-[80vh] overflow-y-auto">
          {/* Mega items mobile */}
          {PRIMARY_MEGA.map((item) => (
            <div key={item.href}>
              <Link href={item.href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 font-hanken text-base text-[#F3EADB]/80 hover:text-[#F3EADB] border-b border-[#F3EADB]/8 transition-colors">
                <item.icon size={16} className="text-[#E0337E]/70 shrink-0" />
                {item.label}
              </Link>
              {/* Sous-catégories mobiles */}
              <div className="pl-7 pb-2">
                {item.sections.flatMap(s => s.cats).slice(0, 6).map((cat) => (
                  <Link key={cat} href={`/decouvrir?category=${encodeURIComponent(cat)}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-1.5 font-hanken text-sm text-[#F3EADB]/40 hover:text-[#F3EADB]/70 transition-colors">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {/* Liens simples mobile */}
          {MORE.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 font-hanken text-base text-[#F3EADB]/80 hover:text-[#F3EADB] border-b border-[#F3EADB]/8 last:border-0 transition-colors">
                <Icon size={16} className="text-[#E0337E]/70 shrink-0" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4 flex flex-col gap-2">
            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#E0337E]/15 border border-[#E0337E]/30 text-sm font-hanken text-[#E0337E]">
                <LayoutDashboard size={14} /> Back-office Admin
              </Link>
            )}
            <div className="flex gap-3">
              {user ? (
                <>
                  <Link href="/compte" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-full border border-[#F3EADB]/20 text-sm font-hanken text-[#F3EADB]/70">
                    Mon compte
                  </Link>
                  <button onClick={() => { setMobileOpen(false); signOut(); }}
                    className="flex-1 text-center py-2.5 rounded-full border border-red-400/20 text-sm font-hanken text-red-400">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Button variant="secondary" href="/auth" className="flex-1 text-sm py-2.5">Connexion</Button>
                  <Button variant="primary" href="/auth" className="flex-1 text-sm py-2.5">S&apos;inscrire</Button>
                </>
              )}
            </div>
          </div>
          <div className="pt-3">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
