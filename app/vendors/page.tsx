import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Star, CheckCircle } from "lucide-react"

export const metadata = {
  title: "Vendors | Spectrum Marketplace",
  description: "Discover unique vendors and shops on Spectrum Marketplace",
}

export default async function VendorsPage() {
  const supabase = await createClient()

  const { data: vendors } = await supabase.from("vendors").select("*").order("rating", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-2">All Vendors</h1>
        <p className="text-muted-foreground mb-8">Discover unique products from our independent sellers</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendors?.map((vendor) => (
            <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
              <Card className="group hover:shadow-lg transition-shadow h-full">
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <img
                    src={
                      vendor.store_banner || `/placeholder.svg?height=128&width=400&query=${vendor.store_name} banner`
                    }
                    alt={`${vendor.store_name} banner`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 -mt-8 relative">
                  <div className="flex items-end gap-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border-4 border-background bg-muted flex-shrink-0">
                      <img
                        src={vendor.store_logo || `/placeholder.svg?height=64&width=64&query=${vendor.store_name} logo`}
                        alt={vendor.store_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {vendor.store_name}
                        </h3>
                        {vendor.is_verified && <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground">{vendor.total_sales} sales</span>
                  </div>
                  {vendor.store_description && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{vendor.store_description}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
