import type { Metadata } from "next"
import ServicesShowcase from "@/components/services-showcase"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Services | Spectrum Marketplace",
  description:
    "Découvrez tous les services proposés par notre communauté de créateur·rice·s et professionnel·le·s sur Spectrum Marketplace.",
}

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>

        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 text-sm font-medium mb-4">
            Services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Services Proposés par nos Créateur·rice·s
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Découvrez la diversité des services offerts par notre communauté de professionnel·le·s talentueux·ses.
            Chaque service est fourni par des membres de la communauté queer et alliés.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <ServicesShowcase />
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Vous proposez un service ?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Rejoignez notre communauté de professionnel·le·s et proposez vos services sur Spectrum Marketplace.
        </p>
        <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90" asChild>
          <Link href="/devenir-vendeur">Devenir Prestataire</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Pour les Prestataires</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Touchez une clientèle engagée et inclusive</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Gérez facilement vos réservations et paiements</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Bénéficiez de notre visibilité et de notre communauté</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Recevez des avis et construisez votre réputation</span>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Pour les Client·e·s</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Trouvez des professionnel·le·s qui partagent vos valeurs</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Réservez et payez en toute sécurité</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Soutenez des entrepreneur·e·s de la communauté</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✓</span>
              <span>Laissez des avis pour aider la communauté</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
