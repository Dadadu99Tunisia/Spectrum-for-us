"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpDown, Eye, Calendar, Download } from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CommandesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentFilter, setCurrentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Données fictives pour la démo
  const orders = [
    {
      id: "CMD-7845",
      client: "Sophie Martin",
      email: "sophie.martin@example.com",
      date: "15/04/2023",
      montant: 89.99,
      statut: "Livré",
      produits: 2,
    },
    {
      id: "CMD-7844",
      client: "Thomas Dubois",
      email: "thomas.dubois@example.com",
      date: "14/04/2023",
      montant: 129.5,
      statut: "Expédié",
      produits: 3,
    },
    {
      id: "CMD-7843",
      client: "Emma Petit",
      email: "emma.petit@example.com",
      date: "14/04/2023",
      montant: 45.0,
      statut: "En préparation",
      produits: 1,
    },
    {
      id: "CMD-7842",
      client: "Lucas Bernard",
      email: "lucas.bernard@example.com",
      date: "13/04/2023",
      montant: 67.25,
      statut: "Livré",
      produits: 2,
    },
    {
      id: "CMD-7841",
      client: "Chloé Dupont",
      email: "chloe.dupont@example.com",
      date: "12/04/2023",
      montant: 34.99,
      statut: "Livré",
      produits: 1,
    },
    {
      id: "CMD-7840",
      client: "Antoine Leroy",
      email: "antoine.leroy@example.com",
      date: "11/04/2023",
      montant: 156.75,
      statut: "Annulé",
      produits: 4,
    },
    {
      id: "CMD-7839",
      client: "Julie Moreau",
      email: "julie.moreau@example.com",
      date: "10/04/2023",
      montant: 78.5,
      statut: "Livré",
      produits: 2,
    },
    {
      id: "CMD-7838",
      client: "Nicolas Fournier",
      email: "nicolas.fournier@example.com",
      date: "09/04/2023",
      montant: 112.3,
      statut: "Remboursé",
      produits: 3,
    },
  ]

  // Filtrer les commandes
  const filteredOrders = orders.filter((order) => {
    // Filtre de recherche
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre de statut
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "delivered" && order.statut === "Livré") ||
      (currentFilter === "processing" && (order.statut === "En préparation" || order.statut === "Expédié")) ||
      (currentFilter === "cancelled" && (order.statut === "Annulé" || order.statut === "Remboursé"))

    return matchesSearch && matchesFilter
  })

  // Trier les commandes
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "recent") {
      return (
        new Date(b.date.split("/").reverse().join("-")).getTime() -
        new Date(a.date.split("/").reverse().join("-")).getTime()
      )
    } else if (sortBy === "oldest") {
      return (
        new Date(a.date.split("/").reverse().join("-")).getTime() -
        new Date(b.date.split("/").reverse().join("-")).getTime()
      )
    } else if (sortBy === "amount_high") {
      return b.montant - a.montant
    } else if (sortBy === "amount_low") {
      return a.montant - b.montant
    }
    return 0
  })

  return (
    <VendeurLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Commandes</h1>
          <p className="text-muted-foreground">Gérez les commandes de vos clients</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une commande..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentFilter("all")}>Toutes les commandes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentFilter("delivered")}>Commandes livrées</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentFilter("processing")}>Commandes en cours</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentFilter("cancelled")}>
                Commandes annulées/remboursées
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Trier
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("recent")}>Plus récentes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>Plus anciennes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("amount_high")}>Montant (décroissant)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("amount_low")}>Montant (croissant)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Période
          </Button>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-background rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Commande</th>
                <th className="text-left py-3 px-4 font-medium">Client</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Montant</th>
                <th className="text-left py-3 px-4 font-medium">Statut</th>
                <th className="text-left py-3 px-4 font-medium">Produits</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-3 px-4">
                    <Link
                      href={`/vendeur/commandes/${order.id}`}
                      className="font-medium text-purple-600 hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{order.client}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{order.date}</td>
                  <td className="py-3 px-4 font-medium">{order.montant.toFixed(2)} €</td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        order.statut === "Livré"
                          ? "bg-green-500"
                          : order.statut === "Expédié"
                            ? "bg-blue-500"
                            : order.statut === "En préparation"
                              ? "bg-yellow-500"
                              : order.statut === "Annulé"
                                ? "bg-red-500"
                                : "bg-gray-500"
                      }
                    >
                      {order.statut}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{order.produits}</td>
                  <td className="py-3 px-4 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/vendeur/commandes/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedOrders.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </VendeurLayout>
  )
}
