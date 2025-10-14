import { NextResponse } from "next/server"

export async function GET() {
  // Version simplifiée pour le déploiement
  const mockSellers = Array.from({ length: 8 }, (_, i) => ({
    id: `seller-${i + 1}`,
    storeName: `Boutique Exemple ${i + 1}`,
    description: `Description de la boutique exemple ${i + 1}`,
    logo: `/placeholder.svg?height=100&width=100&text=Logo+${i + 1}`,
    coverImage: `/placeholder.svg?height=300&width=800&text=Couverture+${i + 1}`,
    verified: i % 3 === 0,
    featured: i % 4 === 0,
    rating: 3.5 + (i % 2),
    reviewCount: 50 + i * 10,
    productCount: 20 + i * 5,
    location: i % 2 === 0 ? "Paris" : "Lyon",
  }))

  return NextResponse.json({
    sellers: mockSellers,
    total: mockSellers.length,
    page: 1,
    pageSize: 8,
    totalPages: 1,
  })
}

