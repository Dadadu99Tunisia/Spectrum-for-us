import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  vendorId?: string
  vendorName?: string
}

interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode: string
  country: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress } = body as {
      items: CartItem[]
      shippingAddress: ShippingAddress
    }

    console.log("[v0] Checkout request received:", { itemCount: items?.length, email: shippingAddress?.email })

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 })
    }

    if (!shippingAddress || !shippingAddress.email) {
      return NextResponse.json({ error: "Adresse de livraison requise" }, { status: 400 })
    }

    // Calculate total for validation
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = 5.99 // Fixed shipping for now
    const total = subtotal + shippingCost

    console.log("[v0] Order total:", { subtotal, shippingCost, total })

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }))

    // Add shipping
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Frais de livraison",
        },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    })

    // Get base URL - handle both local and production
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000"

    console.log("[v0] Using base URL:", baseUrl)

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: shippingAddress.email,
      metadata: {
        items: JSON.stringify(items.map(i => ({ id: i.id, qty: i.quantity }))),
        shippingName: shippingAddress.fullName,
        shippingCity: shippingAddress.city,
      },
    })

    console.log("[v0] Stripe session created:", session.id)

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    return NextResponse.json({ error: `Erreur lors du checkout: ${errorMessage}` }, { status: 500 })
  }
}
