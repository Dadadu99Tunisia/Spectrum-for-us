"use client"

import { useEffect, useState } from "react"

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }

    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}
