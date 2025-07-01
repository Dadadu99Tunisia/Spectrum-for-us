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
import { cn } from "@/lib/utils"

// Importez le hook de détection mobile
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface ProductCardProps {
  product: Product
  featured?: boolean
  index?: number
  viewMode?: "grid" | "list"
  isMobileProp?: boolean
}

export default function ProductCard({
  product,
  featured = false,
  index = 0,
  viewMode = "grid",
  isMobileProp,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Calculer le prix avec remise si applicable
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : null

  const { isMobile } = useMobileDetection()

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
      <Card
        className={cn(
          "overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300",
          viewMode === "list" && "flex",
        )}
      >
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

        <CardContent className={cn("flex-grow", isMobileProp ? "p-3" : "p-4")}>
          <Link href={`/produit/${product.id}`} className="hover:underline">
            <h3
              className={cn(
                "font-semibold line-clamp-2 group-hover:text-purple-600 transition-colors",
                isMobileProp ? "text-base mb-0.5" : "mb-1",
              )}
            >
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mb-2">
            {product.rating && (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
                  <Star className={cn("fill-yellow-400 text-yellow-400", isMobileProp ? "h-3 w-3" : "h-3.5 w-3.5")} />
                </motion.div>
                <span className={cn("text-muted-foreground", isMobileProp ? "text-xs" : "text-sm")}>
                  {product.rating.toFixed(1)}
                </span>
                <span className={cn("text-muted-foreground", isMobileProp ? "text-xs" : "text-sm")}>
                  ({product.reviews?.length || 0} avis)
                </span>
              </>
            )}
          </div>

          <p className={cn("text-muted-foreground line-clamp-2 mb-2", isMobileProp ? "text-xs" : "text-sm")}>
            {product.description}
          </p>

          {/* Prix */}
          <div className="flex items-center gap-2">
            {discountedPrice ? (
              <>
                <motion.span
                  className={cn("font-semibold", isMobileProp ? "text-base" : "text-lg")}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {discountedPrice.toFixed(2)} €
                </motion.span>
                <motion.span
                  className={cn("text-muted-foreground line-through", isMobileProp ? "text-xs" : "text-sm")}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {product.price.toFixed(2)} €
                </motion.span>
              </>
            ) : (
              <motion.span
                className={cn("font-semibold", isMobileProp ? "text-base" : "text-lg")}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {product.price.toFixed(2)} €
              </motion.span>
            )}
          </div>
        </CardContent>

        <CardFooter className={cn(isMobileProp ? "p-3 pt-0" : "p-4 pt-0")}>
          <motion.div className="w-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size={isMobileProp ? "sm" : "default"}
              onClick={() => {
                // Logique d'ajout au panier
                console.log(`Ajout au panier: ${product.name}`)
              }}
            >
              <ShoppingCart className={isMobileProp ? "h-3.5 w-3.5" : "h-4 w-4"} />
              {isMobileProp ? "Ajouter" : "Ajouter au panier"}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
