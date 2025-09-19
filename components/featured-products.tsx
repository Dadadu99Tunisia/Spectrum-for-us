"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

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
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Données statiques pour éviter les erreurs de fetch
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "T-shirt Pride Arc-en-ciel",
        price: 29.99,
        image: "/placeholder.svg?height=300&width=300&text=T-shirt+Pride",
        seller: { name: "Pride Apparel", id: "seller1" },
        category: "Vêtements",
      },
      {
        id: "2",
        name: "Boucles d'oreilles Diversité",
        price: 24.99,
        image: "/placeholder.svg?height=300&width=300&text=Bijoux",
        seller: { name: "Queer Jewelry", id: "seller2" },
        category: "Bijoux",
      },
      {
        id: "3",
        name: "Poster Art Inclusif",
        price: 19.99,
        image: "/placeholder.svg?height=300&width=300&text=Art+Poster",
        seller: { name: "Inclusive Art", id: "seller3" },
        category: "Art",
      },
      {
        id: "4",
        name: "Mug Rainbow",
        price: 15.99,
        image: "/placeholder.svg?height=300&width=300&text=Mug+Rainbow",
        seller: { name: "Home Pride", id: "seller4" },
        category: "Maison",
      },
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">par {product.seller.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">{product.price}€</span>
              <Button size="sm" asChild>
                <Link href={`/produit/${product.id}`}>Voir</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
