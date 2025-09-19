import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          await supabaseAdmin
            .from("orders")
            .update({
              status: "paid",
              stripe_payment_intent: paymentIntent.id,
            })
            .eq("id", orderId)

          await supabaseAdmin.from("payments").insert({
            order_id: orderId,
            amount_cents: paymentIntent.amount_received,
            stripe_charge_id: paymentIntent.latest_charge,
            status: "succeeded",
          })
        }
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const vendorId = subscription.metadata?.vendor_id

        if (vendorId) {
          await supabaseAdmin.from("vendor_subscriptions").upsert({
            vendor_id: vendorId,
            status: subscription.status,
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        await supabaseAdmin
          .from("vendor_subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler failed:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
