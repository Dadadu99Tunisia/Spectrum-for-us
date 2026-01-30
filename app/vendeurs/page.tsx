import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Store, ArrowRight } from "lucide-react"

// Données fictives pour les vendeur·euse·s
const sellers = [
  {
    id: "seller1",
    name: "QueerApparel",
    image: "/placeholder.svg?height=300&width=300",
    coverImage: "/placeholder.svg?height=600&width=1200",
    description: "Vêtements et accessoires inclusifs pour toutes les identités.",
    rating: 4.8,
    reviewCount: 124,
    location: "Paris, France",
    category: "Vêtements",
    featured: true,
    verified: true,
  },
  {
    id: "seller2",
    name: "PrideJewelry",
    image: "/placeholder.svg?height=300&width=300",
    coverImage: "/placeholder.svg?height=600&width=1200",
    description: "Bijoux artisanaux célébrant la diversité et l'expression de soi.",
    rating: 4.9,
    reviewCount: 87,
    location: "Lyon, France",
    category: "Bijoux",
    featured: true,
    verified: true,
  },
  {
    id: "seller3",
    name: "QueerArtCollective",
    image: "/placeholder.svg?height=300&width=300",
    coverImage: "/placeholder.svg?height=600&width=1200",
    description: "Collectif d'artistes queer proposant des œuvres originales et engagées.",
    rating: 4.7,
    reviewCount: 56,
    location: "Marseille, France",
    category: "Art",
    featured: true,
    verified: false,
  },
  {
    id: "seller4",
    name: "TransBeauty",
    image: "/placeholder.svg?height=300&width=300",
    coverImage: "/placeholder.svg?height=600&width=1200",
    description: "Produits de beauté et de soins adaptés aux besoins spécifiques des personnes trans.",
    rating: 4.6,
    reviewCount: 42,
    location: "Bordeaux, France",
    category: "Beauté",
    featured: false,
    verified: true,
  },
  {
    id: "seller5",
    name: "NonBinaryDesign",
    image: "/placeholder.svg?height=300&width=300",
    coverImage: "/placeholder.svg?height=600&width=1200",
    description: "Objets de décoration et accessoires pour la maison au design inclusif et non genré.",
    rating: 4.5,
    reviewCount: 38,
    location: "Lille, France",
    category: "Décoration",
    featured: false,
    verified: true,
  },
  {
    id: "seller6",
    name: "QueerLiterature",
    image: "/placeholder.svg?height=300&width=300",
    coverImage: "/placeholder.svg?height=600&width=1200",
    description: "Livres, zines et publications sur les thématiques LGBTQIA+.",
    rating: 4.9,
    reviewCount: 29,
    location: "Toulouse, France",
    category: "Livres",
    featured: false,
    verified: false,
  },
]

export default function VendeursPage() {
  const featuredSellers = sellers.filter((seller) => seller.featured)
  const otherSellers = sellers.filter((seller) => !seller.featured)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vendeur·euse·s</h1>
          <p className="text-muted-foreground">
            Découvrez les créateur·rice·s et entrepreneur·e·s qui font vivre notre marketplace.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Link href="/devenir-vendeur">
            <Store className="h-4 w-4 mr-2" />
            Devenir Vendeur·euse
          </Link>
        </Button>
      </div>

      {/* Vendeur·euse·s en vedette */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Vendeur·euse·s en vedette</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSellers.map((seller) => (
            <Card key={seller.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <Link href={`/vendeur/${seller.id}`} className="block">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={seller.coverImage || "/placeholder.svg"}
                    alt={`Bannière de ${seller.name}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden border-2 border-white">
                      <Image src={seller.image || "/placeholder.svg"} alt={seller.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{seller.name}</h3>
                        {seller.verified && <Badge className="bg-blue-500 text-white">Vérifié·e</Badge>}
                      </div>
                      <div className="flex items-center text-white/90 text-sm">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                        <span>{seller.rating}</span>
                        <span className="mx-1">•</span>
                        <span>{seller.reviewCount} avis</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{seller.location}</span>
                    <span className="mx-1">•</span>
                    <span>{seller.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{seller.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Tou·te·s les vendeur·euse·s */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Tou·te·s les vendeur·euse·s</h2>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1 rounded-md border border-input bg-background text-sm">
              <option value="all">Toutes les catégories</option>
              <option value="vetements">Vêtements</option>
              <option value="bijoux">Bijoux</option>
              <option value="art">Art</option>
              <option value="beaute">Beauté</option>
              <option value="decoration">Décoration</option>
              <option value="livres">Livres</option>
            </select>
            <select className="px-3 py-1 rounded-md border border-input bg-background text-sm">
              <option value="rating">Meilleures évaluations</option>
              <option value="recent">Plus récent·e·s</option>
              <option value="name">Ordre alphabétique</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherSellers.map((seller) => (
            <Card key={seller.id} className="hover:shadow-md transition-all duration-300">
              <Link href={`/vendeur/${seller.id}`} className="block">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={seller.image || "/placeholder.svg"} alt={seller.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{seller.name}</h3>
                        {seller.verified && <Badge className="bg-blue-500 text-white">Vérifié·e</Badge>}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                        <span>{seller.rating}</span>
                        <span className="mx-1">•</span>
                        <span>{seller.reviewCount} avis</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{seller.location}</span>
                        <span className="mx-1">•</span>
                        <span>{seller.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{seller.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" className="group">
            Voir plus de vendeur·euse·s
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </main>
  )
}
