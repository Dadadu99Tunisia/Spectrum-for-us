import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import ProductSorting from "@/components/product-sorting"
import { categories } from "@/app/api/categories/route"

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  // Trouver la catégorie correspondante
  const category = categories.find((cat) => cat.id === params.id)

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Catégorie non trouvée</h1>
        <p className="text-muted-foreground mb-4">
          Désolé, la catégorie que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link href="/boutique">Voir toutes les catégories</Link>
        </Button>
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
        <Link href="/boutique" className="hover:text-foreground">
          Boutique
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

      {/* Sous-catégories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Parcourir les sous-catégories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {category.subcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/categorie/${category.id}/${subcategory.id}`}>
              <Card className="h-full transition-all hover:shadow-md hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white group">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="font-semibold text-sm mb-1">{subcategory.name}</h3>
                  <p className="text-xs text-muted-foreground group-hover:text-white/80">Explorer</p>
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
