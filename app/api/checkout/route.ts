import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { items, shippingAddress, shippingMethod, shippingCost } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const lineItems = [
      ...items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      // Add shipping as a line item
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Livraison - ${shippingMethod}`,
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      },
    ]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: shippingAddress.email,
      metadata: {
        userId: user?.id || "",
        shippingMethod,
        shippingAddress: JSON.stringify(shippingAddress),
      },
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC", "DE", "ES", "IT", "PT", "NL"],
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
