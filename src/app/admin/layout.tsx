"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, Store, Coins, FileText, Star,
  CalendarDays, Mail, ShieldCheck, ShoppingCart, Users,
  MessageSquare, Settings, Menu, X, ChevronRight,
  TrendingUp, Briefcase, Bot, LogOut, Layout
} from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

const NAV_SECTIONS = [
  {
    label: "Pilotage",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ]
  },
  {
    label: "Opérations",
    items: [
      { href: "/admin/moderation", label: "Modération", icon: ShieldCheck },
      { href: "/admin/orders",     label: "Commandes",  icon: ShoppingCart },
      { href: "/admin/vendors",    label: "Vendeurs",   icon: Store },
      { href: "/admin/products",   label: "Produits",   icon: Package },
      { href: "/admin/services",   label: "Services",   icon: Briefcase },
    ]
  },
  {
    label: "Communauté",
    items: [
      { href: "/admin/users",      label: "Utilisateurs", icon: Users },
      { href: "/admin/rejoindre",  label: "Rejoindre 🏳️‍🌈", icon: Star },
      { href: "/admin/evenements", label: "Événements",   icon: CalendarDays },
      { href: "/admin/outreach",   label: "Outreach",     icon: Mail },
    ]
  },
  {
    label: "Business",
    items: [
      { href: "/admin/finance",    label: "Comptabilité",  icon: Coins },
      { href: "/admin/crm",        label: "CRM",           icon: TrendingUp },
      { href: "/admin/support",    label: "Support",       icon: MessageSquare },
    ]
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/contenu",           label: "Site & Contenu", icon: Layout },
      { href: "/admin/articles",         label: "Articles",      icon: FileText },
      { href: "/admin/ambassadeurs",     label: "Ambassadeurs",  icon: Star },
      { href: "/admin/communication",    label: "Communication", icon: Briefcase },
    ]
  },
  {
    label: "Système",
    items: [
      { href: "/admin/ai",         label: "IA Spectrum", icon: Bot },
      { href: "/admin/settings",   label: "Paramètres",  icon: Settings },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/");
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1a0d2e] flex items-center justify-center">
        <SpectrumLoader size="md" label="Chargement..." />
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#130920] text-[#F3EADB] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#0e061a] border-r border-[#F3EADB]/6 z-50 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#F3EADB]/6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-fraunces text-base text-[#F3EADB]">
                Spectrum <span className="text-[#E0337E]">Admin</span>
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="font-mono text-[9px] text-[#F3EADB]/30 uppercase tracking-widest">Système actif</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-[#F3EADB]/30">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="mb-4">
              <p className="font-mono text-[9px] text-[#F3EADB]/20 uppercase tracking-widest px-3 mb-1">
                {section.label}
              </p>
              {section.items.map(item => {
                const active = isActive(item.href, "exact" in item ? item.exact : undefined);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5 ${
                      active
                        ? "bg-[#E0337E]/15 text-[#E0337E]"
                        : "text-[#F3EADB]/50 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5"
                    }`}>
                    <Icon size={14} className={active ? "text-[#E0337E]" : "text-[#F3EADB]/30"} />
                    <span className="font-hanken flex-1">{item.label}</span>
                    {active && <ChevronRight size={10} className="text-[#E0337E]/50" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-3 border-t border-[#F3EADB]/6">
          <p className="font-mono text-[9px] text-[#F3EADB]/25 truncate mb-2">{user?.email}</p>
          <div className="flex gap-2">
            <Link href="/" className="flex-1 text-center py-1.5 rounded-lg border border-[#F3EADB]/10 font-mono text-[10px] text-[#F3EADB]/30 hover:text-[#F3EADB]/60 transition-colors">
              ← Site
            </Link>
            <button onClick={signOut} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 transition-colors">
              <LogOut size={11} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-30 h-12 bg-[#130920]/95 backdrop-blur-md border-b border-[#F3EADB]/6 px-5 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-[#F3EADB]/40 hover:text-[#F3EADB]">
            <Menu size={18} />
          </button>
          {/* Prism line at top */}
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
