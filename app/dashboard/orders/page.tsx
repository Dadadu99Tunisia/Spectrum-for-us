import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderStatusUpdate } from "@/components/dashboard/order-status-update"
import { Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: vendor } = await supabase.from("vendors").select("id").eq("user_id", user!.id).single()

  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      *,
      products (name, images),
      orders (
        id,
        customer_id,
        shipping_address,
        created_at,
        profiles:customer_id (full_name, email)
      )
    `)
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false })

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and fulfill customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>{orderItems?.length || 0} total order items</CardDescription>
        </CardHeader>
        <CardContent>
          {orderItems && orderItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">#{item.order_id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.orders?.profiles?.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{item.orders?.profiles?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-muted overflow-hidden">
                          <img
                            src={item.products?.images?.[0] || `/placeholder.svg?height=32&width=32`}
                            alt={item.products?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{item.products?.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${item.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <OrderStatusUpdate itemId={item.id} currentStatus={item.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground">When customers order your products, they&apos;ll appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
