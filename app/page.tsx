import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"
import FeaturedProducts from "@/components/featured-products"
import FeaturedSellers from "@/components/featured-sellers"
import FeaturedCategories from "@/components/featured-categories"
import Image from "next/image"
import KeyStats from "@/components/key-stats"
import BrandValues from "@/components/brand-values"
import Testimonials from "@/components/testimonials"
import EcoBanner from "@/components/eco-banner"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] mix-blend-overlay opacity-20"></div>

        <div className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="mb-8">
            <Image
              src="/images/logo.png"
              alt="Spectrum Logo"
              width={800}
              height={240}
              className="h-40 w-auto"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
            Marketplace Queer & Inclusive
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8">
            Découvrez des produits uniques créés par des artistes et entrepreneur·e·s de la communauté queer.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/60" />
            </div>
            <input
              type="text"
              placeholder="Rechercher des produits, boutiques ou catégories..."
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
              Explorer les Produits
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Devenir Vendeur·euse
            </Button>
          </div>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-12 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <KeyStats />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-purple-950/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
              Catégories Populaires
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Explorez Nos Univers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Découvrez nos catégories les plus populaires et trouvez des produits qui correspondent à votre style.
            </p>
          </div>

          <FeaturedCategories />
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium mb-4">
              Nos Valeurs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce Qui Nous Définit</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Spectrum est bien plus qu'une marketplace - c'est un engagement envers notre communauté.
            </p>
          </div>

          <BrandValues />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-white to-pink-50 dark:from-background dark:to-pink-950/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 text-sm font-medium mb-4">
              Produits Tendance
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Nos Coups de Cœur
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Découvrez notre sélection de produits uniques créés par des artistes et entrepreneur·e·s de la communauté.
            </p>
          </div>

          <FeaturedProducts />

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/boutique">
                Voir Tous les Produits
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-4">
              Témoignages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce Que Dit Notre Communauté</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Découvrez les expériences de nos vendeur·euse·s et client·e·s sur Spectrum.
            </p>
          </div>

          <Testimonials />
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-purple-950/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm font-medium mb-4">
              Vendeur·euse·s
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Vendeur·euse·s à Découvrir
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Rencontrez les créateur·rice·s et entrepreneur·e·s qui font vivre notre marketplace.
            </p>
          </div>

          <FeaturedSellers />

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/vendeurs">
                Tou·te·s les Vendeur·euse·s
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Rejoignez Notre Marketplace</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Vous êtes un·e artiste ou entrepreneur·e queer ? Vendez vos créations sur notre plateforme et rejoignez une
            communauté dynamique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
              Devenir Vendeur·euse
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              En Savoir Plus
            </Button>
          </div>
        </div>
      </section>

      {/* Eco Banner */}
      <EcoBanner />
    </main>
  )
}
