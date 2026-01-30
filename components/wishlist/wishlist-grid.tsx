"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "sonner"
import { ShoppingCart, Star, Trash2 } from "lucide-react"

interface WishlistItem {
  id: string
  product_id: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number
    images: string[]
    rating: number
    review_count: number
    is_active: boolean
    stock: number
    vendors: {
      store_name: string
    }
  }
}

interface WishlistGridProps {
  items: WishlistItem[]
}

export function WishlistGrid({ items: initialItems }: WishlistGridProps) {
  const [items, setItems] = useState(initialItems)
  const { addItem } = useCart()

  const handleRemove = async (wishlistId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("wishlists").delete().eq("id", wishlistId)

    if (error) {
      toast.error("Failed to remove item")
      return
    }

    setItems(items.filter((item) => item.id !== wishlistId))
    toast.success("Removed from wishlist")
  }

  const handleAddToCart = async (productId: string) => {
    await addItem(productId)
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="group overflow-hidden">
          <div className="relative aspect-square overflow-hidden">
            <Link href={`/products/${item.products.slug}`}>
              <Image
                src={item.products.images?.[0] || `/placeholder.svg?height=300&width=300&query=${item.products.name}`}
                alt={item.products.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </Link>
            {item.products.compare_at_price && (
              <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                {Math.round(
                  ((item.products.compare_at_price - item.products.price) / item.products.compare_at_price) * 100,
                )}
                % OFF
              </span>
            )}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => handleRemove(item.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <CardContent className="p-4">
            <Link href={`/products/${item.products.slug}`}>
              <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">{item.products.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{item.products.vendors?.store_name}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{Number(item.products.rating).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({item.products.review_count})</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="font-bold">${Number(item.products.price).toFixed(2)}</span>
                {item.products.compare_at_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${Number(item.products.compare_at_price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <Button
              className="w-full mt-3"
              size="sm"
              onClick={() => handleAddToCart(item.products.id)}
              disabled={!item.products.is_active || item.products.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {item.products.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
