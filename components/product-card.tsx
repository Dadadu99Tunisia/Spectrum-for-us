"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  seller: {
    name: string
    verified: boolean
  }
  rating: number
  reviews: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleAddToCart = () => {
    console.log(`Ajout au panier: ${product.name}`)
    // Ici vous ajouteriez la logique d'ajout au panier
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    console.log(`${isFavorite ? "Supprimé des" : "Ajouté aux"} favoris: ${product.name}`)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/produit/${product.id}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <Link href={`/produit/${product.id}`}>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">par</span>
          <span className="text-sm font-medium">{product.seller.name}</span>
          {product.seller.verified && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              ✓
            </Badge>
          )}
        </div>

        <div className="text-lg font-bold text-purple-600">{product.price.toFixed(2)} €</div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  )
}
