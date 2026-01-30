import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { categories } from "@/lib/data/categories"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import ProductSorting from "@/components/product-sorting"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((cat) => cat.id === params.slug)

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Catégorie non trouvée</h1>
          <p className="text-muted-foreground mb-6">
            La catégorie que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button asChild>
            <Link href="/boutique">Retour à la boutique</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/boutique" className="hover:text-foreground">
          Boutique
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      {/* En-tête de catégorie */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && <p className="text-muted-foreground">{category.description}</p>}
      </div>

      {/* Sous-catégories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Sous-catégories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {category.subcategories.map((subcategory) => (
              <Link key={subcategory.id} href={`/categorie/${category.id}/${subcategory.id}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-purple-500">
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="font-medium text-sm">{subcategory.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtres */}
        <div className="w-full md:w-64 shrink-0">
          <ProductFilters />
        </div>

        {/* Produits */}
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
