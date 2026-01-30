"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface Category {
  name: string
  href: string
  image: string
  count: number
}

const categories: Category[] = [
  { name: "Mode", href: "/products?category=Mode", image: "/gender-neutral-fashion-editorial.jpg", count: 250 },
  { name: "Beauté", href: "/products?category=Beauté", image: "/minimal-serum-bottle-skincare.jpg", count: 180 },
  { name: "Maison", href: "/products?category=Maison", image: "/ceramic-vase-organic-shape.jpg", count: 120 },
  {
    name: "Intimité",
    href: "/products?category=Sexualité & Intimité",
    image: "/placeholder.svg?height=200&width=200",
    count: 95,
  },
  { name: "Culture", href: "/products?category=Culture", image: "/queer-zine-magazine-cover.jpg", count: 140 },
  { name: "Bijoux", href: "/products?category=Accessoires", image: "/fluid-artisan-jewelry-queer.jpg", count: 85 },
]

export function MobileCategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:hidden">
      {categories.map((category) => (
        <Link key={category.name} href={category.href}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-semibold text-sm mb-0.5">{category.name}</h3>
                <p className="text-xs text-white/90">{category.count} produits</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
