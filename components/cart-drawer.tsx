"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store/cart-store"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getSubtotal, getItemCount, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
      </Button>
    )
  }

  const itemCount = getItemCount()
  const subtotal = getSubtotal()

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-600">
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Mon Panier ({itemCount} article{itemCount !== 1 ? "s" : ""})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Votre panier est vide</h3>
            <p className="text-muted-foreground mb-6">Découvrez nos produits et ajoutez-les à votre panier.</p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/boutique">Explorer la boutique</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 py-4">
                {Object.entries(itemsByVendor).map(([vendorId, { vendorName, items: vendorItems }]) => (
                  <div key={vendorId} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {vendorName}
                      </Badge>
                    </div>
                    {vendorItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/produit/${item.productId}`}
                            className="font-medium text-sm hover:underline line-clamp-2"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                          {(item.color || item.size) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {[item.color, item.size].filter(Boolean).join(" / ")}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{(item.price * item.quantity).toFixed(2)} €</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 border-t pt-4 sm:flex-col">
              <div className="space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setIsOpen(false)}>
                  <Link href="/checkout">Passer la commande</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsOpen(false)} asChild>
                  <Link href="/panier">Voir le panier</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>
                  Vider le panier
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
