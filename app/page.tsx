"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import EditorialHero from "@/components/editorial-hero"
import CuratedChaosGrid from "@/components/curated-chaos-grid"
import CommunityManifesto from "@/components/community-manifesto"
import CreatorSpotlight from "@/components/creator-spotlight"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

// Loading skeletons
function HeroSkeleton() {
  return <div className="min-h-screen bg-background" />
}

function SectionSkeleton() {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-24">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  )
}

// Featured categories with brutalist style
const categories = [
  { name: "Art", count: 234, href: "/categorie/art" },
  { name: "Jewelry", count: 189, href: "/categorie/jewelry" },
  { name: "Fashion", count: 312, href: "/categorie/clothing" },
  { name: "Home", count: 156, href: "/categorie/home" },
  { name: "Beauty", count: 98, href: "/categorie/beauty" },
  { name: "Books", count: 67, href: "/categorie/books" },
]

function FeaturedCategories() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-background border-t border-border">
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Browse
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Categories
          </h2>
        </div>
        <Link 
          href="/categories"
          className="group flex items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          View All
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link 
              href={category.href}
              className="group block bg-background p-6 md:p-8 transition-colors hover:bg-muted/50"
            >
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground block mb-2">
                {category.count} items
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight group-hover:text-foreground/70 transition-colors">
                {category.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// CTA Section with brutalist style
function CTASection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-muted/30 border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-6">
            Join the Community
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Ready to Create?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Share your art, connect with your community, and build something meaningful. 
            No barriers. No gatekeepers. Just authentic expression.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/devenir-vendeur">
              <Button 
                variant="outline" 
                className="h-14 px-10 font-mono text-xs tracking-[0.15em] uppercase border-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-none bg-transparent"
              >
                Become a Creator
              </Button>
            </Link>
            <Link href="/boutique">
              <Button 
                variant="ghost" 
                className="h-14 px-10 font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-all duration-300 rounded-none"
              >
                Explore Products
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Editorial Hero */}
      <ErrorBoundary fallback={<HeroSkeleton />}>
        <Suspense fallback={<HeroSkeleton />}>
          <EditorialHero />
        </Suspense>
      </ErrorBoundary>

      {/* Curated Chaos Grid - Products, Streaming, Creators */}
      <ErrorBoundary fallback={<SectionSkeleton />}>
        <Suspense fallback={<SectionSkeleton />}>
          <CuratedChaosGrid />
        </Suspense>
      </ErrorBoundary>

      {/* Community Manifesto */}
      <ErrorBoundary fallback={<div className="py-48 bg-foreground" />}>
        <Suspense fallback={<div className="py-48 bg-foreground" />}>
          <CommunityManifesto />
        </Suspense>
      </ErrorBoundary>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Creator Spotlight */}
      <ErrorBoundary fallback={<SectionSkeleton />}>
        <Suspense fallback={<SectionSkeleton />}>
          <CreatorSpotlight />
        </Suspense>
      </ErrorBoundary>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
