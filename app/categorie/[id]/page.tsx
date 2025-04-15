import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { categories } from "@/lib/data/categories"
import { CategoryIcon } from "@/components/category-icons"
import { getProductsByCategory, getFeaturedProducts } from "@/lib/data/products"
import ProductCard from "@/components/product-card"

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  // Trouver la catégorie correspondante
  const category = categories.find((cat) => cat.id === params.id)

  // Si la catégorie n'existe pas, rediriger vers une catégorie similaire ou populaire
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

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Catégories populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link key={cat.id} href={`/categorie/${cat.id}`}>
                <Card className="h-full transition-all hover:shadow-md hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 group">
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="mb-3 text-primary w-10 h-10">
                      <CategoryIcon category={cat.id} className="w-10 h-10" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-xs text-muted-foreground group-hover:text-foreground/80 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // Récupérer les produits de cette catégorie
  const categoryProducts = getProductsByCategory(params.id)

  // Si aucun produit n'est trouvé, afficher des produits similaires ou en vedette
  const productsToDisplay = categoryProducts.length > 0 ? categoryProducts : getFeaturedProducts(8)

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

      {/* Produits de la catégorie */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">
          {categoryProducts.length > 0
            ? `Produits populaires dans ${category.name}`
            : `Découvrez notre sélection exclusive pour ${category.name}`}
        </h2>

        <Suspense fallback={<ProductGridSkeleton />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsToDisplay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
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
