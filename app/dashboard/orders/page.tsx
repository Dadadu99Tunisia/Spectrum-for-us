"use client"

import { useState } from "react"
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
  CheckCircle, Clock, AlertCircle, Send, Copy, ExternalLink
} from "lucide-react"

// Demo vendor orders
const demoVendorOrders = [
  {
    id: "sub-v001",
    orderId: "ord-001-spectrum",
    buyerName: "Alex Martin",
    buyerEmail: "alex@example.com",
    status: "paid",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: "1", name: "Chemise Fluide Unisexe", quantity: 1, price: 89.00, image: "/unisex-fluid-shirt-minimal.jpg" },
      { id: "2", name: "Pantalon Large", quantity: 1, price: 75.00, image: "/wide-leg-pants-neutral.jpg" },
    ],
    subtotal: 164.00,
    shippingCost: 5.99,
    commission: 19.68 + 0.30, // 12% + 0.30€
    payout: 164.00 + 5.99 - 19.98 - 0.30,
    shippingAddress: {
      fullName: "Alex Martin",
      addressLine1: "15 Rue de la Liberté",
      addressLine2: "Apt 4B",
      city: "Paris",
      postalCode: "75011",
      country: "France",
      phone: "+33 6 12 34 56 78",
    },
    buyerNote: "Merci de faire un paquet cadeau si possible !",
  },
  {
    id: "sub-v002",
    orderId: "ord-002-spectrum",
    buyerName: "Jordan Leroy",
    buyerEmail: "jordan@example.com",
    status: "processing",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: "3", name: "T-shirt Oversize", quantity: 2, price: 45.00, image: "/oversized-tee-pastel.jpg" },
    ],
    subtotal: 90.00,
    shippingCost: 0,
    commission: 10.80 + 0.30,
    payout: 90.00 - 11.10,
    shippingAddress: {
      fullName: "Jordan Leroy",
      addressLine1: "28 Avenue des Fleurs",
      city: "Lyon",
      postalCode: "69003",
      country: "France",
      phone: "+33 7 98 76 54 32",
    },
    trackingNumber: "",
    carrier: "",
  },
  {
    id: "sub-v003",
    orderId: "ord-003-spectrum",
    buyerName: "Sam Dubois",
    buyerEmail: "sam@example.com",
    status: "shipped",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: "4", name: "Veste Denim Unisexe", quantity: 1, price: 129.00, image: "/unisex-denim-jacket.jpg" },
    ],
    subtotal: 129.00,
    shippingCost: 7.99,
    commission: 15.48 + 0.30,
    payout: 129.00 + 7.99 - 15.78,
    shippingAddress: {
      fullName: "Sam Dubois",
      addressLine1: "5 Place du Marché",
      city: "Bordeaux",
      postalCode: "33000",
      country: "France",
      phone: "+33 6 55 44 33 22",
    },
    trackingNumber: "LP987654321FR",
    trackingUrl: "https://www.laposte.fr/outils/suivre-vos-envois",
    carrier: "Colissimo",
  },
  {
    id: "sub-v004",
    orderId: "ord-004-spectrum",
    buyerName: "Charlie Moreau",
    buyerEmail: "charlie@example.com",
    status: "delivered",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: "5", name: "Sweat à Capuche", quantity: 1, price: 85.00, image: "/hoodie-minimal-neutral.jpg" },
    ],
    subtotal: 85.00,
    shippingCost: 5.99,
    commission: 10.20 + 0.30,
    payout: 85.00 + 5.99 - 10.50,
    shippingAddress: {
      fullName: "Charlie Moreau",
      addressLine1: "12 Rue des Arts",
      city: "Nantes",
      postalCode: "44000",
      country: "France",
    },
    trackingNumber: "MR123456789",
    carrier: "Mondial Relay",
  },
]

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
    paid: "A expédier",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
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
  const [orders, setOrders] = useState(demoVendorOrders)
  const [activeTab, setActiveTab] = useState("pending")
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { number: string; carrier: string }>>({})

  const pendingCount = orders.filter(o => o.status === "paid" || o.status === "processing").length
  const shippedCount = orders.filter(o => o.status === "shipped").length
  const deliveredCount = orders.filter(o => o.status === "delivered").length

  const filteredOrders = orders.filter(order => {
    if (activeTab === "pending") return order.status === "paid" || order.status === "processing"
    if (activeTab === "shipped") return order.status === "shipped"
    if (activeTab === "delivered") return order.status === "delivered"
    return true
  })

  const handleShipOrder = (orderId: string) => {
    const tracking = trackingInputs[orderId]
    if (!tracking?.number || !tracking?.carrier) {
      alert("Veuillez entrer le numéro de suivi et sélectionner un transporteur")
      return
    }

    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: "shipped", trackingNumber: tracking.number, carrier: tracking.carrier, shippedAt: new Date().toISOString() }
        : o
    ))
  }

  const copyAddress = (address: typeof demoVendorOrders[0]["shippingAddress"]) => {
    const text = `${address.fullName}\n${address.addressLine1}${address.addressLine2 ? '\n' + address.addressLine2 : ''}\n${address.postalCode} ${address.city}\n${address.country}${address.phone ? '\nTél: ' + address.phone : ''}`
    navigator.clipboard.writeText(text)
  }

  // Stats
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.payout, 0)
  const pendingRevenue = orders.filter(o => ["paid", "processing", "shipped"].includes(o.status)).reduce((sum, o) => sum + o.payout, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestion des commandes</h1>
          <p className="text-muted-foreground">Gérez vos expéditions et suivez vos revenus</p>
        </div>
        <div className="flex gap-4">
          <Card className="px-4 py-2">
            <p className="text-xs text-muted-foreground">A expédier</p>
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
            Expédiées ({shippedCount})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Livrées ({deliveredCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Aucune commande dans cette catégorie</p>
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
                      <CardTitle className="text-base">#{order.orderId.slice(-8)}</CardTitle>
                      <Badge variant={getStatusBadge(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.buyerName} • {new Date(order.createdAt).toLocaleDateString("fr-FR", {
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
                      {order.payout.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      après commission ({order.commission.toFixed(2)} €)
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-background rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>

                {/* Buyer note */}
                {order.buyerNote && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm font-medium flex items-center gap-1 mb-1">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      Message du client
                    </p>
                    <p className="text-sm text-muted-foreground">{order.buyerNote}</p>
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
                        onClick={() => copyAddress(order.shippingAddress)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copier
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.addressLine1}<br />
                      {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                      {order.shippingAddress.country}
                      {order.shippingAddress.phone && <><br />Tél: {order.shippingAddress.phone}</>}
                    </p>
                  </div>

                  {/* Shipping / Tracking */}
                  <div className="border rounded-lg p-3">
                    {order.status === "paid" || order.status === "processing" ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Expédition
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
                          <Label htmlFor={`tracking-${order.id}`} className="text-xs">Numéro de suivi</Label>
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
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Marquer comme expédiée
                        </Button>
                      </div>
                    ) : order.trackingNumber ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Suivi d'expédition
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Transporteur:</span> {order.carrier}
                        </p>
                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {order.trackingNumber}
                        </p>
                        {order.shippedAt && (
                          <p className="text-xs text-muted-foreground">
                            Expédiée le {new Date(order.shippedAt).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                        {order.deliveredAt && (
                          <p className="text-xs text-green-600">
                            Livrée le {new Date(order.deliveredAt).toLocaleDateString("fr-FR")}
                          </p>
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
                  {order.status === "shipped" && (
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Voir le suivi
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
