"use client"

import { useState } from "react"
import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight, Star, Truck, Shield, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductById, getFeaturedProducts } from "@/lib/data/products"
import { categories } from "@/lib/data/categories"
import ProductCard from "@/components/product-card"
import AddToCartButton from "@/components/add-to-cart-button"
import ProductImageGallery from "@/components/product-image-gallery"
import ProductReviews from "@/components/product-reviews"
import ProductOptions from "@/components/product-options"
import ProductActions from "@/components/product-actions"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors && product.colors.length > 0 ? product.colors[0] : undefined,
  )
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
  )

  // Si le produit n'existe pas, afficher des produits en vedette
  if (!product) {
    const featuredProducts = getFeaturedProducts(8)

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Découvrez nos produits en vedette</h1>
          <p className="text-muted-foreground">Explorez notre sélection de produits populaires et tendances.</p>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
      </main>
    )
  }

  // Trouver la catégorie et sous-catégorie du produit
  const category = categories.find((cat) => cat.id === product.categoryId)
  const subcategory = category?.subcategories.find((subcat) => subcat.id === product.subcategoryId)

  // Calculer le prix avec remise si applicable
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : null

  // Récupérer des produits similaires
  const similarProducts = getFeaturedProducts(4).filter((p) => p.id !== product.id)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-foreground">
          Shopping
        </Link>
        {category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/categorie/${category.id}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </>
        )}
        {subcategory && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/categorie/${category?.id}/${subcategory.id}`} className="hover:text-foreground">
              {subcategory.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      {/* Section principale du produit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Galerie d'images */}
        <div>
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Informations produit */}
        <div>
          <div className="mb-4">
            {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600 mb-2">Nouveau</Badge>}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              {product.rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviews?.length || 0} avis)
                  </span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Prix */}
            <div className="flex items-center gap-3 mb-6">
              {discountedPrice ? (
                <>
                  <span className="text-3xl font-bold">{discountedPrice.toFixed(2)} €</span>
                  <span className="text-xl text-muted-foreground line-through">{product.price.toFixed(2)} €</span>
                  <Badge className="bg-red-500 hover:bg-red-600 ml-2">-{product.discount}%</Badge>
                </>
              ) : (
                <span className="text-3xl font-bold">{product.price.toFixed(2)} €</span>
              )}
            </div>
          </div>

          {/* Options de produit */}
          <ProductOptions
            colors={product.colors}
            sizes={product.sizes}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
          />

          {/* Actions */}
          <div className="mt-6 space-y-4">
            <AddToCartButton product={product} selectedColor={selectedColor} selectedSize={selectedSize} />

            <ProductActions productId={product.id} productName={product.name} />
          </div>

          {/* Informations supplémentaires */}
          <div className="border-t pt-6 space-y-4 mt-6">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Livraison gratuite</h4>
                <p className="text-sm text-muted-foreground">Pour toute commande supérieure à 50€</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Garantie satisfaction</h4>
                <p className="text-sm text-muted-foreground">Retours gratuits sous 30 jours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Expédition rapide</h4>
                <p className="text-sm text-muted-foreground">Livraison en 2-4 jours ouvrés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets d'information */}
      <div className="mb-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none mb-6">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({product.reviews?.length || 0})</TabsTrigger>
            <TabsTrigger value="shipping">Livraison & Retours</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-2">
            <div className="prose max-w-none">
              <p>{product.longDescription || product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Caractéristiques</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Référence</span>
                    <span>{product.id}</span>
                  </li>
                  {category && (
                    <li className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Catégorie</span>
                      <span>{category.name}</span>
                    </li>
                  )}
                  {subcategory && (
                    <li className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Sous-catégorie</span>
                      <span>{subcategory.name}</span>
                    </li>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <li className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Tags</span>
                      <span>{product.tags.join(", ")}</span>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Informations complémentaires</h3>
                <ul className="space-y-2">
                  {product.sizes && product.sizes.length > 0 && (
                    <li className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Tailles disponibles</span>
                      <span>{product.sizes.join(", ")}</span>
                    </li>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <li className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Couleurs disponibles</span>
                      <span>{product.colors.join(", ")}</span>
                    </li>
                  )}
                  <li className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Stock</span>
                    <span>{product.stock > 0 ? `${product.stock} unités` : "Épuisé"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-2">
            <ProductReviews productId={product.id} reviews={product.reviews || []} />
          </TabsContent>
          <TabsContent value="shipping" className="pt-2">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Livraison</h3>
                <p className="text-muted-foreground mb-4">
                  Nous proposons plusieurs options de livraison pour répondre à vos besoins:
                </p>
                <ul className="space-y-2">
                  <li className="flex justify-between pb-2 border-b">
                    <span>Livraison standard</span>
                    <span>2-4 jours ouvrés (gratuit à partir de 50€)</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b">
                    <span>Livraison express</span>
                    <span>1-2 jours ouvrés (7,99€)</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b">
                    <span>Retrait en point relais</span>
                    <span>3-5 jours ouvrés (gratuit)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Politique de retour</h3>
                <p className="text-muted-foreground mb-4">
                  Nous voulons que vous soyez entièrement satisfait·e de votre achat:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Retours acceptés dans les 30 jours suivant la réception</li>
                  <li>Les articles doivent être dans leur état d'origine, non utilisés et avec étiquettes</li>
                  <li>Les frais de retour sont gratuits pour les échanges et remboursements</li>
                  <li>Remboursement effectué sur votre moyen de paiement original sous 5-7 jours ouvrés</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Produits similaires */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Vous pourriez aussi aimer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}
