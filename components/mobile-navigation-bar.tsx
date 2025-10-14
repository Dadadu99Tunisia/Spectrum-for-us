"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/contexts/locale-context"

// Traductions inclusives
const inclusiveTranslations = {
  fr: {
    home: "Accueil",
    search: "Rechercher",
    favorites: "Favoris",
    cart: "Panier",
    account: "Compte",
  },
  en: {
    home: "Home",
    search: "Search",
    favorites: "Favorites",
    cart: "Cart",
    account: "Account",
  },
}

function MobileNavigationBar() {
  const pathname = usePathname()
  const { language } = useLocale()
  const [cartCount, setCartCount] = useState(2)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Fonction de traduction inclusive
  const t = (key: string) => {
    const lang = language.code.startsWith("fr") ? "fr" : "en"
    return inclusiveTranslations[lang][key] || key
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Vérifier au chargement
    checkMobile()

    // Ajouter un écouteur pour les changements de taille
    window.addEventListener("resize", checkMobile)

    // Nettoyer l'écouteur
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Masquer la barre lors du défilement vers le bas, l'afficher lors du défilement vers le haut
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Si on n'est pas sur mobile, ne pas afficher la barre
  if (!isMobile) return null

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background border-t border-border z-40"
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center h-16">
        <NavItem href="/" icon={<Home className="h-5 w-5" />} label={t("home")} isActive={pathname === "/"} />

        <NavItem
          href="/recherche"
          icon={<Search className="h-5 w-5" />}
          label={t("search")}
          isActive={pathname === "/recherche"}
        />

        <NavItem
          href="/favoris"
          icon={<Heart className="h-5 w-5" />}
          label={t("favorites")}
          isActive={pathname === "/favoris"}
        />

        <NavItem
          href="/panier"
          icon={
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-purple-600 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </div>
          }
          label={t("cart")}
          isActive={pathname === "/panier"}
        />

        <NavItem
          href="/connexion"
          icon={<User className="h-5 w-5" />}
          label={t("account")}
          isActive={pathname === "/connexion" || pathname === "/inscription"}
        />
      </div>
    </motion.div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center w-full">
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={cn(
          "flex flex-col items-center justify-center",
          isActive ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground",
        )}
      >
        {icon}
        <span className="text-[10px] mt-1">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 w-6 h-1 bg-purple-600 dark:bg-purple-400 rounded-t-full"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  )
}

export default MobileNavigationBar
