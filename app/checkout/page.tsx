"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, CreditCard, Shield, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/store/cart-store"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    phone: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">Ajoutez des produits à votre panier pour passer commande.</p>
          <Button asChild>
            <Link href="/boutique">Découvrir nos produits</Link>
          </Button>
        </div>
      </main>
    )
  }

  const subtotal = getSubtotal()
  const shippingCost = shippingMethod === "express" ? 7.99 : subtotal >= 50 ? 0 : 4.99
  const total = subtotal + shippingCost

  // Group items by vendor
  const itemsByVendor = items.reduce(
    (acc, item) => {
      if (!acc[item.vendorId]) {
        acc[item.vendorId] = {
          vendorName: item.vendorName,
          items: [],
        }
      }
      acc[item.vendorId].items.push(item)
      return acc
    },
    {} as Record<string, { vendorName: string; items: typeof items }>,
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: Math.round(item.price * 100), // Stripe expects cents
            quantity: item.quantity,
            image: item.image,
            vendorId: item.vendorId,
          })),
          shippingAddress: formData,
          shippingMethod,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else if (data.error) {
        alert(data.error)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/panier"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Retour au panier
      </Link>

      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Shipping Info */}
          <div className="space-y-8">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adresse de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Rue Example"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mode de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Livraison standard</p>
                          <p className="text-sm text-muted-foreground">3-5 jours ouvrés</p>
                        </div>
                        <span className="font-medium">{subtotal >= 50 ? "Gratuit" : "4,99 €"}</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 mt-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Livraison express</p>
                          <p className="text-sm text-muted-foreground">1-2 jours ouvrés</p>
                        </div>
                        <span className="font-medium">7,99 €</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(itemsByVendor).map(([vendorId, { vendorName, items: vendorItems }]) => (
                  <div key={vendorId} className="space-y-3">
                    <Badge variant="outline" className="text-xs">
                      {vendorName}
                    </Badge>
                    {vendorItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                          {(item.color || item.size) && (
                            <p className="text-xs text-muted-foreground">
                              {[item.color, item.size].filter(Boolean).join(" / ")}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                      </div>
                    ))}
                    <Separator />
                  </div>
                ))}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span className={shippingCost === 0 ? "text-green-600" : ""}>
                      {shippingCost === 0 ? "Gratuit" : `${shippingCost.toFixed(2)} €`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    "Traitement en cours..."
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Payer {total.toFixed(2)} €
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Stripe</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </main>
  )
}
