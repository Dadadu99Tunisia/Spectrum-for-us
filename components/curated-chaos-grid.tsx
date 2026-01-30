"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Play, ArrowUpRight } from "lucide-react"

interface GridItem {
  id: string
  type: "product" | "streaming" | "creator"
  title: string
  subtitle?: string
  image: string
  href: string
  price?: number
  isLive?: boolean
  viewerCount?: number
}

// Sample data - would come from API
const gridItems: GridItem[] = [
  {
    id: "1",
    type: "product",
    title: "Handcrafted Ceramic Vase",
    subtitle: "By Maya Chen",
    image: "/placeholder.svg?height=600&width=400",
    href: "/produit/1",
    price: 89,
  },
  {
    id: "2",
    type: "streaming",
    title: "Live Pottery Session",
    subtitle: "Creating with Clay",
    image: "/placeholder.svg?height=400&width=600",
    href: "/live-shopping/1",
    isLive: true,
    viewerCount: 234,
  },
  {
    id: "3",
    type: "creator",
    title: "Alex Rivera",
    subtitle: "Jewelry Designer",
    image: "/placeholder.svg?height=500&width=400",
    href: "/vendeur/1",
  },
  {
    id: "4",
    type: "product",
    title: "Silk Scarf - Prism Edition",
    subtitle: "Limited Collection",
    image: "/placeholder.svg?height=400&width=400",
    href: "/produit/2",
    price: 145,
  },
  {
    id: "5",
    type: "product",
    title: "Minimalist Ring Set",
    subtitle: "Sterling Silver",
    image: "/placeholder.svg?height=500&width=400",
    href: "/produit/3",
    price: 67,
  },
  {
    id: "6",
    type: "streaming",
    title: "Upcoming: Fashion Talk",
    subtitle: "Tomorrow 8PM",
    image: "/placeholder.svg?height=300&width=500",
    href: "/live-shopping/2",
    isLive: false,
  },
  {
    id: "7",
    type: "creator",
    title: "Sam Park",
    subtitle: "Visual Artist",
    image: "/placeholder.svg?height=400&width=400",
    href: "/vendeur/2",
  },
  {
    id: "8",
    type: "product",
    title: "Art Print - Refraction",
    subtitle: "Signed Edition",
    image: "/placeholder.svg?height=600&width=400",
    href: "/produit/4",
    price: 120,
  },
]

export default function CuratedChaosGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-background">
      {/* Section header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Curated Selection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            The Culture
          </h2>
        </div>
        <Link 
          href="/boutique"
          className="group flex items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          View All
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Masonry-style grid */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
      >
        {gridItems.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className={cn(
              "relative group",
              // Masonry-like varying heights
              index === 0 && "row-span-2",
              index === 1 && "col-span-2 md:col-span-1",
              index === 3 && "md:col-span-1",
              index === 7 && "row-span-2",
            )}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link href={item.href} className="block h-full">
              <div 
                className={cn(
                  "relative overflow-hidden bg-muted h-full min-h-[200px] md:min-h-[250px]",
                  "border border-border transition-all duration-300",
                  hoveredId === item.id && "border-foreground/20",
                  // Film grain for streaming cards
                  item.type === "streaming" && "film-grain",
                  // Neon hover effect
                  item.type === "product" && "neon-hover",
                  item.type === "streaming" && "neon-hover-uv",
                )}
              >
                {/* Image - takes 90% of space */}
                <div className="relative w-full h-full">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-700",
                      hoveredId === item.id && "scale-105",
                      item.type === "creator" && "grayscale hover:grayscale-0 transition-all duration-500",
                    )}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </div>

                {/* Live badge for streaming */}
                {item.type === "streaming" && item.isLive && (
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-red-500 text-white px-2 py-1 font-mono text-[10px] tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Live
                    </span>
                    <span className="bg-background/80 backdrop-blur-sm px-2 py-1 font-mono text-[10px] tracking-wider">
                      {item.viewerCount} watching
                    </span>
                  </div>
                )}

                {/* Play icon for streaming */}
                {item.type === "streaming" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={hoveredId === item.id ? { scale: 1.1 } : { scale: 1 }}
                      className="w-16 h-16 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center border border-white/20"
                    >
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </motion.div>
                  </div>
                )}

                {/* Content - minimal, at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                        {item.subtitle}
                      </p>
                      <h3 className="font-medium text-sm md:text-base truncate text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    
                    {/* Price for products */}
                    {item.type === "product" && item.price && (
                      <span className="font-mono text-sm text-foreground shrink-0">
                        {item.price}
                      </span>
                    )}
                    
                    {/* Arrow for creators */}
                    {item.type === "creator" && (
                      <ArrowUpRight 
                        className={cn(
                          "w-5 h-5 text-muted-foreground transition-all duration-300",
                          hoveredId === item.id && "text-foreground -translate-y-0.5 translate-x-0.5"
                        )} 
                      />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
