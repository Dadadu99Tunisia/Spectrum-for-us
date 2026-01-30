"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

export default function NotFound() {
  // Utiliser useState et useEffect au lieu de useMobileDetection
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Vérifier au chargement
    checkMobile()

    // Ajouter un écouteur pour les changements de taille
    window.addEventListener("resize", checkMobile)

    // Nettoyer l'écouteur
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-muted-foreground mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size={isMobile ? "lg" : "default"} className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size={isMobile ? "lg" : "default"} className="gap-2">
            <Link href="/support">
              <ArrowLeft className="h-4 w-4" />
              Contacter le support
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
