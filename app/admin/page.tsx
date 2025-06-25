import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminProductsTable } from "@/components/admin/admin-products-table"
import { AdminOrdersTable } from "@/components/admin/admin-orders-table"
import { AdminUsersTable } from "@/components/admin/admin-users-table"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/connexion")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">Gérez votre marketplace Spectrum</p>
      </div>

      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <AdminStats />
      </Suspense>

      <Tabs defaultValue="products" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="sellers">Vendeurs</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Produits</CardTitle>
              <CardDescription>Gérez tous les produits de la marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Chargement des produits...</div>}>
                <AdminProductsTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Commandes</CardTitle>
              <CardDescription>Suivez et gérez toutes les commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Chargement des commandes...</div>}>
                <AdminOrdersTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Gérez les comptes utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Chargement des utilisateurs...</div>}>
                <AdminUsersTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Vendeurs</CardTitle>
              <CardDescription>Gérez les comptes vendeurs et leurs boutiques</CardDescription>
            </CardHeader>
            <CardContent>
              <div>Tableau des vendeurs à implémenter</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
