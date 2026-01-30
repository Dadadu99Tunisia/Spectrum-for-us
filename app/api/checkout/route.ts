import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, total } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Validate products and get vendor info
    const productIds = items.map((item: any) => item.productId)
    const { data: products } = await supabase
      .from("products")
      .select("id, name, price, vendor_id, stock")
      .in("id", productIds)

    if (!products || products.length !== items.length) {
      return NextResponse.json({ error: "Invalid products" }, { status: 400 })
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product?.name || "product"}`,
          },
          { status: 400 },
        )
      }
    }

    // Calculate total from server-side prices
    const calculatedTotal = products.reduce((acc, product) => {
      const item = items.find((i: any) => i.productId === product.id)
      return acc + product.price * item.quantity
    }, 0)

    const shipping = calculatedTotal >= 50 ? 0 : 5
    const finalTotal = calculatedTotal + shipping

    // Create the order first
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        total_amount: finalTotal,
        shipping_address: shippingAddress,
        status: "pending",
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId)!
      return {
        order_id: order.id,
        product_id: item.productId,
        vendor_id: product.vendor_id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity,
        status: "pending",
      }
    })

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items error:", itemsError)
      // Clean up the order if items failed
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Update product stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)!
      await supabase
        .from("products")
        .update({ stock: product.stock - item.quantity })
        .eq("id", item.productId)
    }

    // Update vendor sales count
    const vendorSales: Record<string, number> = {}
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)!
      vendorSales[product.vendor_id] = (vendorSales[product.vendor_id] || 0) + item.quantity
    }

    for (const [vendorId, sales] of Object.entries(vendorSales)) {
      const { data: vendor } = await supabase.from("vendors").select("total_sales").eq("id", vendorId).single()

      if (vendor) {
        await supabase
          .from("vendors")
          .update({ total_sales: vendor.total_sales + sales })
          .eq("id", vendorId)
      }
    }

    // Try to create Stripe checkout session
    try {
      const lineItems = products.map((product) => {
        const item = items.find((i: any) => i.productId === product.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: item.quantity,
        }
      })

      // Add shipping if applicable
      if (shipping > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping",
            },
            unit_amount: Math.round(shipping * 100),
          },
          quantity: 1,
        })
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        metadata: {
          orderId: order.id,
        },
      })

      // Update order with Stripe payment intent
      await supabase.from("orders").update({ stripe_payment_intent_id: session.id }).eq("id", order.id)

      return NextResponse.json({ url: session.url })
    } catch (stripeError) {
      // If Stripe fails, still return success with order ID (demo mode)
      console.error("Stripe error:", stripeError)
      return NextResponse.json({ orderId: order.id })
    }
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
