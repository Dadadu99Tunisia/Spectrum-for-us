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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un appel API
    const fetchProducts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setProducts([
        {
          id: "1",
          name: "T-shirt Pride Collection",
          price: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerApparel", id: "seller1" },
          category: "Vêtements",
          isFavorite: false,
        },
        {
          id: "2",
          name: "Boucles d'oreilles Arc-en-ciel",
          price: 34.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "PrideJewelry", id: "seller2" },
          category: "Bijoux",
          isFavorite: true,
        },
        {
          id: "3",
          name: "Impression d'Art Inclusive",
          price: 24.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerArtists", id: "seller3" },
          category: "Art",
          isFavorite: false,
        },
        {
          id: "4",
          name: "Kit de Soins Gender-Affirming",
          price: 49.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "InclusiveBeauty", id: "seller4" },
          category: "Beauté",
          isFavorite: false,
        },
        {
          id: "5",
          name: "Drapeau Progress Pride",
          price: 19.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "PrideFlagShop", id: "seller5" },
          category: "Décoration",
          isFavorite: true,
        },
        {
          id: "6",
          name: "Bracelet Pronoms Personnalisé",
          price: 15.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "IdentityJewels", id: "seller6" },
          category: "Bijoux",
          isFavorite: false,
        },
        {
          id: "7",
          name: "Livre 'Histoires Queer'",
          price: 22.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerBooks", id: "seller7" },
          category: "Livres",
          isFavorite: false,
        },
        {
          id: "8",
          name: "Masque Facial Pride",
          price: 12.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerApparel", id: "seller1" },
          category: "Accessoires",
          isFavorite: false,
        },
      ])
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

