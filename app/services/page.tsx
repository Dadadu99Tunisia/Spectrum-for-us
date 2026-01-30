import { createClient } from "@/lib/supabase/server"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default async function ServicesPage() {
  const supabase = await createClient()

  let services = []
  let error = null

  try {
    const { data: servicesData, error: fetchError } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("[v0] Error fetching services:", fetchError)
      error = fetchError
    } else if (servicesData && servicesData.length > 0) {
      const vendorIds = [...new Set(servicesData.map((s) => s.vendor_id).filter(Boolean))]

      if (vendorIds.length > 0) {
        // Fetch vendor profiles
        const { data: vendorsData } = await supabase.from("profiles").select("id, name, avatar_url").in("id", vendorIds)

        // Create a map of vendors
        const vendorsMap = new Map(vendorsData?.map((v) => [v.id, v]) || [])

        // Combine services with vendor data
        services = servicesData.map((service) => ({
          ...service,
          vendor: service.vendor_id ? vendorsMap.get(service.vendor_id) : null,
        }))
      } else {
        // No vendor IDs, just use services as-is
        services = servicesData.map((service) => ({
          ...service,
          vendor: null,
        }))
      }
    }
  } catch (e) {
    console.error("[v0] Exception fetching services:", e)
    error = e
  }

  const categories = ["All", "Design", "Wellness", "Consulting", "Photography", "Writing", "Coaching", "Other"]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance mb-2">Services</h1>
        <p className="text-muted-foreground text-lg">Connect with talented queer professionals</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[200px]" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="newest">
          <SelectTrigger className="w-full md:w-[200px]" aria-label="Sort services">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      {error || !services || services.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            {error ? "Unable to load services. Please run the database setup scripts." : "No services available yet."}
          </p>
          <p className="text-sm text-muted-foreground">
            {error
              ? "Make sure to execute the SQL scripts in the scripts folder."
              : "Check back soon or become a vendor to offer your services!"}
          </p>
          <Button asChild className="mt-6">
            <Link href="/signup">Become a Vendor</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src={service.image_url || `/.jpg?height=300&width=500&query=${service.category}+service`}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{service.category}</Badge>
                  <span className="text-sm font-semibold">
                    {service.currency === "USD" && "$"}
                    {service.currency === "EUR" && "€"}
                    {service.currency === "TND" && "د.ت"}
                    {service.price}
                  </span>
                </div>
                <CardTitle className="mt-2 line-clamp-2">{service.name}</CardTitle>
                <CardDescription className="line-clamp-3">{service.description}</CardDescription>
                {service.vendor && (
                  <p className="text-xs text-muted-foreground mt-2">by {service.vendor.name || "Creator"}</p>
                )}
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href={`/services/${service.id}`}>Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
