import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  // Version simplifiée pour le déploiement
  return NextResponse.json({
    id: params.id,
    orderNumber: `ORD-${1000 + Number.parseInt(params.id.split("-")[1])}`,
    date: new Date(Date.now() - 86400000).toISOString(),
    status: "processing",
    total: 79.98,
    subtotal: 69.99,
    shipping: 9.99,
    tax: 0,
    shippingAddress: {
      name: "Client Exemple",
      address: "123 Rue Exemple",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    },
    paymentMethod: "Carte bancaire",
    items: Array.from({ length: 2 }, (_, i) => ({
      id: `item-${params.id}-${i}`,
      quantity: i + 1,
      product: {
        id: `product-${i + 1}`,
        name: `Produit exemple ${i + 1}`,
        price: 19.99 + i * 30,
        images: [
          {
            url: `/placeholder.svg?height=100&width=100&text=Produit+${i + 1}`,
            alt: `Image produit exemple ${i + 1}`,
          },
        ],
        seller: {
          id: "seller-1",
          storeName: "Boutique Exemple",
        },
      },
    })),
  })
}
