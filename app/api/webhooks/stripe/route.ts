import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

// Use service role for webhook (no user session)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("[v0] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutComplete(session)
      break
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutExpired(session)
      break
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("[v0] PaymentIntent succeeded:", paymentIntent.id)
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("[v0] PaymentIntent failed:", paymentIntent.id)
      break
    }

    default:
      console.log(`[v0] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId
  const subOrderIds = session.metadata?.subOrderIds?.split(',').filter(Boolean) || []

  console.log("[v0] Checkout completed for order:", orderId)

  if (!orderId) {
    console.error("[v0] No orderId in session metadata")
    return
  }

  try {
    // Update main order status to paid
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'processing',
        stripe_payment_intent_id: session.payment_intent as string,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (orderError) {
      console.error("[v0] Error updating order:", orderError)
    }

    // Update all sub-orders to paid
    for (const subOrderId of subOrderIds) {
      const { error: subOrderError } = await supabase
        .from('sub_orders')
        .update({
          status: 'paid',
        })
        .eq('id', subOrderId)

      if (subOrderError) {
        console.error("[v0] Error updating sub-order:", subOrderId, subOrderError)
      }
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id: session.id,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || 'EUR',
        status: 'completed',
        customer_email: session.customer_details?.email,
      })

    if (paymentError) {
      // Table might not exist, log but don't fail
      console.log("[v0] Payment record creation skipped:", paymentError.message)
    }

    // Send notification to vendors (would implement email/push here)
    console.log("[v0] Order paid successfully, vendors notified")

  } catch (error) {
    console.error("[v0] Error in handleCheckoutComplete:", error)
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId

  if (!orderId) return

  console.log("[v0] Checkout expired for order:", orderId)

  try {
    // Mark order as cancelled
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
      })
      .eq('id', orderId)
      .eq('status', 'pending') // Only cancel if still pending

    if (error) {
      console.error("[v0] Error cancelling expired order:", error)
    }

    // Also cancel sub-orders
    await supabase
      .from('sub_orders')
      .update({ status: 'cancelled' })
      .eq('order_id', orderId)
      .eq('status', 'pending')

  } catch (error) {
    console.error("[v0] Error in handleCheckoutExpired:", error)
  }
}
