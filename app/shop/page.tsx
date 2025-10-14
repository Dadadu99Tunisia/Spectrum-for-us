"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Catégories simplifiées
const simpleCategories = [
  { id: "vetements", name: "Vêtements", subcategories: [] },
  { id: "accessoires", name: "Accessoires", subcategories: [] },
  { id: "bijoux", name: "Bijoux", subcategories: [] },
  { id: "maison", name: "Maison", subcategories: [] },
  { id: "beaute", name: "Beauté", subcategories: [] },
  { id: "art", name: "Art", subcategories: [] },
]

// Produits simplifiés
const simpleProducts = [
  {
    id: "product-1",
    name: "T-shirt Inclusif",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Vêtements",
  },
  {
    id: "product-2",
    name: "Bracelet Pride",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Bijoux",
  },
  {
    id: "product-3",
    name: "Accessoire Design",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessoires",
  },
]

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("categories")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique de recherche simplifiée
    console.log("Recherche:", searchQuery)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Inclusif</h1>

      {/* Barre de recherche simplifiée */}
      <div className="max-w-md mx-auto mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Rechercher des produits..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2" size="sm">
            Rechercher
          </Button>
        </form>
      </div>

      {/* Onglets simplifiés */}
      <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {simpleCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-primary text-xl">{category.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {simpleProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  <Badge className="absolute bottom-2 left-2 bg-primary">{product.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{product.price.toFixed(2)} €</span>
                    <Button size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
