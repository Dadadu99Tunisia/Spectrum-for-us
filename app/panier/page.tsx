"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"

type CartItem = {
  id: string
  name: string
  price: number
  image: string
  seller: {
    name: string
    id: string
  }
  quantity: number
  color: string
  size: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "T-shirt Pride Collection",
      price: 29.99,
      image: "/placeholder.svg?height=300&width=300",
      seller: { name: "QueerApparel", id: "seller1" },
      quantity: 1,
      color: "Blanc",
      size: "M",
    },
    {
      id: "2",
      name: "Boucles d'oreilles Arc-en-ciel",
      price: 34.99,
      image: "/placeholder.svg?height=300&width=300",
      seller: { name: "PrideJewelry", id: "seller2" },
      quantity: 1,
      color: "Multicolore",
      size: "Unique",
    },
  ])

  const [promoCode, setPromoCode] = useState("")

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 4.99
  const total = subtotal + shipping

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
          <Button asChild>
            <Link href="/boutique">Continuer mes achats</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles du panier */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/produit/${item.id}`}>
                          <h3 className="font-semibold hover:text-purple-600 dark:hover:text-purple-400">
                            {item.name}
                          </h3>
                        </Link>
                        <Link
                          href={`/vendeur/${item.seller.id}`}
                          className="text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
                        >
                          par {item.seller.name}
                        </Link>
                      </div>
                      <div className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mt-1 gap-2">
                      <span>Couleur: {item.color}</span>
                      <span>•</span>
                      <span>Taille: {item.size}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="h-8 w-10 flex items-center justify-center border-y border-input text-sm">
                          {item.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/boutique">Continuer mes achats</Link>
              </Button>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div>
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span>{shipping === 0 ? "Gratuit" : `${shipping.toFixed(2)} €`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Code promo" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                  <Button variant="outline">Appliquer</Button>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Passer à la caisse
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  Paiement sécurisé via Stripe. Nous n'enregistrons pas vos informations de paiement.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

