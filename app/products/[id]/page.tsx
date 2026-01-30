"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock product data - replace with real Supabase query
    const mockProduct = {
      id: params.id,
      name: "Chemise Fluide Non-Genrée",
      price: 89,
      description:
        "Une chemise élégante et confortable, conçue pour tous les corps. Coupe ample et fluide, matières naturelles.",
      long_description:
        "Cette chemise représente notre engagement envers une mode inclusive et durable. Fabriquée à partir de lin biologique certifié, elle offre un confort exceptionnel tout en respectant l'environnement. La coupe a été pensée pour s'adapter à toutes les morphologies, avec des lignes épurées qui transcendent les genres.",
      category: "Mode",
      subcategory: "Essentiels",
      inclusivity: ["Non genré", "Tous corps", "Éco-responsable"],
      materials: ["Lin bio", "Boutons recyclés"],
      vendor: "Atelier Libre",
      images: ["/unisex-fluid-shirt-minimal.jpg"],
      stock: 15,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Crème", "Terracotta", "Lavande"],
      rating: 4.8,
      reviews: 24,
    }

    setProduct(mockProduct)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Produit non trouvé</h1>
        <Link href="/products">
          <Button>Retour au catalogue</Button>
        </Link>
      </div>
    )
  }

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
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
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
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>
              <p className="text-3xl font-bold text-primary">{product.price}€</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Inclusivity Badges */}
            <div className="flex flex-wrap gap-2">
              {product.inclusivity.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Vendor */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{product.vendor[0]}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Créé par</p>
                <p className="font-semibold">{product.vendor}</p>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button className="flex-1" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="materials">Matériaux</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({product.reviews})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-neutral max-w-none">
              <p className="text-muted-foreground leading-relaxed">{product.long_description}</p>
            </div>
          </TabsContent>
          <TabsContent value="materials" className="mt-6">
            <ul className="space-y-2">
              {product.materials.map((material: string) => (
                <li key={material} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{material}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <p className="text-muted-foreground">Les avis clients seront bientôt disponibles.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
