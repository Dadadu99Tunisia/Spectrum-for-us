"use client"

import Link from "next/link"
import Image from "next/image"
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
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-end gap-2 sm:gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium hover:bg-white/60 transition-all duration-200"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{languages[language].name}</span>
                  <span className="sm:hidden">{languages[language].flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {Object.entries(languages).map(([code, lang]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLanguage(code as any)}
                    className={`cursor-pointer ${language === code ? "bg-accent" : ""}`}
                  >
                    <span className="mr-2 text-base">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
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
                  className="h-8 gap-1.5 text-xs font-medium hover:bg-white/60 transition-all duration-200"
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>{currency}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {Object.entries(currencies).map(([code, curr]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setCurrency(code as any)}
                    className={`cursor-pointer ${currency === code ? "bg-accent" : ""}`}
                  >
                    <span className="mr-2">{curr.symbol}</span>
                    <span className="font-medium">{curr.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium hover:bg-white/60 transition-all duration-200"
              asChild
            >
              <Link href="/contact">
                <HelpCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Aide</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {/* </CHANGE> */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 transition-opacity hover:opacity-80">
            <Image
              src="/logo-horizontal.png"
              alt="Spectrum For us"
              width={200}
              height={50}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 relative group"
            >
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {/* Shopping Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 group">
                Shopping
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2">
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-md p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                >
                  <Link href="/products" className="flex flex-col">
                    <span className="font-semibold">Produits</span>
                    <span className="text-xs text-muted-foreground">Découvrez notre catalogue</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-md p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                >
                  <Link href="/creators" className="flex flex-col">
                    <span className="font-semibold">Créateur·rice·s</span>
                    <span className="text-xs text-muted-foreground">Rencontrez nos artistes</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 group">
                Services
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2">
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-md p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                >
                  <Link href="/services" className="flex flex-col">
                    <span className="font-semibold">Tous les Services</span>
                    <span className="text-xs text-muted-foreground">Explorez nos offres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-md p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                >
                  <Link href="/streaming" className="flex flex-col">
                    <span className="font-semibold">Streaming</span>
                    <span className="text-xs text-muted-foreground">Vidéos, musique & podcasts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-md p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                >
                  <Link href="/events" className="flex flex-col">
                    <span className="font-semibold">Événements</span>
                    <span className="text-xs text-muted-foreground">Billetterie & activités</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-md p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                >
                  <Link href="/agency" className="flex flex-col">
                    <span className="font-semibold">Qtalkbot Ads</span>
                    <span className="text-xs text-muted-foreground">Agence de communication</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/blog"
              className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 relative group"
            >
              Nouveautés
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>

            <Link
              href="/about"
              className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 relative group"
            >
              À propos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
              <Input
                type="search"
                placeholder="Rechercher des produits, vendeurs ou catégories..."
                className="pl-11 pr-4 h-11 w-full rounded-full border-2 border-gray-200 focus:border-primary bg-gray-50 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Streaming Button */}
            <Button
              asChild
              className="hidden lg:flex bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-4 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Link href="/streaming">Streaming</Link>
            </Button>

            {/* Voyage Button */}
            <Button
              asChild
              className="hidden lg:flex bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold px-4 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Link href="/events">Voyage</Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
              asChild
              aria-label="Panier"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold text-white flex items-center justify-center">
                  0
                </span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
              asChild
              aria-label="Profil"
            >
              <Link href="/dashboard">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input type="search" placeholder="Rechercher..." className="pl-10 rounded-full" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link
                      href="/"
                      className="text-lg font-semibold hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Accueil
                    </Link>
                    <Link
                      href="/products"
                      className="text-lg font-semibold hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Produits
                    </Link>
                    <Link
                      href="/services"
                      className="text-lg font-semibold hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Services
                    </Link>
                    <Link
                      href="/streaming"
                      className="text-lg font-semibold hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Streaming
                    </Link>
                    <Link
                      href="/blog"
                      className="text-lg font-semibold hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Nouveautés
                    </Link>
                    <Link
                      href="/about"
                      className="text-lg font-semibold hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      À propos
                    </Link>
                  </div>

                  <div className="pt-6 border-t">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Connexion
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* </CHANGE> */}
    </nav>
  )
}
