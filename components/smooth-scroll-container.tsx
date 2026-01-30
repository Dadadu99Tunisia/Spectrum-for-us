"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import { cn } from "@/lib/utils"

interface SmoothScrollContainerProps {
  children: React.ReactNode
  className?: string
  horizontal?: boolean
  snapType?: "none" | "proximity" | "mandatory"
  snapAlign?: "start" | "center" | "end"
}

export function SmoothScrollContainer({
  children,
  className,
  horizontal = false,
  snapType = "none",
  snapAlign = "start",
}: SmoothScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useMobileDetection()

  useEffect(() => {
    if (!containerRef.current || !isMobile) return

    // Optimiser le défilement sur mobile
    const container = containerRef.current
    let startX = 0
    let startY = 0
    let startTime = 0
    let isScrolling = false

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startTime = Date.now()
      isScrolling = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) {
        const diffX = Math.abs(e.touches[0].clientX - startX)
        const diffY = Math.abs(e.touches[0].clientY - startY)

        // Déterminer si c'est un défilement horizontal ou vertical
        isScrolling = true

        // Empêcher le défilement de la page si nous défilons horizontalement dans un conteneur horizontal
        if (horizontal && diffX > diffY) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isScrolling) return

      const endTime = Date.now()
      const timeElapsed = endTime - startTime

      // Si le défilement est rapide, ajouter un effet d'inertie
      if (timeElapsed < 300) {
        const momentum = 0.5 // Facteur d'inertie

        if (horizontal) {
          const endX = e.changedTouches[0].clientX
          const distance = (startX - endX) * momentum
          container.scrollBy({ left: distance, behavior: "smooth" })
        } else {
          const endY = e.changedTouches[0].clientY
          const distance = (startY - endY) * momentum
          container.scrollBy({ top: distance, behavior: "smooth" })
        }
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [horizontal, isMobile])

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-auto",
        horizontal ? "flex" : "",
        snapType !== "none" ? `scroll-snap-type-${horizontal ? "x" : "y"}-${snapType}` : "",
        className,
      )}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}

      <style jsx global>{`
        .scroll-snap-type-x-mandatory {
          scroll-snap-type: x mandatory;
        }
        .scroll-snap-type-y-mandatory {
          scroll-snap-type: y mandatory;
        }
        .scroll-snap-type-x-proximity {
          scroll-snap-type: x proximity;
        }
        .scroll-snap-type-y-proximity {
          scroll-snap-type: y proximity;
        }
        .scroll-snap-align-start {
          scroll-snap-align: start;
        }
        .scroll-snap-align-center {
          scroll-snap-align: center;
        }
        .scroll-snap-align-end {
          scroll-snap-align: end;
        }
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
