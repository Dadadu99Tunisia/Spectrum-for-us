import { Suspense } from "react"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import ProductSorting from "@/components/product-sorting"
import { Skeleton } from "@/components/ui/skeleton"

export default function ShopPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tous les Produits</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <ProductFilters />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <ProductSorting />
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

