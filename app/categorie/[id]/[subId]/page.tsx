import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import ProductSorting from "@/components/product-sorting"
import { categories } from "@/app/api/categories/route"

export async function generateStaticParams() {
  const paths: { id: string; subId: string }[] = []

  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      paths.push({
        id: category.id,
        subId: subcategory.id,
      })
    })
  })

  return paths
}

export default function SubcategoryPage({ params }: { params: { id: string; subId: string } }) {
  // Trouver la catégorie et sous-catégorie correspondantes
  const category = categories.find((cat) => cat.id === params.id)
  const subcategory = category?.subcategories.find((subcat) => subcat.id === params.subId)

  if (!category || !subcategory) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sous-catégorie non trouvée</h1>
        <p className="text-muted-foreground mb-4">
          Désolé, la sous-catégorie que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link href="/boutique">Voir toutes les catégories</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/boutique" className="hover:text-foreground">
          Boutique
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/categorie/${category.id}`} className="hover:text-foreground">
          {category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{subcategory.name}</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">{subcategory.name}</h1>
      <p className="text-muted-foreground mb-8">
        Découvrez notre sélection de produits dans la catégorie {subcategory.name}.
      </p>

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

