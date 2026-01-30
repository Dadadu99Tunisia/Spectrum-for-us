"use client"

import type React from "react"

import { useMobileDetection } from "@/hooks/use-mobile-detection"
import { cn } from "@/lib/utils"

interface ResponsiveBackgroundProps {
  mobileImage: string
  desktopImage: string
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

export function ResponsiveBackground({
  mobileImage,
  desktopImage,
  className,
  children,
  style,
}: ResponsiveBackgroundProps) {
  const { isMobile } = useMobileDetection()

  const backgroundImage = isMobile ? mobileImage : desktopImage

  return (
    <div
      className={cn("relative", className)}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
