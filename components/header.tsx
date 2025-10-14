"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon, Search, Heart, User, ShoppingBag, Store, ChevronDown, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Accueil", href: "/" },
  {
    name: "Catégories",
    href: "#",
    dropdown: true,
    items: [
      { name: "Vêtements", href: "/categorie/vetements" },
      { name: "Bijoux", href: "/categorie/bijoux" },
      { name: "Art", href: "/categorie/art" },
      { name: "Beauté", href: "/categorie/beaute" },
      { name: "Décoration", href: "/categorie/decoration" },
      { name: "Livres", href: "/categorie/livres" },
      { name: "Accessoires", href: "/categorie/accessoires" },
      { name: "Artisanat", href: "/categorie/artisanat" },
    ],
  },
  { name: "Nouveautés", href: "/nouveautes" },
  { name: "Vendeurs", href: "/vendeurs" },
  { name: "À Propos", href: "/a-propos" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(2)
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
        scrolled ? "bg-white/80 dark:bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between py-4">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Espace Queer</span>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              Espace Queer
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Changer de thème</span>
          </Button>

          <Link href="/panier" className="mr-2 relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) =>
            item.dropdown ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className="text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400 p-0 h-auto"
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {item.items?.map((subItem) => (
                    <DropdownMenuItem key={subItem.name} asChild>
                      <Link href={subItem.href} className="cursor-pointer">
                        {subItem.name}
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
                {item.name}
              </Link>
            ),
          )}
        </div>

        {/* Desktop right navigation */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
          <div className="relative w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-muted border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Changer de thème</span>
          </Button>

          <Link href="/favoris">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

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
                  <span>Connexion</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/inscription" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Inscription</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/devenir-vendeur" className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  <span>Devenir Vendeur</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ml-2"
          >
            <Link href="/devenir-vendeur">
              <Store className="h-4 w-4 mr-2" />
              Vendre
            </Link>
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <span className="sr-only">Espace Queer</span>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                    Espace Queer
                  </div>
                </Link>
                <button type="button" className="-m-2.5 rounded-md p-2.5" onClick={() => setMobileMenuOpen(false)}>
                  <span className="sr-only">Fermer le menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border">
                  <div className="space-y-2 py-6">
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-muted border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {navigation.map((item) =>
                      item.dropdown ? (
                        <div key={item.name} className="space-y-2">
                          <div className="px-3 py-2 text-base font-semibold">{item.name}</div>
                          <div className="pl-4 space-y-1 border-l border-border">
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-3 py-1 text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold",
                            pathname === item.href
                              ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                              : "text-foreground hover:bg-muted",
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ),
                    )}
                  </div>
                  <div className="py-6">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <Button variant="outline" size="icon" className="w-full">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-full relative">
                        <ShoppingBag className="h-5 w-5" />
                        {cartCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600">
                            {cartCount}
                          </Badge>
                        )}
                      </Button>
                      <Button variant="outline" size="icon" className="w-full">
                        <User className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-full">
                        <Store className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Link href="/connexion" onClick={() => setMobileMenuOpen(false)}>
                          Connexion
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/inscription" onClick={() => setMobileMenuOpen(false)}>
                          Inscription
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/devenir-vendeur" onClick={() => setMobileMenuOpen(false)}>
                          <Store className="h-4 w-4 mr-2" />
                          Devenir Vendeur
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

