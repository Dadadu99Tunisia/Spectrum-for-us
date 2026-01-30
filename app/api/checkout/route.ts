import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

const COMMISSION_RATE = 0.12 // 12%
const FIXED_FEE = 0.30 // 0.30€

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  vendorId?: string
  vendorName?: string
}

interface VendorGroup {
  vendorId: string
  vendorName: string
  subtotal: number
  shippingCost: number
  buyerNote?: string
}

interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode: string
  country: string
}

export async function POST(request: NextRequest) {
  try {
    const { items, shippingAddress, vendorGroups } = await request.json() as {
      items: CartItem[]
      shippingAddress: ShippingAddress
      vendorGroups?: VendorGroup[]
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Calculate totals
    const itemsByVendor = new Map<string, CartItem[]>()
    for (const item of items) {
      const vendorId = item.vendorId || 'spectrum-default'
      if (!itemsByVendor.has(vendorId)) {
        itemsByVendor.set(vendorId, [])
      }
      itemsByVendor.get(vendorId)!.push(item)
    }

    // Calculate total for Stripe
    let totalAmount = 0
    const vendorTotals: Array<{
      vendorId: string
      vendorName: string
      subtotal: number
      shippingCost: number
      commission: number
      payout: number
      buyerNote: string
    }> = []

    for (const [vendorId, vendorItems] of itemsByVendor) {
      const subtotal = vendorItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const vendorGroup = vendorGroups?.find(g => g.vendorId === vendorId)
      const shippingCost = vendorGroup?.shippingCost || 0
      const commission = subtotal * COMMISSION_RATE + FIXED_FEE
      const payout = subtotal + shippingCost - commission

      vendorTotals.push({
        vendorId,
        vendorName: vendorItems[0]?.vendorName || 'Vendeur',
        subtotal,
        shippingCost,
        commission,
        payout,
        buyerNote: vendorGroup?.buyerNote || '',
      })

      totalAmount += subtotal + shippingCost
    }

    // Create line items for Stripe (grouped by vendor for clarity)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    
    for (const item of items) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            metadata: {
              productId: item.id,
              vendorId: item.vendorId || 'spectrum-default',
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    }

    // Add shipping costs per vendor
    for (const vendor of vendorTotals) {
      if (vendor.shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: `Livraison - ${vendor.vendorName}`,
            },
            unit_amount: Math.round(vendor.shippingCost * 100),
          },
          quantity: 1,
        })
      }
    }

    // Create pending order in database BEFORE Stripe session
    let orderId: string | null = null
    const subOrderIds: string[] = []

    if (user) {
      // Create main order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: totalAmount,
          currency: 'EUR',
          status: 'pending',
          shipping_address: shippingAddress,
        })
        .select('id')
        .single()

      if (orderError) {
        console.error('[v0] Order creation error:', orderError)
      } else {
        orderId = orderData.id

        // Create sub-orders for each vendor
        for (const vendor of vendorTotals) {
          const vendorItems = itemsByVendor.get(vendor.vendorId) || []
          
          const { data: subOrderData, error: subOrderError } = await supabase
            .from('sub_orders')
            .insert({
              order_id: orderId,
              vendor_id: vendor.vendorId !== 'spectrum-default' ? vendor.vendorId : null,
              status: 'pending',
              subtotal: vendor.subtotal,
              shipping_cost: vendor.shippingCost,
              commission_rate: COMMISSION_RATE,
              commission_amount: vendor.commission,
              vendor_payout: vendor.payout,
              buyer_notes: vendor.buyerNote,
            })
            .select('id')
            .single()

          if (subOrderError) {
            console.error('[v0] Sub-order creation error:', subOrderError)
          } else if (subOrderData) {
            subOrderIds.push(subOrderData.id)

            // Create order items for this sub-order
            const orderItems = vendorItems.map(item => ({
              order_id: orderId,
              sub_order_id: subOrderData.id,
              product_id: item.id,
              vendor_id: vendor.vendorId !== 'spectrum-default' ? vendor.vendorId : null,
              quantity: item.quantity,
              unit_price: item.price,
              subtotal: item.price * item.quantity,
            }))

            const { error: itemsError } = await supabase
              .from('order_items')
              .insert(orderItems)

            if (itemsError) {
              console.error('[v0] Order items creation error:', itemsError)
            }
          }
        }
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      customer_email: shippingAddress.email,
      metadata: {
        orderId: orderId || '',
        userId: user?.id || "",
        subOrderIds: subOrderIds.join(','),
        shippingAddress: JSON.stringify(shippingAddress),
      },
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC", "DE", "ES", "IT", "PT", "NL"],
      },
    })

    // Update order with Stripe session ID
    if (orderId) {
      await supabase
        .from('orders')
        .update({ stripe_session_id: session.id })
        .eq('id', orderId)
    }

    return NextResponse.json({ 
      url: session.url,
      orderId,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("[v0] Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
