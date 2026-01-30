"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Image from "next/image"
import { isBrowser } from "@/utils/client-utils"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
// Importez le hook de détection mobile
import { useMobileDetection } from "@/hooks/use-mobile-detection"

export default function ModernHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dans la fonction ModernHero, ajoutez cette ligne après les autres hooks
  const { isMobile } = useMobileDetection()

  // Éviter tout rendu qui dépend de window côté serveur
  if (!mounted && !isBrowser) {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
            Marketplace Queer & Inclusive
          </h1>
        </div>
      </section>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const decorativeCircleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.3,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] mix-blend-overlay opacity-20"></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Image src="/images/logo.png" alt="Spectrum Logo" width={800} height={240} className="h-40 w-auto" priority />
        </motion.div>
        {/* Modifiez le titre et le texte pour être plus adaptés au mobile */}
        {/* Remplacez le h1 et le p par ceci: */}
        <motion.h1
          variants={itemVariants}
          className={cn("font-bold text-white mb-6 drop-shadow-md", isMobile ? "text-3xl" : "text-4xl md:text-6xl")}
        >
          Marketplace Queer & Inclusive
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className={cn("text-white/90 max-w-2xl mb-8", isMobile ? "text-base px-4" : "text-xl md:text-2xl")}
        >
          Découvrez des produits uniques créés par des artistes et entrepreneur·euse·s de la communauté queer.
        </motion.p>

        {/* Modifiez la barre de recherche pour être plus adaptée au mobile */}
        {/* Remplacez la div de la barre de recherche par ceci: */}
        <motion.div variants={itemVariants} className={cn("w-full mb-8 relative", isMobile ? "max-w-xs" : "max-w-2xl")}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/60" />
          </div>
          <input
            type="text"
            placeholder={isMobile ? "Rechercher..." : "Rechercher des produits, boutiques ou catégories..."}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </motion.div>

        {/* Modifiez les boutons pour être plus adaptés au mobile */}
        {/* Remplacez la div des boutons par ceci: */}
        <motion.div
          variants={itemVariants}
          className={cn("flex gap-4", isMobile ? "flex-col w-full" : "flex-col sm:flex-row")}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size={isMobile ? "default" : "lg"}
              className={cn("bg-white text-purple-600 hover:bg-white/90", isMobile && "w-full")}
            >
              Explorer les Produits
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size={isMobile ? "default" : "lg"}
              variant="outline"
              className={cn("border-white text-white hover:bg-white/10", isMobile && "w-full")}
            >
              Devenir Vendeur·euse
            </Button>
          </motion.div>
        </motion.div>

        {/* Éléments décoratifs */}
        <motion.div
          variants={decorativeCircleVariants}
          className="absolute -bottom-16 left-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-30"
        ></motion.div>
        <motion.div
          variants={decorativeCircleVariants}
          className="absolute -top-8 right-1/4 w-40 h-40 bg-pink-400 rounded-full blur-3xl opacity-30"
        ></motion.div>
      </motion.div>
    </section>
  )
}
