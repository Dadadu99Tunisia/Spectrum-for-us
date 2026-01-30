import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Star, CheckCircle } from "lucide-react"
import type { Vendor } from "@/lib/types"

interface FeaturedVendorsProps {
  vendors: Vendor[]
}

export function FeaturedVendors({ vendors }: FeaturedVendorsProps) {
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Top Vendors</h2>
          <p className="text-muted-foreground mt-1">Shop from our highest-rated sellers</p>
        </div>
        <Link href="/vendors" className="text-sm font-medium text-primary hover:underline">
          View All Vendors
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((vendor) => (
          <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
            <Card className="group hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={vendor.store_logo || `/placeholder.svg?height=64&width=64&query=${vendor.store_name} logo`}
                      alt={vendor.store_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {vendor.store_name}
                      </h3>
                      {vendor.is_verified && <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{vendor.total_sales} sales</p>
                  </div>
                </div>
                {vendor.store_description && (
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{vendor.store_description}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
