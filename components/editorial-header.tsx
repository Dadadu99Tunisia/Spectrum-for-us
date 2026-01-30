"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Search,
  Heart,
  User,
  ShoppingBag,
  ChevronDown,
  Globe,
  Film,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useLocale, currencies, languages } from "@/contexts/locale-context"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Shop", href: "/boutique" },
  { name: "Creators", href: "/vendeurs" },
  { name: "Live", href: "/slay-plus" },
  { name: "About", href: "/a-propos" },
]

export default function EditorialHeader() {
  const { currency, setCurrency, language, setLanguage } = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount] = useState(2)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled 
            ? "bg-background/80 backdrop-blur-md border-b border-border" 
            : "bg-transparent"
        )}
      >
        {/* Top utility bar */}
        <div className="hidden lg:block border-b border-border/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between py-2">
              {/* Left - tagline */}
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                For Us, By Us
              </span>

              {/* Right - utilities */}
              <div className="flex items-center gap-6">
                {/* Language */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                      <Globe className="h-3 w-3" />
                      <span>{language.code.toUpperCase()}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[150px] rounded-none border-border">
                    <DropdownMenuRadioGroup
                      value={language.code}
                      onValueChange={(value) => {
                        const selectedLanguage = languages.find((l) => l.code === value)
                        if (selectedLanguage) setLanguage(selectedLanguage)
                      }}
                    >
                      {languages.map((lang) => (
                        <DropdownMenuRadioItem key={lang.code} value={lang.code} className="font-mono text-xs">
                          {lang.flag} {lang.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Currency */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                      <span>{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[150px] rounded-none border-border">
                    <DropdownMenuRadioGroup
                      value={currency.code}
                      onValueChange={(value) => {
                        const selectedCurrency = currencies.find((c) => c.code === value)
                        if (selectedCurrency) setCurrency(selectedCurrency)
                      }}
                    >
                      {currencies.map((curr) => (
                        <DropdownMenuRadioItem key={curr.code} value={curr.code} className="font-mono text-xs">
                          {curr.symbol} {curr.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme toggle */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="container mx-auto px-6 lg:px-12">
          <nav className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="group">
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tight">
                SPECTRUM
              </span>
              <span className="hidden md:inline font-serif text-xl md:text-2xl font-light tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                {" "}FOR US
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "font-mono text-xs tracking-[0.15em] uppercase transition-colors relative",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                  {(pathname === item.href || pathname.startsWith(item.href + "/")) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Favorites */}
              <Link
                href="/favoris"
                className="hidden md:block p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Favorites"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link
                href="/panier"
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center bg-foreground text-background text-[10px] rounded-none">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {/* User */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="hidden md:block p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Account"
                  >
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px] rounded-none border-border">
                  <DropdownMenuItem asChild>
                    <Link href="/connexion" className="font-mono text-xs tracking-wider uppercase cursor-pointer">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/inscription" className="font-mono text-xs tracking-wider uppercase cursor-pointer">
                      Register
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/devenir-vendeur" className="font-mono text-xs tracking-wider uppercase cursor-pointer">
                      Become a Creator
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-6 lg:px-12 py-24">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
                    Search
                  </span>
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    autoFocus
                    className="w-full bg-transparent border-b border-border py-4 font-serif text-3xl md:text-4xl placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                  />
                </form>

                <div className="mt-8">
                  <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-4">
                    Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Jewelry", "Art Prints", "Ceramics", "Fashion", "Home Decor"].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term)
                          router.push(`/recherche?q=${encodeURIComponent(term)}`)
                          setSearchOpen(false)
                        }}
                        className="px-3 py-1.5 border border-border font-mono text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-background lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <span className="font-serif text-xl font-bold">SPECTRUM</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6 py-8">
                <ul className="space-y-6">
                  {navigation.map((item, index) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "font-serif text-3xl font-bold tracking-tight block",
                          pathname === item.href ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer actions */}
              <div className="px-6 py-8 border-t border-border space-y-4">
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/devenir-vendeur"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  Become a Creator
                </Link>
                
                {/* Theme toggle */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-[60px] lg:h-[100px]" />
    </>
  )
}
