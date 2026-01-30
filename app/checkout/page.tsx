"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  price: number
  currency: string
  quantity: number
  image: string
}

interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

const shippingMethods: ShippingMethod[] = [
  { id: "free", name: "Livraison gratuite", description: "7-10 jours ouvrés", price: 0, estimatedDays: "7-10 jours" },
  { id: "standard", name: "Standard", description: "5-7 jours ouvrés", price: 5.99, estimatedDays: "5-7 jours" },
  { id: "express", name: "Express", description: "2-3 jours ouvrés", price: 12.99, estimatedDays: "2-3 jours" },
  { id: "priority", name: "Prioritaire", description: "1-2 jours ouvrés", price: 19.99, estimatedDays: "1-2 jours" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedShipping, setSelectedShipping] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)

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
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = shippingMethods.find((m) => m.id === selectedShipping)?.price || 0
  const total = subtotal + shippingCost

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
          shippingMethod: selectedShipping,
          shippingCost,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("[v0] Checkout error:", error)
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

      <h1 className="text-4xl font-bold text-balance mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Forms */}
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
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine1">Adresse *</Label>
                    <Input
                      id="addressLine1"
                      required
                      value={shippingForm.addressLine1}
                      onChange={(e) => setShippingForm({ ...shippingForm, addressLine1: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine2">Complément d'adresse</Label>
                    <Input
                      id="addressLine2"
                      value={shippingForm.addressLine2}
                      onChange={(e) => setShippingForm({ ...shippingForm, addressLine2: e.target.value })}
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

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Mode de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                            <p className="font-semibold">
                              {method.price === 0 ? "Gratuit" : `€${method.price.toFixed(2)}`}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? "Gratuit" : `€${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? "Traitement..." : "Payer maintenant"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">Paiement sécurisé par Stripe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
