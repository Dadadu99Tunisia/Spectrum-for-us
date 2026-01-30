import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Package, Truck, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { products } from "@/lib/data/products"

// Simuler un panier avec quelques produits
const cartItems = [
  { productId: "prod-001", quantity: 1 },
  { productId: "prod-006", quantity: 2 },
  { productId: "prod-008", quantity: 1 },
]

export default function OrderSuccessPage() {
  // Générer un numéro de commande aléatoire
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  // Date de livraison estimée (7 jours à partir d'aujourd'hui)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 7)
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

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

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-muted-foreground">
            Merci pour votre commande. Nous vous avons envoyé un email de confirmation à votre adresse email.
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="font-semibold mb-1">Numéro de commande</h2>
              <p className="text-muted-foreground">{orderNumber}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline">
                <Link href="/account/orders">Voir mes commandes</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-start gap-2">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Commande confirmée</h3>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Livraison estimée</h3>
                <p className="text-sm text-muted-foreground">{formattedDeliveryDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Adresse de livraison</h3>
                <p className="text-sm text-muted-foreground">123 Rue de Paris, 75001 Paris</p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          <h2 className="font-semibold mb-4">Récapitulatif de la commande</h2>

          <div className="space-y-4 mb-6">
            {cartProducts.map((item) => (
              <div key={item.productId} className="flex gap-4">
                <div className="w-20 h-20 bg-muted rounded-md overflow-hidden relative flex-shrink-0">
                  <Image
                    src={item.product?.images[0] || "/placeholder.svg?height=80&width=80"}
                    alt={item.product?.name || "Produit"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.product?.name}</h3>
                    <span className="font-medium">
                      {(
                        (item.product?.discount
                          ? item.product.price * (1 - item.product.discount / 100)
                          : item.product?.price || 0) * item.quantity
                      ).toFixed(2)}{" "}
                      €
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                  {item.product?.discount && (
                    <p className="text-sm text-red-500">-{item.product.discount}% de réduction</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator className="mb-4" />

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span>{shippingCost === 0 ? "Gratuite" : `${shippingCost.toFixed(2)} €`}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Des questions sur votre commande ? Contactez notre service client.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/shop">Continuer mes achats</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/support">
                Contacter le support
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
