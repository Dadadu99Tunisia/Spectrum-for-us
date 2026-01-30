"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/store/cart-store"
import Image from "next/image"
import Link from "next/link"

export function CartSheet() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getSubtotal, getItemCount } = useCartStore()
  const itemCount = getItemCount()
  const subtotal = getSubtotal()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600 text-[10px]">
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Panier</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Panier ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">Votre panier est vide</p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/boutique">Découvrir nos produits</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.vendorName}</p>
                      <p className="font-semibold mt-1">{item.price.toFixed(2)} €</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center border rounded">
                        <button
                          className="p-1 hover:bg-muted"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          className="p-1 hover:bg-muted"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 space-y-4 border-t">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-semibold">{subtotal.toFixed(2)} €</span>
              </div>
              <p className="text-xs text-muted-foreground">Livraison et taxes calculées à la caisse</p>
              <Separator />
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/panier/paiement" className="flex items-center gap-2">
                    Passer la commande
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/panier">Voir le panier</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
