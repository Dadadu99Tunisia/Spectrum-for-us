"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Seller {
  id: string
  name: string
  avatar: string
  rating: number
  verified: boolean
  description: string
  location: string
  productCount: number
}

export default function FeaturedSellers() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSellers = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800))

        const mockSellers: Seller[] = [
          {
            id: "1",
            name: "Atelier Inclusif",
            avatar: "/placeholder.svg?height=100&width=100&text=Seller1",
            rating: 4.9,
            verified: true,
            description: "Créations artisanales inclusives et durables",
            location: "Paris, France",
            productCount: 45,
          },
          {
            id: "2",
            name: "Pride Creations",
            avatar: "/placeholder.svg?height=100&width=100&text=Seller2",
            rating: 4.8,
            verified: true,
            description: "Produits LGBTQ+ authentiques et fiers",
            location: "Lyon, France",
            productCount: 32,
          },
          {
            id: "3",
            name: "Diversité & Style",
            avatar: "/placeholder.svg?height=100&width=100&text=Seller3",
            rating: 4.7,
            verified: true,
            description: "Mode accessible pour tous les corps",
            location: "Marseille, France",
            productCount: 67,
          },
          {
            id: "4",
            name: "Art Queer",
            avatar: "/placeholder.svg?height=100&width=100&text=Seller4",
            rating: 4.9,
            verified: false,
            description: "Art contemporain et expression queer",
            location: "Toulouse, France",
            productCount: 28,
          },
        ]

        setSellers(mockSellers)
      } catch (error) {
        console.error("Erreur lors du chargement des vendeurs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSellers()
  }, [])

  if (loading) {
    return (
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Vendeurs Vedettes</h2>
          <p className="text-muted-foreground">Découvrez nos créateurs talentueux</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Vendeurs Vedettes</h2>
        <p className="text-muted-foreground">Découvrez nos créateurs talentueux</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sellers.map((seller) => (
          <Link key={seller.id} href={`/vendeur/${seller.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Image
                      src={seller.avatar || "/placeholder.svg"}
                      alt={seller.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    {seller.verified && (
                      <Badge className="absolute -bottom-1 -right-1 bg-green-500 hover:bg-green-600 text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">{seller.name}</h3>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{seller.description}</p>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{seller.rating}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    {seller.location}
                  </div>

                  <p className="text-xs text-muted-foreground">{seller.productCount} produits</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
