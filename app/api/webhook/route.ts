import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Version de démonstration qui ne nécessite pas Stripe
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors du traitement du webhook." }, { status: 400 })
  }
}
