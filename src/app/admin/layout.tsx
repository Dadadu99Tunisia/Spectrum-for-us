"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, Store, Coins, FileText, Star,
  CalendarDays, Mail, ShieldCheck, ShoppingCart, Users,
  MessageSquare, Settings, Menu, X, ChevronRight,
  TrendingUp, Briefcase, Bot, LogOut, Layout,
  Bell, Search, ExternalLink, Zap, MapPin, Trophy,
} from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import { AdminErrorBoundary } from "@/components/ui/AdminErrorBoundary";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: string;
  accent?: string;
};

type NavSection = {
  label: string;
  accent: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Pilotage",
    accent: "#FF3D7F",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ]
  },
  {
    label: "Opérations",
    accent: "#E0901E",
    items: [
      { href: "/admin/moderation", label: "Modération",  icon: ShieldCheck,   badge: "!" },
      { href: "/admin/orders",     label: "Commandes",   icon: ShoppingCart },
      { href: "/admin/vendors",    label: "Vendeurs",    icon: Store },
      { href: "/admin/products",   label: "Produits",    icon: Package },
      { href: "/admin/services",   label: "Services",    icon: Briefcase },
    ]
  },
  {
    label: "Communauté",
    accent: "#6D2DB5",
    items: [
      { href: "/admin/users",      label: "Utilisateurs",     icon: Users },
      { href: "/admin/rejoindre",  label: "Rejoindre 🏳️‍🌈",   icon: Star },
      { href: "/admin/evenements", label: "Événements",       icon: CalendarDays },
      { href: "/admin/outreach",   label: "Outreach",         icon: Mail },
    ]
  },
  {
    label: "Business",
    accent: "#1C9C95",
    items: [
      { href: "/admin/finance",           label: "Finance",          icon: Coins },
      { href: "/admin/crm",              label: "CRM Pipeline",     icon: TrendingUp },
      { href: "/admin/founder-program",  label: "Prog. Fondateur",  icon: Trophy, accent: "#FFD700" },
      { href: "/admin/support",          label: "Support",          icon: MessageSquare, badge: "!" },
    ]
  },
  {
    label: "Contenu",
    accent: "#CF3F7C",
    items: [
      { href: "/admin/contenu",       label: "Site & Contenu",  icon: Layout },
      { href: "/admin/articles",      label: "Articles",        icon: FileText },
      { href: "/admin/annuaire",      label: "Annuaire LGBTQ+", icon: MapPin },
      { href: "/admin/ambassadeurs",  label: "Ambassadeurs",    icon: Star },
      { href: "/admin/communication", label: "Communication",   icon: Briefcase },
    ]
  },
  {
    label: "Système",
    accent: "#a78bfa",
    items: [
      { href: "/admin/agents",   label: "Agents IA",    icon: Bot },
      { href: "/admin/settings", label: "Paramètres",   icon: Settings },
    ]
  }
];

// Breadcrumb labels
const ROUTE_LABELS: Record<string, string> = {
  "/admin":               "Dashboard",
  "/admin/moderation":    "Modération",
  "/admin/orders":        "Commandes",
  "/admin/vendors":       "Vendeurs",
  "/admin/products":      "Produits",
  "/admin/services":      "Services",
  "/admin/users":         "Utilisateurs",
  "/admin/rejoindre":     "Rejoindre",
  "/admin/evenements":    "Événements",
  "/admin/outreach":      "Outreach",
  "/admin/finance":       "Finance",
  "/admin/crm":           "CRM Pipeline",
  "/admin/support":       "Support",
  "/admin/contenu":       "Site & Contenu",
  "/admin/articles":      "Articles",
  "/admin/annuaire":      "Annuaire LGBTQ+",
  "/admin/ambassadeurs":  "Ambassadeurs",
  "/admin/communication": "Communication",
  "/admin/agents":        "Agents IA",
  "/admin/ai":            "Agents IA",
  "/admin/settings":      "Paramètres",
};

