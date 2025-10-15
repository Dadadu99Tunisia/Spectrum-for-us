import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  // Version simplifiée pour le déploiement
  return NextResponse.json({
    id: params.id,
    storeName: "Boutique Exemple",
    description: "Description détaillée de la boutique exemple",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=800",
    verified: true,
    featured: true,
    rating: 4.5,
    reviewCount: 120,
    productCount: 45,
    location: "Paris",
    joinedDate: "2023-01-15",
    socialLinks: {
      instagram: "https://instagram.com/example",
      facebook: "https://facebook.com/example",
      website: "https://example.com",
    },
    products: Array.from({ length: 6 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `Produit exemple ${i + 1}`,
      description: `Description du produit exemple ${i + 1}`,
      price: 19.99 + i * 5,
      images: [
        {
          url: `/placeholder.svg?height=400&width=400&text=Produit+${i + 1}`,
          alt: `Image produit exemple ${i + 1}`,
        },
      ],
    })),
  })
}
