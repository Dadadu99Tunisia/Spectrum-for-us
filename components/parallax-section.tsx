"use client"

import { useEffect, useState, type ReactNode } from "react"
import { isBrowser } from "@/utils/client-utils"

interface ParallaxSectionProps {
  children: ReactNode
  direction?: "up" | "down"
  speed?: number
}

export function ParallaxSection({ children, direction = "up", speed = 0.1 }: ParallaxSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    setMounted(true)

    if (!isBrowser) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      setOffset(scrollY * speed * (direction === "up" ? -1 : 1))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [direction, speed])

  // Rendu côté serveur ou pendant l'hydratation
  if (!mounted || !isBrowser) {
    return (
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        {children}
      </section>
    )
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <div
        style={{
          transform: `translateY(${offset}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
      </div>
    </section>
  )
}