function getPageTitle(pathname: string) {
  // Exact match first
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  // Prefix match
  for (const [route, label] of Object.entries(ROUTE_LABELS)) {
    if (pathname.startsWith(route + "/")) return label;
  }
  return "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/");
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1e1730] flex items-center justify-center">
        <SpectrumLoader size="md" label="Chargement…" />
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-[#1e1730] text-[#1A1612] flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════════════════ SIDEBAR ════════════════ */}
      <aside className={`
        fixed top-0 left-0 h-full w-[248px] z-50 flex flex-col
        bg-[#160f26] border-r border-white/[0.12]
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex
      `}
        style={{ boxShadow: "4px 0 24px rgba(0,0,0,.35)" }}>

        {/* Prism top bar */}
        <div className="h-[3px] shrink-0"
          style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />

        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/[0.10] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-fraunces text-[15px] text-[#1A1612]">
                Spectrum <span className="text-[#FF3D7F]">Admin</span>
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="font-mono text-[9px] text-[#1A1612]/30 uppercase tracking-widest">Système actif</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)}
              className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-[#1A1612]/40">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
          {NAV_SECTIONS.map((section, si) => (
            <div key={section.label} className={si > 0 ? "pt-2" : ""}>
              {/* Section header */}
              <div className="flex items-center gap-2 px-3 mb-1">
                <span className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: section.accent }} />
                <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#1A1612]/22">
                  {section.label}
                </p>
              </div>

              {/* Items */}
              {section.items.map(item => {
                const active = isActive(item.href, item.exact);
                const Icon   = item.icon;
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px]
                      transition-all duration-150 mb-px group
                      ${active
                        ? "text-[#1A1612] font-medium"
                        : "text-[#1A1612]/45 hover:text-[#1A1612]/80 hover:bg-white/[0.08]"
                      }
                    `}
                    style={active ? {
                      background: `${section.accent}18`,
                      borderLeft: `3px solid ${section.accent}`,
                      paddingLeft: "9px",
                    } : {}}>
                    <Icon size={13} className={active ? "" : "text-[#1A1612]/30 group-hover:text-[#1A1612]/50"}
                      style={active ? { color: section.accent } : {}} />
                    <span className="font-hanken flex-1 leading-none text-[12.5px]">{item.label}</span>
                    {item.badge && !active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E0901E] shrink-0" />
                    )}
                    {active && (
                      <ChevronRight size={9} style={{ color: `${section.accent}70` }} className="shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
          <div className="h-2" />
        </nav>

        {/* User footer */}
        <div className="px-3 py-3 border-t border-white/[0.10] bg-black/10 shrink-0">
          <div className="flex items-center gap-2.5 mb-2.5 px-1">
            <div className="w-7 h-7 rounded-lg bg-[#FF3D7F]/20 border border-[#FF3D7F]/25 flex items-center justify-center shrink-0">
              <span className="font-fraunces text-[11px] text-[#FF3D7F]">
                {(user?.email ?? "A")[0].toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#1A1612]/35 truncate flex-1">{user?.email}</p>
          </div>
          <div className="flex gap-1.5">
            <Link href="/" className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-white/[0.13] font-mono text-[9px] text-[#1A1612]/30 hover:text-[#1A1612]/60 hover:bg-white/[0.08] transition-all">
              <ExternalLink size={9} /> Site
            </Link>
            <button onClick={signOut}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-red-500/20 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut size={11} />
            </button>
          </div>
        </div>
      </aside>

      {/* ════════════════ MAIN CONTENT ════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* ── Topbar ── */}
        <header className="sticky top-0 z-30 h-14 bg-[#1e1730]/95 backdrop-blur-md border-b border-white/[0.12] px-5 flex items-center gap-4 shrink-0">
          {/* Mobile menu button */}
          <button onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-[#1A1612]/50 hover:text-[#1A1612] transition-colors">
            <Menu size={16} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-mono text-[10px] text-[#1A1612]/25 hidden sm:block">Admin</span>
            <ChevronRight size={10} className="text-[#1A1612]/15 hidden sm:block" />
            <h1 className="font-hanken text-[15px] font-medium text-[#1A1612] truncate">{pageTitle}</h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick search shortcut */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/[0.12] cursor-pointer hover:bg-white/[0.06] transition-colors">
              <Search size={12} className="text-[#1A1612]/25" />
              <span className="font-mono text-[10px] text-[#1A1612]/25">Recherche rapide</span>
              <kbd className="ml-2 font-mono text-[9px] text-[#1A1612]/20 bg-white/[0.09] px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.12] text-[#1A1612]/40 hover:text-[#1A1612] hover:bg-white/[0.07] transition-colors">
                <Bell size={14} />
              </button>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E0901E] border-2 border-[#2d2050]" />
            </div>

            {/* Quick link to site */}
            <Link href="/" target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/[0.12] font-mono text-[10px] text-[#1A1612]/35 hover:text-[#1A1612]/70 hover:bg-white/[0.06] transition-all">
              <Zap size={10} />
              spectrumforus.com
            </Link>
          </div>

          {/* Bottom prism line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: "linear-gradient(90deg,transparent,#FF3D7F40,#6D2DB540,#1C9C9540,transparent)" }} />
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-6 overflow-y-auto">
          <AdminErrorBoundary>
            {children}
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  );
}
