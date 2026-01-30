"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function BrightHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30 pointer-events-none">
        <div className="w-full h-full rounded-full blur-3xl sunrise-gradient-soft" />
      </div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-20 pointer-events-none">
        <div className="w-full h-full rounded-full blur-3xl bg-sunrise-blue" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] text-balance">
              Where Our{" "}
              <span className="sunrise-text">Culture</span>{" "}
              Thrives.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The bright marketplace for LGBTQIA+ creators and products. Discover unique items made with love, by us, for us.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-base pill-btn-gradient"
              >
                <Link href="/boutique">
                  Explore the Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-base border-2 bg-transparent"
              >
                <Link href="/devenir-vendeur">
                  Become a Creator
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">2,500+</span>
                <span>Creators</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">15K+</span>
                <span>Products</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">100%</span>
                <span>Community</span>
              </div>
            </div>
          </motion.div>

          {/* Image grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden soft-shadow-lg">
                <Image
                  src="/placeholder.svg"
                  alt="Diverse creators at a bright studio"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Smaller images */}
              <div className="relative aspect-square rounded-xl overflow-hidden soft-shadow hover-lift">
                <Image
                  src="/placeholder.svg"
                  alt="Handcrafted jewelry"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden soft-shadow hover-lift">
                <Image
                  src="/placeholder.svg"
                  alt="Artisan ceramics"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-background rounded-full px-5 py-3 soft-shadow-lg flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-secondary border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                Join 50K+ members
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
