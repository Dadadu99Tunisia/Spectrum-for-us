"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import { cn } from "@/lib/utils"

interface LazyImageProps extends Omit<ImageProps, "onLoad"> {
  lowQualitySrc?: string
  className?: string
  containerClassName?: string
}

export function LazyImage({ src, alt, lowQualitySrc, className, containerClassName, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isMobile } = useMobileDetection()

  // Utiliser une version basse qualité pour le chargement initial sur mobile
  const placeholderSrc =
    lowQualitySrc ||
    (typeof src === "string" && src.includes("/placeholder.svg") ? src : "/placeholder.svg?height=20&width=20")

  // Réduire la qualité sur mobile pour améliorer les performances
  const quality = isMobile ? (props.quality || 75) - 15 : props.quality

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!isLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        quality={quality}
        className={cn("transition-opacity duration-500", isLoaded ? "opacity-100" : "opacity-0", className)}
        onLoad={() => setIsLoaded(true)}
        loading={isMobile ? "lazy" : props.loading || "lazy"}
        {...props}
      />
    </div>
  )
}
