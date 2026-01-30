import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { categories } from "@/lib/data/categories"
import { CategoryIcon } from "@/components/category-icons"
import { getProductsBySubcategory, getProductsByCategory, getFeaturedProducts } from "@/lib/data/products"
import ProductCard from "@/components/product-card"

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

  // Si la catégorie ou sous-catégorie n'existe pas, rediriger vers des produits similaires
  if (!category) {
    const popularCategory = categories[0] // Prendre la première catégorie comme fallback
    const featuredProducts = getFeaturedProducts(8)

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/shop" className="hover:text-foreground">
            Shopping
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Découvrez nos produits en vedette</h1>
          <p className="text-muted-foreground">Explorez notre sélection de produits populaires et tendances.</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Produits en vedette</h2>
            <Link href="/shop" className="text-primary hover:underline text-sm font-medium">
              Voir toutes les catégories
            </Link>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>
        </div>
      </main>
    )
  }

  if (!subcategory) {
    // Si la sous-catégorie n'existe pas, afficher les produits de la catégorie parente
    const categoryProducts = getProductsByCategory(category.id, 8)

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/shop" className="hover:text-foreground">
            Shopping
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/categorie/${category.id}`} className="hover:text-foreground">
            {category.name}
          </Link>
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

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Produits populaires dans {category.name}</h2>

          <Suspense fallback={<ProductGridSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Sous-catégories de {category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.subcategories.map((subcat) => (
              <Link key={subcat.id} href={`/categorie/${category.id}/${subcat.id}`}>
                <div className="p-4 border rounded-lg hover:shadow-md transition-all hover:border-primary">
                  <h3 className="font-semibold text-sm mb-1">{subcat.name}</h3>
                  {subcat.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{subcat.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // Récupérer les produits de cette sous-catégorie
  const subcategoryProducts = getProductsBySubcategory(params.id, params.subId)

  // Si aucun produit n'est trouvé, afficher des produits de la catégorie parente
  const productsToDisplay = subcategoryProducts.length > 0 ? subcategoryProducts : getProductsByCategory(params.id, 8)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-foreground">
          Shopping
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

      {/* Produits de la sous-catégorie */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">
          {subcategoryProducts.length > 0
            ? `Produits dans ${subcategory.name}`
            : `Découvrez notre sélection exclusive pour ${subcategory.name}`}
        </h2>

        <Suspense fallback={<ProductGridSkeleton />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
      </div>

      {/* Autres sous-catégories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Autres sous-catégories dans {category.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {category.subcategories
            .filter((subcat) => subcat.id !== params.subId)
            .map((subcat) => (
              <Link key={subcat.id} href={`/categorie/${category.id}/${subcat.id}`}>
                <div className="p-4 border rounded-lg hover:shadow-md transition-all hover:border-primary">
                  <h3 className="font-semibold text-sm mb-1">{subcat.name}</h3>
                  {subcat.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{subcat.description}</p>
                  )}
                </div>
              </Link>
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
