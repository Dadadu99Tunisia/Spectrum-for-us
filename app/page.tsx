"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Star, Users, ShoppingBag, Heart, Truck, Shield } from "lucide-react"
import FeaturedProducts from "@/components/featured-products"
import FeaturedSellers from "@/components/featured-sellers"
import FeaturedCategories from "@/components/featured-categories"
import Image from "next/image"
import KeyStats from "@/components/key-stats"
import BrandValues from "@/components/brand-values"
import Testimonials from "@/components/testimonials"
import EcoBanner from "@/components/eco-banner"
import FeaturedEvents from "@/components/featured-events"
import PartnersShowcase from "@/components/partners-showcase"
import ServicesShowcase from "@/components/services-showcase"
import { motion } from "framer-motion"

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

export default function Home() {
  return (
    <>
      {/* Schema.org pour la page d'accueil */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Spectrum Marketplace",
            alternateName: "Spectrum For Us",
            url: "https://spectrum-marketplace.vercel.app/",
            logo: "https://spectrum-marketplace.vercel.app/images/logo.png",
            description:
              "La marketplace #1 pour la communauté LGBTQ+ en France. Découvrez des produits uniques créés par des artistes et entrepreneurs queer talentueux.",
            foundingDate: "2024",
            founders: [
              {
                "@type": "Person",
                name: "CEO Spectrum",
              },
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+33-1-23-45-67-89",
              contactType: "customer service",
              availableLanguage: ["French", "English"],
            },
            sameAs: [
              "https://www.facebook.com/profile.php?id=61565067524779",
              "https://www.instagram.com/spectrum.forus/",
              "https://www.tiktok.com/@spectrumforus",
              "https://www.pinterest.com/spectrumforus",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "2547",
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />

      <main className="min-h-screen">
        {/* Hero Section avec contenu SEO optimisé */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] mix-blend-overlay opacity-20"></div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center"
          >
            <motion.div variants={fadeIn} className="mb-8">
              <Image
                src="/images/logo.png"
                alt="Spectrum Marketplace - La plateforme #1 pour la communauté LGBTQ+ en France"
                width={800}
                height={240}
                className="h-40 w-auto"
                priority
              />
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
              🏳️‍🌈 Marketplace Queer & Inclusive #1 en France
            </motion.h1>

            <motion.h2 variants={fadeIn} className="text-xl md:text-2xl text-white/90 max-w-4xl mb-4">
              Découvrez des produits uniques créés par des artistes et entrepreneur·e·s LGBTQ+ talentueux·ses
            </motion.h2>

            <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4 mb-8 text-white/90">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">50,000+ membres</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-semibold">10,000+ produits</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400" />
                <span className="font-semibold">4.8/5 (2,547 avis)</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <span className="font-semibold">Livraison gratuite dès 50€</span>
              </div>
            </motion.div>

            {/* Barre de recherche SEO optimisée */}
            <motion.div variants={fadeIn} className="w-full max-w-2xl mb-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/60" />
              </div>
              <input
                type="text"
                placeholder="Rechercher mode queer, bijoux inclusifs, art LGBTQ+..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Rechercher des produits queer et inclusifs"
              />
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/boutique">🛍️ Explorer 10,000+ Produits Queer</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/devenir-vendeur">💼 Devenir Vendeur·euse (Gratuit)</Link>
              </Button>
            </motion.div>

            {/* Badges de confiance */}
            <motion.div variants={fadeIn} className="mt-8 flex flex-wrap justify-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Communauté bienveillante</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Qualité garantie</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section des avantages avec mots-clés SEO */}
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
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir Spectrum Marketplace ?</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                La première marketplace française dédiée à la communauté LGBTQ+. Mode inclusive, art queer, bijoux
                non-binaires et bien plus encore !
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Communauté Inclusive</h3>
                <p className="text-muted-foreground">
                  Rejoignez 50,000+ membres de la communauté LGBTQ+ qui partagent vos valeurs d'inclusion et de
                  diversité.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Produits Uniques</h3>
                <p className="text-muted-foreground">
                  Plus de 10,000 produits créés par des artistes queer : mode inclusive, bijoux, art, décoration et
                  plus.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Impact Positif</h3>
                <p className="text-muted-foreground">
                  Chaque achat soutient directement des créateurs LGBTQ+ et contribue à une économie plus inclusive.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

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

        {/* Featured Categories avec mots-clés SEO */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-purple-950/10"
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
                Catégories Populaires
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Mode Queer, Art LGBTQ+, Bijoux Inclusifs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Découvrez nos catégories les plus populaires : vêtements non-binaires, accessoires pride, art queer,
                bijoux inclusifs, décoration rainbow et bien plus encore !
              </p>
            </motion.div>

            <FeaturedCategories />
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
                Services Professionnels
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Services par des Professionnel·le·s LGBTQ+
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Découvrez la diversité des services offerts par notre communauté : design graphique, photographie,
                développement web, coaching, traduction et bien plus !
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Inclusion, Diversité, Authenticité</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Spectrum est bien plus qu'une marketplace - c'est un engagement envers l'inclusion, la diversité et
                l'authenticité de la communauté LGBTQ+.
              </p>
            </motion.div>

            <BrandValues />
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-gradient-to-b from-white to-pink-50 dark:from-background dark:to-pink-950/10"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center mb-12"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 text-sm font-medium mb-4">
                Produits Tendance
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Nos Coups de Cœur Queer
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Découvrez notre sélection de produits uniques créés par des artistes et entrepreneur·e·s LGBTQ+
                talentueux·ses : mode inclusive, bijoux pride, art queer et plus encore !
              </p>
            </motion.div>

            <FeaturedProducts />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <Button asChild variant="outline" size="lg" className="group transition-transform hover:scale-105">
                <Link href="/boutique">
                  🛍️ Voir Tous les Produits Queer
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials */}
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
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-4">
                Témoignages
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">2,547 Avis Clients ⭐⭐⭐⭐⭐</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Découvrez les expériences authentiques de nos vendeur·euse·s et client·e·s de la communauté LGBTQ+ sur
                Spectrum Marketplace.
              </p>
            </motion.div>

            <Testimonials />
          </div>
        </motion.section>

        {/* Événements Mis en Avant */}
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
                Événements Pride
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Événements LGBTQ+ Incontournables
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Ne manquez pas ces événements majeurs organisés par et pour notre communauté : Pride, marchés créateurs,
                expositions d'art queer et bien plus !
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ils Soutiennent l'Inclusion LGBTQ+</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Découvrez les organisations et entreprises qui partagent nos valeurs d'inclusion et soutiennent
                activement la communauté LGBTQ+ en France.
              </p>
            </motion.div>

            <PartnersShowcase />
          </div>
        </motion.section>

        {/* Featured Sellers */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-purple-950/10"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center mb-12"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm font-medium mb-4">
                Créateur·rice·s LGBTQ+
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Artistes & Entrepreneur·e·s Queer
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Rencontrez les créateur·rice·s et entrepreneur·e·s LGBTQ+ talentueux·ses qui font vivre notre
                marketplace inclusive avec leurs créations uniques.
              </p>
            </motion.div>

            <FeaturedSellers />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <Button asChild variant="outline" size="lg" className="group transition-transform hover:scale-105">
                <Link href="/vendeurs">
                  👥 Découvrir Tou·te·s les Créateur·rice·s
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
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
              🏳️‍🌈 Rejoignez la Marketplace LGBTQ+ #1 en France
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl max-w-3xl mx-auto mb-8"
            >
              Vous êtes un·e artiste ou entrepreneur·e LGBTQ+ ? Vendez vos créations sur notre plateforme et rejoignez
              une communauté de 50,000+ membres qui partagent vos valeurs !
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
                asChild
              >
                <Link href="/devenir-vendeur">💼 Devenir Vendeur·euse (Gratuit)</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/a-propos">ℹ️ En Savoir Plus sur Spectrum</Link>
              </Button>
            </motion.div>

            {/* FAQ rapide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <h3 className="text-lg font-semibold mb-4">Questions fréquentes :</h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90">
                <span>✅ Inscription gratuite</span>
                <span>✅ Commission équitable</span>
                <span>✅ Support communautaire</span>
                <span>✅ Paiements sécurisés</span>
              </div>
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
      </main>
    </>
  )
}
