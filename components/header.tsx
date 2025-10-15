"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  BookOpen,
  Sparkles,
  Users,
  Info,
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
import { AccessibilityMenu } from "./accessibility-menu"
import Image from "next/image"
import { useLocale, currencies, languages } from "@/contexts/locale-context"

// Mettre à jour la définition de navigation pour utiliser des clés de traduction
const navigation = [
  { name: "home", href: "/", icon: Home },
  {
    name: "categories",
    href: "#",
    dropdown: true,
    icon: BookOpen,
    items: [
      { name: "clothing", href: "/categorie/clothing" },
      { name: "jewelry", href: "/categorie/jewelry" },
      { name: "art", href: "/categorie/art" },
      { name: "beauty", href: "/categorie/beauty" },
      { name: "home_decor", href: "/categorie/home" },
      { name: "books", href: "/categorie/books" },
      { name: "accessories", href: "/categorie/accessories" },
      { name: "craft", href: "/categorie/craft" },
      { name: "view_all_categories", href: "/categories", isAction: true },
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
    categories: "Catégories",
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
  },
  en: {
    home: "Home",
    categories: "Categories",
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
  },
}

// Dans la fonction Header, ajouter la fonction t
export default function Header() {
  // ...autres déclarations
  const { currency, setCurrency, language, setLanguage } = useLocale()

  // Fonction de traduction inclusive
  const t = (key: string) => {
    const lang = language.code.startsWith("fr") ? "fr" : "en"
    return inclusiveTranslations[lang][key] || key
  }

  // ...reste du code
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(2)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/90 dark:bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        {/* Top bar with language and currency selectors */}
        <div className="hidden lg:flex items-center justify-end py-2 border-b border-border/30 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {/* Langue */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  <Globe className="h-3.5 w-3.5 mr-1" />
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
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
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  <span>{currency.symbol}</span>
                  <span>{currency.name}</span>
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
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="-m-1.5 p-0.5 mr-6">
              <span className="sr-only">Spectrum</span>
              <Image
                src="/images/logo.png"
                alt="Spectrum Logo"
                width={600}
                height={180}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:gap-x-6">
              {navigation.map((item) =>
                item.dropdown ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="link"
                        className="text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400 p-0 h-auto"
                      >
                        {t(item.name)}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56">
                      {item.items?.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.name}
                          asChild
                          className={cn(subItem.isAction && "font-medium text-purple-600 dark:text-purple-400")}
                        >
                          <Link href={subItem.href} className="cursor-pointer">
                            {t(subItem.name)}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400 relative py-2",
                      pathname === item.href
                        ? "text-purple-600 dark:text-purple-400 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-purple-600 dark:after:bg-purple-400"
                        : "text-foreground",
                    )}
                  >
                    {t(item.name)}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Desktop search and actions */}
          <div className="hidden lg:flex items-center gap-x-4">
            {/* Search bar */}
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder={t("search")}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-muted border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{theme === "dark" ? t("light_mode") : t("dark_mode")}</span>
            </Button>

            {/* Accessibility menu */}
            <AccessibilityMenu />

            {/* Favorites */}
            <Link href="/favoris">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/panier" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/panier" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Menu toggle */}
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">{t("open_menu")}</span>
            </Button>
          </div>
        </nav>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="pb-4 lg:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder={t("search")}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-muted border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Spectrum</span>
                <Image
                  src="/images/logo.png"
                  alt="Spectrum Logo"
                  width={600}
                  height={180}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
              <button type="button" className="-m-2.5 rounded-md p-2.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">{t("close_menu")}</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Language and currency selectors */}
            <div className="flex gap-2 mb-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>{language.flag}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <span>{currency.symbol}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
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
            </div>

            {/* Theme and accessibility */}
            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>{theme === "dark" ? t("light_mode") : t("dark_mode")}</span>
              </Button>
              <AccessibilityMenu />
            </div>

            {/* Navigation links */}
            <div className="space-y-1 py-6">
              {navigation.map((item) =>
                item.dropdown ? (
                  <div key={item.name} className="space-y-2">
                    <div className="px-3 py-2 text-base font-semibold flex items-center">
                      {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                      {t(item.name)}
                    </div>
                    <div className="pl-4 space-y-1 border-l border-border">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "block px-3 py-1 text-sm hover:text-purple-600 dark:hover:text-purple-400",
                            subItem.isAction
                              ? "font-medium text-purple-600 dark:text-purple-400"
                              : "text-muted-foreground",
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(subItem.name)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold",
                      pathname === item.href
                        ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                        : "text-foreground hover:bg-muted",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                    {t(item.name)}
                  </Link>
                ),
              )}
            </div>

            {/* User actions */}
            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Link href="/favoris" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    {t("favorites")}
                  </Button>
                </Link>
                <Link href="/panier" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full relative">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {t("cart")}
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Link href="/connexion" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    {t("login")}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/inscription" onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    {t("register")}
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/devenir-vendeur" onClick={() => setMobileMenuOpen(false)}>
                    <Store className="h-4 w-4 mr-2" />
                    {t("become_seller")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
