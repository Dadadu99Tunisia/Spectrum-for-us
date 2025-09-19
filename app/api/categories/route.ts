import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backendspectrumforus.vercel.app"

export async function GET(request: NextRequest) {
  try {
    // Appeler l'API backend
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
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
      data: data.categories || data,
      message: "Catégories récupérées avec succès",
    })
  } catch (error) {
    console.error("Error fetching categories:", error)

    // Fallback avec des données mockées
    const mockCategories = [
      {
        id: "1",
        name: "Mode Inclusive",
        slug: "mode-inclusive",
        description: "Vêtements et accessoires pour tous les corps et toutes les identités",
        image: "/placeholder.svg?height=200&width=200&text=Mode",
        icon: "Shirt",
        productCount: 156,
      },
      {
        id: "2",
        name: "Art & Culture",
        slug: "art-culture",
        description: "Œuvres d'art et objets culturels diversifiés",
        image: "/placeholder.svg?height=200&width=200&text=Art",
        icon: "Palette",
        productCount: 89,
      },
      {
        id: "3",
        name: "Bien-être",
        slug: "bien-etre",
        description: "Produits de bien-être inclusifs et accessibles",
        image: "/placeholder.svg?height=200&width=200&text=Wellness",
        icon: "Heart",
        productCount: 67,
      },
      {
        id: "4",
        name: "Maison & Déco",
        slug: "maison-deco",
        description: "Décoration et objets pour un foyer inclusif",
        image: "/placeholder.svg?height=200&width=200&text=Home",
        icon: "Home",
        productCount: 123,
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockCategories,
      message: "Données de démonstration (backend indisponible)",
    })
  }
}
