import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { items, shippingAddress, shippingMethodsByVendor } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vendorGroups = items.reduce((acc: any, item: any) => {
      if (!acc[item.vendor_id]) {
        acc[item.vendor_id] = {
          items: [],
          subtotal: 0,
          shippingCost: 0,
        }
      }
      acc[item.vendor_id].items.push(item)
      acc[item.vendor_id].subtotal += item.price * item.quantity
      acc[item.vendor_id].shippingCost = shippingMethodsByVendor[item.vendor_id]?.price || 0
      return acc
    }, {})

    // Create line items for Stripe (all vendors combined)
    const lineItems = []
    for (const vendorId in vendorGroups) {
      const group = vendorGroups[vendorId]

      // Add product items
      for (const item of group.items) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
              metadata: {
                vendor_id: vendorId,
              },
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })
      }

      // Add shipping for this vendor
      if (group.shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: `Livraison - ${shippingMethodsByVendor[vendorId]?.name || "Standard"}`,
              metadata: {
                vendor_id: vendorId,
                type: "shipping",
              },
            },
            unit_amount: Math.round(group.shippingCost * 100),
          },
          quantity: 1,
        })
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: shippingAddress.email,
      metadata: {
        userId: user.id,
        vendorGroups: JSON.stringify(vendorGroups),
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
