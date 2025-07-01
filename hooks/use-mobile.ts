"use client"

import { useEffect, useState } from "react"

/**
 * A very tiny helper that returns `{ isMobile: boolean }`
 * based on the `(max-width: 640px)` media-query.
 *
 * It’s exported as a **named export** (`useMobile`)
 * because the build complained it was missing.
 *
 * Example:
 * ```tsx
 * const { isMobile } = useMobile()
 * ```
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)")

    // Initial value
    setIsMobile(mediaQuery.matches)

    // Update on resize / orientation change
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return { isMobile }
}
