import { NextResponse } from "next/server"

export async function GET() {
  // Version simplifiée pour le déploiement
  const mockCartItems = Array.from({ length: 3 }, (_, i) => ({
    id: `cart-item-${i + 1}`,
    quantity: i + 1,
    product: {
      id: `product-${i + 1}`,
      name: `Produit exemple ${i + 1}`,
      price: 19.99 + i * 5,
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
  }))

  return NextResponse.json({
    items: mockCartItems,
    totalItems: mockCartItems.length,
    subtotal: mockCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    shipping: 5.99,
    total: mockCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 5.99,
  })
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Produit ajouté au panier",
  })
}

