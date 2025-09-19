"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"

const sellers = [
  {
    id: "pride-apparel",
    name: "Pride Apparel",
    description: "Vêtements inclusifs et de qualité pour toute la communauté",
    image: "/placeholder.svg?height=100&width=100&text=PA",
    rating: 4.8,
    reviews: 124,
    location: "Paris, France",
    verified: true,
    products: 45,
  },
  {
    id: "queer-jewelry",
    name: "Queer Jewelry",
    description: "Bijoux artisanaux célébrant la diversité",
    image: "/placeholder.svg?height=100&width=100&text=QJ",
    rating: 4.9,
    reviews: 89,
    location: "Lyon, France",
    verified: true,
    products: 32,
  },
  {
    id: "inclusive-art",
    name: "Inclusive Art",
    description: "Art contemporain et illustrations inclusives",
    image: "/placeholder.svg?height=100&width=100&text=IA",
    rating: 4.7,
    reviews: 67,
    location: "Marseille, France",
    verified: true,
    products: 28,
  },
  {
    id: "home-pride",
    name: "Home Pride",
    description: "Décoration et accessoires pour la maison",
    image: "/placeholder.svg?height=100&width=100&text=HP",
    rating: 4.6,
    reviews: 156,
    location: "Toulouse, France",
    verified: false,
    products: 67,
  },
]

export default function FeaturedSellers() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {sellers.map((seller) => (
        <Card key={seller.id} className="group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="relative">
                <Image
                  src={seller.image || "/placeholder.svg"}
                  alt={seller.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                {seller.verified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-semibold text-lg">{seller.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3 mr-1" />
                  {seller.location}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{seller.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{seller.rating}</span>
                <span className="ml-1 text-sm text-muted-foreground">({seller.reviews})</span>
              </div>
              <span className="text-sm text-muted-foreground">{seller.products} produits</span>
            </div>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href={`/vendeur/${seller.id}`}>Voir la boutique</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
