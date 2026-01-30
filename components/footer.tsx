"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Youtube, Heart, Smartphone } from "lucide-react"
// Ajouter les imports pour les icônes
import { Apple, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function Footer() {
  // Utiliser useState et useEffect pour détecter la taille de l'écran au lieu du hook personnalisé
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Fonction pour vérifier si l'écran est de taille mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Vérifier au chargement initial
    checkIfMobile()

    // Ajouter un écouteur d'événement pour les changements de taille
    window.addEventListener("resize", checkIfMobile)

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <footer className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30">
      <div className="container mx-auto px-4 py-12">
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

        {/* Modifiez la grille du footer pour être plus adaptée au mobile */}
        {/* Remplacez la div de la grille principale par ceci: */}
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
            <p className="text-sm text-muted-foreground">
              Un espace inclusif pour la communauté queer où l'expression, la créativité et la diversité sont célébrées.
            </p>
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
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">Youtube</span>
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
            <h3 className="text-sm font-semibold mb-4">Découvrir</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/artistes"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Artistes
                </Link>
              </li>
              <li>
                <Link href="/mode" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                  Mode & Style
                </Link>
              </li>
              <li>
                <Link
                  href="/culture"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Culture
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                  Événements
                </Link>
              </li>
              <li>
                <Link
                  href="/boutique"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Boutique
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Communauté</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/forum" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                  Forum
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Histoires
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Ressources
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/contribute"
                  className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Contribuer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recevez nos actualités, événements et inspirations directement dans votre boîte mail.
            </p>
            <div className="flex space-x-2 mb-6">
              <Input type="email" placeholder="Votre email" className="max-w-[200px] bg-white dark:bg-background" />
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                S'abonner
              </Button>
            </div>

            {/* Optimisez la section des moyens de paiement pour mobile */}
            {/* Remplacez la div des moyens de paiement par ceci: */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Moyens de paiement</h4>
              <div className={cn("flex flex-wrap gap-2 items-center", isMobile && "gap-1")}>
                <div
                  className={cn(
                    "bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
                    isMobile ? "text-[9px]" : "text-xs font-semibold",
                  )}
                >
                  <span className="sr-only">Visa</span>
                  VISA
                </div>
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  <span className="sr-only">Mastercard</span>
                  MASTERCARD
                </div>
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  <span className="sr-only">American Express</span>
                  AMEX
                </div>
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  <span className="sr-only">PayPal</span>
                  PAYPAL
                </div>
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  <span className="sr-only">Klarna</span>
                  KLARNA
                </div>
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  <span className="sr-only">Floa</span>
                  FLOA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ajouter la section de téléchargement d'application dans le footer */}
        {/* Chercher la div qui contient les réseaux sociaux (généralement une div avec des icônes comme Facebook, Twitter, etc.) */}
        {/* Après cette div, ajouter la section suivante: */}
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
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Spectrum. Tous droits réservés.
            </p>
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
