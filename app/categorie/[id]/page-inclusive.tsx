import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import ProductSorting from "@/components/product-sorting"
import { categories } from "@/lib/data/categories"
import { CategoryIcon } from "@/components/category-icons"

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}

export default function CategoryPageInclusive({ params }: { params: { id: string } }) {
  // Trouver la catégorie correspondante
  const category = categories.find((cat) => cat.id === params.id)

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Catégorie non trouvée</h1>
        <p className="text-muted-foreground mb-4">
          Désolé·e, la catégorie que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link href="/categories-inclusives" className="text-primary hover:underline">
          Voir toutes les catégories
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/categories-inclusives" className="hover:text-foreground">
          Catégories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-full">
          <CategoryIcon category={category.id} className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && <p className="text-muted-foreground mt-1">{category.description}</p>}
        </div>
      </div>

      {/* Sous-catégories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Parcourir les sous-catégories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {category.subcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/categorie/${category.id}/${subcategory.id}`}>
              <Card className="h-full transition-all hover:shadow-md hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 group">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="font-semibold text-sm mb-1">{subcategory.name}</h3>
                  {subcategory.description && (
                    <p className="text-xs text-muted-foreground group-hover:text-foreground/80 line-clamp-2">
                      {subcategory.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

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
