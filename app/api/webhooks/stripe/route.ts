import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const orderId = session.metadata?.orderId

      if (orderId) {
        // Update order status to processing
        await supabase
          .from("orders")
          .update({
            status: "processing",
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq("id", orderId)

        // Update all order items to processing
        await supabase.from("order_items").update({ status: "processing" }).eq("order_id", orderId)
      }
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object
      // Handle failed payment - could send notification to customer
      console.log("Payment failed:", paymentIntent.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
