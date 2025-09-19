"use client"

import Link from "next/link"
import { CategoryIcon } from "@/components/category-icons"
import { categories } from "@/lib/data/categories"

const categoryBackgrounds: { [key: string]: string } = {
  "vetements-mode": "/images/categories/calvin-klein-pride.jpg",
  chaussures: "/placeholder-xx3ua.png",
  "accessoires-mode": "/placeholder-0ph8r.png",
  capillaire: "/assorted-hair-products.png",
  "identite-lgbtqia": "/placeholder-wj61b.png",
  "produits-pmr": "/placeholder-zg43s.png",
  "hygiene-beaute": "/beauty-products-collection.png",
  "maison-decoration": "/cozy-living-room.png",
  "art-artisanat": "/placeholder-hlz4f.png",
  "culture-education": "/placeholder-0pmu4.png",
  "jeux-loisirs": "/colorful-toys-and-games.png",
  "technologie-adaptee": "/placeholder-w69w3.png",
  "alimentation-boissons": "/placeholder-42874.png",
  "sport-bien-etre": "/placeholder-wgban.png",
  "cadeaux-personnalises": "/personalized-gifts.png",
}

export default function FeaturedCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.slice(0, 8).map((category) => (
        <Link key={category.id} href={`/categorie/${category.id}`}>
          <div className="relative rounded-lg overflow-hidden aspect-square group">
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-500 group-hover:scale-100"
              style={{
                backgroundImage: `url(${categoryBackgrounds[category.id] || "/placeholder.svg?height=600&width=800"})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <CategoryIcon category={category.icon || "Shirt"} className="h-6 w-6" />
              </div>
              <p className="text-sm mt-1 line-clamp-2">{category.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
