"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import { FormattedPrice } from "@/components/formatted-price"

type Product = {
  id: string
  name: string
  price: number
  image: string
  seller: {
    name: string
    id: string
  }
  category: string
  isFavorite: boolean
}

type ProductCardProps = {
  product: Product
  onToggleFavorite: (id: string) => void
}

export function Product3DCard({ product, onToggleFavorite }: ProductCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className="relative perspective-1000 h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group transform-gpu"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="relative">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full bg-white/80 hover:bg-white ${product.isFavorite ? "text-pink-500" : "text-gray-500"}`}
                onClick={(e) => {
                  e.preventDefault()
                  onToggleFavorite(product.id)
                }}
              >
                <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-current" : ""}`} />
                <span className="sr-only">Ajouter aux favoris</span>
              </Button>
            </div>
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              {product.category}
            </Badge>
          </div>

          {/* Effet de brillance */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background:
                "linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)",
              backgroundSize: "200% 200%",
              animation: "shine 3s infinite",
            }}
          />
        </div>

        <CardContent className="p-4">
          <Link href={`/produit/${product.id}`}>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          <Link
            href={`/vendeur/${product.seller.id}`}
            className="text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
          >
            par {product.seller.name}
          </Link>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <FormattedPrice amount={product.price} className="font-bold" />
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardFooter>
      </Card>

      <style jsx global>{`
        @keyframes shine {
          0% {
            background-position: 200% 200%;
          }
          100% {
            background-position: -200% -200%;
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
