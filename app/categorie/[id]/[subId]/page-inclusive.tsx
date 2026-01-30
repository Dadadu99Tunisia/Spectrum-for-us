import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import ProductSorting from "@/components/product-sorting"
import { categories } from "@/lib/data/categories"
import { CategoryIcon } from "@/components/category-icons"

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

export default function SubcategoryPageInclusive({ params }: { params: { id: string; subId: string } }) {
  // Trouver la catégorie et sous-catégorie correspondantes
  const category = categories.find((cat) => cat.id === params.id)
  const subcategory = category?.subcategories.find((subcat) => subcat.id === params.subId)

  if (!category || !subcategory) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sous-catégorie non trouvée</h1>
        <p className="text-muted-foreground mb-4">
          Désolé·e, la sous-catégorie que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link href="/categories-inclusives" className="text-primary hover:underline">
          Voir toutes les catégories
        </Link>
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
        <Link href="/categories-inclusives" className="hover:text-foreground">
          Catégories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/categorie/${category.id}`} className="hover:text-foreground">
          {category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{subcategory.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-full">
          <CategoryIcon category={category.id} className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{subcategory.name}</h1>
          {subcategory.description && <p className="text-muted-foreground mt-1">{subcategory.description}</p>}
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
