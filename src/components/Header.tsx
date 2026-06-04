"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBag, Menu, X, Search, User, LogOut, Store,
  ChevronDown, ChevronRight, Briefcase, Palette, CalendarDays,
  MapPin, Users, BookOpen, Sparkles, LayoutDashboard, ArrowRight,
  Package, Zap,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/contexts/AuthContext";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { CATEGORIES } from "@/lib/categories";
import { useBanner } from "@/contexts/BannerContext";

// ─────────────────────────────────────────────────────────────
// Structure de navigation propre, sans doublons
// ─────────────────────────────────────────────────────────────

const NAV: Array<{
  label: string;
  href: string;
  icon: React.ElementType;
  mega?: Array<{
    heading: string;
    color: string;
    icon: React.ElementType;
    cats: string[];
  }>;
  links?: Array<{ label: string; href: string; desc?: string }>;
}> = [
  {
    label: "Boutique",
    href: "/decouvrir",
    icon: ShoppingBag,
    mega: [
      {
        heading: "Mode & Bijoux",
        color: "#E0337E",
        icon: Package,
        cats: ["Mode non-genrée", "Bijoux"],
      },
      {
        heading: "Art & Édition",
        color: "#6D2DB5",
        icon: Palette,
        cats: ["Art & Culture", "Zines & Édition"],
      },
      {
        heading: "Corps & Maison",
        color: "#1C9C95",
        icon: Sparkles,
        cats: ["Corps & Soin", "Intimité", "Maison"],
      },
    ],
  },
  {
    label: "Services & Expériences",
    href: "/services",
    icon: Briefcase,
    mega: [
      {
        heading: "Services",
        color: "#E0901E",
        icon: Zap,
        cats: ["Services"],
      },
      {
        heading: "Expériences & Ateliers",
        color: "#6D2DB5",
        icon: CalendarDays,
        cats: ["Expériences"],
      },
    ],
  },
  {
    label: "Média",
    href: "/media",
    icon: BookOpen,
    links: [
      { label: "Articles & Ressources", href: "/media", desc: "Actualités, guides, témoignages queer" },
      { label: "Ressources", href: "/ressources", desc: "Liens, associations, outils" },
      { label: "Emploi & Offres", href: "/emploi", desc: "Opportunités dans l'écosystème queer" },
    ],
  },
  {
    label: "Communauté",
    href: "/communaute",
    icon: Users,
    links: [
      { label: "Espace communautaire", href: "/communaute", desc: "Rencontres, échanges, soutien" },
      { label: "Annuaire queer", href: "/annuaire", desc: "Professionnel·les, asso, lieux safe" },
      { label: "Ambassadeur·rices", href: "/ambassadeurs", desc: "Notre réseau de représentation" },
      { label: "Événements", href: "/evenements", desc: "Agenda culturel et festif" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
export function Header() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu]     = useState<string | null>(null);
  // Mobile: quel accordéon est ouvert
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileSubExpanded, setMobileSubExpanded] = useState<string | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const navRef      = useRef<HTMLDivElement>(null);
  const closeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartCount   = useCart((s) => s.count());
  const { user, isAdmin, loading, signOut } = useAuth();
  const { visible: bannerVisible } = useBanner();

  const pseudo = user?.user_metadata?.pseudo || user?.email?.split("@")[0] || "Mon compte";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setActiveMenu(null);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Fermer le menu mobile à l'escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); setActiveMenu(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Bloquer le scroll body quand menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openMenu = useCallback((key: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setActiveMenu(key);
  }, []);
  const closeMenu = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setMobileSubExpanded(null);
  };

  return (
    <>
      <header className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500",
        bannerVisible ? "top-10" : "top-0",
        scrolled
          ? "bg-[#3D1F5C]/95 backdrop-blur-md border-b border-[#F3EADB]/8"
          : "bg-transparent"
      )}>
        {/* Prism line */}
        <div className="h-[2px] w-full"
          style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="Spectrum For Us — Accueil">
            <Image src="/logo.png" alt="" width={36} height={36} aria-hidden="true"
              className="object-contain transition-opacity duration-300 group-hover:opacity-80" />
            <span className="font-fraunces text-lg font-semibold text-[#F3EADB] hidden sm:block leading-none tracking-tight">
              Spectrum <span className="text-[#E0337E] font-light">For Us</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-0.5" aria-label="Navigation principale">
            {NAV.map((item) => (
              <div key={item.href} className="relative"
                onMouseEnter={() => openMenu(item.href)}
                onMouseLeave={closeMenu}>
                <button
                  aria-haspopup="true"
                  aria-expanded={activeMenu === item.href}
                  onClick={() => setActiveMenu(activeMenu === item.href ? null : item.href)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg font-hanken text-sm transition-colors duration-200",
                    activeMenu === item.href
                      ? "text-[#F3EADB] bg-[#F3EADB]/8"
                      : "text-[#F3EADB]/70 hover:text-[#F3EADB]"
                  )}>
                  {item.label}
                  <ChevronDown size={11}
                    className={cn("transition-transform duration-200", activeMenu === item.href && "rotate-180")} />
                </button>

                {/* Dropdown */}
                {activeMenu === item.href && (
                  <div className="absolute left-0 top-full pt-2 z-50" role="region" aria-label={item.label}>
                    <div className="absolute -top-2 left-0 right-0 h-2" aria-hidden="true" />
                    <div className="bg-[#1e0f35] border border-[#F3EADB]/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
                      style={{ minWidth: item.mega ? "560px" : "260px", maxHeight: "calc(100vh - 120px)" }}>

                      {/* Header */}
                      <div className="px-5 pt-4 pb-3 border-b border-[#F3EADB]/8 flex items-center justify-between shrink-0">
                        <Link href={item.href} onClick={() => setActiveMenu(null)}
                          className="flex items-center gap-2 font-fraunces text-sm text-[#F3EADB] hover:text-[#E0337E] transition-colors">
                          {item.label} <ArrowRight size={13} />
                        </Link>
                        <Link href="/vendre" onClick={() => setActiveMenu(null)}
                          className="font-mono text-[10px] text-[#E0337E]/60 hover:text-[#E0337E] uppercase tracking-widest transition-colors">
                          + Vendre ici
                        </Link>
                      </div>

                      {/* Méga menu — catégories + sous-catégories */}
                      {item.mega && (
                        <div className="p-5 grid gap-6 overflow-y-auto"
                          style={{ gridTemplateColumns: `repeat(${item.mega.length}, 1fr)` }}>
                          {item.mega.map((section) => (
                            <div key={section.heading}>
                              <div className="flex items-center gap-1.5 mb-3">
                                <section.icon size={11} style={{ color: section.color }} aria-hidden="true" />
                                <p className="font-mono text-[9px] tracking-widest uppercase"
                                  style={{ color: section.color }}>{section.heading}</p>
                              </div>
                              <div className="space-y-4">
                                {section.cats.map((catName) => {
                                  const subs = CATEGORIES[catName] ?? [];
                                  return (
                                    <div key={catName}>
                                      <Link
                                        href={`/decouvrir?category=${encodeURIComponent(catName)}`}
                                        onClick={() => setActiveMenu(null)}
                                        className="flex items-center gap-1.5 font-hanken text-sm text-[#F3EADB]/85 hover:text-[#F3EADB] font-medium mb-1.5 transition-colors group"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                          style={{ background: section.color }} aria-hidden="true" />
                                        {catName}
                                        <ArrowRight size={10}
                                          className="opacity-0 group-hover:opacity-60 transition-opacity ml-auto" aria-hidden="true" />
                                      </Link>
                                      <ul className="space-y-0.5 pl-3.5">
                                        {subs.slice(0, 5).map((sub) => (
                                          <li key={sub}>
                                            <Link
                                              href={`/decouvrir?category=${encodeURIComponent(catName)}&subcategory=${encodeURIComponent(sub)}`}
                                              onClick={() => setActiveMenu(null)}
                                              className="font-hanken text-xs text-[#F3EADB]/40 hover:text-[#F3EADB]/75 transition-colors block py-0.5"
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
                      )}

                      {/* Simple links menu */}
                      {item.links && (
                        <div className="p-3 overflow-y-auto">
                          {item.links.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setActiveMenu(null)}
                              className="flex flex-col px-4 py-3 rounded-xl hover:bg-[#F3EADB]/5 transition-colors group">
                              <span className="font-hanken text-sm text-[#F3EADB]/80 group-hover:text-[#F3EADB] transition-colors">
                                {link.label}
                              </span>
                              {link.desc && (
                                <span className="font-hanken text-xs text-[#F3EADB]/35 mt-0.5">{link.desc}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link href="/decouvrir" aria-label="Rechercher"
              className="p-2 text-[#F3EADB]/60 hover:text-[#F3EADB] transition-colors hidden lg:flex">
              <Search size={18} />
            </Link>
            <div className="hidden lg:flex">
              <LocaleSwitcher />
            </div>
            <Link href="/panier"
              aria-label={`Panier — ${cartCount} article${cartCount > 1 ? "s" : ""}`}
              className="p-2 text-[#F3EADB]/60 hover:text-[#F3EADB] transition-colors relative hidden lg:flex">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E0337E] text-[#F3EADB] text-[9px] font-mono flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {!loading && (
              user ? (
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-haspopup="true" aria-expanded={userMenuOpen}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F3EADB]/15 text-[#F3EADB]/70 hover:text-[#F3EADB] hover:border-[#F3EADB]/30 transition-all text-sm font-hanken">
                    <User size={14} aria-hidden="true" />
                    <span className="max-w-[80px] truncate">{pseudo}</span>
                    <ChevronDown size={12} aria-hidden="true"
                      className={cn("transition-transform duration-200", userMenuOpen && "rotate-180")} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#1e0f35] border border-[#F3EADB]/15 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                      <div className="px-4 py-3 border-b border-[#F3EADB]/8">
                        <p className="font-hanken text-xs text-[#F3EADB]/40">Connecté·e en tant que</p>
                        <p className="font-bricolage font-semibold text-[#F3EADB] text-sm truncate">{pseudo}</p>
                      </div>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 font-hanken text-sm text-[#E0337E] hover:bg-[#E0337E]/5 transition-colors border-b border-[#F3EADB]/8">
                          <LayoutDashboard size={14} aria-hidden="true" /> Back-office Admin
                        </Link>
                      )}
                      <Link href="/compte" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 font-hanken text-sm text-[#F3EADB]/70 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-colors">
                        <User size={14} aria-hidden="true" /> Mon compte
                      </Link>
                      <Link href="/vendeur" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 font-hanken text-sm text-[#F3EADB]/70 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-colors">
                        <Store size={14} aria-hidden="true" /> Espace créateur·rice
                      </Link>
                      <button onClick={() => { setUserMenuOpen(false); signOut(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 font-hanken text-sm text-[#F3EADB]/50 hover:text-red-400 hover:bg-[#F3EADB]/5 transition-colors border-t border-[#F3EADB]/8">
                        <LogOut size={14} aria-hidden="true" /> Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Button variant="ghost" href="/auth" className="text-sm px-4 py-2">Connexion</Button>
                  <Button variant="primary" href="/auth" className="text-xs px-5 py-2">S&apos;inscrire</Button>
                </div>
              )
            )}

            {/* Panier mobile */}
            <Link href="/panier" aria-label={`Panier — ${cartCount} article${cartCount > 1 ? "s" : ""}`}
              className="lg:hidden p-2 text-[#F3EADB]/60 hover:text-[#F3EADB] relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E0337E] text-[#F3EADB] text-[9px] font-mono flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Burger mobile */}
            <button
              className="lg:hidden p-2 text-[#F3EADB]/80 hover:text-[#F3EADB] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════
          MENU MOBILE — Drawer full height avec accordéons
          ═══════════════════════════════════════════════ */}
      {/* Overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobile}
      />

      {/* Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu de navigation"
        aria-modal="true"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-[#1a0d28] flex flex-col lg:hidden",
          "transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Prism line */}
        <div className="h-[3px] w-full shrink-0"
          style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />

        {/* Header du drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3EADB]/8 shrink-0">
          <Link href="/" onClick={closeMobile} className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Spectrum For Us" width={28} height={28} className="object-contain" />
            <span className="font-fraunces text-base text-[#F3EADB]">
              Spectrum <span className="text-[#E0337E] font-light">For Us</span>
            </span>
          </Link>
          <button onClick={closeMobile} aria-label="Fermer le menu"
            className="p-2 text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav aria-label="Menu mobile" className="p-3">
            {NAV.map((item) => {
              const isExpanded = mobileExpanded === item.href;
              const Icon = item.icon;

              return (
                <div key={item.href} className="mb-1">
                  {/* Section principale */}
                  <button
                    onClick={() => setMobileExpanded(isExpanded ? null : item.href)}
                    aria-expanded={isExpanded}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                      isExpanded
                        ? "bg-[#E0337E]/10 text-[#F3EADB]"
                        : "text-[#F3EADB]/70 hover:bg-[#F3EADB]/5 hover:text-[#F3EADB]"
                    )}
                  >
                    <Icon size={16} aria-hidden="true"
                      className={isExpanded ? "text-[#E0337E]" : "text-[#E0337E]/60"} />
                    <span className="font-hanken text-base flex-1 text-left">{item.label}</span>
                    <ChevronDown size={15} aria-hidden="true"
                      className={cn("transition-transform duration-200 text-[#F3EADB]/30",
                        isExpanded && "rotate-180 text-[#E0337E]")} />
                  </button>

                  {/* Contenu accordéon */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-500",
                    isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="pb-2">
                      {/* Lien vers la page principale */}
                      <Link href={item.href} onClick={closeMobile}
                        className="flex items-center gap-2 px-4 py-2.5 mx-2 rounded-lg font-hanken text-sm text-[#E0337E]/80 hover:text-[#E0337E] hover:bg-[#E0337E]/5 transition-colors">
                        <ArrowRight size={12} aria-hidden="true" />
                        Voir tout — {item.label}
                      </Link>

                      {/* Méga menu : sections avec sous-catégories */}
                      {item.mega?.map((section) => {
                        const SectionIcon = section.icon;
                        return (
                          <div key={section.heading} className="mt-1">
                            <div className="flex items-center gap-2 px-4 py-2">
                              <SectionIcon size={11} style={{ color: section.color }} aria-hidden="true" />
                              <p className="font-mono text-[9px] tracking-widest uppercase"
                                style={{ color: section.color }}>{section.heading}</p>
                            </div>

                            {section.cats.map((catName) => {
                              const subs = CATEGORIES[catName] ?? [];
                              const catKey = `${item.href}:${catName}`;
                              const catExpanded = mobileSubExpanded === catKey;

                              return (
                                <div key={catName} className="px-2 mb-0.5">
                                  {/* Catégorie principale */}
                                  <div className="flex items-center">
                                    <Link
                                      href={`/decouvrir?category=${encodeURIComponent(catName)}`}
                                      onClick={closeMobile}
                                      className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-l-lg font-hanken text-sm text-[#F3EADB]/75 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 transition-colors"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ background: section.color }} aria-hidden="true" />
                                      {catName}
                                    </Link>
                                    {subs.length > 0 && (
                                      <button
                                        onClick={() => setMobileSubExpanded(catExpanded ? null : catKey)}
                                        aria-expanded={catExpanded}
                                        aria-label={`Sous-catégories de ${catName}`}
                                        className={cn(
                                          "px-2.5 py-2.5 rounded-r-lg border-l border-[#F3EADB]/8 transition-all",
                                          catExpanded
                                            ? "text-[#E0337E] bg-[#E0337E]/8"
                                            : "text-[#F3EADB]/25 hover:text-[#F3EADB]/60 hover:bg-[#F3EADB]/5"
                                        )}
                                      >
                                        <ChevronRight size={13} aria-hidden="true"
                                          className={cn("transition-transform duration-200", catExpanded && "rotate-90")} />
                                      </button>
                                    )}
                                  </div>

                                  {/* Sous-catégories */}
                                  <div className={cn(
                                    "overflow-hidden transition-all duration-200",
                                    catExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                                  )}>
                                    <ul className="pl-6 py-1">
                                      {subs.map((sub) => (
                                        <li key={sub}>
                                          <Link
                                            href={`/decouvrir?category=${encodeURIComponent(catName)}&subcategory=${encodeURIComponent(sub)}`}
                                            onClick={closeMobile}
                                            className="block py-2 px-3 font-hanken text-sm text-[#F3EADB]/45 hover:text-[#F3EADB]/80 transition-colors rounded-lg hover:bg-[#F3EADB]/4"
                                          >
                                            {sub}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* Links menu */}
                      {item.links?.map((link) => (
                        <div key={link.href} className="px-2">
                          <Link href={link.href} onClick={closeMobile}
                            className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-[#F3EADB]/5 transition-colors">
                            <span className="font-hanken text-sm text-[#F3EADB]/75 hover:text-[#F3EADB]">
                              {link.label}
                            </span>
                            {link.desc && (
                              <span className="font-hanken text-xs text-[#F3EADB]/30 mt-0.5">{link.desc}</span>
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer du drawer */}
        <div className="shrink-0 border-t border-[#F3EADB]/8 p-4 space-y-3">
          {isAdmin && (
            <Link href="/admin" onClick={closeMobile}
              className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#E0337E]/15 border border-[#E0337E]/30 text-sm font-hanken text-[#E0337E] w-full">
              <LayoutDashboard size={14} aria-hidden="true" /> Back-office
            </Link>
          )}
          {user ? (
            <div className="grid grid-cols-2 gap-2">
              <Link href="/compte" onClick={closeMobile}
                className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#F3EADB]/20 text-sm font-hanken text-[#F3EADB]/70 hover:text-[#F3EADB] transition-colors">
                <User size={14} aria-hidden="true" /> Mon compte
              </Link>
              <button onClick={() => { closeMobile(); signOut(); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-red-400/20 text-sm font-hanken text-red-400 hover:bg-red-400/5 transition-colors">
                <LogOut size={14} aria-hidden="true" /> Déconnexion
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" href="/auth" className="text-sm py-2.5 text-center justify-center">
                Connexion
              </Button>
              <Button variant="primary" href="/auth" className="text-sm py-2.5 text-center justify-center">
                S&apos;inscrire
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <LocaleSwitcher />
            <span className="font-mono text-[9px] text-[#F3EADB]/20 uppercase tracking-widest">
              ✦ La marketplace queer
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
