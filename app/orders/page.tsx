"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { 
  Package, Truck, CheckCircle, XCircle, Store, 
  MessageSquare, ExternalLink, Clock, MapPin, AlertCircle, Loader2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Order {
  id: string
  total_price: number
  currency: string
  status: string
  shipping_address: any
  created_at: string
  sub_orders: SubOrder[]
}

interface SubOrder {
  id: string
  status: string
  subtotal: number
  shipping_cost: number
  tracking_number: string | null
  tracking_url: string | null
  carrier: string | null
  shipped_at: string | null
  delivered_at: string | null
  vendor: {
    id: string
    name: string
    avatar_url: string | null
  } | null
  items: Array<{
    id: string
    quantity: number
    unit_price: number
    subtotal: number
    product: {
      id: string
      name: string
      image_url: string | null
    } | null
  }>
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "shipped":
    case "in_transit":
      return <Truck className="h-5 w-5 text-blue-600" />
    case "cancelled":
    case "refunded":
      return <XCircle className="h-5 w-5 text-red-600" />
    case "disputed":
      return <AlertCircle className="h-5 w-5 text-orange-600" />
    default:
      return <Package className="h-5 w-5 text-orange-600" />
  }
}

const getStatusBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    paid: "default",
    processing: "default",
    shipped: "default",
    in_transit: "default",
    delivered: "outline",
    cancelled: "destructive",
    refunded: "destructive",
    disputed: "destructive",
  }
  return variants[status] || "default"
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "En attente",
    paid: "Payee",
    processing: "En preparation",
    shipped: "Expediee",
    in_transit: "En transit",
    delivered: "Livree",
    cancelled: "Annulee",
    refunded: "Remboursee",
    disputed: "Litige",
  }
  return labels[status] || status
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setOrders([])
        return
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (ordersError || !ordersData) {
        console.error('[v0] Error fetching orders:', ordersError)
        setOrders([])
        return
      }

      if (ordersData.length === 0) {
        setOrders([])
        return
      }

      // Fetch sub_orders for all orders
      const orderIds = ordersData.map(o => o.id)
      const { data: subOrdersData } = await supabase
        .from('sub_orders')
        .select('*')
        .in('order_id', orderIds)

      // Fetch sub_order_items for all sub_orders
      const subOrderIds = subOrdersData?.map(so => so.id) || []
      const { data: itemsData } = await supabase
        .from('sub_order_items')
        .select('*')
        .in('sub_order_id', subOrderIds)

      // Get unique vendor and product IDs
      const vendorIds = [...new Set(subOrdersData?.map(so => so.vendor_id).filter(Boolean) || [])]
      const productIds = [...new Set(itemsData?.map(i => i.product_id).filter(Boolean) || [])]

      // Fetch vendors
      let vendorMap: Record<string, any> = {}
      if (vendorIds.length > 0) {
        const { data: vendorsData } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', vendorIds)
        if (vendorsData) {
          vendorMap = vendorsData.reduce((acc, v) => ({ ...acc, [v.id]: v }), {})
        }
      }

      // Fetch products
      let productMap: Record<string, any> = {}
      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('id, name, image_url')
          .in('id', productIds)
        if (productsData) {
          productMap = productsData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
        }
      }

      // Assemble the data
      const ordersWithSubOrders = ordersData.map(order => {
        const subOrders = (subOrdersData || [])
          .filter(so => so.order_id === order.id)
          .map(subOrder => {
            const items = (itemsData || [])
              .filter(i => i.sub_order_id === subOrder.id)
              .map(item => ({
                ...item,
                product: item.product_id ? productMap[item.product_id] || null : null
              }))
            
            return {
              ...subOrder,
              vendor: subOrder.vendor_id ? vendorMap[subOrder.vendor_id] || null : null,
              items
            }
          })
        
        return { ...order, sub_orders: subOrders }
      })

      setOrders(ordersWithSubOrders)
    } catch (error) {
      console.error('[v0] Error:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true
    if (activeTab === "active") {
      return order.sub_orders?.some(so => 
        ["paid", "processing", "shipped", "in_transit"].includes(so.status)
      )
    }
    if (activeTab === "delivered") {
      return order.sub_orders?.every(so => so.status === "delivered")
    }
    return true
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">Mes commandes</h1>
      <p className="text-muted-foreground mb-6">
        Suivez vos commandes et communiquez avec les vendeur·euse·s
      </p>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-4">Vous n'avez pas encore de commandes</p>
            <Button asChild>
              <Link href="/products">Decouvrir nos produits</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Toutes ({orders.length})</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="delivered">Livrees</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">Commande #{order.id.slice(-8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {" • "}
                        {order.sub_orders?.length || 0} vendeur·euse{(order.sub_orders?.length || 0) > 1 ? "·s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{order.total_price.toFixed(2)} €</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Sub-orders by vendor */}
                  {order.sub_orders?.map((subOrder, idx) => (
                    <div key={subOrder.id}>
                      {idx > 0 && <Separator className="my-4" />}
                      
                      <div className="space-y-3">
                        {/* Vendor header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{subOrder.vendor?.name || "Vendeur Spectrum"}</span>
                          </div>
                          <Badge variant={getStatusBadge(subOrder.status)}>
                            {getStatusIcon(subOrder.status)}
                            <span className="ml-1">{getStatusLabel(subOrder.status)}</span>
                          </Badge>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          {subOrder.items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.product?.image_url || "/placeholder.svg"}
                                  alt={item.product?.name || "Produit"}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.product?.name || "Produit"}</p>
                                <p className="text-xs text-muted-foreground">Qte: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-medium">{item.subtotal.toFixed(2)} €</p>
                            </div>
                          ))}
                        </div>

                        {/* Tracking info */}
                        {subOrder.tracking_number && (
                          <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Truck className="h-4 w-4" />
                                {subOrder.carrier || "Transporteur"}
                              </span>
                              {subOrder.tracking_url && (
                                <a 
                                  href={subOrder.tracking_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  Suivre <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="font-mono text-xs">{subOrder.tracking_number}</p>
                            {subOrder.shipped_at && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Expediee le {new Date(subOrder.shipped_at).toLocaleDateString("fr-FR")}
                              </p>
                            )}
                            {subOrder.delivered_at && (
                              <p className="text-xs text-green-600">
                                Livree le {new Date(subOrder.delivered_at).toLocaleDateString("fr-FR")}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <Button variant="outline" size="sm" className="bg-transparent text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Contacter {subOrder.vendor?.name || "le vendeur"}
                          </Button>
                          {subOrder.status === "delivered" && (
                            <Button variant="outline" size="sm" className="bg-transparent text-xs">
                              Laisser un avis
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Shipping address */}
                  {order.shipping_address && (
                    <>
                      <Separator />
                      <div className="text-sm">
                        <p className="font-medium mb-1 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Adresse de livraison
                        </p>
                        <p className="text-muted-foreground">
                          {order.shipping_address.fullName}<br />
                          {order.shipping_address.addressLine1}<br />
                          {order.shipping_address.addressLine2 && <>{order.shipping_address.addressLine2}<br /></>}
                          {order.shipping_address.postalCode} {order.shipping_address.city}<br />
                          {order.shipping_address.country}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
