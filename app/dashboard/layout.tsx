import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "vendor") {
    redirect("/become-vendor")
  }

  const { data: vendor } = await supabase.from("vendors").select("*").eq("user_id", user.id).single()

  if (!vendor) {
    redirect("/become-vendor")
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar vendor={vendor} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader vendor={vendor} />
        <main className="flex-1 p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  )
}
