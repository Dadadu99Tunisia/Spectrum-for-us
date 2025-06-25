import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import FeaturedProducts from "@/components/featured-products"
import FeaturedSellers from "@/components/featured-sellers"
import FeaturedCategories from "@/components/featured-categories"
import KeyStats from "@/components/key-stats"
import BrandValues from "@/components/brand-values"
import Testimonials from "@/components/testimonials"
import EcoBanner from "@/components/eco-banner"
import FeaturedEvents from "@/components/featured-events"
import PartnersShowcase from "@/components/partners-showcase"
import ServicesShowcase from "@/components/services-showcase"
import { SectionHeader } from "@/components/section-header"
import { HeroSectionClient } from "@/components/hero-section-client"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] mix-blend-overlay opacity-20"></div>
        <HeroSectionClient />
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
          <SectionHeader
            badge="Catégories Populaires"
            title="Explorez Nos Univers"
            description="Découvrez nos catégories les plus populaires et trouvez des produits qui correspondent à votre style."
          />
          <FeaturedCategories />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Services"
            title="Services Proposés par nos Créateur·rice·s"
            description="Découvrez la diversité des services offerts par notre communauté de professionnel·le·s talentueux·ses."
            badgeClass="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300"
            titleClass="bg-gradient-to-r from-teal-600 to-blue-600"
          />
          <ServicesShowcase />
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Nos Valeurs"
            title="Ce Qui Nous Définit"
            description="Spectrum est bien plus qu'une marketplace - c'est un engagement envers notre communauté."
            badgeClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"
          />
          <BrandValues />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-white to-pink-50 dark:from-background dark:to-pink-950/10">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Produits Tendance"
            title="Nos Coups de Cœur"
            description="Découvrez notre sélection de produits uniques créés par des artistes et entrepreneur·e·s de la communauté."
            badgeClass="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300"
            titleClass="bg-gradient-to-r from-pink-600 to-purple-600"
          />
          <FeaturedProducts />
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="group transition-transform hover:scale-105">
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
          <SectionHeader
            badge="Témoignages"
            title="Ce Que Dit Notre Communauté"
            description="Découvrez les expériences de nos vendeur·euse·s et client·e·s sur Spectrum."
            badgeClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
          />
          <Testimonials />
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Événements à la Une"
            title="Événements Incontournables"
            description="Ne manquez pas ces événements majeurs organisés par et pour notre communauté."
            badgeClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"
            titleClass="bg-gradient-to-r from-purple-600 to-pink-600"
          />
          <FeaturedEvents />
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50 dark:from-background dark:to-indigo-950/10">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Nos Partenaires"
            title="Ils Soutiennent Spectrum"
            description="Découvrez les organisations et entreprises qui partagent nos valeurs et soutiennent notre mission."
          />
          <PartnersShowcase />
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-purple-950/10">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="Vendeur·euse·s"
            title="Vendeur·euse·s à Découvrir"
            description="Rencontrez les créateur·rice·s et entrepreneur·e·s qui font vivre notre marketplace."
            badgeClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300"
            titleClass="bg-gradient-to-r from-green-600 to-teal-600"
          />
          <FeaturedSellers />
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="group transition-transform hover:scale-105">
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
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90 transition-transform hover:scale-105"
            >
              Devenir Vendeur·euse
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 transition-transform hover:scale-105"
            >
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
