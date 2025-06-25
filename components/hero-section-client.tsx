"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export function HeroSectionClient() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center"
    >
      <motion.div variants={fadeIn} className="mb-8">
        <Image src="/images/logo.png" alt="Spectrum Logo" width={800} height={240} className="h-40 w-auto" priority />
      </motion.div>
      <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
        Marketplace Queer & Inclusive
      </motion.h1>
      <motion.p variants={fadeIn} className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8">
        Découvrez des produits uniques créés par des artistes et entrepreneur·e·s de la communauté queer.
      </motion.p>

      <motion.div variants={fadeIn} className="w-full max-w-2xl mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/60" />
        </div>
        <input
          type="text"
          placeholder="Rechercher des produits, boutiques ou catégories..."
          className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </motion.div>

      <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 transition-transform hover:scale-105">
          Explorer les Produits
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white text-white hover:bg-white/10 transition-transform hover:scale-105"
        >
          Devenir Vendeur·euse
        </Button>
      </motion.div>
    </motion.div>
  )
}
