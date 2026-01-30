import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ChevronRight, ArrowLeft } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/compte/commandes")
  }

  // Get user orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_email", user.email)
    .order("created_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Payée</Badge>
      case "processing":
        return <Badge className="bg-blue-500">En préparation</Badge>
      case "shipped":
        return <Badge className="bg-purple-500">Expédiée</Badge>
      case "delivered":
        return <Badge className="bg-gray-500">Livrée</Badge>
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/compte">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Mes commandes</h1>
        </div>

        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
              <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande.</p>
              <Button asChild>
                <Link href="/boutique">Découvrir nos produits</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Commande #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.order_items?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.product_name}
                        </span>
                        <span>{item.total_price.toFixed(2)} €</span>
                      </div>
                    ))}
                    {order.order_items?.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        + {order.order_items.length - 3} autre(s) article(s)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold">{order.total_amount.toFixed(2)} €</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/compte/commandes/${order.id}`}>
                        Voir les détails
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
