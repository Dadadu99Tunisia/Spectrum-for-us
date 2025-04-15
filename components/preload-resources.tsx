"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Liste des routes à précharger
const ROUTES_TO_PRELOAD = ["/", "/boutique", "/categories", "/nouveautes", "/connexion", "/inscription"]

// Liste des images à précharger
const IMAGES_TO_PRELOAD = ["/images/logo.png", "/placeholder.svg?height=400&width=400"]

export function PreloadResources() {
  const router = useRouter()

  useEffect(() => {
    // Précharger les routes après le chargement initial
    const preloadRoutes = () => {
      ROUTES_TO_PRELOAD.forEach((route) => {
        router.prefetch(route)
      })
    }

    // Précharger les images
    const preloadImages = () => {
      IMAGES_TO_PRELOAD.forEach((src) => {
        const img = new Image()
        img.src = src
      })
    }

    // Utiliser requestIdleCallback pour précharger pendant les périodes d'inactivité
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        preloadRoutes()
        preloadImages()
      })
    } else {
      // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
      setTimeout(() => {
        preloadRoutes()
        preloadImages()
      }, 2000)
    }
  }, [router])

  return null
}
