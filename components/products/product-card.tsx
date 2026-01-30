"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import { AddToWishlist } from "@/components/products/add-to-wishlist"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart()

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addItem(product.id)
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Card className={cn("group overflow-hidden", className)}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={
              product.images?.[0] || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name)}`
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">-{discount}%</Badge>
          )}
          {product.is_featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <div onClick={handleWishlistClick}>
              <AddToWishlist productId={product.id} variant="icon" className="h-8 w-8" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.vendors?.store_name || "Unknown Vendor"}</p>
          <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{Number(product.rating).toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.review_count} reviews)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${Number(product.price).toFixed(2)}</span>
            {product.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                ${Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-xs text-destructive mt-1">Only {product.stock} left in stock</p>
          )}
          {product.stock === 0 && <p className="text-xs text-muted-foreground mt-1">Out of stock</p>}
        </CardContent>
      </Link>
    </Card>
  )
}
