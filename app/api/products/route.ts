import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backendspectrumforus.vercel.app"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    // Construire l'URL de l'API backend
    const backendUrl = new URL("/api/products", API_BASE_URL)
    if (category) backendUrl.searchParams.set("category", category)
    if (search) backendUrl.searchParams.set("search", search)
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
      data: data.products || data,
      message: "Produits récupérés avec succès",
    })
  } catch (error) {
    console.error("Error fetching products:", error)

    // Fallback avec des données mockées
    const mockProducts = [
      {
        id: "1",
        name: "T-shirt Inclusif Arc-en-ciel",
        description: "T-shirt confortable avec design arc-en-ciel inclusif",
        price: 29.99,
        images: ["/placeholder.svg?height=300&width=300&text=T-shirt+Inclusif"],
        category: "mode",
        seller: {
          id: "1",
          name: "Atelier Pride",
          avatar: "/placeholder.svg?height=100&width=100&text=Seller",
          verified: true,
          rating: 4.8,
        },
        rating: 4.7,
        reviews: 156,
        inStock: true,
        tags: ["LGBTQ+", "Inclusif", "Mode"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Accessoire Diversité",
        description: "Accessoire unique célébrant la diversité",
        price: 45.5,
        images: ["/placeholder.svg?height=300&width=300&text=Accessoire"],
        category: "accessoires",
        seller: {
          id: "2",
          name: "Créations Diverses",
          avatar: "/placeholder.svg?height=100&width=100&text=Seller2",
          verified: true,
          rating: 4.9,
        },
        rating: 4.8,
        reviews: 89,
        inStock: true,
        tags: ["Diversité", "Artisanal", "Unique"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockProducts,
      message: "Données de démonstration (backend indisponible)",
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Appeler l'API backend
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.product || data,
      message: "Produit créé avec succès",
    })
  } catch (error) {
    console.error("Error creating product:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création du produit",
      },
      { status: 500 },
    )
  }
}
