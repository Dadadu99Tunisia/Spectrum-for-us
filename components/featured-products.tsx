"use client"

import { useState, useEffect } from "react"
import { Product3DCard } from "./product-card-3d"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

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
          name: "T-shirt Spectre Collection",
          price: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerApparel", id: "seller1" },
          category: "Vêtements",
          isFavorite: false,
        },
        {
          id: "2",
          name: "Boucles d'oreilles Horizon",
          price: 34.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "PrideJewelry", id: "seller2" },
          category: "Bijoux",
          isFavorite: true,
        },
        {
          id: "3",
          name: "Impression d'Art Diversité",
          price: 24.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerArtists", id: "seller3" },
          category: "Art",
          isFavorite: false,
        },
        {
          id: "4",
          name: "Kit de Soins Versatile",
          price: 49.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "InclusiveBeauty", id: "seller4" },
          category: "Beauté",
          isFavorite: false,
        },
        {
          id: "5",
          name: "Bannière Horizon",
          price: 19.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "PrideFlagShop", id: "seller5" },
          category: "Décoration",
          isFavorite: true,
        },
        {
          id: "6",
          name: "Bracelet Personnalisable Écho",
          price: 15.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "IdentityJewels", id: "seller6" },
          category: "Bijoux",
          isFavorite: false,
        },
        {
          id: "7",
          name: "Livre 'Chroniques Contemporaines'",
          price: 22.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerBooks", id: "seller7" },
          category: "Livres",
          isFavorite: false,
        },
        {
          id: "8",
          name: "Masque Facial Élégance",
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((product, index) => (
        <Product3DCard key={product.id} product={product} onToggleFavorite={toggleFavorite} index={index} />
      ))}
    </motion.div>
  )
}
