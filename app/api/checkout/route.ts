import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Version de démonstration qui ne nécessite pas Stripe
    return NextResponse.json({
      sessionId: "demo_session_123",
      url: "/panier?demo=true",
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création de la session de paiement." },
      { status: 500 },
    )
  }
}
