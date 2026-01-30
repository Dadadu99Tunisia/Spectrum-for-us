"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Store, DollarSign, Users, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BecomeVendorPage() {
  const { user, profile, refreshProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push("/auth/login?redirect=/become-vendor")
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      // Update profile role to vendor
      const { error: profileError } = await supabase.from("profiles").update({ role: "vendor" }).eq("id", user.id)

      if (profileError) throw profileError

      // Create vendor profile
      const { error: vendorError } = await supabase.from("vendors").insert({
        user_id: user.id,
        store_name: storeName,
        store_description: storeDescription,
      })

      if (vendorError) throw vendorError

      await refreshProfile()
      toast.success("Congratulations! Your seller account has been created.")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Failed to create seller account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (profile?.role === "vendor") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>You&apos;re already a seller!</CardTitle>
              <CardDescription>You already have a seller account on Spectrum.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Selling on Spectrum</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of vendors reaching millions of customers. Set up your store in minutes and start earning
                today.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="container py-12">
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <Store className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Easy Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Create your store in minutes with our simple onboarding process.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Reach Customers</h3>
                <p className="text-sm text-muted-foreground">
                  Access millions of shoppers actively looking for products like yours.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <DollarSign className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Low Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Only 10% commission on sales. Keep more of what you earn.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Grow Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Access analytics and tools to help you scale your business.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sign Up Form */}
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Create Your Seller Account</CardTitle>
              <CardDescription>Fill in the details below to set up your store</CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">You need to sign in to create a seller account.</p>
                  <Button asChild>
                    <Link href="/auth/login?redirect=/become-vendor">Sign In to Continue</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name *</Label>
                    <Input
                      id="storeName"
                      placeholder="e.g., John's Electronics"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Store Description</Label>
                    <Textarea
                      id="storeDescription"
                      placeholder="Tell customers about your store and what you sell..."
                      rows={4}
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                    />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">By creating a seller account, you agree to:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Our Seller Terms of Service</li>
                      <li>10% commission on all sales</li>
                      <li>Providing accurate product information</li>
                    </ul>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Seller Account"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  )
}
