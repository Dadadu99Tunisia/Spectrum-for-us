"'use client'
import { useMobile } from "./use-mobile"

export function useMobileDetection() {
  const { isMobile } = useMobile()

  return { isMobile }
}
