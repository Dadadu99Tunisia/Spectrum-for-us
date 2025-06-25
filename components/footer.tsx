"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Youtube, Heart, Smartphone } from "lucide-react"
import { Apple, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export default function Footer() {
  // État pour le rendu côté client uniquement
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Si pas encore monté, utiliser une mise en page par défaut pour éviter les erreurs d'hydratation
  if (!mounted) {
    return (
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-8">
          {/* Version simplifiée pour le rendu initial côté serveur */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contenu minimal pour éviter les sauts de mise en page */}
            <div>
              <h3 className="font-bold text-purple-600 mb-4">Spectrum</h3>
              <p className="text-sm text-gray-600">La marketplace inclusive pour la communauté LGBTQ+</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <div className="space-y-2">
                <Link href="/" className="block text-sm text-gray-600 hover:text-purple-600">
                  Accueil
                </Link>
                <Link href="/categories" className="block text-sm text-gray-600 hover:text-purple-600">
                  Catégories
                </Link>
                <Link href="/vendeurs" className="block text-sm text-gray-600 hover:text-purple-600">
                  Vendeurs
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link href="/aide" className="block text-sm text-gray-600 hover:text-purple-600">
                  Aide
                </Link>
                <Link href="/contact" className="block text-sm text-gray-600 hover:text-purple-600">
                  Contact
                </Link>
                <Link href="/a-propos" className="block text-sm text-gray-600 hover:text-purple-600">
                  À propos
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-purple-600">
                  Confidentialité
                </Link>
                <Link href="/terms" className="block text-sm text-gray-600 hover:text-purple-600">
                  Conditions
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            © 2024 Spectrum Marketplace. Tous droits réservés.
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        {/* App Download Banner */}
        <div className="mb-12 p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl border border-purple-200 dark:border-purple-800/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Smartphone className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                  Télécharge Spectrum For Us
                </h3>
                <p className="text-sm text-muted-foreground">
                  Crée un compte et bénéficie de 10% de réduction sur la boutique
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app-presentation">
                <Image
                  src="/placeholder.svg?height=40&width=135"
                  alt="Télécharger sur Google Play"
                  width={135}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <Link href="/app-presentation">
                <Image
                  src="/placeholder.svg?height=40&width=135"
                  alt="Télécharger sur App Store"
                  width={135}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Grille du footer adaptée au mobile */}
        <div className={cn("grid gap-8", isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-4")}>
          <div className={cn(isMobile ? "col-span-2" : "md:col-span-1")}>
            <div className="mb-2">
              <Image
                src="/images/logo.png"
                alt="Spectrum Logo"
                width={600}
                height={180}
                className="h-24 w-auto"
                priority
              />
            </div>
            <p className="text-sm text-muted-foreground">La marketplace inclusive pour la communauté LGBTQ+</p>
            <div className="mt-4 flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
                asChild
              >
                <a
                  href="https://www.facebook.com/profile.php?id=61565067524779"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
                asChild
              >
                <a href="https://www.instagram.com/spectrum.forus/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
                asChild
              >
                <a href="https://www.tiktok.com/@spectrumforus" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                    <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    <path d="M15 8v8a4 4 0 0 1-4 4" />
                    <line x1="15" y1="4" x2="15" y2="12" />
                  </svg>
                  <span className="sr-only">TikTok</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
                asChild
              >
                <a href="https://www.youtube.com/channel/UCSpectrumForUs" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                  <span className="sr-only">Youtube</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
                asChild
              >
                <a href="https://www.pinterest.com/spectrumforus" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v12" />
                    <path d="M8 10h8" />
                  </svg>
                  <span className="sr-only">Pinterest</span>
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Catégories
                </Link>
              </li>
              <li>
                <Link
                  href="/vendeurs"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Vendeurs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/aide" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                  Aide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                  Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Section téléchargement d'application */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-lg font-semibold mb-2">Télécharge Spectrum For Us</h3>
              <p className="text-gray-600 mb-4">Crée un compte pour bénéficier de 10% de réduction sur la boutique</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="/app-presentation"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Apple className="h-5 w-5" />
                <div>
                  <div className="text-xs">Télécharger sur</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="/app-presentation"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                <div>
                  <div className="text-xs">Disponible sur</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-200 dark:border-purple-800/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2024 Spectrum Marketplace. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                Politique de confidentialité
              </Link>
              <Link
                href="/accessibilite"
                className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
              >
                Accessibilité
              </Link>
              <div className="flex items-center text-muted-foreground">
                <span>Fait avec</span>
                <Heart className="h-3 w-3 mx-1 text-pink-500" />
                <span>pour la communauté</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
