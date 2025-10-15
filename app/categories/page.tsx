import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/app/api/categories/route"

export default function CategoriesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Toutes les Catégories</h1>

      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <h2 className="text-2xl font-semibold">
              <Link href={`/categorie/${category.id}`} className="hover:text-purple-600 dark:hover:text-purple-400">
                {category.name}
              </Link>
            </h2>

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
        ))}
      </div>
    </main>
  )
}
