import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
    const { data: cartItem, error: fetchError } = await supabase.from("cart_items").select("*").eq("id", id).single()

    if (fetchError || !cartItem) {
      return NextResponse.json({ error: "Élément du panier non trouvé" }, { status: 404 })
    }

    // Vérifier si l'élément appartient à l'utilisateur
    if (cartItem.user_id !== session.user.id) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à modifier cet élément" }, { status: 403 })
    }

    // Récupérer les données
    const data = await request.json()
    const { quantity } = data

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantité invalide" }, { status: 400 })
    }

    // Mettre à jour la quantité
    const { data: updatedItem, error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

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
    const { data: cartItem, error: fetchError } = await supabase.from("cart_items").select("*").eq("id", id).single()

    if (fetchError || !cartItem) {
      return NextResponse.json({ error: "Élément du panier non trouvé" }, { status: 404 })
    }

    // Vérifier si l'élément appartient à l'utilisateur
    if (cartItem.user_id !== session.user.id) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à modifier cet élément" }, { status: 403 })
    }

    // Supprimer l'élément
    const { error: deleteError } = await supabase.from("cart_items").delete().eq("id", id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'élément du panier:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression de l'élément du panier" },
      { status: 500 },
    )
  }
}
