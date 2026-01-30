"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock favorites data
const mockFavorites = [
  {
    id: "1",
    name: "Chemise fluide unisexe",
    price: 89,
    image: "/unisex-fluid-shirt-minimal.jpg",
    category: "Mode",
    vendor: "Atelier Libre",
    inStock: true,
  },
  {
    id: "2",
    name: "Bijou artisanal fluide",
    price: 65,
    image: "/fluid-artisan-jewelry-queer.jpg",
    category: "Accessoires",
    vendor: "Créations Queer",
    inStock: true,
  },
  {
    id: "3",
    name: "Sérum visage neutre",
    price: 42,
    image: "/minimal-serum-bottle-skincare.jpg",
    category: "Beauté",
    vendor: "Soin Inclusif",
    inStock: false,
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites)
  const [sortBy, setSortBy] = useState("recent")

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((item) => item.id !== id))
  }

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price
    if (sortBy === "price-desc") return b.price - a.price
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white pb-24 lg:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Mes Favoris</h1>
          </div>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? "produit" : "produits"} dans votre liste
          </p>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun favori pour le moment</h2>
            <p className="text-gray-600 mb-6">
              Commencez à ajouter des produits à vos favoris pour les retrouver facilement
            </p>
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500">
              <Link href="/products">Découvrir le catalogue</Link>
            </Button>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récents</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedFavorites.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!item.inStock && <Badge className="absolute top-3 left-3 bg-red-500">Rupture de stock</Badge>}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-md"
                      onClick={() => removeFavorite(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs mb-2">
                        {item.category}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.vendor}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-gray-900">{item.price} €</span>
                      <Button
                        size="sm"
                        disabled={!item.inStock}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">Continuer mes achats</Link>
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                disabled={favorites.length === 0 || favorites.every((f) => !f.inStock)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Tout ajouter au panier
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
