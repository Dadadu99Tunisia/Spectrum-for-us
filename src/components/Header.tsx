"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Menu, X, Search, User, LogOut, Store, ChevronDown } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Créations", href: "/decouvrir?type=produit" },
  { label: "Services", href: "/decouvrir?type=service" },
  { label: "Expériences", href: "/decouvrir?type=experience" },
  { label: "Créateur·rice·s", href: "/#createurs" },
  { label: "À propos", href: "/#manifeste" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = useCart((s) => s.count());
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const pseudo = user?.user_metadata?.pseudo || user?.email?.split("@")[0] || "Mon compte";

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled ? "bg-[#1C0E29]/90 backdrop-blur-md border-b border-[#F3EADB]/8" : "bg-transparent"
    )}>
      {/* Prism line */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Spectrum For Us"
            width={36}
            height={36}
            className="object-contain transition-opacity duration-300 group-hover:opacity-80"
          />
          <span className="font-fraunces text-lg font-semibold text-[#F3EADB] hidden sm:block leading-none tracking-tight">
            Spectrum <span className="text-[#E0337E] font-light">For Us</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 font-hanken text-sm text-[#F3EADB]/70 hover:text-[#F3EADB] transition-colors duration-200 group relative">
              <span className="group-hover:before:content-['('] group-hover:after:content-[')'] before:text-[#E0337E] after:text-[#E0337E] before:opacity-0 after:opacity-0 group-hover:before:opacity-100 group-hover:after:opacity-100 before:transition-opacity after:transition-opacity">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Link href="/decouvrir" aria-label="Rechercher"
            className="p-2 text-[#F3EADB]/60 hover:text-[#F3EADB] transition-colors hidden md:flex">
            <Search size={18} />
          </Link>

          {/* Cart */}
          <Link href="/panier" aria-label={`Panier — ${cartCount} article${cartCount > 1 ? "s" : ""}`}
            className="p-2 text-[#F3EADB]/60 hover:text-[#F3EADB] transition-colors relative hidden md:flex">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E0337E] text-[#F3EADB] text-[9px] font-mono flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          {!loading && (
            user ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F3EADB]/15 text-[#F3EADB]/70 hover:text-[#F3EADB] hover:border-[#F3EADB]/30 transition-all duration-200 text-sm font-hanken"
                >
                  <User size={14} />
                  <span className="max-w-[80px] truncate">{pseudo}</span>
                  <ChevronDown size={12} className={cn("transition-transform duration-200", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#1C0E29] border border-[#F3EADB]/15 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                    <div className="px-4 py-3 border-b border-[#F3EADB]/8">
                      <p className="font-hanken text-xs text-[#F3EADB]/40">Connecté·e en tant que</p>
                      <p className="font-bricolage font-semibold text-[#F3EADB] text-sm truncate">{pseudo}</p>
                    </div>
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
                <Button variant="ghost" href="/auth" className="text-sm px-4 py-2">
                  Connexion
                </Button>
                <Button variant="primary" href="/auth" className="text-xs px-5 py-2">
                  S&apos;inscrire
                </Button>
              </div>
            )
          )}

          {/* Vendre CTA */}
          {!loading && !user && (
            <Button variant="secondary" href="/auth?mode=vendor" className="hidden lg:inline-flex text-xs px-4 py-2 ml-1">
              Vendre ici
            </Button>
          )}

          {/* Mobile burger */}
          <button className="md:hidden p-2 text-[#F3EADB]/80" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1C0E29]/95 backdrop-blur-md border-t border-[#F3EADB]/8 px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="py-2.5 font-hanken text-base text-[#F3EADB]/80 hover:text-[#F3EADB] border-b border-[#F3EADB]/8 last:border-0 transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex gap-3">
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
      )}
    </header>
  );
}
