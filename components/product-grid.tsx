"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
// Importez le hook de détection mobile
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
  // Dans la fonction ProductGrid, ajoutez cette ligne après les autres hooks
  const { isMobile } = useMobileDetection()

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
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des produits...</span>
      </div>
    )
  }

  // Modifiez la grille pour avoir moins de colonnes sur mobile
  // Remplacez le return final par ceci:
  return (
    <div className={cn("grid gap-4 sm:gap-6", isMobile ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative h-40 sm:h-48">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            <Badge className="absolute bottom-2 left-2 bg-primary text-xs">{product.category}</Badge>
          </div>
          <CardContent className={cn(isMobile ? "p-2 sm:p-4" : "p-4")}>
            <Link href={`/produit/${product.id}`}>
              <h3 className={cn("font-semibold mb-2", isMobile ? "text-sm sm:text-base" : "text-lg")}>
                {product.name}
              </h3>
            </Link>
          </CardContent>
          <CardFooter className={cn(isMobile ? "p-2 sm:p-4 pt-0" : "p-4 pt-0", "flex justify-between")}>
            <span className={cn("font-bold", isMobile ? "text-sm" : "text-base")}>{product.price.toFixed(2)} €</span>
            <Button size={isMobile ? "sm" : "default"}>
              <ShoppingBag className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4", isMobile ? "mr-1" : "mr-2")} />
              {isMobile ? "Ajouter" : "Ajouter"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
