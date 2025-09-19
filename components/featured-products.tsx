"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"

const products = [
  {
    id: 1,
    title: "T-shirt Pride Artistique",
    price: "29.99€",
    originalPrice: "39.99€",
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300&text=T-shirt+Pride",
    vendor: "Alex Art Studio",
    category: "Mode",
    isNew: true,
    isFavorite: false,
  },
  {
    id: 2,
    title: "Illustration Personnalisée",
    price: "45.00€",
    rating: 5.0,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300&text=Illustration",
    vendor: "Sam Creative",
    category: "Art",
    isNew: false,
    isFavorite: true,
  },
  {
    id: 3,
    title: "Bijoux Inclusifs Handmade",
    price: "35.50€",
    rating: 4.9,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300&text=Bijoux",
    vendor: "Jordan Jewelry",
    category: "Accessoires",
    isNew: true,
    isFavorite: false,
  },
  {
    id: 4,
    title: "Mug Motivationnel Queer",
    price: "18.99€",
    originalPrice: "24.99€",
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300&text=Mug+Queer",
    vendor: "Riley Designs",
    category: "Lifestyle",
    isNew: false,
    isFavorite: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function FeaturedProducts() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">Nouveau</Badge>}
                {product.originalPrice && <Badge variant="destructive">Promo</Badge>}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className={`absolute top-3 right-3 bg-white/80 hover:bg-white ${
                  product.isFavorite ? "text-red-500" : "text-gray-600"
                }`}
              >
                <Heart className={`h-4 w-4 ${product.isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{product.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  {product.rating} ({product.reviews})
                </div>
              </div>
              <Link href={`/produit/${product.id}`}>
                <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors cursor-pointer">
                  {product.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">par {product.vendor}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>
                <Button size="sm" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
