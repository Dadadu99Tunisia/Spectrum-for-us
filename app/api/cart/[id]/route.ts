import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

// PUT /api/cart/[id] - Mettre à jour la quantité d'un élément du panier
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Vérifier l'authentification
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Vous devez être connecté pour modifier votre panier" }, { status: 401 })
    }

    // Récupérer l'élément du panier
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Élément du panier non trouvé" }, { status: 404 })
    }

    // Vérifier si l'élément appartient à l'utilisateur
    if (cartItem.userId !== session.user.id) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à modifier cet élément" }, { status: 403 })
    }

    // Récupérer les données
    const data = await request.json()
    const { quantity } = data

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantité invalide" }, { status: 400 })
    }

    // Mettre à jour la quantité
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du panier:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la mise à jour du panier" }, { status: 500 })
  }
}

// DELETE /api/cart/[id] - Supprimer un élément du panier
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Vérifier l'authentification
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Vous devez être connecté pour modifier votre panier" }, { status: 401 })
    }

    // Récupérer l'élément du panier
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Élément du panier non trouvé" }, { status: 404 })
    }

    // Vérifier si l'élément appartient à l'utilisateur
    if (cartItem.userId !== session.user.id) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à modifier cet élément" }, { status: 403 })
    }

    // Supprimer l'élément
    await prisma.cartItem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'élément du panier:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression de l'élément du panier" },
      { status: 500 },
    )
  }
}
