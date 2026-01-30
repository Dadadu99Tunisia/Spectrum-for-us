"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Creator {
  id: string
  name: string
  specialty: string
  location: string
  image: string
  frameNumber: string
}

const creators: Creator[] = [
  {
    id: "1",
    name: "Maya Chen",
    specialty: "Ceramics & Pottery",
    location: "Brooklyn, NY",
    image: "/placeholder.svg?height=400&width=400",
    frameNumber: "001",
  },
  {
    id: "2",
    name: "Alex Rivera",
    specialty: "Jewelry Design",
    location: "Los Angeles, CA",
    image: "/placeholder.svg?height=400&width=400",
    frameNumber: "002",
  },
  {
    id: "3",
    name: "Sam Park",
    specialty: "Visual Art",
    location: "Seattle, WA",
    image: "/placeholder.svg?height=400&width=400",
    frameNumber: "003",
  },
  {
    id: "4",
    name: "Jordan Blake",
    specialty: "Fashion Design",
    location: "Miami, FL",
    image: "/placeholder.svg?height=400&width=400",
    frameNumber: "004",
  },
  {
    id: "5",
    name: "Taylor Kim",
    specialty: "Illustration",
    location: "Austin, TX",
    image: "/placeholder.svg?height=400&width=400",
    frameNumber: "005",
  },
  {
    id: "6",
    name: "Casey Morgan",
    specialty: "Textile Art",
    location: "Portland, OR",
    image: "/placeholder.svg?height=400&width=400",
    frameNumber: "006",
  },
]

export default function CreatorSpotlight() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [filterBW, setFilterBW] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-background">
      {/* Section header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            The Real People
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Creator Spotlight
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* B&W toggle */}
          <button
            onClick={() => setFilterBW(!filterBW)}
            className={cn(
              "font-mono text-xs tracking-[0.15em] uppercase transition-colors",
              filterBW ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {filterBW ? "B&W" : "Color"}
          </button>
          
          <Link 
            href="/vendeurs"
            className="group flex items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            All Creators
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Film contact sheet style grid */}
      <div className="relative">
        {/* Film sprocket holes - left */}
        <div className="absolute left-0 top-0 bottom-0 w-4 hidden lg:flex flex-col justify-around py-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-muted rounded-sm" />
          ))}
        </div>
        
        {/* Film sprocket holes - right */}
        <div className="absolute right-0 top-0 bottom-0 w-4 hidden lg:flex flex-col justify-around py-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-muted rounded-sm" />
          ))}
        </div>

        {/* Contact sheet grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border p-px lg:mx-8"
        >
          {creators.map((creator) => (
            <motion.div
              key={creator.id}
              variants={itemVariants}
              className="relative bg-background"
              onMouseEnter={() => setHoveredId(creator.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={`/vendeur/${creator.id}`} className="block">
                <div className="aspect-square relative overflow-hidden">
                  {/* Frame number - film style */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="font-mono text-[10px] tracking-wider text-foreground/70 bg-background/80 px-1">
                      {creator.frameNumber}
                    </span>
                  </div>

                  {/* Image */}
                  <Image
                    src={creator.image || "/placeholder.svg"}
                    alt={creator.name}
                    fill
                    className={cn(
                      "object-cover transition-all duration-500",
                      filterBW && hoveredId !== creator.id && "grayscale",
                      hoveredId === creator.id && "scale-105 grayscale-0",
                    )}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  />

                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === creator.id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
                  />

                  {/* Info overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredId === creator.id ? 1 : 0,
                      y: hoveredId === creator.id ? 0 : 10,
                    }}
                    className="absolute bottom-0 left-0 right-0 p-3"
                  >
                    <h3 className="font-medium text-sm text-foreground mb-0.5">
                      {creator.name}
                    </h3>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
                      {creator.specialty}
                    </p>
                    <p className="font-mono text-[10px] tracking-wider text-muted-foreground/60 mt-1">
                      {creator.location}
                    </p>
                  </motion.div>
                </div>

                {/* Film frame border effect */}
                <div 
                  className={cn(
                    "absolute inset-0 border transition-colors duration-300 pointer-events-none",
                    hoveredId === creator.id ? "border-neon-green/50" : "border-transparent"
                  )}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Film strip info */}
        <div className="mt-4 flex items-center justify-between lg:mx-8">
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
            SPECTRUM FOR US — CREATOR SERIES 001
          </span>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
            KODAK PORTRA 400
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link href="/devenir-vendeur">
          <Button 
            variant="outline" 
            className="h-12 px-8 font-mono text-xs tracking-[0.15em] uppercase border-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-none bg-transparent"
          >
            Become a Creator
          </Button>
        </Link>
      </div>
    </section>
  )
}
