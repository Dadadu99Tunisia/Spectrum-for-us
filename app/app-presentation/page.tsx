import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, ShoppingBag, Smartphone, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AppPresentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center text-purple-600 dark:text-purple-400 mb-8 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Découvrez l'application Spectrum For Us
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Explorez notre marketplace inclusive, soutenez les créateurs et artisans de la communauté queer et
              bénéficiez de 10% de réduction sur votre première commande.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button asChild variant="outline" className="bg-black hover:bg-gray-800 text-white border-0 h-14 px-6">
                <a href="#" className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
                    <path d="M16.5,8.5c0.2-1.4-0.4-2.8-1.3-3.8c-0.9-1-2.3-1.7-3.7-1.7c-0.5,0-1,0.1-1.5,0.2C9.5,3.3,9,3.5,8.6,3.7 C8.2,3.9,7.8,4.2,7.4,4.5C7.1,4.8,6.8,5.1,6.5,5.5C6.2,5.9,6,6.3,5.8,6.8C5.6,7.2,5.5,7.7,5.5,8.2c0,0.5,0.1,1,0.2,1.5 c0.2,0.5,0.4,0.9,0.7,1.3c0.3,0.4,0.6,0.7,1,1c0.4,0.3,0.8,0.5,1.2,0.7c0.4,0.2,0.9,0.3,1.4,0.3c0.5,0,1-0.1,1.4-0.2 c0.5-0.1,0.9-0.3,1.3-0.6c0.4-0.2,0.8-0.5,1.1-0.9c0.3-0.3,0.6-0.7,0.8-1.1C16.2,9.6,16.4,9.1,16.5,8.5z M19.9,18.3 c-0.2,0.5-0.5,0.9-0.8,1.3c-0.4,0.4-0.8,0.7-1.2,0.9c-0.5,0.2-1,0.3-1.5,0.3c-0.5,0-1-0.1-1.5-0.2c-0.5-0.1-0.9-0.3-1.3-0.6 c-0.4-0.2-0.8-0.5-1.1-0.8c-0.3-0.3-0.6-0.7-0.9-1.1c-0.2-0.4-0.4-0.8-0.5-1.3c-0.1-0.5-0.2-0.9-0.2-1.4c0-0.5,0.1-1,0.2-1.4 c0.1-0.5,0.3-0.9,0.6-1.3c0.2-0.4,0.5-0.8,0.9-1.1c0.3-0.3,0.7-0.6,1.1-0.8c0.4-0.2,0.8-0.4,1.3-0.5c0.4-0.1,0.9-0.2,1.4-0.2 c0.5,0,0.9,0.1,1.4,0.2c0.4,0.1,0.9,0.3,1.3,0.5c0.4,0.2,0.8,0.5,1.1,0.8c0.3,0.3,0.6,0.7,0.8,1.1c0.2,0.4,0.4,0.8,0.5,1.3 c0.1,0.5,0.2,0.9,0.2,1.4c0,0.5-0.1,1-0.2,1.4C20.3,17.5,20.1,17.9,19.9,18.3z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Télécharger sur</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
              </Button>

              <Button asChild variant="outline" className="bg-black hover:bg-gray-800 text-white border-0 h-14 px-6">
                <a href="#" className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M17.6,13.8l0-0.1c0-0.2,0.1-0.3,0.2-0.4l0,0c0.1-0.1,0.2-0.1,0.3-0.1c0,0,0.1,0,0.1,0l0,0c0.1,0,0.2,0,0.3,0.1l0,0 c0.1,0.1,0.1,0.2,0.1,0.3c0,0,0,0.1,0,0.1l0,0c0,0.1,0,0.2-0.1,0.3l0,0c-0.1,0.1-0.2,0.1-0.3,0.1c0,0-0.1,0-0.1,0l0,0 c-0.1,0-0.2,0-0.3-0.1l0,0C17.7,14,17.6,13.9,17.6,13.8z M8.3,12c0-0.7,0.2-1.3,0.5-1.8c0.3-0.5,0.8-0.9,1.4-1.1l0,0 c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0,0.6,0,0.9,0.1l0,0c0.6,0.2,1.1,0.6,1.4,1.1c0.3,0.5,0.5,1.1,0.5,1.8c0,0.7-0.2,1.3-0.5,1.8 c-0.3,0.5-0.8,0.9-1.4,1.1l0,0c-0.3,0.1-0.6,0.1-0.9,0.1c-0.3,0-0.6,0-0.9-0.1l0,0c-0.6-0.2-1.1-0.6-1.4-1.1 C8.5,13.3,8.3,12.7,8.3,12z M10.4,12c0,0.3,0.1,0.6,0.2,0.9c0.1,0.3,0.3,0.5,0.6,0.6l0,0c0.1,0.1,0.3,0.1,0.4,0.1 c0.1,0,0.3,0,0.4-0.1l0,0c0.2-0.1,0.4-0.3,0.6-0.6c0.1-0.3,0.2-0.6,0.2-0.9c0-0.3-0.1-0.6-0.2-0.9c-0.1-0.3-0.3-0.5-0.6-0.6l0,0 c-0.1-0.1-0.3-0.1-0.4-0.1c-0.1,0-0.3,0-0.4,0.1l0,0c-0.2,0.1-0.4,0.3-0.6,0.6C10.5,11.4,10.4,11.7,10.4,12z M13.8,12 c0-0.7,0.2-1.3,0.5-1.8c0.3-0.5,0.8-0.9,1.4-1.1l0,0c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0,0.6,0,0.9,0.1l0,0c0.6,0.2,1.1,0.6,1.4,1.1 c0.3,0.5,0.5,1.1,0.5,1.8c0,0.7-0.2,1.3-0.5,1.8c-0.3,0.5-0.8,0.9-1.4,1.1l0,0c-0.3,0.1-0.6,0.1-0.9,0.1c-0.3,0-0.6,0-0.9-0.1l0,0 c-0.6-0.2-1.1-0.6-1.4-1.1C14,13.3,13.8,12.7,13.8,12z M15.9,12c0,0.3,0.1,0.6,0.2,0.9c0.1,0.3,0.3,0.5,0.6,0.6l0,0 c0.1,0.1,0.3,0.1,0.4,0.1c0.1,0,0.3,0,0.4-0.1l0,0c0.2-0.1,0.4-0.3,0.6-0.6c0.1-0.3,0.2-0.6,0.2-0.9c0-0.3-0.1-0.6-0.2-0.9 c-0.1-0.3-0.3-0.5-0.6-0.6l0,0c-0.1-0.1-0.3-0.1-0.4-0.1c-0.1,0-0.3,0-0.4,0.1l0,0c-0.2,0.1-0.4,0.3-0.6,0.6 C16,11.4,15.9,11.7,15.9,12z M5.8,14.1L5.8,14.1c-0.1,0.1-0.2,0.1-0.3,0.1c0,0-0.1,0-0.1,0l0,0c-0.1,0-0.2,0-0.3-0.1l0,0 c-0.1-0.1-0.1-0.2-0.1-0.3c0,0,0-0.1,0-0.1l0,0c0-0.1,0-0.2,0.1-0.3l0,0c0.1-0.1,0.2-0.1,0.3-0.1c0,0,0.1,0,0.1,0l0,0 c0.1,0,0.2,0,0.3,0.1l0,0c0.1,0.1,0.1,0.2,0.1,0.3c0,0,0,0.1,0,0.1l0,0C5.9,13.9,5.9,14,5.8,14.1z M4.9,12c0-0.7,0.2-1.3,0.5-1.8 c0.3-0.5,0.8-0.9,1.4-1.1l0,0c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0,0.6,0,0.9,0.1l0,0c0.6,0.2,1.1,0.6,1.4,1.1c0.3,0.5,0.5,1.1,0.5,1.8 c0,0.7-0.2,1.3-0.5,1.8c-0.3,0.5-0.8,0.9-1.4,1.1l0,0c-0.3,0.1-0.6,0.1-0.9,0.1c-0.3,0-0.6,0-0.9-0.1l0,0c-0.6-0.2-1.1-0.6-1.4-1.1 C5.1,13.3,4.9,12.7,4.9,12z M7,12c0,0.3,0.1,0.6,0.2,0.9c0.1,0.3,0.3,0.5,0.6,0.6l0,0c0.1,0.1,0.3,0.1,0.4,0.1c0.1,0,0.3,0,0.4-0.1 l0,0c0.2-0.1,0.4-0.3,0.6-0.6C9.3,12.6,9.4,12.3,9.4,12c0-0.3-0.1-0.6-0.2-0.9c-0.1-0.3-0.3-0.5-0.6-0.6l0,0 c-0.1-0.1-0.3-0.1-0.4-0.1c-0.1,0-0.3,0-0.4,0.1l0,0c-0.2,0.1-0.4,0.3-0.6,0.6C7.1,11.4,7,11.7,7,12z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Disponible sur</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-1 text-yellow-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
              <span className="text-gray-700 dark:text-gray-300 ml-2 text-sm">4.9/5 (2,500+ avis)</span>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-50"></div>
            <div className="relative bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl p-4 shadow-xl">
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=300"
                  alt="Application Spectrum For Us"
                  width={300}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-black font-bold py-2 px-4 rounded-full shadow-lg">
              10% de réduction
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Fonctionnalités principales
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShoppingBag className="h-6 w-6 text-purple-600" />,
              title: "Shopping simplifié",
              description: "Parcourez des milliers de produits artisanaux et effectuez vos achats en quelques clics.",
            },
            {
              icon: <Users className="h-6 w-6 text-purple-600" />,
              title: "Communauté engagée",
              description: "Connectez-vous avec d'autres membres de la communauté queer et partagez vos découvertes.",
            },
            {
              icon: <Smartphone className="h-6 w-6 text-purple-600" />,
              title: "Expérience mobile optimisée",
              description: "Profitez d'une interface intuitive conçue pour une expérience d'achat fluide sur mobile.",
            },
          ].map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-fit mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Avantages exclusifs</h2>

          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "10% de réduction sur votre première commande",
                "Notifications pour les nouveaux produits et événements",
                "Accès prioritaire aux ventes exclusives",
                "Suivi de commande en temps réel",
                "Programme de fidélité avec récompenses",
                "Contenu exclusif sur la culture queer",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 mt-1">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              <Link href="/inscription">Créer un compte maintenant</Link>
            </Button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Téléchargez l'application et inscrivez-vous pour profiter de tous les avantages
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
