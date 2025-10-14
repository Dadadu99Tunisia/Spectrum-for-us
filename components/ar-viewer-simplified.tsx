"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ViewIcon as View360, Maximize2, RotateCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ARViewerSimplifiedProps {
  productId: string
  productName: string
  productImages: string[]
}

export default function ARViewerSimplified({ productId, productName, productImages }: ARViewerSimplifiedProps) {
  const [currentAngle, setCurrentAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Utiliser des images par défaut si aucune n'est fournie
  const images = productImages.length > 0 ? productImages : ["/placeholder.svg?height=600&width=600"]

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    setStartX(e.clientX)

    // Changer l'angle en fonction du mouvement de la souris
    setCurrentAngle((prev) => (prev + deltaX) % 360)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const toggleFullscreen = () => {
    const element = document.documentElement

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <Link href={`/produit/${productId}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour au produit
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentAngle(0)}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4 mr-1" />
            {isFullscreen ? "Quitter" : "Plein écran"}
          </Button>
        </div>
      </div>

      <div
        className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `rotateY(${currentAngle}deg)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src={images[0] || "/placeholder.svg"} alt={productName} fill className="object-contain" />
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center">
          <View360 className="h-4 w-4 mr-1" />
          Faites glisser pour faire pivoter
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">{productName} - Vue 3D</h2>
        <p className="text-muted-foreground mt-2">
          Explorez ce produit sous tous les angles. Faites glisser pour faire pivoter l'objet et utiliser le mode plein
          écran pour une meilleure expérience.
        </p>
      </div>
    </div>
  )
}
