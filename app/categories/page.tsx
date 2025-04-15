import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { categories } from "@/lib/data/categories"
import { CategoryIcon } from "@/components/category-icons"

export default function CategoriesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Toutes les Catégories</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez notre marketplace inclusif avec des produits et services pour toustes, célébrant la diversité des
          identités, des corps et des besoins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 pb-2">
              <div className="flex items-center gap-3">
                <div className="text-primary w-8 h-8">
                  <CategoryIcon category={category.id} className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </div>
              {category.description && <CardDescription className="mt-2">{category.description}</CardDescription>}
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-1">
                {category.subcategories.slice(0, 5).map((subcategory) => (
                  <li key={subcategory.id} className="text-sm">
                    <Link
                      href={`/categorie/${category.id}/${subcategory.id}`}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span className="text-xs">•</span> {subcategory.name}
                    </Link>
                  </li>
                ))}
                {category.subcategories.length > 5 && (
                  <li className="text-sm text-primary font-medium pt-1">
                    <Link href={`/categorie/${category.id}`}>
                      + {category.subcategories.length - 5} autres sous-catégories
                    </Link>
                  </li>
                )}
              </ul>
              <div className="mt-4">
                <Link href={`/categorie/${category.id}`} className="text-sm font-medium text-primary hover:underline">
                  Voir toutes les sous-catégories
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
