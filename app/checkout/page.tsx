"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Store, Truck, MessageSquare, Shield, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  price: number
  currency: string
  quantity: number
  image: string
  vendorId?: string
  vendorName?: string
  shippingCost?: number
  processingTime?: string
}

interface VendorGroup {
  vendorId: string
  vendorName: string
  items: CartItem[]
  subtotal: number
  shippingCost: number
  processingTime: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [buyerNotes, setBuyerNotes] = useState<Record<string, string>>({})

  // Shipping address form
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "France",
  })

  useEffect(() => {
    const savedCart = localStorage.getItem("spectrum_cart")
    if (savedCart) {
      const items = JSON.parse(savedCart)
      // Add demo vendor info if not present
      const itemsWithVendor = items.map((item: CartItem, index: number) => ({
        ...item,
        vendorId: item.vendorId || `vendor-${index % 3}`,
        vendorName: item.vendorName || ["Atelier Luna", "Maison Prisme", "Studio Fluid"][index % 3],
        shippingCost: item.shippingCost || [0, 4.99, 5.99][index % 3],
        processingTime: item.processingTime || ["1-2 jours", "2-3 jours", "3-5 jours"][index % 3],
      }))
      setCartItems(itemsWithVendor)
    }
  }, [])

  // Group items by vendor
  const vendorGroups: VendorGroup[] = cartItems.reduce((groups: VendorGroup[], item) => {
    const existingGroup = groups.find(g => g.vendorId === item.vendorId)
    if (existingGroup) {
      existingGroup.items.push(item)
      existingGroup.subtotal += item.price * item.quantity
    } else {
      groups.push({
        vendorId: item.vendorId || 'unknown',
        vendorName: item.vendorName || 'Vendeur',
        items: [item],
        subtotal: item.price * item.quantity,
        shippingCost: item.shippingCost || 0,
        processingTime: item.processingTime || '2-5 jours',
      })
    }
    return groups
  }, [])

  const productsTotal = vendorGroups.reduce((sum, g) => sum + g.subtotal, 0)
  const shippingTotal = vendorGroups.reduce((sum, g) => sum + g.shippingCost, 0)
  const platformFee = 0 // Les frais sont inclus dans le prix
  const total = productsTotal + shippingTotal + platformFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: shippingForm,
          vendorGroups: vendorGroups.map(g => ({
            vendorId: g.vendorId,
            subtotal: g.subtotal,
            shippingCost: g.shippingCost,
            buyerNote: buyerNotes[g.vendorId] || '',
          })),
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-4">Votre panier est vide</p>
            <Button asChild>
              <Link href="/products">Continuer mes achats</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au panier
        </Link>
      </Button>

      <h1 className="text-3xl md:text-4xl font-bold text-balance mb-4">Finaliser la commande</h1>
      
      {/* Info banner about multivendor */}
      <div className="bg-lavender/20 border border-lavender/30 rounded-lg p-4 mb-8 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Commande multi-vendeurs</p>
          <p className="text-muted-foreground">
            Vos articles proviennent de {vendorGroups.length} créateur·ice·s différent·e·s. 
            Chaque vendeur·euse expédiera directement sa commande avec son propre suivi.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Vendor Groups */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <Input
                      id="fullName"
                      required
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      placeholder="Prénom Nom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      placeholder="vous@exemple.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      placeholder="+33 6 00 00 00 00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine1">Adresse *</Label>
                    <Input
                      id="addressLine1"
                      required
                      value={shippingForm.addressLine1}
                      onChange={(e) => setShippingForm({ ...shippingForm, addressLine1: e.target.value })}
                      placeholder="Numéro et nom de rue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine2">Complément d'adresse</Label>
                    <Input
                      id="addressLine2"
                      value={shippingForm.addressLine2}
                      onChange={(e) => setShippingForm({ ...shippingForm, addressLine2: e.target.value })}
                      placeholder="Appartement, bâtiment, étage..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={shippingForm.postalCode}
                      onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="country">Pays *</Label>
                    <Input
                      id="country"
                      required
                      value={shippingForm.country}
                      onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Groups - Each vendor ships separately */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Store className="h-5 w-5" />
                Vos commandes par vendeur·euse ({vendorGroups.length})
              </h2>
              
              {vendorGroups.map((group, index) => (
                <Card key={group.vendorId} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Store className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{group.vendorName}</CardTitle>
                          <p className="text-xs text-muted-foreground">Envoi {index + 1} sur {vendorGroups.length}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Truck className="h-3 w-3 mr-1" />
                        {group.processingTime}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {/* Items from this vendor */}
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">
                            {(item.price * item.quantity).toFixed(2)} €
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping info */}
                    <div className="flex items-center justify-between text-sm py-2 border-t">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        Frais de port
                      </span>
                      <span className="font-medium">
                        {group.shippingCost === 0 ? (
                          <span className="text-green-600">Gratuit</span>
                        ) : (
                          `${group.shippingCost.toFixed(2)} €`
                        )}
                      </span>
                    </div>

                    {/* Subtotal for this vendor */}
                    <div className="flex items-center justify-between font-medium pt-2 border-t">
                      <span>Sous-total {group.vendorName}</span>
                      <span>{(group.subtotal + group.shippingCost).toFixed(2)} €</span>
                    </div>

                    {/* Message to vendor */}
                    <div className="pt-2">
                      <Label htmlFor={`note-${group.vendorId}`} className="text-xs flex items-center gap-1 mb-2">
                        <MessageSquare className="h-3 w-3" />
                        Message au vendeur (optionnel)
                      </Label>
                      <Textarea
                        id={`note-${group.vendorId}`}
                        placeholder="Instructions spéciales, personnalisation..."
                        className="text-sm min-h-[60px]"
                        value={buyerNotes[group.vendorId] || ''}
                        onChange={(e) => setBuyerNotes({
                          ...buyerNotes,
                          [group.vendorId]: e.target.value
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vendor breakdown */}
                <div className="space-y-2">
                  {vendorGroups.map((group) => (
                    <div key={group.vendorId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">{group.vendorName}</span>
                      <span className="font-medium">{group.subtotal.toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total produits</span>
                    <span className="font-medium">{productsTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison ({vendorGroups.length} envois)</span>
                    <span className="font-medium">
                      {shippingTotal === 0 ? (
                        <span className="text-green-600">Gratuit</span>
                      ) : (
                        `${shippingTotal.toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? "Traitement en cours..." : `Payer ${total.toFixed(2)} €`}
                </Button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <Shield className="h-4 w-4" />
                  <span>Paiement sécurisé par Stripe</span>
                </div>

                {/* Marketplace info */}
                <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Comment ça marche ?</p>
                  <ul className="space-y-1">
                    <li>• Chaque vendeur·euse expédie directement</li>
                    <li>• Vous recevrez {vendorGroups.length} colis séparés</li>
                    <li>• Suivi de commande individuel par vendeur</li>
                    <li>• Protection acheteur Spectrum incluse</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
