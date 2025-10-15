import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Produit ajouté aux favoris",
  })
}

export async function DELETE() {
  return NextResponse.json({
    success: true,
    message: "Produit retiré des favoris",
  })
}
