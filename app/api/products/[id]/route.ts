import { type NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/api"

// GET /api/products/[id] - Récupérer un produit par son ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await api.getProduct(params.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error)
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
  }
}

// PUT /api/products/[id] - Mettre à jour un produit (réservé au vendeur du produit)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productData = await request.json()
    const data = await api.updateProduct(params.id, productData)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la mise à jour du produit" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Supprimer un produit (réservé au vendeur du produit)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await api.deleteProduct(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la suppression du produit" }, { status: 500 })
  }
}
