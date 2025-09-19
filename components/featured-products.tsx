"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un chargement de données
    const loadProducts = async () => {
      try {
        // Simuler un délai de chargement
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockProducts: Product[] = [
          {
            id: "1",
            name: "T-shirt Pride Arc-en-ciel",
            price: 29.99,
            image: "/placeholder.svg?height=300&width=300&text=T-shirt+Pride",
            seller: {
              name: "Atelier Inclusif",
              verified: true,
            },
            rating: 4.8,
            reviews: 124,
          },
          {
            id: "2",
            name: "Bracelet Diversité",
            price: 15.99,
            image: "/placeholder.svg?height=300&width=300&text=Bracelet",
            seller: {
              name: "Créations Uniques",
              verified: true,
            },
            rating: 4.9,
            reviews: 89,
          },
          {
            id: "3",
            name: "Sac Tote Inclusif",
            price: 24.99,
            image: "/placeholder.svg?height=300&width=300&text=Sac+Tote",
            seller: {
              name: "Mode Pour Tous",
              verified: false,
            },
            rating: 4.7,
            reviews: 67,
          },
          {
            id: "4",
            name: "Pin's Collection Pride",
            price: 12.99,
            image: "/placeholder.svg?height=300&width=300&text=Pins",
            seller: {
              name: "Art & Fierté",
              verified: true,
            },
            rating: 4.6,
            reviews: 156,
          },
        ]

        setProducts(mockProducts)
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Produits Vedettes</h2>
          <p className="text-muted-foreground">Découvrez nos produits les plus populaires</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Produits Vedettes</h2>
        <p className="text-muted-foreground">Découvrez nos produits les plus populaires</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
