"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, Heart, User, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Shop", href: "/boutique" },
  { name: "Categories", href: "/categories" },
  { name: "Creators", href: "/vendeurs" },
  { name: "About", href: "/a-propos" },
]

export default function EditorialHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

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
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-background"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl lg:text-2xl font-semibold tracking-tight text-foreground">
                Spectrum
              </span>
              <span className="text-xl lg:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors">
                For Us
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative py-2",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                  {(pathname === item.href || pathname.startsWith(item.href + "/")) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Favorites */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden sm:flex text-muted-foreground hover:text-foreground"
              >
                <Link href="/favoris">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Favorites</span>
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Link href="/panier">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full sunrise-gradient text-white text-xs font-medium flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:flex text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="cursor-pointer">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/sign-up" className="cursor-pointer">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/devenir-vendeur" className="cursor-pointer">
                      Become a Creator
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sign in button - desktop */}
              <Button
                asChild
                className="hidden lg:flex rounded-full px-6 pill-btn-gradient"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="mx-auto max-w-3xl px-4 py-20">
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-medium text-muted-foreground">
                  Search
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close search</span>
                </Button>
              </div>

              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  autoFocus
                  className="w-full bg-transparent border-b-2 border-border py-4 font-serif text-3xl md:text-4xl placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                />
              </form>

              <div className="mt-8">
                <span className="text-sm font-medium text-muted-foreground block mb-4">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Jewelry", "Art Prints", "Ceramics", "Fashion", "Home Decor"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term)
                        router.push(`/recherche?q=${encodeURIComponent(term)}`)
                        setSearchOpen(false)
                      }}
                      className="px-4 py-2 rounded-full bg-secondary text-sm font-medium text-secondary-foreground hover:bg-accent transition-colors"
                    >
                      {term}
                    </button>
                  ))}
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
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <span className="text-xl font-semibold">Spectrum</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-8">
                <ul className="space-y-4">
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
                          "text-2xl font-medium block py-2",
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
              <div className="px-4 py-6 border-t border-border space-y-4">
                <Button asChild className="w-full rounded-full pill-btn-gradient">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-full bg-transparent">
                  <Link href="/devenir-vendeur" onClick={() => setMobileMenuOpen(false)}>
                    Become a Creator
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  )
}
