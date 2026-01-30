import { NextResponse } from "next/server"
import { OrderService } from "@/lib/services/order-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // In a real application, you would verify the user is authorized to view this order
    const order = await OrderService.getOrderById(orderId)

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des détails de la commande." },
      { status: 500 },
    )
  }
}
