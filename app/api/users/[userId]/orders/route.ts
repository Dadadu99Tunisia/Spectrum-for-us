import { type NextRequest, NextResponse } from "next/server"
import { getOrdersByUserId } from "@/lib/utils/data-utils"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const orders = getOrdersByUserId(params.userId)

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des commandes" },
      { status: 500 },
    )
  }
}

