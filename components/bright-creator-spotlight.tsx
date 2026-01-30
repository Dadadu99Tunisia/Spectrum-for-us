"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const creators = [
  {
    id: "1",
    name: "Luna Chen",
    specialty: "Handmade Jewelry",
    rating: 4.9,
    products: 67,
    image: "/placeholder.svg",
    featured: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Marcus Williams",
    specialty: "Ceramic Artist",
    rating: 5.0,
    products: 34,
    image: "/placeholder.svg",
    featured: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Aria Santos",
    specialty: "Digital Art & Prints",
    rating: 4.8,
    products: 89,
    image: "/placeholder.svg",
    featured: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Jordan Kim",
    specialty: "Sustainable Fashion",
    rating: 4.9,
    products: 45,
    image: "/placeholder.svg",
    featured: "/placeholder.svg",
  },
]

export default function BrightCreatorSpotlight() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            Meet Our Creators
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Talented artisans and designers from our community, creating unique products with love and intention
          </p>
        </div>

        {/* Creators grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/vendeur/${creator.id}`} className="block group">
                <div className="bg-background rounded-2xl overflow-hidden soft-shadow hover-lift">
                  {/* Featured product image */}
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={creator.featured || "/placeholder.svg"}
                      alt={`Featured work by ${creator.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Creator info */}
                  <div className="p-5 -mt-8 relative">
                    {/* Avatar with ring */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-background mb-3 avatar-ring">
                      <Image
                        src={creator.image || "/placeholder.svg"}
                        alt={creator.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <h3 className="font-semibold text-foreground text-lg">
                      {creator.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {creator.specialty}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-foreground">{creator.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {creator.products} products
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-transparent">
            <Link href="/vendeurs">
              View All Creators
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
