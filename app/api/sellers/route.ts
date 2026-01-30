import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backendspectrumforus.vercel.app"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Construire l'URL de l'API backend
    const backendUrl = new URL("/api/sellers", API_BASE_URL)
    if (limit) backendUrl.searchParams.set("limit", limit)
    if (offset) backendUrl.searchParams.set("offset", offset)

    // Appeler l'API backend
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.sellers || data,
      message: "Vendeurs récupérés avec succès",
    })
  } catch (error) {
    console.error("Error fetching sellers:", error)

    // Fallback avec des données mockées
    const mockSellers = [
      {
        id: "1",
        name: "Atelier Inclusif",
        avatar: "/placeholder.svg?height=100&width=100&text=Seller1",
        rating: 4.9,
        verified: true,
        description: "Créations artisanales inclusives et durables pour tous",
        location: "Paris, France",
        joinedAt: "2023-01-15",
        productCount: 45,
        totalSales: 1250,
      },
      {
        id: "2",
        name: "Pride Creations",
        avatar: "/placeholder.svg?height=100&width=100&text=Seller2",
        rating: 4.8,
        verified: true,
        description: "Produits LGBTQ+ authentiques et fiers",
        location: "Lyon, France",
        joinedAt: "2023-03-22",
        productCount: 32,
        totalSales: 890,
      },
      {
        id: "3",
        name: "Diversité & Style",
        avatar: "/placeholder.svg?height=100&width=100&text=Seller3",
        rating: 4.7,
        verified: true,
        description: "Mode accessible et inclusive pour tous les corps",
        location: "Marseille, France",
        joinedAt: "2023-02-10",
        productCount: 67,
        totalSales: 1580,
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockSellers,
      message: "Données de démonstration (backend indisponible)",
    })
  }
}
