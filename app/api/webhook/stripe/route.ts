import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Get line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

        // Parse metadata
        const vendorIds = session.metadata?.vendorIds?.split(",") || []
        const shippingAddress = session.metadata?.shippingAddress ? JSON.parse(session.metadata.shippingAddress) : null

        // Create order in database
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent,
            customer_email: session.customer_email,
            customer_name: session.metadata?.customerName,
            total_amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency,
            status: "paid",
            shipping_address: shippingAddress,
            shipping_method: session.metadata?.shippingMethod,
          })
          .select()
          .single()

        if (orderError) {
          console.error("Error creating order:", orderError)
          break
        }

        // Create order items
        const orderItems = lineItems.data.map((item) => ({
          order_id: order.id,
          product_name: item.description,
          quantity: item.quantity,
          unit_price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          total_price: item.amount_total ? item.amount_total / 100 : 0,
        }))

        await supabase.from("order_items").insert(orderItems)

        // Update vendor balances (for multi-vendor payout)
        // This would be expanded in a full implementation
        for (const vendorId of vendorIds) {
          // Calculate vendor's share of the order
          // In a real implementation, you'd track which items belong to which vendor
          console.log(`Processing payment for vendor: ${vendorId}`)
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error("Payment failed:", paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
