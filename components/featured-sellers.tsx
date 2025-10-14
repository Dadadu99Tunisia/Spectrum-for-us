import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Store } from "lucide-react"

const sellers = [
  {
    id: "seller1",
    name: "QueerApparel",
    description: "Vêtements et accessoires inclusifs pour toutes les identités.",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviewCount: 124,
    productCount: 45,
    category: "Vêtements",
  },
  {
    id: "seller2",
    name: "PrideJewelry",
    description: "Bijoux artisanaux célébrant la diversité et l'expression de soi.",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviewCount: 89,
    productCount: 32,
    category: "Bijoux",
  },
  {
    id: "seller3",
    name: "QueerArtists",
    description: "Collectif d'artistes proposant des œuvres originales et inclusives.",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviewCount: 56,
    productCount: 28,
    category: "Art",
  },
  {
    id: "seller4",
    name: "InclusiveBeauty",
    description: "Produits de beauté éthiques et inclusifs pour tous les genres.",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviewCount: 42,
    productCount: 18,
    category: "Beauté",
  },
]

export default function FeaturedSellers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {sellers.map((seller) => (
        <Card key={seller.id} className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <div className="relative h-40 overflow-hidden">
            <Image
              src={seller.image || "/placeholder.svg"}
              alt={seller.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
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
              <span>Vendeur vérifié</span>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/vendeur/${seller.id}`}>Voir la boutique</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

