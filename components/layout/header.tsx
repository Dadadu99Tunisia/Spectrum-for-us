"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, Heart, Store, LogOut, ChevronDown, Accessibility, Sparkles, Home, Palette, BookHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

const categoryMenu = [
  {
    name: "Fashion & Apparel",
    href: "/categories/fashion-apparel",
    description: "Gender-neutral streetwear, binders, tucking lingerie, upcycled fashion, clubwear",
    icon: Sparkles,
  },
  {
    name: "Beauty & Grooming",
    href: "/categories/beauty-grooming",
    description: "Skincare for all, beard care, gender-affirming makeup, fragrances",
    icon: Palette,
  },
  {
    name: "Adaptive & Mobility",
    href: "/categories/adaptive-mobility",
    description: "Designer wheelchair covers, stylish canes, sensory-friendly clothing, prosthetic art",
    icon: Accessibility,
  },
  {
    name: "Home & Sanctuary",
    href: "/categories/home-sanctuary",
    description: "Queer art prints, LGBTQ+ literature, safe space decor, candles",
    icon: Home,
  },
  {
    name: "Intimacy & Wellness",
    href: "/categories/intimacy-wellness",
    description: "Sexual wellness, mental health resources, yoga & body connection",
    icon: BookHeart,
  },
]

export function Header() {
  const { user, profile, vendor, isLoading } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Shop by Category</p>
              {categoryMenu.map((category) => (
                <Link 
                  key={category.href} 
                  href={category.href} 
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <category.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </Link>
              ))}
              <div className="border-t my-4" />
              <Link href="/categories" className="text-lg font-medium">
                All Categories
              </Link>
              <Link href="/vendors" className="text-lg font-medium">
                Vendors
              </Link>
              <Link href="/deals" className="text-lg font-medium">
                Deals
              </Link>
              <Link href="/community-guidelines" className="text-lg font-medium">
                Community Guidelines
              </Link>
              {profile?.role === "vendor" && (
                <Link href="/dashboard" className="text-lg font-medium">
                  Seller Dashboard
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span className="hidden text-xl font-bold sm:inline-block">Spectrum</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 ml-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              <DropdownMenuLabel>Shop by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categoryMenu.map((category) => (
                <DropdownMenuItem key={category.href} asChild>
                  <Link href={category.href} className="flex items-start gap-3 p-2">
                    <category.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/categories" className="font-medium">View All Categories</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/vendors" className="text-sm font-medium hover:text-primary transition-colors">
            Vendors
          </Link>
          <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors">
            Deals
          </Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          {user && (
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
          )}

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {/* User Menu */}
          {isLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <User className="h-5 w-5" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {profile?.role === "vendor" && vendor ? (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Seller Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/become-vendor" className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Become a Seller
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
