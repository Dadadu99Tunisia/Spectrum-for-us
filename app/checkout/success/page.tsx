"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/lib/store/cart-store"
import confetti from "canvas-confetti"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Clear the cart after successful checkout
    clearCart()

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#8b5cf6", "#ec4899", "#06b6d4"],
    })
  }, [clearCart])

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
          <p className="text-lg text-muted-foreground">
            Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de votre commande.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <Package className="h-8 w-8" />
              <div className="text-left">
                <p className="font-medium text-foreground">Livraison estimée</p>
                <p className="text-sm">3-5 jours ouvrés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/compte/commandes">
              Voir mes commandes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/boutique">Continuer mes achats</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
