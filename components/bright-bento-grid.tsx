"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const featuredItems = [
  {
    id: "1",
    type: "product",
    title: "Handcrafted Rainbow Earrings",
    price: 45,
    image: "/placeholder.svg",
    creator: "Luna Artistry",
    category: "Jewelry",
  },
  {
    id: "2",
    type: "product",
    title: "Pride Ceramic Vase",
    price: 89,
    image: "/placeholder.svg",
    creator: "Clay & Soul",
    category: "Home Decor",
  },
  {
    id: "3",
    type: "streaming",
    title: "Live: Creating Pride Jewelry",
    creator: "Alex Chen",
    viewers: 234,
    image: "/placeholder.svg",
  },
  {
    id: "4",
    type: "product",
    title: "Inclusive Art Print",
    price: 35,
    image: "/placeholder.svg",
    creator: "Spectrum Studios",
    category: "Art",
  },
  {
    id: "5",
    type: "product",
    title: "Queer Joy Candle Set",
    price: 52,
    image: "/placeholder.svg",
    creator: "Glow & Co",
    category: "Home",
  },
  {
    id: "6",
    type: "creator",
    name: "Maya Rodriguez",
    specialty: "Jewelry Designer",
    products: 48,
    image: "/placeholder.svg",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function BrightBentoGrid() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              Curated For You
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover unique products from our community of creators
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex items-center gap-2">
            <Link href="/boutique">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {/* Large featured product */}
          <motion.div variants={item} className="col-span-2 row-span-2">
            <Link href={`/produit/${featuredItems[0].id}`} className="block group">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary card-elevated">
                <Image
                  src={featuredItems[0].image || "/placeholder.svg"}
                  alt={featuredItems[0].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Favorite button */}
                <button
                  type="button"
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-foreground hover:bg-white transition-colors"
                >
                  <Heart className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge className="mb-2 bg-white/20 text-white border-0">
                    {featuredItems[0].category}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-1">{featuredItems[0].title}</h3>
                  <p className="text-white/80 text-sm mb-2">by {featuredItems[0].creator}</p>
                  <p className="text-xl font-bold">${featuredItems[0].price}</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Streaming card */}
          <motion.div variants={item} className="col-span-2 md:col-span-1">
            <Link href="/slay-plus" className="block group">
              <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden bg-secondary card-elevated">
                <Image
                  src={featuredItems[2].image || "/placeholder.svg"}
                  alt={featuredItems[2].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                
                {/* Live badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                  <span className="px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                    {featuredItems[2].viewers} watching
                  </span>
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-foreground ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-medium text-sm mb-1">{featuredItems[2].title}</h3>
                  <p className="text-white/80 text-xs">{featuredItems[2].creator}</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Regular product cards */}
          {featuredItems.slice(1, 2).concat(featuredItems.slice(3, 5)).map((product) => (
            <motion.div key={product.id} variants={item}>
              <Link href={`/produit/${product.id}`} className="block group">
                <div className="card-elevated rounded-xl overflow-hidden">
                  <div className="relative aspect-square bg-secondary">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-foreground hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-foreground/80 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.creator}
                    </p>
                    <p className="font-semibold text-foreground mt-2">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Creator spotlight card */}
          <motion.div variants={item}>
            <Link href={`/vendeur/${featuredItems[5].id}`} className="block group">
              <div className="card-elevated rounded-xl overflow-hidden p-4 h-full flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 avatar-ring">
                  <Image
                    src={featuredItems[5].image || "/placeholder.svg"}
                    alt={featuredItems[5].name || "Creator"}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-foreground">{featuredItems[5].name}</h3>
                <p className="text-sm text-muted-foreground">{featuredItems[5].specialty}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {featuredItems[5].products} products
                </p>
                <Button variant="outline" size="sm" className="mt-4 rounded-full bg-transparent">
                  View Shop
                </Button>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile view all button */}
        <div className="mt-8 sm:hidden">
          <Button asChild className="w-full rounded-full">
            <Link href="/boutique">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
