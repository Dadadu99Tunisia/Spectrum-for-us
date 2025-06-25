"use client"

import type React from "react"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  Home,
  Sparkles,
  Users,
  Info,
  Film,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useLocale, currencies, languages } from "@/contexts/locale-context"
import { motion, AnimatePresence } from "framer-motion"

// Navigation avec redirections directes
const navigation = [
  { name: "home", href: "/", icon: Home },
  {
    name: "shopping",
    href: "/categories",
    icon: ShoppingBag,
    mobileItems: [
      { name: "clothing", href: "/categorie/clothing" },
      { name: "jewelry", href: "/categorie/jewelry" },
      { name: "art", href: "/categorie/art" },
      { name: "beauty", href: "/categorie/beauty" },
      { name: "home_decor", href: "/categorie/home" },
      { name: "books", href: "/categorie/books" },
      { name: "accessories", href: "/categorie/accessories" },
      { name: "craft", href: "/categorie/craft" },
    ],
  },
  {
    name: "services",
    href: "/services",
    icon: Sparkles,
    mobileItems: [
      { name: "design", href: "/services/design" },
      { name: "photography", href: "/services/photography" },
      { name: "web_dev", href: "/services/web-development" },
      { name: "consulting", href: "/services/consulting" },
      { name: "coaching", href: "/services/coaching" },
      { name: "translation", href: "/services/translation" },
    ],
  },
  { name: "new_arrivals", href: "/nouveautes", icon: Sparkles },
  { name: "sellers", href: "/vendeurs", icon: Users },
  { name: "about", href: "/a-propos", icon: Info },
]

// Traductions inclusives
const inclusiveTranslations = {
  fr: {
    home: "Accueil",
    shopping: "Shopping",
    services: "Services",
    design: "Design",
    photography: "Photographie",
    web_dev: "Développement Web",
    consulting: "Conseil",
    coaching: "Coaching",
    translation: "Traduction",
    view_all_services: "Tous les services",
    clothing: "Vêtements",
    jewelry: "Bijoux",
    art: "Art",
    beauty: "Beauté",
    home_decor: "Décoration",
    books: "Livres",
    accessories: "Accessoires",
    craft: "Artisanat",
    view_all_categories: "Voir toutes les catégories",
    new_arrivals: "Nouveautés",
    sellers: "Vendeur·euse·s",
    about: "À propos",
    search: "Rechercher des produits, vendeur·euse·s...",
    light_mode: "Mode clair",
    dark_mode: "Mode sombre",
    login: "Se connecter",
    register: "S'inscrire",
    become_seller: "Devenir vendeur·euse",
    sell: "Vendre",
    open_menu: "Ouvrir le menu",
    close_menu: "Fermer le menu",
    favorites: "Favoris",
    cart: "Panier",
    account: "Mon compte",
    settings: "Paramètres",
    help: "Aide",
    notifications: "Notifications",
  },
  en: {
    home: "Home",
    shopping: "Shopping",
    services: "Services",
    design: "Design",
    photography: "Photography",
    web_dev: "Web Development",
    consulting: "Consulting",
    coaching: "Coaching",
    translation: "Translation",
    view_all_services: "All services",
    clothing: "Clothing",
    jewelry: "Jewelry",
    art: "Art",
    beauty: "Beauty",
    home_decor: "Home Decor",
    books: "Books",
    accessories: "Accessories",
    craft: "Craft",
    view_all_categories: "View all categories",
    new_arrivals: "New Arrivals",
    sellers: "Sellers",
    about: "About",
    search: "Search for products, sellers...",
    light_mode: "Light mode",
    dark_mode: "Dark mode",
    login: "Login",
    register: "Register",
    become_seller: "Become a seller",
    sell: "Sell",
    open_menu: "Open menu",
    close_menu: "Close menu",
    favorites: "Favorites",
    cart: "Cart",
    account: "My account",
    settings: "Settings",
    help: "Help",
    notifications: "Notifications",
  },
}

export default function Header() {
  const { currency, setCurrency, language, setLanguage } = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(2)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Détection mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fonction de traduction inclusive
  const t = (key: string) => {
    const lang = language.code.startsWith("fr") ? "fr" : "en"
    return inclusiveTranslations[lang][key] || key
  }

  // Navigation mobile directe - ferme le menu et redirige
  const handleMobileNavigation = (href: string) => {
    setMobileMenuOpen(false)
    router.push(href)
  }

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effet pour fermer le menu mobile lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  // Fonction pour gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/95 dark:bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        {/* Top bar - masqué sur mobile pour plus d'espace */}
        <div className="hidden lg:flex items-center justify-end py-1 border-b border-border/30 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            {/* Langue */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>{language.flag}</span>
                  <span className="hidden sm:inline">{language.name}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuRadioGroup
                  value={language.code}
                  onValueChange={(value) => {
                    const selectedLanguage = languages.find((l) => l.code === value)
                    if (selectedLanguage) setLanguage(selectedLanguage)
                  }}
                >
                  {languages.map((lang) => (
                    <DropdownMenuRadioItem key={lang.code} value={lang.code}>
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Devise */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                  <span>{currency.symbol}</span>
                  <span className="hidden sm:inline">{currency.name}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuRadioGroup
                  value={currency.code}
                  onValueChange={(value) => {
                    const selectedCurrency = currencies.find((c) => c.code === value)
                    if (selectedCurrency) setCurrency(selectedCurrency)
                  }}
                >
                  {currencies.map((curr) => (
                    <DropdownMenuRadioItem key={curr.code} value={curr.code}>
                      <span className="mr-2">{curr.symbol}</span>
                      {curr.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Boutons Slay+ et Voyage+ */}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                asChild
              >
                <Link href="/slay-plus">
                  <Film className="h-3 w-3 mr-1" />
                  <span>Slay+</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-xs bg-gradient-to-r from-blue-500 to-teal-600 text-white hover:from-blue-600 hover:to-teal-700"
                asChild
              >
                <Link href="/voyage-plus">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>Voyage+</span>
                </Link>
              </Button>
            </div>

            <Link href="/aide" className="text-xs hover:text-purple-600 transition-colors">
              {t("help")}
            </Link>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn("mr-6", isMobile && "mr-2")}
            >
              <Link href="/">
                <span
                  className={cn(
                    "font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
                    isMobile ? "text-lg" : "text-xl",
                  )}
                >
                  {isMobile ? "Spectrum" : "Spectrum For us"}
                </span>
              </Link>
            </motion.div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`hover:text-purple-600 ${pathname === item.href ? "text-purple-600" : ""}`}
                >
                  {t(item.name)}
                </Link>
              ))}
            </div>

            {/* Desktop search and actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/recherche">
                  <Search className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/favoris">
                  <Heart className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/panier">
                  <ShoppingBag className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/connexion">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild>
                <Link href="/devenir-vendeur">{t("sell")}</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 hover:text-purple-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.name)}
                  </Link>
                ))}
                <Link
                  href="/favoris"
                  className="block py-2 hover:text-purple-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("favorites")}
                </Link>
                <Link
                  href="/panier"
                  className="block py-2 hover:text-purple-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("cart")}
                </Link>
                <Link
                  href="/connexion"
                  className="block py-2 hover:text-purple-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/devenir-vendeur"
                  className="block py-2 bg-purple-600 text-white text-center rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("become_seller")}
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pb-3 lg:hidden"
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-muted border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                  style={{ fontSize: isMobile ? "16px" : "14px" }}
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
