import { Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Store, MapPin, Calendar, MessageCircle } from "lucide-react"
import ProductGrid from "@/components/product-grid"
import { Skeleton } from "@/components/ui/skeleton"

export default function SellerPage({ params }: { params: { id: string } }) {
  // Dans une application réelle, vous récupéreriez les données du vendeur à partir de l'API
  const seller = {
    id: params.id,
    name: "QueerApparel",
    description:
      "Vêtements et accessoires inclusifs pour toutes les identités. Notre mission est de créer des vêtements qui permettent à chacun d'exprimer sa véritable identité, au-delà des normes de genre traditionnelles.",
    image: "/placeholder.svg?height=400&width=400",
    coverImage: "/placeholder.svg?height=600&width=1200",
    rating: 4.8,
    reviewCount: 124,
    productCount: 45,
    category: "Vêtements",
    location: "Paris, France",
    joinDate: "Janvier 2022",
    verified: true,
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Bannière du vendeur */}
      <div className="relative h-64 md:h-80 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={seller.coverImage || "/placeholder.svg"}
          alt={`Bannière de ${seller.name}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-lg overflow-hidden border-4 border-white">
            <Image src={seller.image || "/placeholder.svg"} alt={seller.name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{seller.name}</h1>
              {seller.verified && <Badge className="bg-blue-500">Vérifié</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                <span>{seller.rating}</span>
                <span className="ml-1 text-sm">({seller.reviewCount} avis)</span>
              </div>
              <div className="flex items-center">
                <Store className="h-4 w-4 mr-1" />
                <span>{seller.productCount} produits</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{seller.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Membre depuis {seller.joinDate}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button className="bg-white text-purple-600 hover:bg-white/90">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contacter
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Suivre
            </Button>
          </div>
        </div>
      </div>

      {/* Description du vendeur */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">À propos de {seller.name}</h2>
        <p className="text-muted-foreground">{seller.description}</p>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="products" className="mb-8">
        <TabsList>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="about">Informations</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-6">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Les avis seront bientôt disponibles.</p>
          </div>
        </TabsContent>
        <TabsContent value="about">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Informations supplémentaires à venir.</p>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

