import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Truck } from "lucide-react"

export default async function VendorOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch orders containing vendor's products
  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      *,
      orders (*,
        profiles (name, email),
        shipping_addresses (*),
        shipping_methods (*)
      ),
      products!inner (*)
    `)
    .eq("products.vendor_id", user.id)
    .order("created_at", { ascending: false })

  // Group by order
  const ordersByOrderId = orderItems?.reduce((acc: any, item: any) => {
    const orderId = item.orders.id
    if (!acc[orderId]) {
      acc[orderId] = {
        ...item.orders,
        items: [],
      }
    }
    acc[orderId].items.push(item)
    return acc
  }, {})

  const orders = Object.values(ordersByOrderId || {})

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-balance mb-8">Gestion des commandes</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Aucune commande pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Commande #{order.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Client: {order.profiles?.name || order.profiles?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Badge>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 bg-background rounded overflow-hidden">
                        <img
                          src={item.products?.image_url || "/placeholder.svg"}
                          alt={item.products?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.products?.name}</p>
                        <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                      </div>
                      <p className="font-medium">€{item.subtotal}</p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {order.shipping_addresses && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Adresse de livraison
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_addresses.full_name}
                      <br />
                      {order.shipping_addresses.address_line1}
                      <br />
                      {order.shipping_addresses.postal_code} {order.shipping_addresses.city}
                    </p>
                  </div>
                )}

                {/* Tracking Number Form */}
                {order.status === "paid" || order.status === "processing" ? (
                  <form className="border-t pt-4 space-y-3">
                    <div>
                      <Label htmlFor={`tracking-${order.id}`}>Numéro de suivi</Label>
                      <Input
                        id={`tracking-${order.id}`}
                        placeholder="Ex: 1Z999AA10123456784"
                        defaultValue={order.tracking_number || ""}
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full">
                      Marquer comme expédiée
                    </Button>
                  </form>
                ) : order.tracking_number ? (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-1">Numéro de suivi</p>
                    <p className="text-sm font-mono text-muted-foreground">{order.tracking_number}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
