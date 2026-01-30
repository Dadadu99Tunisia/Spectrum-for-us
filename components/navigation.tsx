"use client"

import Link from "next/link"
import { ShoppingCart, Menu, Search, User, ChevronDown, HelpCircle, Globe, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { languages, currencies } from "@/lib/i18n/config"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { t, language, setLanguage, currency, setCurrency } = useI18n()

  return (
    <nav className="sticky top-0 z-50 w-full bg-cream border-b-3 border-charcoal/10" aria-label="Main navigation">
      {/* Top Bar */}
      <div className="bg-white border-b border-charcoal/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-end gap-2 sm:gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-bold text-charcoal hover:bg-sunshine-yellow/20 rounded-full transition-all duration-200"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{languages[language].name}</span>
                  <span className="sm:hidden">{languages[language].flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl border-2 border-charcoal/10">
                {Object.entries(languages).map(([code, lang]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLanguage(code as keyof typeof languages)}
                    className={`cursor-pointer rounded-xl ${language === code ? "bg-sunshine-yellow/30" : ""}`}
                  >
                    <span className="mr-2 text-base">{lang.flag}</span>
                    <span className="font-semibold">{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-bold text-charcoal hover:bg-zesty-orange/20 rounded-full transition-all duration-200"
                >
                  <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{currency}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-2xl border-2 border-charcoal/10">
                {Object.entries(currencies).map(([code, curr]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setCurrency(code as keyof typeof currencies)}
                    className={`cursor-pointer rounded-xl ${currency === code ? "bg-zesty-orange/30" : ""}`}
                  >
                    <span className="mr-2">{curr.symbol}</span>
                    <span className="font-semibold">{curr.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs font-bold text-charcoal hover:bg-fresh-teal/20 rounded-full transition-all duration-200"
              asChild
            >
              <Link href="/contact">
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Help</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="flex h-20 items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Spectrum Home">
            <span className="text-2xl sm:text-3xl font-black tracking-tight">
              <span className="text-electric-blue">Spec</span>
              <span className="text-zesty-orange">trum</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-bold text-charcoal hover:text-electric-blue transition-colors duration-200 relative group py-2"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-electric-blue rounded-full group-hover:w-full transition-all duration-300" />
            </Link>

            {/* Vibe Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-bold text-charcoal hover:text-zesty-orange transition-colors duration-200 group py-2">
                Shop by Vibe
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-3 rounded-3xl border-3 border-zesty-orange/20">
                <DropdownMenuItem asChild className="cursor-pointer rounded-2xl p-4 hover:bg-electric-blue/10 focus:bg-electric-blue/10">
                  <Link href="/products?category=wear" className="flex items-center gap-3">
                    <span className="text-2xl">👕</span>
                    <div>
                      <span className="font-bold text-charcoal">Wear</span>
                      <p className="text-xs text-charcoal/60">Fashion & Accessories</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-2xl p-4 hover:bg-zesty-orange/10 focus:bg-zesty-orange/10">
                  <Link href="/products?category=decorate" className="flex items-center gap-3">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <span className="font-bold text-charcoal">Decorate</span>
                      <p className="text-xs text-charcoal/60">Art & Home</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-2xl p-4 hover:bg-fresh-teal/10 focus:bg-fresh-teal/10">
                  <Link href="/products?category=read" className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    <div>
                      <span className="font-bold text-charcoal">Read</span>
                      <p className="text-xs text-charcoal/60">Books & Zines</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-2xl p-4 hover:bg-poppy-red/10 focus:bg-poppy-red/10">
                  <Link href="/products?category=play" className="flex items-center gap-3">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <span className="font-bold text-charcoal">Play</span>
                      <p className="text-xs text-charcoal/60">Games & Fun</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-2xl p-4 hover:bg-sunshine-yellow/20 focus:bg-sunshine-yellow/20">
                  <Link href="/products?category=care" className="flex items-center gap-3">
                    <span className="text-2xl">💆</span>
                    <div>
                      <span className="font-bold text-charcoal">Care</span>
                      <p className="text-xs text-charcoal/60">Wellness & Beauty</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/creators"
              className="text-sm font-bold text-charcoal hover:text-fresh-teal transition-colors duration-200 relative group py-2"
            >
              Creators
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-fresh-teal rounded-full group-hover:w-full transition-all duration-300" />
            </Link>

            <Link
              href="/about"
              className="text-sm font-bold text-charcoal hover:text-poppy-red transition-colors duration-200 relative group py-2"
            >
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-poppy-red rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/50 group-focus-within:text-electric-blue transition-colors duration-200" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Find Joy: search makers, art, gear..."
                className="pl-12 pr-4 h-12 w-full rounded-full border-3 border-zesty-orange/40 bg-white text-charcoal focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/20 transition-all duration-200 text-sm font-medium placeholder:text-charcoal/50"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Sell Button */}
            <Button
              asChild
              className="hidden lg:flex bg-zesty-orange hover:bg-zesty-orange/90 text-white font-bold px-6 rounded-full shadow-orange hover-bounce transition-all duration-200"
            >
              <Link href="/vendor-subscription">Sell & Join the Party</Link>
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-electric-blue/10 rounded-full transition-all duration-200"
              asChild
              aria-label="Profile"
            >
              <Link href="/dashboard">
                <User className="h-5 w-5 text-charcoal" />
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-poppy-red/10 rounded-full transition-all duration-200"
              asChild
              aria-label="Shopping cart with 0 items"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 text-charcoal" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-poppy-red text-[10px] font-black text-white flex items-center justify-center">
                  0
                </span>
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-sunshine-yellow/20 rounded-full transition-all duration-200"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-charcoal" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto bg-cream border-l-3 border-charcoal/10">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/50" aria-hidden="true" />
                    <Input
                      type="search"
                      placeholder="Find Joy..."
                      className="pl-12 rounded-full border-2 border-zesty-orange/40 bg-white"
                      aria-label="Search"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link
                      href="/"
                      className="text-lg font-bold text-charcoal hover:text-electric-blue transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>

                    <div className="border-t-2 border-charcoal/10 pt-4">
                      <p className="text-xs font-black text-zesty-orange mb-3 uppercase tracking-wider">Shop by Vibe</p>
                      {[
                        { name: "Wear", icon: "👕", href: "/products?category=wear" },
                        { name: "Decorate", icon: "🎨", href: "/products?category=decorate" },
                        { name: "Read", icon: "📚", href: "/products?category=read" },
                        { name: "Play", icon: "🎮", href: "/products?category=play" },
                        { name: "Care", icon: "💆", href: "/products?category=care" },
                      ].map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="flex items-center gap-3 text-base font-semibold text-charcoal hover:text-electric-blue transition-colors py-3"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="text-xl">{category.icon}</span>
                          {category.name}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t-2 border-charcoal/10 pt-4">
                      <Link
                        href="/creators"
                        className="text-base font-semibold text-charcoal hover:text-fresh-teal transition-colors py-2 block"
                        onClick={() => setIsOpen(false)}
                      >
                        Creators
                      </Link>
                      <Link
                        href="/about"
                        className="text-base font-semibold text-charcoal hover:text-poppy-red transition-colors py-2 block"
                        onClick={() => setIsOpen(false)}
                      >
                        Our Story
                      </Link>
                      <Link
                        href="/contact"
                        className="text-base font-semibold text-charcoal hover:text-electric-blue transition-colors py-2 block"
                        onClick={() => setIsOpen(false)}
                      >
                        Contact
                      </Link>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-charcoal/10">
                    <Button
                      asChild
                      className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white font-bold rounded-full py-6 mb-3"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-zesty-orange hover:bg-zesty-orange/90 text-white font-bold rounded-full py-6"
                    >
                      <Link href="/vendor-subscription" onClick={() => setIsOpen(false)}>
                        Start Selling
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
