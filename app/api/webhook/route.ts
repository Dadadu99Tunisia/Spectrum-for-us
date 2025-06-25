import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import { headers } from "next/headers"

// This would be a real function in your application
async function processOrder(session: any) {
  const orderId = session.metadata.orderId
  const customerEmail = session.customer_details?.email
  const amount = session.amount_total / 100 // Convert from cents to euros

  console.log(`Processing order ${orderId} for ${customerEmail} with amount ${amount}€`)

  // In a real application, you would:
  // 1. Save the order to your database
  // 2. Update inventory
  // 3. Send confirmation email
  // 4. Update seller balances

  // Example of sending an email (mock implementation)
  await sendOrderConfirmationEmail(customerEmail, orderId, amount)

  return true
}

// Mock email sending function
async function sendOrderConfirmationEmail(email: string, orderId: string, amount: number) {
  console.log(`Sending confirmation email to ${email} for order ${orderId} with amount ${amount}€`)

  // In a real application, you would use a service like SendGrid, Mailgun, etc.
  // Example with SendGrid would be:
  // await sendgrid.send({
  //   to: email,
  //   from: 'your-store@example.com',
  //   subject: `Order Confirmation #${orderId}`,
  //   text: `Thank you for your order! Your order #${orderId} for ${amount}€ has been confirmed.`,
  //   html: `<p>Thank you for your order!</p><p>Your order <strong>#${orderId}</strong> for <strong>${amount}€</strong> has been confirmed.</p>`,
  // });

  return true
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") as string

  let event

  try {
    // Verify the webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.warn("Webhook secret not configured. Skipping signature verification.")
      // For development, parse the event without verification
      event = JSON.parse(body)
    } else {
      // For production, verify the signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object

        // Process the order
        await processOrder(session)

        console.log(`Payment succeeded for order ${session.metadata.orderId}`)
        break

      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object
        console.log(`Payment failed for intent ${paymentIntent.id}`)

        // You might want to notify the customer or update your database
        break

      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors du traitement du webhook." }, { status: 400 })
  }
}
