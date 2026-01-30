import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/types"
import { Sparkles, Palette, Accessibility, Home, BookHeart, Gem, Users, BookOpen } from "lucide-react"

interface CategoriesSectionProps {
  categories: Category[]
}

const categoryIcons: Record<string, typeof Sparkles> = {
  "fashion-apparel": Sparkles,
  "beauty-grooming": Palette,
  "adaptive-mobility": Accessibility,
  "home-sanctuary": Home,
  "intimacy-wellness": BookHeart,
  "accessories": Gem,
  "unisex-fluid": Users,
  "community-culture": BookOpen,
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground mt-1">Inclusive products for every identity and ability</p>
        </div>
        <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.slug] || Sparkles
          return (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image_url || `/images/categories/${category.slug}.jpg`}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4 text-white/90" />
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      </div>
                      {category.description && (
                        <p className="text-xs text-white/80 line-clamp-2">{category.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
