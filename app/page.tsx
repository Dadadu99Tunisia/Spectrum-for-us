"use client"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
import Categories from "@/components/categories"
import FeaturedSellers from "@/components/featured-sellers"
import KeyStats from "@/components/key-stats"
import BrandValues from "@/components/brand-values"
import Testimonials from "@/components/testimonials"
import EcoBanner from "@/components/eco-banner"
import FeaturedEvents from "@/components/featured-events"
import PartnersShowcase from "@/components/partners-showcase"
import ServicesShowcase from "@/components/services-showcase"
import { motion } from "framer-motion"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import CommunityHighlights from "@/components/community-highlights"
import HowItWorks from "@/components/how-it-works"
import { ErrorBoundary } from "@/components/error-boundary"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

// Composants de loading
function HeroSkeleton() {
  return <Skeleton className="h-[600px] w-full" />
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />

        <div className="container mx-auto px-4 py-16 space-y-16">
          <FeaturedProducts />
          <Categories />
          <FeaturedSellers />
        </div>
      </main>

      {/* Main Content */}
      <div className="container mx-auto px-4 space-y-16 py-16">
        {/* How It Works */}
        <ErrorBoundary fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorks />
          </Suspense>
        </ErrorBoundary>

        {/* Community Highlights */}
        <ErrorBoundary fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <CommunityHighlights />
          </Suspense>
        </ErrorBoundary>

        {/* Testimonials */}
        <ErrorBoundary fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <Testimonials />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Key Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12 bg-white dark:bg-background"
      >
        <div className="container mx-auto px-4">
          <KeyStats />
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white dark:bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 text-sm font-medium mb-4">
              Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Services Proposés par nos Créateur·rice·s
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Découvrez la diversité des services offerts par notre communauté de professionnel·le·s talentueux·ses.
            </p>
          </motion.div>

          <ServicesShowcase />
        </div>
      </motion.section>

      {/* Brand Values */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white dark:bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium mb-4">
              Nos Valeurs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce Qui Nous Définit</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Spectrum est bien plus qu'une marketplace - c'est un engagement envers notre communauté.
            </p>
          </motion.div>

          <BrandValues />
        </div>
      </motion.section>

      {/* Featured Events */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white dark:bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium mb-4">
              Événements à la Une
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Événements Incontournables
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Ne manquez pas ces événements majeurs organisés par et pour notre communauté.
            </p>
          </motion.div>

          <FeaturedEvents />
        </div>
      </motion.section>

      {/* Partenaires */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gradient-to-b from-white to-indigo-50 dark:from-background dark:to-indigo-950/10"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
              Nos Partenaires
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ils Soutiennent Spectrum</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Découvrez les organisations et entreprises qui partagent nos valeurs et soutiennent notre mission.
            </p>
          </motion.div>

          <PartnersShowcase />
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Rejoignez Notre Marketplace
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl max-w-2xl mx-auto mb-8"
          >
            Vous êtes un·e artiste ou entrepreneur·e queer ? Vendez vos créations sur notre plateforme et rejoignez une
            communauté dynamique.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90 transition-transform hover:scale-105"
            >
              Devenir Vendeur·euse
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 transition-transform hover:scale-105 bg-transparent"
            >
              En Savoir Plus
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Eco Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <EcoBanner />
      </motion.div>
    </div>
  )
}
