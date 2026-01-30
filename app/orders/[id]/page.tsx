import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, MapPin } from "lucide-react"

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (name, images, slug),
        vendors (store_name)
      )
    `)
    .eq("id", id)
    .eq("customer_id", user.id)
    .single()

  if (!order) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      refunded: "bg-gray-100 text-gray-700",
    }
    return statusColors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
              <p className="text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <Badge className={`ml-auto ${getStatusBadge(order.status)}`}>{order.status}</Badge>
          </div>

          <div className="space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                    <Link href={`/products/${item.products?.slug}`}>
                      <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.products?.images?.[0] || `/placeholder.svg?height=80&width=80`}
                          alt={item.products?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/products/${item.products?.slug}`} className="font-medium hover:text-primary">
                        {item.products?.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">Sold by {item.vendors?.store_name}</p>
                      <p className="text-sm mt-1">
                        Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                      </p>
                      <Badge className={`mt-2 ${getStatusBadge(item.status)}`}>{item.status}</Badge>
                    </div>
                    <p className="font-bold">${item.total_price.toFixed(2)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{order.shipping_address.name}</p>
                  <p className="text-muted-foreground">{order.shipping_address.address}</p>
                  <p className="text-muted-foreground">
                    {order.shipping_address.city}, {order.shipping_address.postalCode}
                  </p>
                  <p className="text-muted-foreground">{order.shipping_address.country}</p>
                  {order.shipping_address.phone && (
                    <p className="text-muted-foreground mt-2">{order.shipping_address.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    ${order.order_items?.reduce((acc: number, item: any) => acc + item.total_price, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {order.total_amount -
                      order.order_items?.reduce((acc: number, item: any) => acc + item.total_price, 0) >
                    0
                      ? `$${(order.total_amount - order.order_items?.reduce((acc: number, item: any) => acc + item.total_price, 0)).toFixed(2)}`
                      : "Free"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
