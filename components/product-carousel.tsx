"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"

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
  isNew: boolean
}

export default function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simuler un appel API
    const fetchProducts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setProducts([
        {
          id: "new1",
          name: "Hoodie Pride Edition",
          price: 49.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerApparel", id: "seller1" },
          category: "Vêtements",
          isNew: true,
        },
        {
          id: "new2",
          name: "Collier Quartz Rose",
          price: 39.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "PrideJewelry", id: "seller2" },
          category: "Bijoux",
          isNew: true,
        },
        {
          id: "new3",
          name: "Poster Art Queer",
          price: 19.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerArtists", id: "seller3" },
          category: "Art",
          isNew: true,
        },
        {
          id: "new4",
          name: "Huile Essentielle Relaxante",
          price: 24.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "InclusiveBeauty", id: "seller4" },
          category: "Beauté",
          isNew: true,
        },
        {
          id: "new5",
          name: "Tote Bag Pride",
          price: 15.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerApparel", id: "seller1" },
          category: "Accessoires",
          isNew: true,
        },
        {
          id: "new6",
          name: "Bougie Artisanale",
          price: 22.99,
          image: "/placeholder.svg?height=300&width=300",
          seller: { name: "QueerHome", id: "seller8" },
          category: "Décoration",
          isNew: true,
        },
      ])
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount =
        direction === "left" ? current.scrollLeft - current.offsetWidth : current.scrollLeft + current.offsetWidth

      current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white dark:bg-background shadow-md"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Précédent</span>
        </Button>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start">
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-pink-500 hover:bg-pink-600">Nouveau</Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="outline" className="bg-white/80 dark:bg-background/80">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <Link href={`/produit/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <Link
                  href={`/vendeur/${product.seller.id}`}
                  className="text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                >
                  par {product.seller.name}
                </Link>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="font-bold">{product.price.toFixed(2)} €</span>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white dark:bg-background shadow-md"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Suivant</span>
        </Button>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

