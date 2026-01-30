"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube3d, ArrowRight } from "lucide-react"

export default function ARBanner() {
  const [mounted, setMounted] = useState(false)

  // Vérifier si nous sommes côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Ne rien rendre côté serveur
  if (!mounted) return null

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 my-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Visualisez les produits en 3D</h2>
          <p className="text-white/80 mb-4">Explorez nos produits en 3D avant de les acheter.</p>
          <Link href="/shop?ar=true" passHref>
            <Button className="bg-white text-indigo-600 hover:bg-white/90 gap-2" size="lg">
              Explorer les produits 3D
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center">
          <Cube3d className="h-24 w-24 text-white/90" />
        </div>
      </div>
    </div>
  )
}
