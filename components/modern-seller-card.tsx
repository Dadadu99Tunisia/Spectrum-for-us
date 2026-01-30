import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Store } from "lucide-react"

type Seller = {
  id: string
  name: string
  description: string
  image: string
  rating: number
  reviewCount: number
  productCount: number
  category: string
}

export function ModernSellerCard({ seller }: { seller: Seller }) {
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={seller.image || "/placeholder.svg"}
          alt={seller.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Effet de brillance au survol */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)",
            backgroundSize: "200% 200%",
            animation: "shine 3s infinite",
          }}
        />

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Badge className="bg-purple-500 hover:bg-purple-600 mb-2">{seller.category}</Badge>
          <h3 className="text-xl font-bold text-white">{seller.name}</h3>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-500 mr-2">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{seller.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({seller.reviewCount} avis)</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{seller.productCount} produits</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{seller.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-sm text-muted-foreground">
          <Store className="h-4 w-4 mr-1" />
          <span>Vendeur·euse vérifié·e</span>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/vendeur/${seller.id}`}>Voir la boutique</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
