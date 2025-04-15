import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, success_url, cancel_url } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Aucun article dans le panier." }, { status: 400 })
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.description || "",
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        success_url || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/panier/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/panier`,
      metadata: {
        orderId: body.orderId || `order_${Date.now()}`,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création de la session de paiement." },
      { status: 500 },
    )
  }
}
