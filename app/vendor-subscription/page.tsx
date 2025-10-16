"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function VendorSubscriptionPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string) => {
    setIsLoading(plan)
    try {
      const response = await fetch("/api/vendor-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Failed to create subscription")
      }
    } catch (error) {
      console.error("[v0] Subscription error:", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(null)
    }
  }

  const plans = [
    {
      name: "Basic",
      price: "35",
      currency: "EUR",
      period: "mois",
      description: "Parfait pour commencer à vendre sur Spectrum",
      features: [
        "Jusqu'à 50 produits",
        "Commission de 10% par vente",
        "Dashboard vendeur",
        "Support par email",
        "Statistiques de base",
      ],
    },
    {
      name: "Premium",
      price: "75",
      currency: "EUR",
      period: "mois",
      description: "Pour les vendeurs qui veulent aller plus loin",
      features: [
        "Produits illimités",
        "Commission de 7% par vente",
        "Dashboard vendeur avancé",
        "Support prioritaire",
        "Statistiques avancées",
        "Promotion sur la page d'accueil",
        "Badge vendeur vérifié",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "150",
      currency: "EUR",
      period: "mois",
      description: "Pour les marques et grandes entreprises",
      features: [
        "Tout du plan Premium",
        "Commission de 5% par vente",
        "Account manager dédié",
        "API access",
        "Campagnes marketing personnalisées",
        "Intégration avec votre système",
        "Formation et onboarding",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Devenez Vendeur·euse sur Spectrum</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/95 max-w-4xl mx-auto leading-relaxed">
            Rejoignez la première marketplace queer internationale et partagez vos créations avec une communauté engagée
            de plus de 100 000 membres. Que vous vendiez des produits, des services, du contenu streaming ou organisiez
            des événements, Spectrum est votre plateforme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/signup?type=vendor">Commencer gratuitement</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur border-white text-white hover:bg-white/20"
              asChild
            >
              <Link href="#pricing">Voir les tarifs</Link>
            </Button>
          </div>
          <p className="mt-6 text-white/80">Essai gratuit de 14 jours • Sans carte bancaire</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi vendre sur Spectrum ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🌈</div>
                <h3 className="text-xl font-semibold mb-3">Communauté Engagée</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Accédez à une communauté de 100 000+ clients passionnés qui cherchent activement des produits et
                  services queer-friendly. Taux de conversion 3x supérieur aux marketplaces généralistes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold mb-3">Outils Professionnels</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dashboard complet avec statistiques en temps réel, gestion des commandes, facturation automatique et
                  outils marketing intégrés. Tout ce dont vous avez besoin pour réussir.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-3">Visibilité Maximale</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Profitez de nos campagnes marketing, de notre présence sur les réseaux sociaux et de notre SEO
                  optimisé. Nous investissons dans votre succès.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold mb-3">International</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Vendez dans le monde entier avec support multilingue (FR, EN, AR) et multi-devises (EUR, USD, TND).
                  Nous gérons la complexité pour vous.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-3">Support Dédié</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Une équipe qui comprend vos besoins et vous accompagne à chaque étape. Support par email, chat et
                  téléphone selon votre plan.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-3">Paiements Sécurisés</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Intégration Stripe pour des paiements sécurisés et rapides. Recevez vos paiements sous 48h directement
                  sur votre compte bancaire.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choisissez votre plan</h2>
          <p className="text-muted-foreground text-lg">
            Tous les plans incluent l'accès à notre plateforme et à nos outils de vente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Plus populaire
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan.name.toLowerCase())}
                  disabled={isLoading === plan.name.toLowerCase()}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {isLoading === plan.name.toLowerCase() ? "Chargement..." : "Commencer"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos vendeur·euse·s</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 italic">
                  "Spectrum m'a permis de toucher une audience qui comprend vraiment mes créations. Mes ventes ont
                  triplé en 3 mois !"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20" />
                  <div>
                    <p className="font-semibold">Alex M.</p>
                    <p className="text-sm text-muted-foreground">Créateur·rice de mode</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 italic">
                  "Enfin une plateforme qui nous comprend ! Le support est incroyable et les outils sont super
                  intuitifs."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20" />
                  <div>
                    <p className="font-semibold">Sam L.</p>
                    <p className="text-sm text-muted-foreground">Artiste illustrateur·rice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 italic">
                  "La communauté Spectrum est exceptionnelle. Je me sens enfin à ma place et mes clients aussi !"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20" />
                  <div>
                    <p className="font-semibold">Jordan K.</p>
                    <p className="text-sm text-muted-foreground">Coach bien-être</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Questions Fréquentes</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comment fonctionnent les commissions ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nous prenons une commission sur chaque vente (10%, 7% ou 5% selon votre plan) plus des frais de
                  gestion de 0,30€ par article (0,61€ pour les produits média). Aucun frais caché.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Puis-je vendre à l'international ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui ! Spectrum supporte plusieurs langues et devises. Vous pouvez vendre partout dans le monde et nous
                  gérons la conversion des devises automatiquement.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comment sont traités les paiements ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tous les paiements sont sécurisés via Stripe. Vous recevez vos paiements sous 48h directement sur
                  votre compte bancaire après déduction de notre commission.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt·e à commencer ?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Rejoignez des centaines de vendeur·euse·s qui font confiance à Spectrum
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup?type=vendor">Créer mon compte vendeur</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
