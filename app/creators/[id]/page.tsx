import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Globe, ShoppingCart } from "lucide-react"

export default async function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch creator profile
  const { data: creator, error: creatorError } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (creatorError || !creator) {
    notFound()
  }

  // Fetch creator's products
  const { data: products } = await supabase.from("products").select("*").eq("vendor_id", id).limit(6)

  // Fetch creator's services
  const { data: services } = await supabase.from("services").select("*").eq("vendor_id", id).limit(6)

  const socialLinks = creator.social_links as Record<string, string>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Creator Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-32 h-32 rounded-full bg-muted overflow-hidden flex-shrink-0">
                <img
                  src={creator.avatar_url || `/creator-avatar.jpg?height=200&width=200&query=creator`}
                  alt={creator.name || "Creator"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{creator.name || "Anonymous Creator"}</h1>
                <p className="text-muted-foreground mb-4">{creator.email}</p>
                <p className="text-foreground leading-relaxed mb-4">
                  {creator.bio || "A talented creator in our community."}
                </p>
                {socialLinks && Object.keys(socialLinks).length > 0 && (
                  <div className="flex gap-3 justify-center md:justify-start">
                    {socialLinks.facebook && (
                      <Link
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </Link>
                    )}
                    {socialLinks.instagram && (
                      <Link
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </Link>
                    )}
                    {socialLinks.twitter && (
                      <Link
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </Link>
                    )}
                    {socialLinks.website && (
                      <Link
                        href={socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Website"
                      >
                        <Globe className="h-5 w-5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Section */}
      {products && products.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={
                        product.image_url || `/product-placeholder.jpg?height=400&width=400&query=${product.category}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <p className="text-lg font-semibold mt-2">
                    {product.currency === "USD" && "$"}
                    {product.currency === "EUR" && "€"}
                    {product.currency === "TND" && "د.ت"}
                    {product.price}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 gap-2">
                  <Button className="flex-1" variant="secondary" asChild>
                    <Link href={`/products/${product.id}`}>View</Link>
                  </Button>
                  <Button size="icon" disabled={product.stock === 0} aria-label="Add to cart">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Services Section */}
      {services && services.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
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
                  <CardTitle className="mt-2">{service.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/services/${service.id}`}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {(!products || products.length === 0) && (!services || services.length === 0) && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">This creator hasn't added any products or services yet.</p>
        </div>
      )}
    </div>
  )
}
