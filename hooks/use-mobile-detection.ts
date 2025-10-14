"use client"

import { useState, useEffect } from "react"

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)
        setIsLoading(false)
      }
    }

    // Vérification initiale
    checkMobile()

    // Écouter les changements de taille d'écran
    const handleResize = () => {
      checkMobile()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return { isMobile, isLoading }
}
