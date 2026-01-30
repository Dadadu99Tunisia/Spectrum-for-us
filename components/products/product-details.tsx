"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Truck, Shield, RotateCcw, CheckCircle, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/providers/cart-provider"
import { AddToWishlist } from "@/components/products/add-to-wishlist"
import type { Product, Review, Vendor, Category, Profile } from "@/lib/types"

interface ProductDetailsProps {
  product: Product & {
    vendors: Vendor
    categories: Category | null
  }
  reviews: (Review & { profiles: Profile })[]
}

export function ProductDetails({ product, reviews }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const images =
    product.images?.length > 0
      ? product.images
      : [`/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)}`]

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await addItem(product.id)
    }
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        {product.categories && (
          <>
            <Link href={`/categories/${product.categories.slug}`} className="hover:text-foreground">
              {product.categories.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-lg px-3 py-1">
                -{discount}%
              </Badge>
            )}
            <AddToWishlist productId={product.id} variant="icon" className="absolute top-4 right-4" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Vendor */}
          <Link
            href={`/vendors/${product.vendors.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={product.vendors.store_logo || undefined} />
              <AvatarFallback>{product.vendors.store_name[0]}</AvatarFallback>
            </Avatar>
            {product.vendors.store_name}
            {product.vendors.is_verified && <CheckCircle className="h-4 w-4 text-primary" />}
          </Link>

          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(Number(product.rating)) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {Number(product.rating).toFixed(1)} ({product.review_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">${Number(product.price).toFixed(2)}</span>
            {product.compare_at_price && (
              <span className="text-xl text-muted-foreground line-through">
                ${Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          {product.stock > 0 ? (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              In Stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-sm text-destructive">Out of Stock</p>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <AddToWishlist productId={product.id} variant="icon" />
          </div>

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <Truck className="h-6 w-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Free Shipping</span>
              <span className="text-xs text-muted-foreground">Orders $50+</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <Shield className="h-6 w-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Secure Payment</span>
              <span className="text-xs text-muted-foreground">100% Protected</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <RotateCcw className="h-6 w-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Easy Returns</span>
              <span className="text-xs text-muted-foreground">30 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger
            value="vendor"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            About Seller
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {product.description || "No description available."}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.profiles?.avatar_url || undefined} />
                      <AvatarFallback>{review.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.profiles?.full_name || "Anonymous"}</span>
                        {review.is_verified_purchase && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && <h4 className="font-medium mt-2">{review.title}</h4>}
                      {review.comment && <p className="text-muted-foreground mt-1">{review.comment}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </TabsContent>
        <TabsContent value="vendor" className="mt-6">
          <Link href={`/vendors/${product.vendors.id}`}>
            <div className="flex items-start gap-4 p-6 rounded-lg border hover:bg-muted/50 transition-colors">
              <Avatar className="h-16 w-16">
                <AvatarImage src={product.vendors.store_logo || undefined} />
                <AvatarFallback className="text-2xl">{product.vendors.store_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{product.vendors.store_name}</h3>
                  {product.vendors.is_verified && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {Number(product.vendors.rating).toFixed(1)}
                  </div>
                  <span>{product.vendors.total_sales} sales</span>
                </div>
                <p className="text-primary text-sm mt-2">View Store →</p>
              </div>
            </div>
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  )
}
