import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag, Store, CreditCard, Package, ArrowRight } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
            Comment ça marche
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple et inclusif</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Que vous soyez acheteur ou vendeur, notre plateforme est conçue pour être accessible à tous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Pour les acheteurs */}
          <div className="space-y-8">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">Pour les acheteurs</h3>
                <p className="text-muted-foreground">Découvrez des produits uniques et inclusifs</p>
              </div>
            </div>

            <div className="space-y-6">
              <Step
                number="1"
                title="Explorez notre marketplace"
                description="Parcourez nos catégories et découvrez des produits créés par des artistes et entrepreneurs queer."
              />

              <Step
                number="2"
                title="Trouvez des produits qui vous correspondent"
                description="Utilisez nos filtres inclusifs pour trouver des produits adaptés à vos besoins et préférences."
              />

              <Step
                number="3"
                title="Effectuez votre achat en toute sécurité"
                description="Notre plateforme de paiement sécurisée garantit la protection de vos données personnelles."
              />

              <Step
                number="4"
                title="Recevez votre commande"
                description="Suivez votre commande et recevez vos produits directement chez vous."
              />
            </div>

            <div className="text-center">
              <Button asChild className="group">
                <Link href="/boutique">
                  Commencer à explorer
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Pour les vendeurs */}
          <div className="space-y-8">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <Store className="h-8 w-8 text-pink-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">Pour les vendeurs</h3>
                <p className="text-muted-foreground">Vendez vos créations à une communauté engagée</p>
              </div>
            </div>

            <div className="space-y-6">
              <Step
                number="1"
                title="Créez votre boutique"
                description="Inscrivez-vous et créez votre boutique en quelques minutes, sans frais d'inscription."
              />

              <Step
                number="2"
                title="Ajoutez vos produits"
                description="Mettez en ligne vos créations avec des descriptions détaillées et des photos de qualité."
              />

              <Step
                number="3"
                title="Recevez des commandes"
                description="Soyez notifié instantanément lorsqu'un client passe commande dans votre boutique."
              />

              <Step
                number="4"
                title="Développez votre activité"
                description="Accédez à des outils d'analyse pour suivre vos ventes et développer votre entreprise."
              />
            </div>

            <div className="text-center">
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group"
              >
                <Link href="/devenir-vendeur">
                  Devenir vendeur
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Commission équitable</h3>
            <p className="text-muted-foreground">
              Nous prélevons seulement 10% de commission sur vos ventes, bien en-dessous de la moyenne du marché.
            </p>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/10 p-6 rounded-lg">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Livraison simplifiée</h3>
            <p className="text-muted-foreground">
              Gérez facilement vos expéditions avec nos outils d'étiquetage et nos tarifs négociés avec les
              transporteurs.
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-lg">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Communauté engagée</h3>
            <p className="text-muted-foreground">
              Rejoignez une communauté d'acheteurs engagés qui valorisent l'authenticité et l'inclusivité.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm">
        {number}
      </div>
      <div className="ml-4">
        <h4 className="text-base font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

