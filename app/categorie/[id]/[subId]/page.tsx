"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { categories } from "@/app/api/categories/route"
import { products } from "@/lib/data/products"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSorting } from "@/components/product-sorting"
import { Button } from "@/components/ui/button"
import { ChevronDown, Filter, Grid, List } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"

interface SubCategoryPageProps {
  params: {
    id: string
    subId: string
  }
}

export default function SubCategoryPage({ params }: SubCategoryPageProps) {
  const isMobile = useMobile()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    colors: [],
    sizes: [],
    brands: [],
  })

  const category = categories.find((cat) => cat.id === params.id)
  const subcategory = category?.subcategories.find((sub) => sub.id === params.subId)

  if (!category || !subcategory) {
    notFound()
  }

  // Filtrer les produits par sous-catégorie
  const subcategoryProducts = products.filter(
    (product) => product.category === params.id && product.subcategory === params.subId,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la sous-catégorie */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Link href={`/categorie/${params.id}`} className="hover:text-gray-700">
                  {category.name}
                </Link>
                <span>/</span>
                <span>{subcategory.name}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{subcategory.name}</h1>
              <p className="mt-2 text-gray-600">{subcategoryProducts.length} produits disponibles</p>
            </div>

            {/* Contrôles de vue */}
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          {showFilters && (
            <div className="lg:w-64 flex-shrink-0">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          )}

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Tri */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {subcategoryProducts.length} produit{subcategoryProducts.length > 1 ? "s" : ""}
              </p>
              <ProductSorting sortBy={sortBy} onSortChange={setSortBy} />
            </div>

            {/* Grille de produits */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {subcategoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>

            {/* Message si aucun produit */}
            {subcategoryProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun produit trouvé dans cette sous-catégorie.</p>
                <p className="text-gray-400 mt-2">Revenez bientôt pour découvrir de nouveaux articles !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
