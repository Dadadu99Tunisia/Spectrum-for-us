"use client"

import { useProducts } from "@/hooks/use-api"
import { ProductCard } from "@/components/product-card"
import { ApiErrorHandler } from "@/components/api-error-handler"
import { Skeleton } from "@/components/ui/skeleton"

export function FeaturedProducts() {
  const { products, loading, error } = useProducts({ limit: 8 })

  if (error) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Produits en Vedette</h2>
          <ApiErrorHandler
            error={new Error(error)}
            title="Erreur de chargement des produits"
            description="Impossible de charger les produits en vedette"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Produits en Vedette</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de produits inclusifs créés par et pour notre communauté diversifiée
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Voir tous les produits
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
