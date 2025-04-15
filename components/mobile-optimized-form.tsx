"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface MobileOptimizedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  className?: string
}

export function MobileOptimizedForm({ children, className, ...props }: MobileOptimizedFormProps) {
  const { isMobile } = useMobileDetection()
  const [activeInput, setActiveInput] = useState<HTMLElement | null>(null)
  const [viewportHeight, setViewportHeight] = useState<number>(0)

  useEffect(() => {
    if (!isMobile) return

    // Mettre à jour la hauteur du viewport
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()
    window.addEventListener("resize", updateViewportHeight)

    // Gérer le focus des inputs
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        setActiveInput(target)

        // Faire défiler l'élément en vue avec un délai pour le clavier mobile
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 300)
      }
    }

    // Gérer la perte de focus
    const handleBlur = () => {
      setActiveInput(null)
    }

    document.addEventListener("focus", handleFocus, true)
    document.addEventListener("blur", handleBlur, true)

    return () => {
      window.removeEventListener("resize", updateViewportHeight)
      document.removeEventListener("focus", handleFocus, true)
      document.removeEventListener("blur", handleBlur, true)
    }
  }, [isMobile])

  return (
    <form
      className={cn(isMobile && "mobile-optimized-form", className)}
      {...props}
      style={{
        ...(isMobile && activeInput
          ? {
              paddingBottom: "40vh", // Espace pour le clavier mobile
            }
          : {}),
        ...props.style,
      }}
    >
      {children}

      {/* Styles spécifiques pour les formulaires mobiles */}
      {isMobile && (
        <style jsx global>{`
          .mobile-optimized-form input,
          .mobile-optimized-form textarea,
          .mobile-optimized-form select {
            font-size: 16px !important; /* Évite le zoom sur iOS */
            padding: 12px !important; /* Cibles tactiles plus grandes */
          }
          
          .mobile-optimized-form button[type="submit"] {
            min-height: 44px; /* Taille minimale recommandée pour les cibles tactiles */
          }
        `}</style>
      )}
    </form>
  )
}
