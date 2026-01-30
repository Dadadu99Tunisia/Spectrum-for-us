"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import type { Vendor } from "@/lib/types"

export default function SettingsPage() {
  const { user, refreshProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    storeLogo: "",
    storeBanner: "",
  })

  useEffect(() => {
    const fetchVendor = async () => {
      if (!user) return
      const supabase = createClient()
      const { data } = await supabase.from("vendors").select("*").eq("user_id", user.id).single()

      if (data) {
        setVendor(data)
        setFormData({
          storeName: data.store_name,
          storeDescription: data.store_description || "",
          storeLogo: data.store_logo || "",
          storeBanner: data.store_banner || "",
        })
      }
    }
    fetchVendor()
  }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "storeLogo" | "storeBanner") => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (response.ok) {
        const { url } = await response.json()
        setFormData({ ...formData, [field]: url })
        toast.success("Image uploaded")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor) return

    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("vendors")
      .update({
        store_name: formData.storeName,
        store_description: formData.storeDescription,
        store_logo: formData.storeLogo || null,
        store_banner: formData.storeBanner || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", vendor.id)

    if (error) {
      toast.error("Failed to update settings")
    } else {
      await refreshProfile()
      toast.success("Settings updated successfully")
      router.refresh()
    }

    setIsLoading(false)
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic details about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                id="storeName"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                rows={4}
                value={formData.storeDescription}
                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                placeholder="Tell customers about your store..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Branding</CardTitle>
            <CardDescription>Upload your store logo and banner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Store Logo</Label>
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-muted">
                  {formData.storeLogo ? (
                    <img
                      src={formData.storeLogo || "/placeholder.svg"}
                      alt="Store logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No logo</div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload Logo"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "storeLogo")}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Store Banner</Label>
              <div className="space-y-4">
                <div className="aspect-[3/1] rounded-lg overflow-hidden bg-muted">
                  {formData.storeBanner ? (
                    <img
                      src={formData.storeBanner || "/placeholder.svg"}
                      alt="Store banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No banner
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload Banner"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "storeBanner")}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Rate</CardTitle>
            <CardDescription>Your current marketplace commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{vendor.commission_rate}%</span>
              <span className="text-muted-foreground">per sale</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This is the fee deducted from each sale. Contact support to discuss custom rates.
            </p>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
}
