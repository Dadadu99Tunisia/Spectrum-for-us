"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Store,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  MessageSquare,
  HelpCircle,
  Bell,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VendeurLayoutProps {
  children: React.ReactNode
}

export default function VendeurLayout({ children }: VendeurLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Tableau de Bord", href: "/vendeur/dashboard", icon: BarChart2 },
    { name: "Produits", href: "/vendeur/produits", icon: Package },
    { name: "Commandes", href: "/vendeur/commandes", icon: ShoppingCart },
    { name: "Clients", href: "/vendeur/clients", icon: Users },
    { name: "Ma Boutique", href: "/vendeur/boutique", icon: Store },
    { name: "Sécurité", href: "/vendeur/securite", icon: Shield },
    { name: "Paramètres", href: "/vendeur/parametres", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar mobile */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-background border-r z-40 p-4">
              <div className="flex items-center mb-8">
                <Image
                  src="/images/logo.png"
                  alt="Spectrum Logo"
                  width={600}
                  height={180}
                  className="h-20 w-auto"
                  priority
                />
                <span className="ml-2 font-semibold">Vendeur</span>
              </div>

              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      pathname === item.href || pathname?.startsWith(item.href + "/")
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-4 left-4 right-4">
                <Button variant="outline" className="w-full" onClick={() => setSidebarOpen(false)}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r bg-background pt-5">
          <div className="flex items-center px-4 mb-8">
            <Image
              src="/images/logo.png"
              alt="Spectrum Logo"
              width={600}
              height={180}
              className="h-20 w-auto"
              priority
            />
            <span className="ml-2 font-semibold">Vendeur</span>
          </div>

          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  pathname === item.href || pathname?.startsWith(item.href + "/")
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="flex items-center justify-end h-16 px-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link href="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="font-medium text-sm text-purple-600">QA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
