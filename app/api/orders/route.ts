import { NextResponse } from "next/server"

export async function GET() {
  // Version simplifiée pour le déploiement
  const mockOrders = Array.from({ length: 5 }, (_, i) => ({
    id: `order-${i + 1}`,
    orderNumber: `ORD-${1000 + i}`,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    status: ["completed", "processing", "shipped", "delivered", "cancelled"][i % 5],
    total: 49.99 + i * 10,
    items: Array.from({ length: 2 }, (_, j) => ({
      id: `item-${i}-${j}`,
      quantity: j + 1,
      product: {
        id: `product-${j + 1}`,
        name: `Produit exemple ${j + 1}`,
        price: 19.99 + j * 5,
        images: [
          {
            url: `/placeholder.svg?height=100&width=100&text=Produit+${j + 1}`,
            alt: `Image produit exemple ${j + 1}`,
          },
        ],
      },
    })),
  }))

  return NextResponse.json({
    orders: mockOrders,
    total: mockOrders.length,
  })
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Commande créée avec succès",
    order: {
      id: "new-order",
      orderNumber: "ORD-1234",
      date: new Date().toISOString(),
      status: "processing",
      total: 79.98,
    },
  })
}
