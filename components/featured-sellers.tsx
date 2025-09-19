"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Star, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"

const sellers = [
  {
    id: "pride-apparel",
    name: "Pride Apparel",
    description: "Vêtements inclusifs et de qualité pour toute la communauté",
    avatar: "/placeholder.svg?height=100&width=100&text=PA",
    banner: "/placeholder.svg?height=200&width=400&text=Pride+Apparel",
    rating: 4.9,
    reviewCount: 234,
    productCount: 156,
    location: "Paris, France",
    verified: true,
    featured: true,
    specialties: ["Vêtements", "Accessoires"],
  },
  {
    id: "queer-jewelry",
    name: "Queer Jewelry",
    description: "Bijoux artisanaux célébrant la diversité et l'authenticité",
    avatar: "/placeholder.svg?height=100&width=100&text=QJ",
    banner: "/placeholder.svg?height=200&width=400&text=Queer+Jewelry",
    rating: 4.8,
    reviewCount: 189,
    productCount: 89,
    location: "Lyon, France",
    verified: true,
    featured: true,
    specialties: ["Bijoux", "Accessoires"],
  },
  {
    id: "inclusive-art",
    name: "Inclusive Art",
    description: "Art contemporain qui célèbre la diversité sous toutes ses formes",
    avatar: "/placeholder.svg?height=100&width=100&text=IA",
    banner: "/placeholder.svg?height=200&width=400&text=Inclusive+Art",
    rating: 4.9,
    reviewCount: 156,
    productCount: 234,
    location: "Marseille, France",
    verified: true,
    featured: true,
    specialties: ["Art", "Décoration"],
  },
  {
    id: "rainbow-home",
    name: "Rainbow Home",
    description: "Décoration et accessoires pour un intérieur qui vous ressemble",
    avatar: "/placeholder.svg?height=100&width=100&text=RH",
    banner: "/placeholder.svg?height=200&width=400&text=Rainbow+Home",
    rating: 4.7,
    reviewCount: 98,
    productCount: 67,
    location: "Toulouse, France",
    verified: true,
    featured: true,
    specialties: ["Maison", "Décoration"],
  },
]

export default function FeaturedSellers() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Vendeurs en vedette</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les créateurs et artisans qui font la richesse de notre marketplace
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {sellers.map((seller, index) => (
            <motion.div key={seller.id} variants={item}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="absolute inset-0 bg-black/10" />
                  {seller.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1">
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6 -mt-8 relative">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 border-4 border-background mb-4">
                      <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                      <AvatarFallback>
                        {seller.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-lg font-semibold mb-2">{seller.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{seller.description}</p>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{seller.rating}</span>
                      <span className="text-sm text-muted-foreground">({seller.reviewCount})</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{seller.productCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{seller.location.split(",")[0]}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {seller.specialties.map((specialty) => (
                        <span key={specialty} className="px-2 py-1 bg-muted rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/vendeur/${seller.id}`}>Voir la boutique</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/vendeurs">Découvrir tous les vendeurs</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
