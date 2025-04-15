"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ArrowRight, ShoppingBag, Users, CreditCard, HelpCircle, Settings, FileText } from "lucide-react"

export default function VendrePage() {
  const [activeTab, setActiveTab] = useState("pourquoi")

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-purple-900 to-purple-800 text-white overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-purple-500 opacity-20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-pink-500 opacity-20 rounded-full transform translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/4 right-1/6 w-24 h-24 bg-yellow-400 opacity-20 rounded-full"></div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Touchez une communauté engagée et inclusive
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-purple-100">
              Rejoignez Spectrum et vendez vos créations à des milliers de client·e·s qui partagent vos valeurs
            </p>
            <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-purple-100">
              <Link href="/devenir-vendeur">
                Commencer à vendre
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi vendre sur Spectrum ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rejoignez la marketplace créative où des milliers de personnes dépensent pour soutenir des
              entrepreneur·e·s comme vous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Marché en pleine croissance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Plus de 50 000 client·e·s à la recherche de produits uniques, inclusifs et authentiques.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Communauté engagée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Une communauté qui valorise la diversité, l'inclusion et le soutien aux créateur·rice·s
                  indépendant·e·s.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Frais transparents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seulement 8% de commission sur les ventes, sans frais mensuels ni frais d'inscription.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Commencer à vendre sur Spectrum est simple et rapide. Suivez ces étapes pour lancer votre boutique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-purple-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Créez votre compte</h3>
              <p className="text-muted-foreground">Inscrivez-vous et complétez votre profil de vendeur·euse.</p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-purple-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Configurez votre boutique</h3>
              <p className="text-muted-foreground">Personnalisez votre espace et définissez vos politiques.</p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-purple-200 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ajoutez vos produits</h3>
              <p className="text-muted-foreground">Mettez en ligne vos créations avec photos et descriptions.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Commencez à vendre</h3>
              <p className="text-muted-foreground">Recevez des commandes et développez votre activité.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/devenir-vendeur">
                Ouvrir ma boutique
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Seller Success Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Histoires de réussite</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment des créateur·rice·s comme vous ont réussi sur Spectrum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/sellers/seller1.jpg"
                  alt="Portrait d'Alex, vendeur·euse sur Spectrum"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Alex, QueerApparel</CardTitle>
                <CardDescription>Vêtements inclusifs | Paris</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Spectrum m'a permis de toucher une clientèle qui partage mes valeurs. En 6 mois, j'ai pu quitter mon
                  emploi pour me consacrer entièrement à ma passion."
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/sellers/seller2.jpg"
                  alt="Portrait de Sam, vendeur·euse sur Spectrum"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Sam, PrideJewels</CardTitle>
                <CardDescription>Bijoux artisanaux | Lyon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "La communauté Spectrum est incroyable. Les client·e·s comprennent la valeur du fait-main et sont
                  prêt·e·s à soutenir des artisan·e·s indépendant·e·s."
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/images/sellers/seller3.jpg"
                  alt="Portrait de Jordan, vendeur·euse sur Spectrum"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Jordan, InclusiveArt</CardTitle>
                <CardDescription>Art & Illustrations | Marseille</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Grâce à Spectrum, j'ai pu développer ma clientèle internationale. Les outils de vente sont simples et
                  les frais sont raisonnables."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ and Resources */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ressources pour vendeur·euse·s</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour réussir sur Spectrum.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="pourquoi">Pourquoi Spectrum</TabsTrigger>
              <TabsTrigger value="frais">Frais & Paiements</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="pourquoi" className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Pourquoi choisir Spectrum ?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Une marketplace inclusive et diversifiée</p>
                    <p className="text-muted-foreground">
                      Spectrum est dédié à la promotion de la diversité et de l'inclusion dans le commerce en ligne.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Des outils de vente simples et puissants</p>
                    <p className="text-muted-foreground">
                      Notre plateforme est conçue pour vous permettre de vous concentrer sur la création, pas sur la
                      technique.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Une communauté engagée</p>
                    <p className="text-muted-foreground">
                      Nos client·e·s recherchent activement des produits qui reflètent leurs valeurs et soutiennent des
                      créateur·rice·s indépendant·e·s.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Support dédié aux vendeur·euse·s</p>
                    <p className="text-muted-foreground">
                      Notre équipe est là pour vous aider à chaque étape de votre parcours entrepreneurial.
                    </p>
                  </div>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="frais" className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Frais & Paiements</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Frais de commission</h4>
                  <p className="text-muted-foreground">
                    Spectrum prélève une commission de 8% sur chaque vente, ce qui inclut les frais de traitement des
                    paiements.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Frais d'inscription</h4>
                  <p className="text-muted-foreground">
                    Aucun frais d'inscription ou d'abonnement mensuel. Vous ne payez que lorsque vous vendez.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Paiements</h4>
                  <p className="text-muted-foreground">
                    Les paiements sont versés directement sur votre compte bancaire 3 jours ouvrables après la
                    confirmation de livraison.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Devises acceptées</h4>
                  <p className="text-muted-foreground">
                    Spectrum accepte les paiements en EUR, USD, GBP et CAD. Vous pouvez choisir votre devise préférée.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Questions fréquentes</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Qui peut vendre sur Spectrum ?</h4>
                  <p className="text-muted-foreground">
                    Toute personne majeure peut vendre sur Spectrum, à condition que les produits respectent nos
                    conditions d'utilisation et nos valeurs d'inclusion et de diversité.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Combien de temps faut-il pour ouvrir une boutique ?</h4>
                  <p className="text-muted-foreground">
                    Le processus d'inscription prend environ 15-20 minutes. Votre boutique sera examinée et approuvée
                    dans un délai de 48 heures.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Comment sont gérées les expéditions ?</h4>
                  <p className="text-muted-foreground">
                    Vous êtes responsable de l'expédition de vos produits. Spectrum vous permet de définir vos propres
                    tarifs et délais d'expédition.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Que se passe-t-il en cas de litige ?</h4>
                  <p className="text-muted-foreground">
                    Spectrum dispose d'un système de résolution des litiges pour aider les vendeur·euse·s et les
                    acheteur·euse·s à trouver une solution équitable.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <Link href="/ressources-vendeurs" className="block">
              <Card className="h-full hover:border-purple-300 transition-colors">
                <CardHeader>
                  <FileText className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Guide du vendeur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Tout ce que vous devez savoir pour réussir sur Spectrum.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/outils-vendeurs" className="block">
              <Card className="h-full hover:border-purple-300 transition-colors">
                <CardHeader>
                  <Settings className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Outils & Ressources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Accédez à nos outils pour optimiser votre boutique.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/support-vendeurs" className="block">
              <Card className="h-full hover:border-purple-300 transition-colors">
                <CardHeader>
                  <HelpCircle className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Support vendeur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Obtenez de l'aide pour toutes vos questions.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt·e à rejoindre Spectrum ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Commencez à vendre dès aujourd'hui et rejoignez notre communauté de créateur·rice·s passionné·e·s.
          </p>
          <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-purple-100">
            <Link href="/devenir-vendeur">
              Ouvrir ma boutique
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
