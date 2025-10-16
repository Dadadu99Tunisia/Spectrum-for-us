"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart, Heart, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const mockProducts = [
  {
    id: "1",
    name: "Veste oversized non-genrée",
    description: "Coupe ample et confortable, matières durables. Pour tous les corps.",
    price: 89,
    currency: "EUR",
    category: "Mode",
    inclusivity: "Non-genré",
    materials: "Coton bio",
    image_url: "/oversized-gender-neutral-jacket-fashion.jpg",
    vendor: { name: "Atelier Fluide", avatar_url: null },
    stock: 15,
    tags: ["sustainable", "unisex", "comfort"],
  },
  {
    id: "2",
    name: 'Affiche "Belonging"',
    description: "Illustration originale célébrant la diversité et l'appartenance.",
    price: 35,
    currency: "EUR",
    category: "Art",
    inclusivity: "Inclusif",
    materials: "Papier recyclé",
    image_url: "/queer-art-poster-belonging-illustration.jpg",
    vendor: { name: "Studio Prisme", avatar_url: null },
    stock: 50,
    tags: ["art", "poster", "inclusive"],
  },
  {
    id: "3",
    name: "Bijoux artisanaux fluides",
    description: "Pièces uniques créées à la main, design androgyne et élégant.",
    price: 65,
    currency: "EUR",
    category: "Accessoires",
    inclusivity: "Fluide",
    materials: "Argent recyclé",
    image_url: "/fluid-artisan-jewelry-queer.jpg",
    vendor: { name: "Créations Libres", avatar_url: null },
    stock: 8,
    tags: ["jewelry", "handmade", "unique"],
  },
  {
    id: "4",
    name: 'Livre "Voix Queers"',
    description: "Recueil de témoignages et récits de la communauté LGBTQIA+.",
    price: 22,
    currency: "EUR",
    category: "Livres",
    inclusivity: "Communautaire",
    materials: "Papier FSC",
    image_url: "/queer-voices-book-cover-diverse.jpg",
    vendor: { name: "Éditions Spectre", avatar_url: null },
    stock: 100,
    tags: ["book", "stories", "community"],
  },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedInclusivity, setSelectedInclusivity] = useState<string[]>([])
  const [cart, setCart] = useState<any[]>([])

  const categories = ["Tous", "Mode", "Art", "Accessoires", "Livres", "Maison", "Beauté"]
  const inclusivityOptions = ["Non-genré", "Inclusif", "Fluide", "Communautaire", "Accessible"]

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesInclusivity = selectedInclusivity.length === 0 || selectedInclusivity.includes(product.inclusivity)

    return matchesSearch && matchesCategory && matchesPrice && matchesInclusivity
  })

  const addToCart = (product: any) => {
    setCart([...cart, product])
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-balance mb-4">Shop</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Découvrez des créations uniques par et pour la communauté queer
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Cart */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative bg-transparent">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Panier ({cart.length})
                {cart.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Votre Panier</SheetTitle>
                <SheetDescription>
                  {cart.length} article{cart.length > 1 ? "s" : ""}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price}€</p>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-center text-muted-foreground py-8">Votre panier est vide</p>}
              </div>
              {cart.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{cartTotal}€</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Passer la commande
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="mb-2 block">Catégorie</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="mb-2 block">
                    Prix: {priceRange[0]}€ - {priceRange[1]}€
                  </Label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={200} step={5} className="mt-2" />
                </div>

                {/* Inclusivity Filter */}
                <div>
                  <Label className="mb-3 block">Inclusivité</Label>
                  <div className="space-y-2">
                    {inclusivityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={selectedInclusivity.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedInclusivity([...selectedInclusivity, option])
                            } else {
                              setSelectedInclusivity(selectedInclusivity.filter((i) => i !== option))
                            }
                          }}
                        />
                        <Label htmlFor={option} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
              </p>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                  <SelectItem value="popular">Populaires</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <CardHeader className="p-0 relative">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6 flex-1">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <Badge variant="secondary">{product.category}</Badge>
                      <Badge variant="outline">{product.inclusivity}</Badge>
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mb-4">{product.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">{product.price}€</p>
                      <p className="text-xs text-muted-foreground">par {product.vendor.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{product.materials}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/products/${product.id}`}>Voir détails</Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Aucun produit ne correspond à vos critères</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setPriceRange([0, 200])
                    setSelectedInclusivity([])
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
