"use client"

import Image, { type ImageProps } from "next/image"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string
  mobileSrc?: string
  mobileWidth?: number
  mobileHeight?: number
  desktopWidth?: number
  desktopHeight?: number
  className?: string
}

export function OptimizedImage({
  src,
  mobileSrc,
  alt,
  mobileWidth,
  mobileHeight,
  desktopWidth,
  desktopHeight,
  className,
  ...props
}: OptimizedImageProps) {
  const { isMobile } = useMobileDetection()

  // Utiliser l'image mobile si disponible, sinon utiliser l'image par défaut
  const imageSrc = isMobile && mobileSrc ? mobileSrc : src

  // Calculer les dimensions en fonction de l'appareil
  const width = isMobile && mobileWidth ? mobileWidth : desktopWidth
  const height = isMobile && mobileHeight ? mobileHeight : desktopHeight

  // Priorité plus élevée pour les images visibles sur mobile
  const priority = isMobile ? props.priority || true : props.priority

  return (
    <Image
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={cn("transition-opacity duration-300", className)}
      priority={priority}
      {...props}
    />
  )
}
