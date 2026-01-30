"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Filter, Edit, Eye, ArrowUpDown, MoreHorizontal } from "lucide-react"
import VendeurLayout from "@/components/vendeur-layout"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProduitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentFilter, setCurrentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Données fictives pour la démo
  const products = [
    {
      id: "PRD-001",
      name: "T-shirt Pride Collection",
      price: 29.99,
      stock: 15,
      category: "Vêtements",
      status: "active",
      image: "/placeholder.svg?height=80&width=80",
      sales: 42,
      date: "12/01/2023",
    },
    {
      id: "PRD-002",
      name: "Boucles d'oreilles Arc-en-ciel",
      price: 34.99,
      stock: 8,
      category: "Bijoux",
      status: "active",
      image: "/placeholder.svg?height=80&width=80",
      sales: 28,
      date: "15/01/2023",
    },
    {
      id: "PRD-003",
      name: "Impression d'Art Inclusive",
      price: 24.99,
      stock: 20,
      category: "Art",
      status: "active",
      image: "/placeholder.svg?height=80&width=80",
      sales: 15,
      date: "20/01/2023",
    },
    {
      id: "PRD-004",
      name: "Kit de Soins Gender-Affirming",
      price: 49.99,
      stock: 5,
      category: "Beauté",
      status: "active",
      image: "/placeholder.svg?height=80&width=80",
      sales: 10,
      date: "25/01/2023",
    },
    {
      id: "PRD-005",
      name: "Drapeau Progress Pride",
      price: 19.99,
      stock: 0,
      category: "Décoration",
      status: "out_of_stock",
      image: "/placeholder.svg?height=80&width=80",
      sales: 30,
      date: "28/01/2023",
    },
    {
      id: "PRD-006",
      name: "Bracelet Pronoms Personnalisé",
      price: 15.99,
      stock: 12,
      category: "Bijoux",
      status: "active",
      image: "/placeholder.svg?height=80&width=80",
      sales: 22,
      date: "02/02/2023",
    },
    {
      id: "PRD-007",
      name: "Livre 'Histoires Queer'",
      price: 22.99,
      stock: 7,
      category: "Livres",
      status: "active",
      image: "/placeholder.svg?height=80&width=80",
      sales: 18,
      date: "05/02/2023",
    },
    {
      id: "PRD-008",
      name: "Masque Facial Pride",
      price: 12.99,
      stock: 0,
      category: "Accessoires",
      status: "draft",
      image: "/placeholder.svg?height=80&width=80",
      sales: 0,
      date: "10/02/2023",
    },
  ]

  // Filtrer les produits
  const filteredProducts = products.filter((product) => {
    // Filtre de recherche
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre de statut
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && product.status === "active") ||
      (currentFilter === "out_of_stock" && product.status === "out_of_stock") ||
      (currentFilter === "draft" && product.status === "draft")

    return matchesSearch && matchesFilter
  })

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "recent") {
      return (
        new Date(b.date.split("/").reverse().join("-")).getTime() -
        new Date(a.date.split("/").reverse().join("-")).getTime()
      )
    } else if (sortBy === "name_asc") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "name_desc") {
      return b.name.localeCompare(a.name)
    } else if (sortBy === "price_asc") {
      return a.price - b.price
    } else if (sortBy === "price_desc") {
      return b.price - a.price
    } else if (sortBy === "stock_asc") {
      return a.stock - b.stock
    } else if (sortBy === "stock_desc") {
      return b.stock - a.stock
    } else if (sortBy === "sales") {
      return b.sales - a.sales
    }
    return 0
  })

  return (
    <VendeurLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Produits</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de produits</p>
        </div>
        <Button asChild>
          <Link href="/vendeur/produits/ajouter">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un Produit
          </Link>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
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
              <DropdownMenuItem onClick={() => setCurrentFilter("all")}>Tous les produits</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentFilter("active")}>Produits actifs</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentFilter("out_of_stock")}>Rupture de stock</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentFilter("draft")}>Brouillons</DropdownMenuItem>
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
              <DropdownMenuItem onClick={() => setSortBy("recent")}>Plus récents</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name_asc")}>Nom (A-Z)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name_desc")}>Nom (Z-A)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price_asc")}>Prix (croissant)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price_desc")}>Prix (décroissant)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("stock_asc")}>Stock (croissant)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("stock_desc")}>Stock (décroissant)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("sales")}>Meilleures ventes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-background rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Produit</th>
                <th className="text-left py-3 px-4 font-medium">Catégorie</th>
                <th className="text-left py-3 px-4 font-medium">Prix</th>
                <th className="text-left py-3 px-4 font-medium">Stock</th>
                <th className="text-left py-3 px-4 font-medium">Statut</th>
                <th className="text-left py-3 px-4 font-medium">Ventes</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/vendeur/produits/${product.id}`} className="font-medium hover:text-purple-600">
                          {product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{product.category}</Badge>
                  </td>
                  <td className="py-3 px-4">{product.price.toFixed(2)} €</td>
                  <td className="py-3 px-4">
                    <span className={product.stock === 0 ? "text-red-600" : product.stock < 5 ? "text-yellow-600" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {product.status === "active" && <Badge className="bg-green-500">Actif</Badge>}
                    {product.status === "out_of_stock" && <Badge className="bg-red-500">Rupture</Badge>}
                    {product.status === "draft" && <Badge variant="outline">Brouillon</Badge>}
                  </td>
                  <td className="py-3 px-4">{product.sales}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/produit/${product.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/vendeur/produits/${product.id}/modifier`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </VendeurLayout>
  )
}
