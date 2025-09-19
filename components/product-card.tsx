"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Product } from "@/lib/data/products"
import { cn } from "@/lib/utils"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface ProductCardProps {
  product: Product
  featured?: boolean
  index?: number
}

export default function ProductCard({ product, featured = false, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { isMobile, isLoading } = useMobileDetection()

  // Calculer le prix avec remise si applicable
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : null

  // Éviter le rendu pendant le chargement pour éviter l'hydratation mismatch
  if (isLoading) {
    return (
      <Card className="overflow-hidden h-full flex flex-col shadow-md animate-pulse">
        <div className="aspect-[4/5] bg-muted" />
        <CardContent className="p-4 flex-grow">
          <div className="h-4 bg-muted rounded mb-2" />
          <div className="h-3 bg-muted rounded mb-2 w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="h-10 bg-muted rounded w-full" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <div
      className="h-full transition-transform duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <Link href={`/produit/${product.id}`}>
            <div className="aspect-[4/5] overflow-hidden relative bg-muted">
              <Image
                src={product.images[0] || "/placeholder.svg?height=400&width=400"}
                alt={product.name}
                fill
                className={cn("object-cover transition-transform duration-300", isHovered ? "scale-105" : "scale-100")}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={index < 4}
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">Nouveau</Badge>}
                {product.discount && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-xs">-{product.discount}%</Badge>
                )}
                {product.featured && !product.isNew && !product.discount && (
                  <Badge className="bg-purple-500 hover:bg-purple-600 text-xs">Populaire</Badge>
                )}
              </div>
            </div>
          </Link>

          {/* Quick actions */}
          <div
            className={cn(
              "absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/90 text-foreground shadow-md hover:bg-primary hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsFavorite(!isFavorite)
                    }}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter aux favoris</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <CardContent className={cn("flex-grow", isMobile ? "p-3" : "p-4")}>
          <Link href={`/produit/${product.id}`} className="hover:underline">
            <h3
              className={cn(
                "font-semibold line-clamp-2 hover:text-purple-600 transition-colors",
                isMobile ? "text-sm mb-1" : "text-base mb-2",
              )}
            >
              {product.name}
            </h3>
          </Link>

          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className={cn("fill-yellow-400 text-yellow-400", isMobile ? "h-3 w-3" : "h-3.5 w-3.5")} />
              <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                {product.rating.toFixed(1)}
              </span>
              <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                ({product.reviews?.length || 0})
              </span>
            </div>
          )}

          <p className={cn("text-muted-foreground line-clamp-2 mb-3", isMobile ? "text-xs" : "text-sm")}>
            {product.description}
          </p>

          {/* Prix */}
          <div className="flex items-center gap-2">
            {discountedPrice ? (
              <>
                <span className={cn("font-bold text-primary", isMobile ? "text-base" : "text-lg")}>
                  {discountedPrice.toFixed(2)} €
                </span>
                <span className={cn("text-muted-foreground line-through", isMobile ? "text-xs" : "text-sm")}>
                  {product.price.toFixed(2)} €
                </span>
              </>
            ) : (
              <span className={cn("font-bold text-primary", isMobile ? "text-base" : "text-lg")}>
                {product.price.toFixed(2)} €
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className={cn(isMobile ? "p-3 pt-0" : "p-4 pt-0")}>
          <Button
            className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105"
            size={isMobile ? "sm" : "default"}
            onClick={(e) => {
              e.preventDefault()
              // Logique d'ajout au panier
              console.log(`Ajout au panier: ${product.name}`)
            }}
          >
            <ShoppingCart className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
            {isMobile ? "Ajouter" : "Ajouter au panier"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
