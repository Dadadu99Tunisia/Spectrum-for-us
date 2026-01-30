"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Truck, Shield, Store, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  category: string
  image_url: string | null
  stock: number
  vendor_id: string
  vendor?: {
    id: string
    name: string
    avatar_url: string | null
    bio: string | null
  }
}

interface ShippingSettings {
  free_shipping_threshold: number
  base_shipping_rate: number
  processing_time_days: number
}

interface RelatedProduct {
  id: string
  name: string
  price: number
  image_url: string | null
  currency: string
}

interface Props {
  product: Product
  shippingSettings: ShippingSettings | null
  relatedProducts: RelatedProduct[]
}

export default function ProductDetailClient({ product, shippingSettings, relatedProducts }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const addToCart = () => {
    setIsAddingToCart(true)
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      quantity: quantity,
      image: product.image_url || "/placeholder.svg",
      vendorId: product.vendor_id,
      vendorName: product.vendor?.name || "Vendeur",
      shippingCost: shippingSettings?.base_shipping_rate || 0,
      processingTime: shippingSettings?.processing_time_days 
        ? `${shippingSettings.processing_time_days} jour${shippingSettings.processing_time_days > 1 ? 's' : ''}`
        : "2-5 jours",
    }
    
    const existingCart = JSON.parse(localStorage.getItem("spectrum_cart") || "[]")
    const existingIndex = existingCart.findIndex((item: any) => item.id === product.id)
    
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += quantity
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem("spectrum_cart", JSON.stringify(existingCart))
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new Event("cart-updated"))
    
    setTimeout(() => setIsAddingToCart(false), 500)
  }

  const freeShippingThreshold = shippingSettings?.free_shipping_threshold || 50
  const shippingCost = product.price * quantity >= freeShippingThreshold 
    ? 0 
    : (shippingSettings?.base_shipping_rate || 5.99)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-balance">{product.name}</h1>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
                {product.stock < 10 && product.stock > 0 && (
                  <Badge variant="destructive">Plus que {product.stock} en stock</Badge>
                )}
              </div>
              <p className="text-3xl font-bold text-primary">{product.price}€</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Vendor Info */}
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {product.vendor?.avatar_url ? (
                    <Image
                      src={product.vendor.avatar_url || "/placeholder.svg"}
                      alt={product.vendor.name || ""}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <Store className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Vendu par</p>
                  <Link href={`/creators/${product.vendor_id}`} className="font-semibold hover:text-primary transition-colors">
                    {product.vendor?.name || "Vendeur Spectrum"}
                  </Link>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Voir la boutique
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">Livraison gratuite</span>
                    ) : (
                      <>Livraison: <span className="font-medium">{shippingCost.toFixed(2)}€</span></>
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Livraison gratuite des {freeShippingThreshold}€ d'achats chez ce vendeur
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Protection acheteur Spectrum</span>
                </div>
              </CardContent>
            </Card>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantite:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={addToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAddingToCart ? "Ajoute!" : product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <p className="text-sm text-center text-muted-foreground">
                {product.stock > 0 ? `${product.stock} disponible${product.stock > 1 ? 's' : ''}` : "Rupture de stock"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="shipping">Livraison</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-neutral max-w-none">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Delais de preparation:</span>
                <span>{shippingSettings?.processing_time_days || 2}-{(shippingSettings?.processing_time_days || 2) + 3} jours ouvrables</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Retours:</span>
                <span>14 jours pour changer d'avis</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <p className="text-muted-foreground">Les avis clients seront bientot disponibles.</p>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Du meme vendeur</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/products/${related.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative bg-muted">
                      <Image
                        src={related.image_url || "/placeholder.svg"}
                        alt={related.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm line-clamp-1">{related.name}</p>
                      <p className="text-primary font-bold">{related.price}€</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
