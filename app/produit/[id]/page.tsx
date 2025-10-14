"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingBag, Share2, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)

  // Dans une application réelle, vous récupéreriez les données du produit à partir de l'API
  const product = {
    id: params.id,
    name: "T-shirt Pride Collection",
    price: 29.99,
    description:
      "T-shirt inclusif en coton biologique avec design arc-en-ciel. Coupe unisexe, disponible en plusieurs tailles et couleurs.",
    longDescription:
      "Ce t-shirt de notre collection Pride est fabriqué à partir de coton biologique 100% certifié, garantissant confort et durabilité. Avec sa coupe inclusive adaptée à tous les types de corps, il célèbre la diversité et l'expression de soi. Le design arc-en-ciel représente la fierté et la solidarité avec la communauté LGBTQ+. Chaque achat contribue à soutenir des organisations qui défendent les droits des personnes queer.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    colors: ["Blanc", "Noir", "Gris", "Bleu"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    reviewCount: 42,
    seller: {
      name: "QueerApparel",
      id: "seller1",
      rating: 4.9,
      verified: true,
    },
    category: "Vêtements",
    tags: ["Pride", "Inclusif", "Unisexe", "Coton bio"],
    inStock: true,
    shipping: "Livraison gratuite à partir de 50€",
    returns: "Retours gratuits sous 30 jours",
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images du produit */}
        <div className="space-y-4">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="relative h-24 rounded-md overflow-hidden cursor-pointer">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - vue ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Informations du produit */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-purple-500">{product.category}</Badge>
              {product.inStock ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  En stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Rupture de stock
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 fill-opacity-50" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} avis)
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Vendu par{" "}
                <Link href={`/vendeur/${product.seller.id}`} className="text-purple-600 hover:underline">
                  {product.seller.name}
                  {product.seller.verified && " ✓"}
                </Link>
              </div>
            </div>

            <div className="text-2xl font-bold mb-6">{product.price.toFixed(2)} €</div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Options du produit */}
            <div className="space-y-4 mb-6">
              {/* Couleurs */}
              <div>
                <label className="block text-sm font-medium mb-2">Couleur</label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`px-3 py-1 rounded-full border ${
                        selectedColor === color
                          ? "border-purple-600 bg-purple-50 text-purple-600 dark:bg-purple-950/30"
                          : "border-border hover:border-purple-600"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tailles */}
              <div>
                <label className="block text-sm font-medium mb-2">Taille</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                        selectedSize === size
                          ? "border-purple-600 bg-purple-50 text-purple-600 dark:bg-purple-950/30"
                          : "border-border hover:border-purple-600"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantité */}
              <div>
                <label className="block text-sm font-medium mb-2">Quantité</label>
                <div className="flex items-center w-32">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="h-10 w-12 flex items-center justify-center border-y border-input">{quantity}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Ajouter au Panier
              </Button>
              <Button variant="outline" className="flex-1" onClick={toggleFavorite}>
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current text-pink-500" : ""}`} />
                {isFavorite ? "Ajouté aux Favoris" : "Ajouter aux Favoris"}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Informations supplémentaires */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span>{product.shipping}</span>
              </div>
              <div className="flex items-start gap-2">
                <RotateCcw className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span>{product.returns}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span>Paiement sécurisé garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets d'informations */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="shipping">Livraison</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>{product.longDescription}</p>
            <h3>Caractéristiques</h3>
            <ul>
              <li>100% coton biologique certifié</li>
              <li>Coupe inclusive adaptée à tous les types de corps</li>
              <li>Design arc-en-ciel représentant la fierté</li>
              <li>Lavable en machine</li>
              <li>Fabriqué de manière éthique</li>
            </ul>
            <h3>Tags</h3>
            <div className="flex flex-wrap gap-2 not-prose">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Les avis seront bientôt disponibles.</p>
          </div>
        </TabsContent>
        <TabsContent value="shipping">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Informations de livraison à venir.</p>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

