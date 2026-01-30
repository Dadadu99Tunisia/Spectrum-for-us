"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import BrightHero from "@/components/bright-hero"
import BrightBentoGrid from "@/components/bright-bento-grid"
import BrightCreatorSpotlight from "@/components/bright-creator-spotlight"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Heart, Users } from "lucide-react"

// Loading skeletons
function HeroSkeleton() {
  return <div className="min-h-[90vh] bg-background" />
}

function SectionSkeleton() {
  return (
    <div className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  )
}

// Featured categories - clean card style
const categories = [
  { name: "Art & Prints", count: 234, href: "/categorie/art", color: "bg-sunrise-pink/10" },
  { name: "Jewelry", count: 189, href: "/categorie/jewelry", color: "bg-sunrise-orange/10" },
  { name: "Fashion", count: 312, href: "/categorie/clothing", color: "bg-sunrise-yellow/10" },
  { name: "Home Decor", count: 156, href: "/categorie/home", color: "bg-sunrise-blue/10" },
  { name: "Beauty", count: 98, href: "/categorie/beauty", color: "bg-sunrise-lavender/10" },
  { name: "Books & Zines", count: 67, href: "/categorie/books", color: "bg-sunrise-pink/10" },
]

function FeaturedCategories() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            Shop by Category
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find exactly what you are looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={category.href}
                className="group block p-6 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors text-center"
              >
                <h3 className="font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.count} items
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Value proposition section
function ValueProps() {
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "Every purchase directly supports LGBTQIA+ creators and their craft.",
    },
    {
      icon: Sparkles,
      title: "Unique & Handmade",
      description: "Discover one-of-a-kind products you won't find anywhere else.",
    },
    {
      icon: Users,
      title: "Safe Space",
      description: "A welcoming marketplace built by our community, for our community.",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-background soft-shadow mb-4">
                <value.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section - bright and welcoming
function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl sunrise-gradient-soft" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Ready to Share Your{" "}
            <span className="sunrise-text">Creativity?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are building their dreams on Spectrum. 
            No fees to start, just authentic community connection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-base pill-btn-gradient"
            >
              <Link href="/devenir-vendeur">
                Become a Creator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base border-2 bg-transparent"
            >
              <Link href="/a-propos">
                Learn More About Us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Bright Hero */}
      <ErrorBoundary fallback={<HeroSkeleton />}>
        <Suspense fallback={<HeroSkeleton />}>
          <BrightHero />
        </Suspense>
      </ErrorBoundary>

      {/* Value Props */}
      <ValueProps />

      {/* Curated Products Bento Grid */}
      <ErrorBoundary fallback={<SectionSkeleton />}>
        <Suspense fallback={<SectionSkeleton />}>
          <BrightBentoGrid />
        </Suspense>
      </ErrorBoundary>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Creator Spotlight */}
      <ErrorBoundary fallback={<SectionSkeleton />}>
        <Suspense fallback={<SectionSkeleton />}>
          <BrightCreatorSpotlight />
        </Suspense>
      </ErrorBoundary>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
