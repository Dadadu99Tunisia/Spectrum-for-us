"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Store,
  CreditCard,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Vendor } from "@/lib/types"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/payouts", label: "Payouts", icon: CreditCard },
  { href: "/dashboard/settings", label: "Store Settings", icon: Settings },
]

interface DashboardSidebarProps {
  vendor: Vendor
}

export function DashboardSidebar({ vendor }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background hidden md:flex flex-col">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-bold">Spectrum</span>
        </Link>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
            {vendor.store_logo ? (
              <img
                src={vendor.store_logo || "/placeholder.svg"}
                alt={vendor.store_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{vendor.store_name}</p>
            <p className="text-xs text-muted-foreground">Seller Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </Link>
        <Link
          href={`/vendors/${vendor.id}`}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Store className="h-4 w-4" />
          View Store
        </Link>
      </div>
    </aside>
  )
}
