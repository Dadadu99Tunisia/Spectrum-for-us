import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/products/product-grid"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, Calendar } from "lucide-react"

interface VendorPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: VendorPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vendor } = await supabase.from("vendors").select("store_name, store_description").eq("id", id).single()

  if (!vendor) {
    return { title: "Vendor Not Found" }
  }

  return {
    title: `${vendor.store_name} | Spectrum Marketplace`,
    description: vendor.store_description,
  }
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vendor } = await supabase.from("vendors").select("*").eq("id", id).single()

  if (!vendor) {
    notFound()
  }

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .eq("vendor_id", vendor.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  const products = (productsData || []).map((p) => ({
    ...p,
    vendors: { store_name: vendor.store_name },
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={
              vendor.store_banner || `/placeholder.svg?height=256&width=1200&query=${vendor.store_name} store banner`
            }
            alt={`${vendor.store_name} banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="container -mt-16 relative z-10">
          {/* Vendor Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={vendor.store_logo || undefined} />
              <AvatarFallback className="text-4xl">{vendor.store_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{vendor.store_name}</h1>
                {vendor.is_verified && (
                  <Badge className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified Seller
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-6 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{Number(vendor.rating).toFixed(1)}</span>
                  <span>rating</span>
                </div>
                <span>{vendor.total_sales} sales</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(vendor.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {vendor.store_description && (
                <p className="mt-4 text-muted-foreground max-w-2xl">{vendor.store_description}</p>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-6">Products ({products.length})</h2>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">This vendor hasn&apos;t added any products yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
