import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube, Heart } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
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
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white dark:bg-background hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">Youtube</span>
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
            <div className="flex space-x-2">
              <Input type="email" placeholder="Votre email" className="max-w-[200px] bg-white dark:bg-background" />
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                S'abonner
              </Button>
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

