"use client"

import { useState, useEffect } from "react"

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      setIsTablet(width >= 640 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    // Exécuter une fois au chargement
    handleResize()

    // Ajouter l'écouteur d'événement
    window.addEventListener("resize", handleResize)

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return { isMobile, isTablet, isDesktop, isClient }
}
