"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Image from "next/image"
import { isBrowser } from "@/utils/client-utils"

export default function ModernHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] mix-blend-overlay opacity-20"></div>

      <div className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="mb-8">
          <Image src="/images/logo.png" alt="Spectrum Logo" width={800} height={240} className="h-40 w-auto" priority />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">Marketplace Queer & Inclusive</h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8">
          Découvrez des produits uniques créés par des artistes et entrepreneur·euse·s de la communauté queer.
        </p>

        {/* Barre de recherche */}
        <div className="w-full max-w-2xl mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/60" />
          </div>
          <input
            type="text"
            placeholder="Rechercher des produits, boutiques ou catégories..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
            Explorer les Produits
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Devenir Vendeur·euse
          </Button>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute -bottom-16 left-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -top-8 right-1/4 w-40 h-40 bg-pink-400 rounded-full blur-3xl opacity-30"></div>
      </div>
    </section>
  )
}
