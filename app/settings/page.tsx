import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProfileForm } from "@/components/settings/profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Settings | Spectrum Marketplace",
  description: "Manage your account settings",
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/settings")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm profile={profile} userEmail={user.email || ""} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-1">Email Address</h3>
                    <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      To change your email address, please contact support.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-1">Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Your password was last updated when you created your account.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-1">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                    <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h3 className="font-medium">Order Updates</h3>
                      <p className="text-sm text-muted-foreground">Get notified when your order status changes.</p>
                    </div>
                    <div className="text-sm text-green-600 font-medium">Enabled</div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h3 className="font-medium">Promotions</h3>
                      <p className="text-sm text-muted-foreground">Receive deals and promotional offers.</p>
                    </div>
                    <div className="text-sm text-green-600 font-medium">Enabled</div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h3 className="font-medium">Newsletter</h3>
                      <p className="text-sm text-muted-foreground">Weekly updates about new products and sellers.</p>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Disabled</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
