"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store/cart-store"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Votre panier</h1>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </main>
    )
  }

  const subtotal = getSubtotal()
  const shippingCost = subtotal > 50 ? 0 : 4.99
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discount

  const applyPromoCode = () => {
    if (!promoCode) return
    setIsApplyingPromo(true)
    setTimeout(() => {
      if (promoCode.toLowerCase() === "welcome10" || promoCode.toLowerCase() === "spectrum10") {
        setPromoApplied(true)
      }
      setIsApplyingPromo(false)
    }, 500)
  }

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

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Votre panier</h1>
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-8">Découvrez nos produits et commencez à remplir votre panier !</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Link href="/boutique">Découvrir nos produits</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items grouped by vendor */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(itemsByVendor).map(([vendorId, { vendorName, items: vendorItems }]) => (
            <div key={vendorId} className="bg-white dark:bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-3 border-b">
                <Link href={`/vendeur/${vendorId}`} className="font-medium text-purple-600 hover:underline">
                  {vendorName}
                </Link>
              </div>

              <div className="divide-y">
                {vendorItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=96&width=96"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/produit/${item.productId}`}
                        className="font-medium hover:text-purple-600 line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {(item.size || item.color) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.size && `Taille: ${item.size}`}
                          {item.size && item.color && " | "}
                          {item.color && `Couleur: ${item.color}`}
                        </p>
                      )}
                      <p className="font-semibold mt-2">{item.price.toFixed(2)} €</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button variant="outline" asChild>
            <Link href="/boutique">Continuer mes achats</Link>
          </Button>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white dark:bg-card rounded-xl border shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>{shippingCost === 0 ? "Gratuite" : `${shippingCost.toFixed(2)} €`}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction (10%)</span>
                  <span>-{discount.toFixed(2)} €</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Code promo</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Entrez votre code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied || isApplyingPromo}
                />
                <Button
                  variant="outline"
                  onClick={applyPromoCode}
                  disabled={promoApplied || isApplyingPromo || !promoCode}
                >
                  {isApplyingPromo ? "..." : "OK"}
                </Button>
              </div>
              {promoApplied && <p className="text-sm text-green-600 mt-1">Code promo appliqué !</p>}
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4 text-purple-600" />
                <span>Livraison gratuite dès 50€</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>Livraison en 2-4 jours ouvrés</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                Passer à la caisse
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
