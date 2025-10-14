import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseClient"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Please set up Supabase environment variables." },
        { status: 503 },
      )
    }

    const id = params.id
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Vous devez être connecté pour modifier votre panier" }, { status: 401 })
    }

    const { data: cartItem, error: fetchError } = await supabaseAdmin
      .from("cart_items")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !cartItem) {
      return NextResponse.json({ error: "Élément du panier non trouvé" }, { status: 404 })
    }

    if (cartItem.user_id !== session.user.id) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à modifier cet élément" }, { status: 403 })
    }

    const data = await request.json()
    const { quantity } = data

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantité invalide" }, { status: 400 })
    }

    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from("cart_items")
      .update({ quantity })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating cart item:", updateError)
      return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error in PUT /api/cart/[id]:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la mise à jour du panier" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Please set up Supabase environment variables." },
        { status: 503 },
      )
    }

    const id = params.id
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Vous devez être connecté pour modifier votre panier" }, { status: 401 })
    }

    const { data: cartItem, error: fetchError } = await supabaseAdmin
      .from("cart_items")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !cartItem) {
      return NextResponse.json({ error: "Élément du panier non trouvé" }, { status: 404 })
    }

    if (cartItem.user_id !== session.user.id) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à modifier cet élément" }, { status: 403 })
    }

    const { error: deleteError } = await supabaseAdmin.from("cart_items").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting cart item:", deleteError)
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/cart/[id]:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression de l'élément du panier" },
      { status: 500 },
    )
  }
}
