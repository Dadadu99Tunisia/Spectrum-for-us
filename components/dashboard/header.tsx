"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Menu, User, LogOut, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/client"
import type { Vendor } from "@/lib/types"

interface DashboardHeaderProps {
  vendor: Vendor
}

export function DashboardHeader({ vendor }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>Dashboard Menu</SheetTitle>
            </SheetHeader>
            <nav className="p-4">
              <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-muted">
                Overview
              </Link>
              <Link href="/dashboard/products" className="block px-3 py-2 rounded-lg hover:bg-muted">
                Products
              </Link>
              <Link href="/dashboard/orders" className="block px-3 py-2 rounded-lg hover:bg-muted">
                Orders
              </Link>
              <Link href="/dashboard/analytics" className="block px-3 py-2 rounded-lg hover:bg-muted">
                Analytics
              </Link>
              <Link href="/dashboard/settings" className="block px-3 py-2 rounded-lg hover:bg-muted">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">Seller Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <p className="font-medium">{vendor.store_name}</p>
              <p className="text-xs text-muted-foreground">Vendor Account</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/vendors/${vendor.id}`}>
                <Store className="h-4 w-4 mr-2" />
                View Store
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Back to Marketplace</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
