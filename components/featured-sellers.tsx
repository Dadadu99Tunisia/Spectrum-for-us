import { ModernSellerCard } from "./modern-seller-card"

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
        <ModernSellerCard key={seller.id} seller={seller} />
      ))}
    </div>
  )
}

