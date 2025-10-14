import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

// GET /api/favorites - Récupérer les favoris de l'utilisateur
export async function GET() {
  // Version simplifiée pour le déploiement
  const mockFavorites = Array.from({ length: 4 }, (_, i) => ({
    id: `favorite-${i + 1}`,
    product: {
      id: `product-${i + 1}`,
      name: `Produit favori ${i + 1}`,
      price: 19.99 + i * 5,
      images: [
        {
          url: `/placeholder.svg?height=400&width=400&text=Favori+${i + 1}`,
          alt: `Image produit favori ${i + 1}`,
        },
      ],
      seller: {
        id: "seller-1",
        storeName: "Boutique Exemple",
      },
    },
  }))

  return NextResponse.json({
    favorites: mockFavorites,
    total: mockFavorites.length,
  })
}

// POST /api/favorites - Ajouter un produit aux favoris
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour ajouter un produit aux favoris" },
        { status: 401 },
      )
    }

    // Récupérer les données
    const data = await request.json()
    const { productId } = data

    if (!productId) {
      return NextResponse.json({ error: "ID de produit manquant" }, { status: 400 })
    }

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Vérifier si le produit est déjà dans les favoris
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json({ error: "Ce produit est déjà dans vos favoris" }, { status: 400 })
    }

    // Ajouter aux favoris
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId,
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de l'ajout aux favoris" }, { status: 500 })
  }
}

