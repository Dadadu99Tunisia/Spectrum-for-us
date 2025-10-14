"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"

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

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un appel API
    const fetchProducts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Données fictives
      const mockProducts = Array(16)
        .fill(null)
        .map((_, i) => ({
          id: `product-${i + 1}`,
          name: `Produit ${i + 1}`,
          price: 19.99 + i * 5,
          image: `/placeholder.svg?height=300&width=300`,
          seller: {
            name: `Vendeur ${Math.floor(i / 4) + 1}`,
            id: `seller-${Math.floor(i / 4) + 1}`,
          },
          category: ["Vêtements", "Bijoux", "Art", "Beauté"][i % 4],
          isFavorite: i % 5 === 0,
        }))

      setProducts(mockProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const toggleFavorite = (productId: string) => {
    setProducts(
      products.map((product) => (product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product)),
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
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
                    toggleFavorite(product.id)
                  }}
                >
                  <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-current" : ""}`} />
                  <span className="sr-only">Ajouter aux favoris</span>
                </Button>
              </div>
            </div>
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-purple-500 hover:bg-purple-600">{product.category}</Badge>
            </div>
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
            <span className="font-bold">{product.price.toFixed(2)} €</span>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

