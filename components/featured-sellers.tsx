"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Package } from "lucide-react"

const sellers = [
  {
    id: 1,
    name: "Alex Rivera",
    username: "@alexart",
    avatar: "/placeholder.svg?height=80&width=80&text=AR",
    cover: "/placeholder.svg?height=200&width=400&text=Alex+Studio",
    rating: 4.9,
    reviews: 234,
    products: 45,
    location: "Paris, France",
    specialties: ["Art Digital", "Illustrations", "NFT"],
    description: "Artiste digital passionné·e par l'art inclusif et les représentations diverses.",
    isVerified: true,
  },
  {
    id: 2,
    name: "Sam Chen",
    username: "@samdesigns",
    avatar: "/placeholder.svg?height=80&width=80&text=SC",
    cover: "/placeholder.svg?height=200&width=400&text=Sam+Designs",
    rating: 5.0,
    reviews: 189,
    products: 32,
    location: "Lyon, France",
    specialties: ["Mode", "Accessoires", "Upcycling"],
    description: "Designer mode éthique spécialisé·e dans les créations durables et inclusives.",
    isVerified: true,
  },
  {
    id: 3,
    name: "Jordan Martinez",
    username: "@jordancreates",
    avatar: "/placeholder.svg?height=80&width=80&text=JM",
    cover: "/placeholder.svg?height=200&width=400&text=Jordan+Creates",
    rating: 4.8,
    reviews: 156,
    products: 28,
    location: "Marseille, France",
    specialties: ["Bijoux", "Céramique", "Artisanat"],
    description: "Artisan·e créateur·rice de bijoux uniques et d'objets déco personnalisés.",
    isVerified: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function FeaturedSellers() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {sellers.map((seller) => (
        <motion.div key={seller.id} variants={itemVariants}>
          <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-purple-400 to-pink-400">
              <Image
                src={seller.cover || "/placeholder.svg"}
                alt={`${seller.name} cover`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6 relative">
              <div className="absolute -top-10 left-6">
                <div className="relative">
                  <Image
                    src={seller.avatar || "/placeholder.svg"}
                    alt={seller.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  {seller.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/vendeur/${seller.id}`}>
                    <h3 className="text-xl font-semibold group-hover:text-purple-600 transition-colors cursor-pointer">
                      {seller.name}
                    </h3>
                  </Link>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    {seller.rating} ({seller.reviews})
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{seller.username}</p>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{seller.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {seller.location}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Package className="h-4 w-4 mr-1" />
                  {seller.products} produits
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {seller.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full">
                  <Link href={`/vendeur/${seller.id}`}>Voir la Boutique</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
