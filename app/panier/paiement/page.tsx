"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  CreditCard,
  Landmark,
  ShoppingCartIcon as Paypal,
  Check,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { products } from "@/lib/data/products"

// Simuler un panier avec quelques produits
const cartItems = [
  { productId: "prod-001", quantity: 1 },
  { productId: "prod-006", quantity: 2 },
  { productId: "prod-008", quantity: 1 },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  // Récupérer les détails des produits dans le panier
  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return {
        ...item,
        product,
      }
    })
    .filter((item) => item.product)

  // Calculer les totaux
  const subtotal = cartProducts.reduce((total, item) => {
    const price = item.product?.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product?.price || 0
    return total + price * item.quantity
  }, 0)

  const shippingCost = subtotal > 50 ? 0 : 4.99
  const total = subtotal + shippingCost

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simuler le traitement du paiement
    setTimeout(() => {
      window.location.href = "/panier/success"
    }, 1500)
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/panier" className="hover:text-foreground">
          Panier
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Paiement</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de paiement */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Adresse de livraison */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Adresse de livraison</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" required />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>

              <div className="mb-4">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" required />
              </div>

              <div className="mb-4">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input id="postalCode" required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" required />
                </div>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Méthode de paiement</h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div
                  className={`flex items-center justify-between border rounded-lg p-4 ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-5 w-5" />
                      Carte bancaire
                    </Label>
                  </div>
                  <div className="flex gap-1">
                    <Image src="/placeholder.svg?height=24&width=36" alt="Visa" width={36} height={24} />
                    <Image src="/placeholder.svg?height=24&width=36" alt="Mastercard" width={36} height={24} />
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between border rounded-lg p-4 ${paymentMethod === "paypal" ? "border-primary bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                      <Paypal className="h-5 w-5" />
                      PayPal
                    </Label>
                  </div>
                  <Image src="/placeholder.svg?height=24&width=60" alt="PayPal" width={60} height={24} />
                </div>

                <div
                  className={`flex items-center justify-between border rounded-lg p-4 ${paymentMethod === "bank" ? "border-primary bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                      <Landmark className="h-5 w-5" />
                      Virement bancaire
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Date d'expiration</Label>
                      <Input id="expiryDate" placeholder="MM/AA" required />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Conditions générales */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="flex items-start gap-2 mb-4">
                <Checkbox id="terms" required />
                <div>
                  <Label htmlFor="terms" className="font-medium">
                    J'accepte les conditions générales de vente
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    En passant commande, vous acceptez nos{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      conditions générales de vente
                    </Link>{" "}
                    et notre{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="newsletter" />
                <div>
                  <Label htmlFor="newsletter" className="font-medium">
                    Je souhaite recevoir la newsletter
                  </Label>
                  <p className="text-sm text-muted-foreground">Recevez nos offres exclusives et nos nouveautés.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/panier">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au panier
                </Link>
              </Button>

              <Button type="submit" size="lg" disabled={isProcessing} className="gap-2">
                {isProcessing ? (
                  <>Traitement en cours...</>
                ) : (
                  <>
                    Payer {total.toFixed(2)} €
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Résumé de la commande */}
        <div>
          <div className="bg-white rounded-lg border p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>

            <div className="space-y-4 mb-6">
              {cartProducts.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-16 h-16 bg-muted rounded-md overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.product?.images[0] || "/placeholder.svg?height=64&width=64"}
                      alt={item.product?.name || "Produit"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-1">{item.product?.name}</h3>
                    <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                    <div className="text-sm font-medium">
                      {(
                        (item.product?.discount
                          ? item.product.price * (1 - item.product.discount / 100)
                          : item.product?.price || 0) * item.quantity
                      ).toFixed(2)}{" "}
                      €
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>{shippingCost === 0 ? "Gratuite" : `${shippingCost.toFixed(2)} €`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Paiement sécurisé
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
