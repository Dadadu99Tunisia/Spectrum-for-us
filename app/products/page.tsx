"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart, Heart, Search, Filter, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  category: string
  subcategory?: string
  image_url: string | null
  stock: number
  vendor_id: string
  vendor?: {
    id: string
    name: string
    avatar_url: string | null
  }
  inclusivity?: string
  materials?: string
  tags?: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [sortBy, setSortBy] = useState("newest")
  const [cart, setCart] = useState<Product[]>([])

  const supabase = createClient()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      // First fetch products
      let query = supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .order('created_at', { ascending: false })

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory)
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      query = query.gte('price', priceRange[0]).lte('price', priceRange[1])

      const { data: productsData, error: productsError } = await query

      if (productsError) {
        console.error('[v0] Error fetching products:', productsError)
        setProducts([])
        return
      }

      if (!productsData || productsData.length === 0) {
        setProducts([])
        return
      }

      // Get unique vendor IDs
      const vendorIds = [...new Set(productsData.map(p => p.vendor_id).filter(Boolean))]

      // Fetch vendor profiles
      let vendorMap: Record<string, { id: string; name: string; avatar_url: string | null }> = {}
      
      if (vendorIds.length > 0) {
        const { data: vendorsData } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', vendorIds)

        if (vendorsData) {
          vendorMap = vendorsData.reduce((acc, vendor) => {
            acc[vendor.id] = vendor
            return acc
          }, {} as Record<string, { id: string; name: string; avatar_url: string | null }>)
        }
      }

      // Combine products with vendor data
      let combined = productsData.map(product => ({
        ...product,
        vendor: vendorMap[product.vendor_id] || null
      }))
      
      // Sort
      switch (sortBy) {
        case "price-low":
          combined = combined.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          combined = combined.sort((a, b) => b.price - a.price)
          break
        case "name":
          combined = combined.sort((a, b) => a.name.localeCompare(b.name))
          break
      }
      
      setProducts(combined)
    } catch (error) {
      console.error('[v0] Error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [supabase, selectedCategory, searchQuery, priceRange, sortBy])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("spectrum_cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const categories = [
    "Mode", "Accessoires", "Beaute", "Bien-etre", 
    "Maison", "Culture", "Sexualite & Intimite"
  ]

  const addToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      quantity: 1,
      image: product.image_url || "/placeholder.svg",
      vendorId: product.vendor_id,
      vendorName: product.vendor?.name || "Vendeur",
    }
    
    const existingCart = JSON.parse(localStorage.getItem("spectrum_cart") || "[]")
    const existingIndex = existingCart.findIndex((item: any) => item.id === product.id)
    
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem("spectrum_cart", JSON.stringify(existingCart))
    setCart(existingCart)
  }

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)
    localStorage.setItem("spectrum_cart", JSON.stringify(newCart))
    setCart(newCart)
  }

  const cartTotal = cart.reduce((sum, item: any) => sum + (item.price * (item.quantity || 1)), 0)

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setPriceRange([0, 200])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">Shop</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Decouvrez des creations uniques par et pour la communaute queer
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Search and Cart */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
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
              <Button variant="outline" className="relative bg-transparent w-full sm:w-auto">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Panier
                {cart.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Votre Panier</SheetTitle>
                <SheetDescription>
                  {cart.length} article{cart.length > 1 ? "s" : ""}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-4 max-h-[60vh] overflow-y-auto">
                {cart.map((item: any, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b">
                    <Image
                      src={item.image || item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price}€ x {item.quantity || 1}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeFromCart(index)} className="flex-shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-center text-muted-foreground py-8">Votre panier est vide</p>}
              </div>
              {cart.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{cartTotal.toFixed(2)}€</span>
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Passer la commande</Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="h-4 w-4" />
                    Filtres
                  </CardTitle>
                  {(selectedCategory !== "all" || priceRange[0] !== 0 || priceRange[1] !== 200) && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
                      Reinitialiser
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Categorie</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Filter */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Prix: {priceRange[0]}€ - {priceRange[1]}€
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={200}
                    step={5}
                    className="mt-2"
                  />
                </div>

                {/* Sort */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Trier par</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Plus recents</SelectItem>
                      <SelectItem value="price-low">Prix croissant</SelectItem>
                      <SelectItem value="price-high">Prix decroissant</SelectItem>
                      <SelectItem value="name">Nom A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">Aucun produit trouve</p>
                  <Button onClick={clearAllFilters}>Reinitialiser les filtres</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {products.length} produit{products.length > 1 ? "s" : ""} trouve{products.length > 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="group overflow-hidden">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <Link href={`/products/${product.id}`}>
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </Link>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        {product.stock < 5 && product.stock > 0 && (
                          <Badge className="absolute top-2 left-2" variant="destructive">
                            Plus que {product.stock}
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/products/${product.id}`}>
                              <CardTitle className="text-base line-clamp-1 hover:text-primary transition-colors">
                                {product.name}
                              </CardTitle>
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.vendor?.name || "Vendeur Spectrum"}
                            </p>
                          </div>
                          <p className="font-bold text-lg whitespace-nowrap">
                            {product.price}€
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        {product.category && (
                          <Badge variant="outline" className="mt-2">
                            {product.category}
                          </Badge>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
