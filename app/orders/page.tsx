"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { 
  Package, Truck, CheckCircle, XCircle, Store, 
  MessageSquare, ExternalLink, Clock, MapPin, AlertCircle
} from "lucide-react"

// Demo orders data for multivendor marketplace
const demoOrders = [
  {
    id: "ord-001-spectrum",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 127.97,
    shippingAddress: {
      fullName: "Alex Martin",
      addressLine1: "15 Rue de la Liberté",
      city: "Paris",
      postalCode: "75011",
      country: "France",
    },
    subOrders: [
      {
        id: "sub-001a",
        vendorName: "Atelier Luna",
        vendorId: "vendor-luna",
        status: "shipped",
        shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: "LP123456789FR",
        trackingUrl: "https://www.laposte.fr/outils/suivre-vos-envois",
        carrier: "Colissimo",
        estimatedDelivery: "25-27 Jan 2026",
        items: [
          { id: "1", name: "Chemise Fluide Unisexe", quantity: 1, price: 89.00, image: "/unisex-fluid-shirt-minimal.jpg" },
        ],
        subtotal: 89.00,
        shippingCost: 0,
      },
      {
        id: "sub-001b",
        vendorName: "Maison Prisme",
        vendorId: "vendor-prisme",
        status: "processing",
        items: [
          { id: "2", name: "Bougie Soja Artisanale", quantity: 2, price: 19.00, image: "/soy-candle-minimal-glass.jpg" },
        ],
        subtotal: 38.00,
        shippingCost: 0.97,
      },
    ],
  },
  {
    id: "ord-002-spectrum",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 65.00,
    shippingAddress: {
      fullName: "Alex Martin",
      addressLine1: "15 Rue de la Liberté",
      city: "Paris",
      postalCode: "75011",
      country: "France",
    },
    subOrders: [
      {
        id: "sub-002a",
        vendorName: "Studio Fluid",
        vendorId: "vendor-fluid",
        status: "delivered",
        deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: "MR987654321",
        carrier: "Mondial Relay",
        items: [
          { id: "3", name: "Sérum Hydratant Bio", quantity: 1, price: 45.00, image: "/minimal-serum-bottle-skincare.jpg" },
          { id: "4", name: "Huile de Massage", quantity: 1, price: 20.00, image: "/intimate-oil-glass-bottle.jpg" },
        ],
        subtotal: 65.00,
        shippingCost: 0,
      },
    ],
  },
]

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
    paid: "Payée",
    processing: "En préparation",
    shipped: "Expédiée",
    in_transit: "En transit",
    delivered: "Livrée",
    cancelled: "Annulée",
    refunded: "Remboursée",
    disputed: "Litige",
  }
  return labels[status] || status
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(demoOrders)
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true
    if (activeTab === "active") {
      return order.subOrders.some(so => 
        ["paid", "processing", "shipped", "in_transit"].includes(so.status)
      )
    }
    if (activeTab === "delivered") {
      return order.subOrders.every(so => so.status === "delivered")
    }
    return true
  })

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
              <Link href="/products">Découvrir nos produits</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Toutes ({orders.length})</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="delivered">Livrées</TabsTrigger>
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
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {" • "}
                        {order.subOrders.length} vendeur·euse{order.subOrders.length > 1 ? "·s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{order.totalPrice.toFixed(2)} €</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Sub-orders by vendor */}
                  {order.subOrders.map((subOrder, idx) => (
                    <div key={subOrder.id}>
                      {idx > 0 && <Separator className="my-4" />}
                      
                      <div className="space-y-3">
                        {/* Vendor header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{subOrder.vendorName}</span>
                          </div>
                          <Badge variant={getStatusBadge(subOrder.status)}>
                            {getStatusIcon(subOrder.status)}
                            <span className="ml-1">{getStatusLabel(subOrder.status)}</span>
                          </Badge>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          {subOrder.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
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

                        {/* Tracking info */}
                        {subOrder.trackingNumber && (
                          <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Truck className="h-4 w-4" />
                                {subOrder.carrier}
                              </span>
                              {subOrder.trackingUrl ? (
                                <a 
                                  href={subOrder.trackingUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  Suivre <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : null}
                            </div>
                            <p className="font-mono text-xs">{subOrder.trackingNumber}</p>
                            {subOrder.estimatedDelivery && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Livraison estimée: {subOrder.estimatedDelivery}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <Button variant="outline" size="sm" className="bg-transparent text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Contacter {subOrder.vendorName}
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
                  <Separator />
                  <div className="text-sm">
                    <p className="font-medium mb-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Adresse de livraison
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.addressLine1}<br />
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
