import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Package, Truck, CheckCircle, XCircle } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's orders with items
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      shipping_addresses (*),
      shipping_methods (*),
      order_items (
        *,
        products (*),
        services (*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />
      case "cancelled":
      case "refunded":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-orange-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      paid: "default",
      processing: "default",
      shipped: "default",
      delivered: "outline",
      cancelled: "destructive",
      refunded: "destructive",
    }
    return variants[status] || "default"
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente",
      paid: "Payée",
      processing: "En préparation",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
      refunded: "Remboursée",
    }
    return labels[status] || status
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-balance mb-8">Mes commandes</h1>

      {!orders || orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-4">Vous n'avez pas encore de commandes</p>
            <Button asChild>
              <Link href="/products">Découvrir nos produits</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <CardTitle className="text-lg">Commande #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadge(order.status)}>{getStatusLabel(order.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.order_items?.map((item: any) => {
                    const product = item.products || item.services
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img
                            src={product?.image_url || "/placeholder.svg"}
                            alt={product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product?.name}</p>
                          <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                        </div>
                        <p className="font-medium">€{item.subtotal}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Shipping Info */}
                {order.shipping_addresses && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Adresse de livraison</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_addresses.full_name}
                      <br />
                      {order.shipping_addresses.address_line1}
                      <br />
                      {order.shipping_addresses.address_line2 && (
                        <>
                          {order.shipping_addresses.address_line2}
                          <br />
                        </>
                      )}
                      {order.shipping_addresses.postal_code} {order.shipping_addresses.city}
                      <br />
                      {order.shipping_addresses.country}
                    </p>
                  </div>
                )}

                {/* Tracking */}
                {order.tracking_number && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-1">Numéro de suivi</p>
                    <p className="text-sm font-mono text-muted-foreground">{order.tracking_number}</p>
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">€{order.total_price}</span>
                </div>

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={`/orders/${order.id}`}>Voir les détails</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
