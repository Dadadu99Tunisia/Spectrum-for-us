import { NextResponse } from "next/server"
import { productsDB } from "@/lib/db-local"

export async function GET() {
  try {
    const products = await productsDB.getAll()

    return NextResponse.json({
      products,
      pagination: {
        page: 1,
        limit: 12,
        total: products.length,
        totalPages: 1,
        hasMore: false,
      },
    })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const product = await productsDB.create(data)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
