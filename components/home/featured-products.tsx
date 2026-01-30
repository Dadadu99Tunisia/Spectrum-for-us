import Link from "next/link"
import { ProductGrid } from "@/components/products/product-grid"
import type { Product } from "@/lib/types"

interface FeaturedProductsProps {
  products: Product[]
  title?: string
  subtitle?: string
  viewAllHref?: string
}

export function FeaturedProducts({
  products,
  title = "Featured Products",
  subtitle = "Handpicked products from our best vendors",
  viewAllHref = "/products",
}: FeaturedProductsProps) {
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
          View All
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  )
}
