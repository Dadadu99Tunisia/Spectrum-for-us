"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Product } from "@/lib/data/products"

// Supprimez l'import de useMobileDetection
// import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface ProductCardProps {
  product: Product
  featured?: boolean
  index?: number
}

export default function ProductCard({ product, featured = false, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Supprimez l'appel au hook
  // const { isMobile } = useMobileDetection()

  // Calculer le prix avec remise si applicable
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -10,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <Link href={`/produit/${product.id}`}>
            <div className="aspect-[4/5] overflow-hidden relative bg-muted">
              <motion.div
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full"
              >
                <Image
                  src={product.images[0] || "/placeholder.svg?height=400&width=400"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Badge className="bg-blue-500 hover:bg-blue-600">Nouveau</Badge>
                  </motion.div>
                )}
                {product.discount && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Badge className="bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                  </motion.div>
                )}
                {product.featured && !product.isNew && !product.discount && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Badge className="bg-purple-500 hover:bg-purple-600">Populaire</Badge>
                  </motion.div>
                )}
              </div>
            </div>
          </Link>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2 flex flex-col gap-2"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/90 text-foreground shadow-md hover:bg-primary hover:text-white"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter aux favoris</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </div>

        <CardContent className="flex-grow p-3 sm:p-4">
          <Link href={`/produit/${product.id}`} className="hover:underline">
            <h3 className="font-semibold line-clamp-2 group-hover:text-purple-600 transition-colors text-base sm:text-lg mb-0.5 sm:mb-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mb-2">
            {product.rating && (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
                  <Star className="fill-yellow-400 text-yellow-400 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </motion.div>
                <span className="text-muted-foreground text-xs sm:text-sm">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">({product.reviews?.length || 0} avis)</span>
              </>
            )}
          </div>

          <p className="text-muted-foreground line-clamp-2 mb-2 text-xs sm:text-sm">{product.description}</p>

          {/* Prix */}
          <div className="flex items-center gap-2">
            {discountedPrice ? (
              <>
                <motion.span
                  className="font-semibold text-base sm:text-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {discountedPrice.toFixed(2)} €
                </motion.span>
                <motion.span
                  className="text-muted-foreground line-through text-xs sm:text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {product.price.toFixed(2)} €
                </motion.span>
              </>
            ) : (
              <motion.span
                className="font-semibold text-base sm:text-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {product.price.toFixed(2)} €
              </motion.span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
          <motion.div className="w-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="sm"
              onClick={() => {
                // Logique d'ajout au panier
                console.log(`Ajout au panier: ${product.name}`)
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sm:hidden">Ajouter</span>
              <span className="hidden sm:inline">Ajouter au panier</span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
