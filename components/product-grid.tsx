"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingBag, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { isMobile, isLoading: mobileLoading } = useMobileDetection()

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setProducts([
        {
          id: "product-1",
          name: "T-shirt Inclusif",
          price: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Vêtements",
        },
        {
          id: "product-2",
          name: "Bracelet Pride",
          price: 19.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Bijoux",
        },
        {
          id: "product-3",
          name: "Accessoire Design",
          price: 49.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Accessoires",
        },
        {
          id: "product-4",
          name: "Livre Diversité",
          price: 15.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Livres",
        },
        {
          id: "product-5",
          name: "Sac Éco-responsable",
          price: 35.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Accessoires",
        },
        {
          id: "product-6",
          name: "Chaussures Confort",
          price: 79.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Chaussures",
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading || mobileLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-sm text-muted-foreground">Chargement des produits...</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4", isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
      {products.map((product, index) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="relative aspect-square">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={index < 4}
            />
            <Badge className="absolute bottom-2 left-2 bg-primary text-xs">{product.category}</Badge>
          </div>
          <CardContent className={cn(isMobile ? "p-2" : "p-3")}>
            <Link href={`/produit/${product.id}`} className="hover:underline">
              <h3 className={cn("font-semibold line-clamp-2", isMobile ? "text-sm mb-1" : "text-base mb-2")}>
                {product.name}
              </h3>
            </Link>
          </CardContent>
          <CardFooter className={cn(isMobile ? "p-2 pt-0" : "p-3 pt-0", "flex justify-between items-center")}>
            <span className={cn("font-bold text-primary", isMobile ? "text-sm" : "text-base")}>
              {product.price.toFixed(2)} €
            </span>
            <Button size={isMobile ? "sm" : "default"} className="gap-1">
              <ShoppingBag className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
              {isMobile ? "+" : "Ajouter"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
