import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

interface CheckoutItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  vendorId: string
}

interface ShippingAddress {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, shippingAddress, shippingMethod } = body as {
      items: CheckoutItem[]
      shippingAddress: ShippingAddress
      shippingMethod: string
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Aucun article dans le panier." }, { status: 400 })
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.productId,
            vendorId: item.vendorId,
          },
        },
        unit_amount: item.price, // Already in cents from frontend
      },
      quantity: item.quantity,
    }))

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (item.price / 100) * item.quantity, 0)

    // Add shipping cost
    let shippingCost = 0
    if (shippingMethod === "express") {
      shippingCost = 799 // 7.99€ in cents
    } else if (subtotal < 50) {
      shippingCost = 499 // 4.99€ in cents
    }

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: shippingMethod === "express" ? "Livraison express" : "Frais de livraison",
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      })
    }

    // Group items by vendor for metadata
    const vendorIds = [...new Set(items.map((item) => item.vendorId))]

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: shippingAddress?.email,
      metadata: {
        vendorIds: vendorIds.join(","),
        shippingMethod,
        customerName: `${shippingAddress?.firstName} ${shippingAddress?.lastName}`,
        shippingAddress: JSON.stringify(shippingAddress),
      },
      shipping_options:
        shippingCost === 0
          ? undefined
          : [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: {
                    amount: 0,
                    currency: "eur",
                  },
                  display_name: "Inclus dans le total",
                },
              },
            ],
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
