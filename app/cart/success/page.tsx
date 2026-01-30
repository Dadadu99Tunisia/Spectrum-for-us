"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Package, Truck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Clear the cart on successful checkout
    localStorage.removeItem("spectrum_cart")
    
    // Dispatch event to update cart in other components
    window.dispatchEvent(new Event("cart-updated"))
    
    // Small delay to show loading state
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Commande confirmee !</h1>

          <p className="text-muted-foreground mb-6">
            Merci pour votre achat sur Spectrum for Us. Votre commande a ete confirmee et sera traitee par nos vendeur·euse·s.
          </p>

          {/* Order info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>Un email de confirmation vous a ete envoye</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Chaque vendeur·euse expediera directement votre commande</span>
            </div>
          </div>

          {/* What's next */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 text-left">
            <p className="font-medium mb-2">Prochaines etapes</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Les vendeur·euse·s preparent vos articles</li>
              <li>• Vous recevrez un email avec le suivi de chaque colis</li>
              <li>• Suivez vos commandes dans votre espace personnel</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg">
              <Link href="/orders">Voir mes commandes</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/products">Continuer mes achats</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
