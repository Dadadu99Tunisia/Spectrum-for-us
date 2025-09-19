"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart" // Importer le hook

export default function CartPage() {
  const {
    cartProducts,
    promoCode,
    setPromoCode,
    promoApplied,
    isApplyingPromo,
    subtotal,
    shippingCost,
    discount,
    total,
    updateQuantity,
    removeProduct,
    applyPromoCode,
  } = useCart() // Utiliser le hook

  // Si le panier est vide
  if (cartProducts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Votre panier</h1>

        <div className="text-center py-16 max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-8">Découvrez nos produits et commencez à remplir votre panier !</p>
          <Button asChild size="lg">
            <Link href="/shop">Découvrir nos produits</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Produits du panier */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="hidden md:grid md:grid-cols-12 text-sm text-muted-foreground mb-4">
              <div className="col-span-6">Produit</div>
              <div className="col-span-2 text-center">Prix</div>
              <div className="col-span-2 text-center">Quantité</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="space-y-4">
              {cartProducts.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b last:border-0"
                >
                  {/* Produit */}
                  <div className="col-span-6 flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.product?.images[0] || "/placeholder.svg?height=80&width=80"}
                        alt={item.product?.name || "Produit"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        <Link href={`/produit/${item.productId}`} className="hover:underline">
                          {item.product?.name}
                        </Link>
                      </h3>
                      {item.product?.discount && (
                        <div className="text-sm text-red-500 font-medium">-{item.product.discount}%</div>
                      )}
                      <button
                        onClick={() => removeProduct(item.productId)}
                        className="text-sm text-muted-foreground hover:text-red-500 flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="md:col-span-2 flex items-center md:justify-center">
                    <div className="md:hidden text-sm text-muted-foreground">Prix:</div>
                    <div className="ml-auto md:ml-0">
                      {item.product?.discount ? (
                        <div>
                          <span className="font-medium">
                            {(item.product.price * (1 - item.product.discount / 100)).toFixed(2)} €
                          </span>
                          <span className="text-sm text-muted-foreground line-through ml-1">
                            {item.product.price.toFixed(2)} €
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">{item.product?.price.toFixed(2)} €</span>
                      )}
                    </div>
                  </div>

                  {/* Quantité */}
                  <div className="md:col-span-2 flex items-center md:justify-center">
                    <div className="md:hidden text-sm text-muted-foreground">Quantité:</div>
                    <div className="flex items-center border rounded-md ml-auto md:ml-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="w-8 text-center text-sm">{item.quantity}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 flex items-center md:justify-end">
                    <div className="md:hidden text-sm text-muted-foreground">Total:</div>
                    <div className="font-medium ml-auto md:ml-0">
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

            <div className="flex justify-between mt-6">
              <Button variant="outline" asChild>
                <Link href="/shop">Continuer mes achats</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Résumé de la commande */}
        <div>
          <div className="bg-white rounded-lg border p-6 sticky top-4">
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

            {/* Code promo */}
            <div className="mb-6">
              <p className="text-sm mb-2">Code promo</p>
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
                  {isApplyingPromo ? "..." : "Appliquer"}
                </Button>
              </div>
              {promoApplied && <p className="text-sm text-green-600 mt-1">Code promo "WELCOME10" appliqué !</p>}
            </div>

            {/* Informations de livraison */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Livraison gratuite</p>
                  <p className="text-muted-foreground">Pour les commandes de plus de 50€</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Livraison estimée</p>
                  <p className="text-muted-foreground">2-4 jours ouvrés</p>
                </div>
              </div>
            </div>

            <Button asChild size="lg" className="w-full gap-2">
              <Link href="/panier/paiement">
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
