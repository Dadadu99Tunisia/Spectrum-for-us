import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Package, Briefcase, Plus, Edit, Trash2 } from "lucide-react"
import { Logo } from "@/components/logo"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch vendor's products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch vendor's services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false })

  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-balance mb-2">Vendor Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {profile?.name || "Creator"}! Manage your products and services.
          </p>
        </div>
        <div className="hidden md:block">
          <Logo size="md" linkToHome={true} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active offerings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.role === "vendor" ? "Active" : "Inactive"}</div>
            <p className="text-xs text-muted-foreground">Vendor account</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Products and Services */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Products</h2>
            <Button asChild>
              <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>

          {!products || products.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
                <Button asChild>
                  <Link href="/dashboard/products/new">Add Your First Product</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={
                          product.image_url || `/product-placeholder.jpg?height=100&width=100&query=${product.category}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-medium">
                          {product.currency === "USD" && "$"}
                          {product.currency === "EUR" && "€"}
                          {product.currency === "TND" && "د.ت"}
                          {product.price}
                        </span>
                        <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                        <span className="text-sm text-muted-foreground">{product.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/dashboard/products/${product.id}/edit`} aria-label="Edit product">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive bg-transparent"
                        aria-label="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Services</h2>
            <Button asChild>
              <Link href="/dashboard/services/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Link>
            </Button>
          </div>

          {!services || services.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't added any services yet.</p>
                <Button asChild>
                  <Link href="/dashboard/services/new">Add Your First Service</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={service.image_url || `/.jpg?height=100&width=100&query=${service.category}+service`}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-medium">
                          {service.currency === "USD" && "$"}
                          {service.currency === "EUR" && "€"}
                          {service.currency === "TND" && "د.ت"}
                          {service.price}
                        </span>
                        <span className="text-sm text-muted-foreground">{service.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/dashboard/services/${service.id}/edit`} aria-label="Edit service">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive bg-transparent"
                        aria-label="Delete service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Blog Posts</h2>
            <Button asChild>
              <Link href="/dashboard/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>

          {!blogPosts || blogPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">You haven't created any blog posts yet.</p>
                <Button asChild>
                  <Link href="/dashboard/blog/new">Create Your First Post</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {blogPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Category: {post.category}</span>
                          <span>
                            {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Not published"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/blog`}>Manage</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your vendor profile and public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-muted-foreground">{profile?.name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">{profile?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <p className="text-muted-foreground">{profile?.bio || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="text-muted-foreground capitalize">{profile?.role}</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/profile/edit">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
