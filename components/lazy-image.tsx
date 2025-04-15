"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  sizes = "100vw",
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (priority) {
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" },
    )

    const element = document.getElementById(`lazy-image-${src.replace(/\W/g, "")}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [src, priority])

  // Si pas encore monté, retourner un placeholder
  if (!mounted) {
    return (
      <div className={cn("bg-muted animate-pulse", className)} style={{ width: `${width}px`, height: `${height}px` }} />
    )
  }

  return (
    <div
      id={`lazy-image-${src.replace(/\W/g, "")}`}
      className={cn("relative overflow-hidden", className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {isIntersecting && (
        <>
          <div
            className={cn(
              "absolute inset-0 bg-muted animate-pulse transition-opacity duration-300",
              isLoaded ? "opacity-0" : "opacity-100",
            )}
          />
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            quality={quality}
            sizes={sizes}
            className={cn("transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0", className)}
            onLoad={() => setIsLoaded(true)}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
        </>
      )}
    </div>
  )
}
