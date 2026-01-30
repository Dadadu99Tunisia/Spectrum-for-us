"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { 
  Package, Truck, MessageSquare, MapPin, Euro, 
  CheckCircle, Clock, AlertCircle, Send, Copy, ExternalLink, Loader2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SubOrder {
  id: string
  order_id: string
  status: string
  subtotal: number
  shipping_cost: number
  commission_amount: number
  vendor_payout: number
  buyer_notes: string | null
  tracking_number: string | null
  tracking_url: string | null
  carrier: string | null
  shipped_at: string | null
  delivered_at: string | null
  created_at: string
  order: {
    id: string
    user_id: string
    shipping_address: any
    buyer: {
      name: string
      email: string
    }
  }
  items: Array<{
    id: string
    quantity: number
    unit_price: number
    subtotal: number
    product: {
      id: string
      name: string
      image_url: string | null
    }
  }>
}

const carriers = [
  { value: "colissimo", label: "Colissimo", trackingUrl: "https://www.laposte.fr/outils/suivre-vos-envois" },
  { value: "mondial_relay", label: "Mondial Relay", trackingUrl: "https://www.mondialrelay.fr/suivi-de-colis/" },
  { value: "chronopost", label: "Chronopost", trackingUrl: "https://www.chronopost.fr/tracking" },
  { value: "ups", label: "UPS", trackingUrl: "https://www.ups.com/track" },
  { value: "dhl", label: "DHL", trackingUrl: "https://www.dhl.com/fr-fr/home/tracking.html" },
  { value: "other", label: "Autre", trackingUrl: "" },
]

const getStatusBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    paid: "default",
    processing: "secondary",
    shipped: "default",
    delivered: "outline",
    cancelled: "destructive",
  }
  return variants[status] || "default"
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "En attente",
    paid: "A expedier",
    processing: "En preparation",
    shipped: "Expediee",
    delivered: "Livree",
    cancelled: "Annulee",
  }
  return labels[status] || status
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "paid":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function VendorOrdersPage() {
  const [subOrders, setSubOrders] = useState<SubOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { number: string; carrier: string }>>({})
  const [updating, setUpdating] = useState<string | null>(null)

  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setSubOrders([])
        return
      }

      const { data, error } = await supabase
        .from('sub_orders')
        .select(`
          *,
          order:orders!order_id (
            id,
            user_id,
            shipping_address,
            buyer:profiles!user_id (
              name,
              email
            )
          ),
          items:order_items (
            id,
            quantity,
            unit_price,
            subtotal,
            product:products!product_id (
              id,
              name,
              image_url
            )
          )
        `)
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching orders:', error)
        setSubOrders([])
      } else {
        setSubOrders(data || [])
      }
    } catch (error) {
      console.error('[v0] Error:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const pendingCount = subOrders.filter(o => o.status === "paid" || o.status === "processing").length
  const shippedCount = subOrders.filter(o => o.status === "shipped").length
  const deliveredCount = subOrders.filter(o => o.status === "delivered").length

  const filteredOrders = subOrders.filter(order => {
    if (activeTab === "pending") return order.status === "paid" || order.status === "processing"
    if (activeTab === "shipped") return order.status === "shipped"
    if (activeTab === "delivered") return order.status === "delivered"
    return true
  })

  const handleShipOrder = async (subOrderId: string) => {
    const tracking = trackingInputs[subOrderId]
    if (!tracking?.number || !tracking?.carrier) {
      alert("Veuillez entrer le numero de suivi et selectionner un transporteur")
      return
    }

    setUpdating(subOrderId)

    try {
      const carrierInfo = carriers.find(c => c.value === tracking.carrier)
      
      const { error } = await supabase
        .from('sub_orders')
        .update({
          status: 'shipped',
          tracking_number: tracking.number,
          carrier: carrierInfo?.label || tracking.carrier,
          tracking_url: carrierInfo?.trackingUrl || null,
          shipped_at: new Date().toISOString(),
        })
        .eq('id', subOrderId)

      if (error) {
        console.error('[v0] Error updating order:', error)
        alert("Erreur lors de la mise a jour")
      } else {
        // Refresh orders
        await fetchOrders()
      }
    } catch (error) {
      console.error('[v0] Error:', error)
    } finally {
      setUpdating(null)
    }
  }

  const copyAddress = (address: any) => {
    if (!address) return
    const text = `${address.fullName}\n${address.addressLine1}${address.addressLine2 ? '\n' + address.addressLine2 : ''}\n${address.postalCode} ${address.city}\n${address.country}${address.phone ? '\nTel: ' + address.phone : ''}`
    navigator.clipboard.writeText(text)
  }

  // Stats
  const totalRevenue = subOrders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + (o.vendor_payout || 0), 0)
  const pendingRevenue = subOrders.filter(o => ["paid", "processing", "shipped"].includes(o.status)).reduce((sum, o) => sum + (o.vendor_payout || 0), 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestion des commandes</h1>
          <p className="text-muted-foreground">Gerez vos expeditions et suivez vos revenus</p>
        </div>
        <div className="flex gap-4">
          <Card className="px-4 py-2">
            <p className="text-xs text-muted-foreground">A expedier</p>
            <p className="text-2xl font-bold text-primary">{pendingCount}</p>
          </Card>
          <Card className="px-4 py-2">
            <p className="text-xs text-muted-foreground">Revenus en attente</p>
            <p className="text-2xl font-bold text-green-600">{pendingRevenue.toFixed(2)} €</p>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            A traiter ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="shipped" className="gap-2">
            <Truck className="h-4 w-4" />
            Expediees ({shippedCount})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Livrees ({deliveredCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              {subOrders.length === 0 
                ? "Vous n'avez pas encore de commandes" 
                : "Aucune commande dans cette categorie"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className={order.status === "paid" ? "border-primary/50 bg-primary/5" : ""}>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">#{order.order_id.slice(-8)}</CardTitle>
                      <Badge variant={getStatusBadge(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.order?.buyer?.name || "Client"} • {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 flex items-center gap-1 justify-end">
                      <Euro className="h-4 w-4" />
                      {(order.vendor_payout || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      apres commission ({(order.commission_amount || 0).toFixed(2)} €)
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-background rounded overflow-hidden flex-shrink-0">
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

                {/* Buyer note */}
                {order.buyer_notes && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm font-medium flex items-center gap-1 mb-1">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      Message du client
                    </p>
                    <p className="text-sm text-muted-foreground">{order.buyer_notes}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Shipping Address */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Adresse de livraison
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => copyAddress(order.order?.shipping_address)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copier
                      </Button>
                    </div>
                    {order.order?.shipping_address ? (
                      <p className="text-sm text-muted-foreground">
                        {order.order.shipping_address.fullName}<br />
                        {order.order.shipping_address.addressLine1}<br />
                        {order.order.shipping_address.addressLine2 && <>{order.order.shipping_address.addressLine2}<br /></>}
                        {order.order.shipping_address.postalCode} {order.order.shipping_address.city}<br />
                        {order.order.shipping_address.country}
                        {order.order.shipping_address.phone && <><br />Tel: {order.order.shipping_address.phone}</>}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Adresse non disponible</p>
                    )}
                  </div>

                  {/* Shipping / Tracking */}
                  <div className="border rounded-lg p-3">
                    {order.status === "paid" || order.status === "processing" ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Expedition
                        </p>
                        <div>
                          <Label htmlFor={`carrier-${order.id}`} className="text-xs">Transporteur</Label>
                          <Select
                            value={trackingInputs[order.id]?.carrier || ""}
                            onValueChange={(v) => setTrackingInputs({
                              ...trackingInputs,
                              [order.id]: { ...trackingInputs[order.id], carrier: v }
                            })}
                          >
                            <SelectTrigger id={`carrier-${order.id}`} className="mt-1">
                              <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                            <SelectContent>
                              {carriers.map(c => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`tracking-${order.id}`} className="text-xs">Numero de suivi</Label>
                          <Input
                            id={`tracking-${order.id}`}
                            placeholder="LP123456789FR"
                            className="mt-1"
                            value={trackingInputs[order.id]?.number || ""}
                            onChange={(e) => setTrackingInputs({
                              ...trackingInputs,
                              [order.id]: { ...trackingInputs[order.id], number: e.target.value }
                            })}
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleShipOrder(order.id)}
                          disabled={updating === order.id}
                        >
                          {updating === order.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Marquer comme expediee
                        </Button>
                      </div>
                    ) : order.tracking_number ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Suivi d'expedition
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Transporteur:</span> {order.carrier}
                        </p>
                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {order.tracking_number}
                        </p>
                        {order.shipped_at && (
                          <p className="text-xs text-muted-foreground">
                            Expediee le {new Date(order.shipped_at).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                        {order.delivered_at && (
                          <p className="text-xs text-green-600">
                            Livree le {new Date(order.delivered_at).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                        {order.tracking_url && (
                          <a 
                            href={order.tracking_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Suivre le colis
                          </a>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Actions */}
                <Separator />
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contacter l'acheteur
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
