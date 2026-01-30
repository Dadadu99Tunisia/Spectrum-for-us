import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { plan, userId } = await request.json()

    const supabase = await createClient()

    // Get user info
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Define subscription plans
    const plans: Record<string, { price: number; name: string }> = {
      basic: { price: 35, name: "Basic Plan" },
      premium: { price: 75, name: "Premium Plan" },
      enterprise: { price: 150, name: "Enterprise Plan" },
    }

    const selectedPlan = plans[plan]
    if (!selectedPlan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Spectrum For Us - ${selectedPlan.name}`,
              description: `Abonnement vendeur mensuel`,
            },
            unit_amount: selectedPlan.price * 100,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/vendor-subscription`,
      metadata: {
        userId: user.id,
        plan,
      },
      customer_email: user.email,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Vendor subscription error:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
