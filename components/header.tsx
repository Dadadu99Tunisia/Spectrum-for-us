"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Heart,
  User,
  ShoppingBag,
  Store,
  ChevronDown,
  LogIn,
  Globe,
  Home,
  Sparkles,
  Users,
  Info,
  Settings,
  HelpCircle,
  Film,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AccessibilityMenu } from "./accessibility-menu"
import { useLocale, currencies, languages } from "@/contexts/locale-context"
import { motion, AnimatePresence } from "framer-motion"
import { SpeechToggle } from "@/components/speech-toggle"

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
            <div className="hidden lg:flex lg:gap-x-4">
              {navigation.map((item) => (
                <motion.div key={item.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400 h-9 px-3",
                      pathname === item.href &&
                        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                    )}
                    asChild
                  >
                    <Link href={item.href}>{t(item.name)}</Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop search and actions */}
          <div className="hidden lg:flex items-center gap-x-2">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-muted border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </form>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <AccessibilityMenu />
            <SpeechToggle />

            {/* Favorites */}
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href="/favoris">
                <Heart className="h-4 w-4" />
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="h-9 w-9 relative" asChild>
              <Link href="/panier">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-purple-600 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/connexion" className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>{t("login")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/inscription" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("register")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/parametres" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("settings")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/aide" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>{t("help")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/devenir-vendeur" className="cursor-pointer">
                    <Store className="mr-2 h-4 w-4" />
                    <span>{t("become_seller")}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sell button */}
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ml-1"
            >
              <Link href="/devenir-vendeur">
                <Store className="h-4 w-4 mr-2" />
                {t("sell")}
              </Link>
            </Button>
          </div>

          {/* Mobile menu button and quick actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Search toggle */}
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="h-4 w-4" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="h-9 w-9 relative" asChild>
              <Link href="/panier">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-purple-600 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Menu toggle */}
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
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

      {/* Mobile menu - Navigation directe sans dropdowns */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-4 sm:max-w-sm"
            >
              {/* Header du menu */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Spectrum For us
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation principale - liens directs */}
              <div className="space-y-2 mb-6">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {/* Lien principal */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base"
                      onClick={() => handleMobileNavigation(item.href)}
                    >
                      {item.icon && <item.icon className="h-5 w-5 mr-3" />}
                      {t(item.name)}
                    </Button>

                    {/* Sous-liens pour mobile (affichés directement) */}
                    {item.mobileItems && (
                      <div className="ml-8 space-y-1 mt-1">
                        {item.mobileItems.map((subItem) => (
                          <Button
                            key={subItem.name}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm text-muted-foreground hover:text-purple-600"
                            onClick={() => handleMobileNavigation(subItem.href)}
                          >
                            {t(subItem.name)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Services rapides */}
              <div className="border-t border-border pt-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none"
                    onClick={() => handleMobileNavigation("/slay-plus")}
                  >
                    <Film className="h-4 w-4 mr-2" />
                    Slay+
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 bg-gradient-to-r from-blue-500 to-teal-600 text-white border-none"
                    onClick={() => handleMobileNavigation("/voyage-plus")}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Voyage+
                  </Button>
                </div>
              </div>

              {/* Actions utilisateur */}
              <div className="border-t border-border pt-4 space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => handleMobileNavigation("/connexion")}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {t("login")}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleMobileNavigation("/inscription")}>
                  <User className="h-4 w-4 mr-2" />
                  {t("register")}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleMobileNavigation("/devenir-vendeur")}>
                  <Store className="h-4 w-4 mr-2" />
                  {t("sell")}
                </Button>
              </div>

              {/* Liens rapides */}
              <div className="border-t border-border pt-4 mt-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleMobileNavigation("/favoris")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {t("favorites")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleMobileNavigation("/parametres")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t("settings")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleMobileNavigation("/aide")}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {t("help")}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
