import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Heart, Settings, CreditCard, MapPin, Store, LogOut } from "lucide-react"

export default async function AccountPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/compte")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get recent orders count
  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("customer_email", user.email)

  // Check if user is a vendor
  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, shop_name, status")
    .eq("user_id", user.id)
    .single()

  const menuItems = [
    {
      title: "Mes commandes",
      description: `${ordersCount || 0} commande(s)`,
      href: "/compte/commandes",
      icon: Package,
    },
    {
      title: "Mes favoris",
      description: "Produits sauvegardés",
      href: "/compte/favoris",
      icon: Heart,
    },
    {
      title: "Adresses",
      description: "Gérer mes adresses",
      href: "/compte/adresses",
      icon: MapPin,
    },
    {
      title: "Paiement",
      description: "Moyens de paiement",
      href: "/compte/paiement",
      icon: CreditCard,
    },
    {
      title: "Paramètres",
      description: "Modifier mon profil",
      href: "/compte/parametres",
      icon: Settings,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name || "Mon compte"}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Vendor Section */}
        {vendor ? (
          <Card className="mb-8 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{vendor.shop_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Statut: {vendor.status === "active" ? "Actif" : "En attente"}
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/vendeur/dashboard">Accéder à ma boutique</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Devenir vendeur</h3>
                  <p className="text-sm text-muted-foreground">Vendez vos créations sur Spectrum</p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/devenir-vendeur">En savoir plus</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <form action="/auth/signout" method="post">
          <Button variant="outline" className="w-full bg-transparent" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </form>
      </div>
    </main>
  )
}
