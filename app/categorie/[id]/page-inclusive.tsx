"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { categories } from "@/app/api/categories/route"
import { products } from "@/lib/data/products"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSorting } from "@/components/product-sorting"
import { Button } from "@/components/ui/button"
import { ChevronDown, Filter, Grid, List, Heart, Users, Sparkles } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface InclusiveCategoryPageProps {
  params: {
    id: string
  }
}

export default function InclusiveCategoryPage({ params }: InclusiveCategoryPageProps) {
  const isMobile = useMobile()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    colors: [],
    sizes: [],
    brands: [],
    inclusive: true,
  })

  const category = categories.find((cat) => cat.id === params.id)

  if (!category) {
    notFound()
  }

  // Filtrer les produits inclusifs par catégorie
  const inclusiveProducts = products.filter(
    (product) => product.category === params.id && product.tags?.includes("inclusive"),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header inclusif */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-pink-500" />
              <Users className="h-6 w-6 text-purple-500" />
              <Sparkles className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              {category.name} Inclusif
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de produits {category.name.toLowerCase()} conçus pour célébrer la diversité et
              l'inclusion. Chaque article raconte une histoire d'authenticité et d'acceptation.
            </p>
            <p className="mt-2 text-purple-600 font-medium">
              {inclusiveProducts.length} produits inclusifs disponibles
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bannière inclusive */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-8 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">🏳️‍🌈 Collection Inclusive</h2>
          <p className="text-purple-100">
            Produits créés par et pour la communauté LGBTQ+. Chaque achat soutient des créateurs queer.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres inclusifs */}
          {showFilters && (
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-4">Filtres Inclusifs</h3>
                <ProductFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </div>
          )}

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Contrôles */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {inclusiveProducts.length} produit{inclusiveProducts.length > 1 ? "s" : ""} inclusif
                {inclusiveProducts.length > 1 ? "s" : ""}
              </p>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filtres</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>

                <ProductSorting sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            </div>

            {/* Grille de produits inclusifs */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {inclusiveProducts.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    🏳️‍🌈 Inclusif
                  </div>
                  <ProductCard product={product} viewMode={viewMode} />
                </div>
              ))}
            </div>

            {/* Message si aucun produit */}
            {inclusiveProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏳️‍🌈</div>
                <p className="text-gray-500 text-lg">
                  Aucun produit inclusif trouvé dans cette catégorie pour le moment.
                </p>
                <p className="text-gray-400 mt-2">
                  Notre équipe travaille à enrichir cette collection. Revenez bientôt !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
