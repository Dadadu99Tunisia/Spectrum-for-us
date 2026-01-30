"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"
import { useAuthStore } from "@/lib/store/auth-store"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  totalSales: number
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  revenueChange: number
  ordersChange: number
}

interface RecentOrder {
  id: string
  order_number: string
  created_at: string
  total: number
  status: string
  customer_name: string
}

export default function VendeurDashboard() {
  const { vendor, profile } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenueChange: 12,
    ordersChange: 8,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!vendor?.id) {
        setIsLoading(false)
        return
      }

      const supabase = createClient()

      try {
        // Fetch products count
        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("vendor_id", vendor.id)

        // Fetch order items for this vendor
        const { data: orderItems } = await supabase
          .from("order_items")
          .select(`
            *,
            order:orders(order_number, created_at, status, user_id)
          `)
          .eq("vendor_id", vendor.id)
          .order("created_at", { ascending: false })
          .limit(10)

        const totalRevenue = orderItems?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0
        const totalOrders = new Set(orderItems?.map((item) => item.order_id)).size

        setStats({
          totalSales: vendor.total_sales || 0,
          totalRevenue,
          totalOrders,
          totalProducts: productsCount || 0,
          revenueChange: 12,
          ordersChange: 8,
        })

        // Format recent orders
        const formattedOrders =
          orderItems?.slice(0, 5).map((item) => ({
            id: item.order_id,
            order_number: item.order?.order_number || "N/A",
            created_at: item.created_at,
            total: item.total_price,
            status: item.vendor_status,
            customer_name: "Client",
          })) || []

        setRecentOrders(formattedOrders)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [vendor?.id])

  // Demo data if no vendor yet
  const demoStats = {
    totalSales: 1245,
    totalRevenue: 3850,
    totalOrders: 124,
    totalProducts: 45,
    revenueChange: 12,
    ordersChange: -5,
  }

  const demoOrders = [
    {
      id: "1",
      order_number: "ORD-20231215-0001",
      created_at: "2023-12-15",
      total: 89.99,
      status: "delivered",
      customer_name: "Sophie M.",
    },
    {
      id: "2",
      order_number: "ORD-20231214-0002",
      created_at: "2023-12-14",
      total: 129.5,
      status: "shipped",
      customer_name: "Thomas D.",
    },
    {
      id: "3",
      order_number: "ORD-20231214-0003",
      created_at: "2023-12-14",
      total: 45.0,
      status: "processing",
      customer_name: "Emma P.",
    },
    {
      id: "4",
      order_number: "ORD-20231213-0004",
      created_at: "2023-12-13",
      total: 67.25,
      status: "pending",
      customer_name: "Lucas B.",
    },
  ]

  const displayStats = vendor ? stats : demoStats
  const displayOrders = vendor ? recentOrders : demoOrders

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmée", className: "bg-blue-100 text-blue-800" },
      processing: { label: "En préparation", className: "bg-purple-100 text-purple-800" },
      shipped: { label: "Expédiée", className: "bg-cyan-100 text-cyan-800" },
      delivered: { label: "Livrée", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Annulée", className: "bg-red-100 text-red-800" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <VendeurLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue, {vendor?.shop_name || profile?.display_name || "Vendeur"}
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Link href="/vendeur/produits/ajouter">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus ce mois</p>
                  <p className="text-2xl font-bold mt-1">{displayStats.totalRevenue.toFixed(2)} €</p>
                  <div
                    className={`flex items-center text-xs mt-1 ${displayStats.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {displayStats.revenueChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(displayStats.revenueChange)}% vs mois dernier
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commandes</p>
                  <p className="text-2xl font-bold mt-1">{displayStats.totalOrders}</p>
                  <div
                    className={`flex items-center text-xs mt-1 ${displayStats.ordersChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {displayStats.ordersChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(displayStats.ordersChange)}% vs mois dernier
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Produits actifs</p>
                  <p className="text-2xl font-bold mt-1">{displayStats.totalProducts}</p>
                  <Link href="/vendeur/produits" className="text-xs text-purple-600 hover:underline mt-1 inline-block">
                    Gérer les produits
                  </Link>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ventes totales</p>
                  <p className="text-2xl font-bold mt-1">{displayStats.totalSales}</p>
                  <p className="text-xs text-muted-foreground mt-1">Depuis l'inscription</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>Les dernières commandes reçues</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/vendeur/commandes">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {displayOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-sm">Commande</th>
                      <th className="pb-3 font-medium text-sm">Client</th>
                      <th className="pb-3 font-medium text-sm">Date</th>
                      <th className="pb-3 font-medium text-sm">Montant</th>
                      <th className="pb-3 font-medium text-sm">Statut</th>
                      <th className="pb-3 font-medium text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-3 text-sm font-medium">{order.order_number}</td>
                        <td className="py-3 text-sm">{order.customer_name}</td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 text-sm font-medium">{order.total.toFixed(2)} €</td>
                        <td className="py-3">{getStatusBadge(order.status)}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/vendeur/commandes/${order.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Link href="/vendeur/produits/ajouter" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <PlusCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Ajouter un produit</h3>
                  <p className="text-sm text-muted-foreground">Créer une nouvelle fiche produit</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Link href="/vendeur/boutique" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Voir ma boutique</h3>
                  <p className="text-sm text-muted-foreground">Aperçu de votre vitrine</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Link href="/vendeur/statistiques" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Statistiques</h3>
                  <p className="text-sm text-muted-foreground">Analyser vos performances</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendeurLayout>
  )
}
