"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, DollarSign, PlusCircle, TrendingUp } from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"

export default function VendeurDashboard() {
  const [activeTab, setActiveTab] = useState("apercu")

  // Données fictives pour la démo
  const stats = {
    ventes: {
      total: 1245,
      pourcentage: 12,
      augmentation: true,
    },
    revenus: {
      total: 3850,
      pourcentage: 8,
      augmentation: true,
    },
    visiteurs: {
      total: 5678,
      pourcentage: 15,
      augmentation: true,
    },
    commandes: {
      total: 124,
      pourcentage: 5,
      augmentation: false,
    },
  }

  const recentOrders = [
    { id: "CMD-7845", client: "Sophie Martin", date: "15/04/2023", montant: 89.99, statut: "Livré" },
    { id: "CMD-7844", client: "Thomas Dubois", date: "14/04/2023", montant: 129.5, statut: "Expédié" },
    { id: "CMD-7843", client: "Emma Petit", date: "14/04/2023", montant: 45.0, statut: "En préparation" },
    { id: "CMD-7842", client: "Lucas Bernard", date: "13/04/2023", montant: 67.25, statut: "Livré" },
    { id: "CMD-7841", client: "Chloé Dupont", date: "12/04/2023", montant: 34.99, statut: "Livré" },
  ]

  const lowStockProducts = [
    { id: "PRD-001", name: "T-shirt Pride Collection", stock: 3, image: "/placeholder.svg?height=50&width=50" },
    { id: "PRD-015", name: "Bracelet Rainbow", stock: 2, image: "/placeholder.svg?height=50&width=50" },
    { id: "PRD-023", name: "Tote Bag Inclusif", stock: 5, image: "/placeholder.svg?height=50&width=50" },
  ]

  return (
    <VendeurLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground">Bienvenue, QueerApparel</p>
        </div>
        <Button asChild>
          <Link href="/vendeur/produits/ajouter">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un Produit
          </Link>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Ventes ce mois</p>
                <h3 className="text-2xl font-bold">{stats.ventes.total} €</h3>
                <div
                  className={`flex items-center text-xs mt-1 ${stats.ventes.augmentation ? "text-green-600" : "text-red-600"}`}
                >
                  {stats.ventes.augmentation ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                  )}
                  <span>{stats.ventes.pourcentage}% par rapport au mois dernier</span>
                </div>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Revenus nets</p>
                <h3 className="text-2xl font-bold">{stats.revenus.total} €</h3>
                <div
                  className={`flex items-center text-xs mt-1 ${stats.revenus.augmentation ? "text-green-600" : "text-red-600"}`}
                >
                  {stats.revenus.augmentation ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                  )}
                  <span>{stats.revenus.pourcentage}% par rapport au mois dernier</span>
                </div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Visiteurs</p>
                <h3 className="text-2xl font-bold">{stats.visiteurs.total}</h3>
                <div
                  className={`flex items-center text-xs mt-1 ${stats.visiteurs.augmentation ? "text-green-600" : "text-red-600"}`}
                >
                  {stats.visiteurs.augmentation ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                  )}
                  <span>{stats.visiteurs.pourcentage}% par rapport au mois dernier</span>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Commandes</p>
                <h3 className="text-2xl font-bold">{stats.commandes.total}</h3>
                <div
                  className={`flex items-center text-xs mt-1 ${stats.commandes.augmentation ? "text-green-600" : "text-red-600"}`}
                >
                  {stats.commandes.augmentation ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                  )}
                  <span>{stats.commandes.pourcentage}% par rapport au mois dernier</span>
                </div>
              </div>
              <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                <Package className="h-5 w-5 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commandes récentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Commandes Récentes</CardTitle>
            <CardDescription>Les 5 dernières commandes reçues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">ID</th>
                    <th className="text-left py-3 px-2 font-medium">Client</th>
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">Montant</th>
                    <th className="text-left py-3 px-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 px-2">
                        <Link href={`/vendeur/commandes/${order.id}`} className="text-purple-600 hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3 px-2">{order.client}</td>
                      <td className="py-3 px-2">{order.date}</td>
                      <td className="py-3 px-2">{order.montant.toFixed(2)} €</td>
                      <td className="py-3 px-2">
                        <Badge
                          className={
                            order.statut === "Livré"
                              ? "bg-green-500"
                              : order.statut === "Expédié"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                          }
                        >
                          {order.statut}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/vendeur/commandes">Voir toutes les commandes</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Produits en stock faible */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Faible</CardTitle>
            <CardDescription>Produits à réapprovisionner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/vendeur/produits/${product.id}`}
                      className="text-sm font-medium hover:text-purple-600 truncate block"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    {product.stock} en stock
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/vendeur/produits">Gérer l'inventaire</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </VendeurLayout>
  )
}
