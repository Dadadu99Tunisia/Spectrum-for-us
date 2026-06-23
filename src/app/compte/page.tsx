"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/store/cart";
import { ReturnRequestButton } from "@/components/account/ReturnRequestButton";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, Heart, Star, Settings, Store, LogOut, LayoutDashboard, Download, Trash2, PlusCircle, ChevronRight, ArrowRight, MapPin } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

const TABS = ["Commandes", "Favoris", "Avis", "Paramètres"] as const;
type Tab = typeof TABS[number];

const TAB_ICONS = {
  "Commandes": Package,
  "Favoris": Heart,
  "Avis": Star,
  "Paramètres": Settings,
};

const CONTENT = {
  fr: {
    dateLocale: "fr-FR",
    headerTitle: "Mon compte",
    tabs: { "Commandes": "Commandes", "Favoris": "Favoris", "Avis": "Avis", "Paramètres": "Paramètres" } as Record<Tab, string>,
    statusLabel: { pending: "En attente", paid: "Payé", shipped: "Expédié", delivered: "Livré", cancelled: "Annulé" } as Record<string, string>,
    qFavoris: "Favoris",
    qCommandes: "Commandes",
    qAdresses: "Adresses",
    administration: "Administration",
    espaceVendeur: "Espace vendeur·rice",
    publierCreation: "Publier une création",
    vendsTesCreations: "Vends tes créations ici",
    admin: "Admin",
    espaceVendeurShort: "Espace vendeur",
    devenirVendeur: "Devenir vendeur·rice",
    mesReservations: "🗓️ Mes réservations",
    service: "Service",
    confirme: "Confirmé",
    annule: "Annulé",
    enAttente: "En attente",
    annuler: "Annuler",
    confirmCancelBooking: "Annuler cette réservation ? Tu seras remboursé·e.",
    errorPrefix: "Erreur : ",
    noOrders: "Aucune commande pour l'instant.",
    explorerMarketplace: "Explorer la marketplace",
    colis: "Colis",
    livre: "Livré",
    expedie: "Expédié",
    enPreparation: "En préparation",
    suivi: "Suivi",
    recu: "🧾 Reçu",
    racheter: "↻ Racheter",
    // FavoritesTab
    aucunFavori: "Tu n'as pas encore de favoris.",
    decouvrirCreations: "Découvrir des créations",
    favori: "favori",
    favoriPlural: "s",
    toutGerer: "Tout gérer →",
    // ReviewsTab
    avisIci: "Tes avis apparaîtront ici après tes achats.",
    creation: "Création",
    // SettingsTab
    pseudoLabel: "Pseudo / Nom affiché",
    pseudoPlaceholder: "ton_pseudo",
    pronounsLabel: "Pronoms (public)",
    pronounsPlaceholder: "iel, elle, il…",
    emailLabel: "E-mail (non modifiable)",
    colisDiscrets: "Colis discrets (aucune mention Spectrum à l'extérieur)",
    enregistrement: "Enregistrement…",
    enregistre: "✓ Enregistré !",
    enregistrer: "Enregistrer",
    rgpdTitle: "Données personnelles (RGPD)",
    exporter: "Exporter mes données (Art. 20)",
    // DeleteAccountButton
    deleteWarning: "⚠️ Cette action est irréversible. Ton compte sera supprimé définitivement.",
    suppression: "Suppression…",
    confirmerSuppression: "Confirmer la suppression",
    annulerBtn: "Annuler",
    supprimerCompte: "Supprimer mon compte (Art. 17)",
  },
  en: {
    dateLocale: "en-US",
    headerTitle: "My account",
    tabs: { "Commandes": "Orders", "Favoris": "Favorites", "Avis": "Reviews", "Paramètres": "Settings" } as Record<Tab, string>,
    statusLabel: { pending: "Pending", paid: "Paid", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" } as Record<string, string>,
    qFavoris: "Favorites",
    qCommandes: "Orders",
    qAdresses: "Addresses",
    administration: "Administration",
    espaceVendeur: "Seller space",
    publierCreation: "Publish a creation",
    vendsTesCreations: "Sell your creations here",
    admin: "Admin",
    espaceVendeurShort: "Seller space",
    devenirVendeur: "Become a seller",
    mesReservations: "🗓️ My bookings",
    service: "Service",
    confirme: "Confirmed",
    annule: "Cancelled",
    enAttente: "Pending",
    annuler: "Cancel",
    confirmCancelBooking: "Cancel this booking? You'll be refunded.",
    errorPrefix: "Error: ",
    noOrders: "No orders yet.",
    explorerMarketplace: "Explore the marketplace",
    colis: "Parcel",
    livre: "Delivered",
    expedie: "Shipped",
    enPreparation: "In preparation",
    suivi: "Tracking",
    recu: "🧾 Receipt",
    racheter: "↻ Buy again",
    aucunFavori: "You don't have any favorites yet.",
    decouvrirCreations: "Discover creations",
    favori: "favorite",
    favoriPlural: "s",
    toutGerer: "Manage all →",
    avisIci: "Your reviews will appear here after your purchases.",
    creation: "Creation",
    pseudoLabel: "Username / Display name",
    pseudoPlaceholder: "your_username",
    pronounsLabel: "Pronouns (public)",
    pronounsPlaceholder: "they, she, he…",
    emailLabel: "E-mail (not editable)",
    colisDiscrets: "Discreet parcels (no Spectrum mention on the outside)",
    enregistrement: "Saving…",
    enregistre: "✓ Saved!",
    enregistrer: "Save",
    rgpdTitle: "Personal data (GDPR)",
    exporter: "Export my data (Art. 20)",
    deleteWarning: "⚠️ This action is irreversible. Your account will be permanently deleted.",
    suppression: "Deleting…",
    confirmerSuppression: "Confirm deletion",
    annulerBtn: "Cancel",
    supprimerCompte: "Delete my account (Art. 17)",
  },
} as const;

export default function ComptePage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { locale, formatPrice } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const router = useRouter();
  const { add } = useCart();
  const [rebuying, setRebuying] = useState<string | null>(null);

  const rebuy = async (orderId: string) => {
    setRebuying(orderId);
    const supabase = createClient();
    const { data: its } = await supabase.from("order_items").select("product_id, quantity").eq("order_id", orderId);
    const ids = (its ?? []).map((i) => i.product_id);
    if (ids.length) {
      const { data: prods } = await supabase
        .from("products")
        .select("id,name,title,price,type,image_url,images,is_active")
        .in("id", ids);
      const pmap = Object.fromEntries((prods ?? []).map((p) => [p.id, p]));
      let n = 0;
      for (const it of its ?? []) {
        const p = pmap[it.product_id];
        if (!p || !p.is_active) continue;
        add({ id: p.id, name: p.name || p.title, creator: "", price: Number(p.price), quantity: it.quantity, type: (p.type ?? "product") as "product" | "service" | "event", image: (p.images?.[0] as string) ?? p.image_url ?? undefined });
        n++;
      }
      setRebuying(null);
      if (n) { router.push("/panier"); return; }
    }
    setRebuying(null);
  };
  const [tab, setTab] = useState<Tab>("Commandes");
  const [profile, setProfile] = useState<{ full_name?: string; pseudo?: string; pronouns?: string; is_vendor?: boolean } | null>(null);
  const [orders, setOrders] = useState<Array<{ id: string; total_amount: number; status: string; created_at: string }>>([]);
  const [shipments, setShipments] = useState<Record<string, Array<{ shop_id: string; method_label: string | null; status: string; carrier: string | null; tracking_number: string | null }>>>({});
  const [returns, setReturns] = useState<Record<string, string>>({}); // `${order_id}|${shop_id}` -> status
  const [bookings, setBookings] = useState<Array<{ id: string; start_at: string; status: string; amount: number | null; products: { name: string | null; title: string | null } | null }>>([]);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push("/auth?redirect=/compte");
  }, [user, loading, router]);

  useEffect(() => {
    const read = () => {
      try { setFavCount(JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]").length); }
      catch { setFavCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from("profiles").select("*").eq("id", user.id).single()
      .then(({ data }) => setProfile(data));
    supabase.from("bookings").select("id, start_at, status, amount, products(name, title)").eq("customer_id", user.id).order("start_at", { ascending: false })
      .then(({ data }) => setBookings((data ?? []) as unknown as typeof bookings));
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(async ({ data }) => {
        setOrders(data ?? []);
        const ids = (data ?? []).map(o => o.id);
        if (ids.length) {
          const [{ data: sh }, { data: rr }] = await Promise.all([
            supabase.from("order_shipments").select("order_id, shop_id, method_label, status, carrier, tracking_number").in("order_id", ids),
            supabase.from("return_requests").select("order_id, shop_id, status").in("order_id", ids),
          ]);
          const byOrder: Record<string, Array<{ shop_id: string; method_label: string | null; status: string; carrier: string | null; tracking_number: string | null }>> = {};
          (sh ?? []).forEach(s => { (byOrder[s.order_id] ??= []).push(s); });
          setShipments(byOrder);
          const rmap: Record<string, string> = {};
          (rr ?? []).forEach(r => { rmap[`${r.order_id}|${r.shop_id}`] = r.status; });
          setReturns(rmap);
        }
      });
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center">
        <SpectrumLoader size="md" />
      </div>
    );
  }

  const pseudo = profile?.full_name || user.user_metadata?.pseudo || user.email?.split("@")[0];
  const pronouns = user.user_metadata?.pronouns || "";

  const STATUS_COLOR: Record<string, string> = {
    pending: "text-[#FFD400] border-[#FFD400]/40",
    paid: "text-[#7A2BF0] border-[#7A2BF0]/40",
    shipped: "text-[#2323C4] border-[#2323C4]/40",
    delivered: "text-[#2323C4] border-[#2323C4]/40",
    cancelled: "text-red-400 border-red-400/40",
  };
  const STATUS_LABEL = C.statusLabel;

  return (
    <>
      <div className="hidden md:block"><Header /></div>
      <MobilePageHeader title={C.headerTitle} backHref="/" />

      <main className="min-h-screen md:pt-24 pb-24 md:pb-20 px-4 md:px-6 bg-[#FBFAF8] text-[#101014]">
        <div className="max-w-5xl mx-auto">

          {/* ── Mobile profile card ── */}
          <div className="md:hidden pt-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl mb-4"
              style={{ background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)" }}>
              <div className="w-14 h-14 rounded-2xl bg-[#FF2DA0]/12 border border-[#FF2DA0]/30 flex items-center justify-center shrink-0">
                <span className="font-fraunces text-xl text-[#FF2DA0]">{(pseudo?.[0] ?? "?").toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-fraunces text-[19px] text-[#101014] truncate">{pseudo}</h1>
                  {pronouns && <span className="font-mono text-[10px] text-[#101014]/35">{pronouns}</span>}
                </div>
                <p className="font-hanken text-[12px] text-[#101014]/40 truncate">{user.email}</p>
              </div>
              <button onClick={signOut}
                className="p-2 rounded-xl border border-[#101014]/12 text-[#101014]/40 active:text-red-400 transition-colors shrink-0">
                <LogOut size={15} />
              </button>
            </div>

            {/* Quick action tiles */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Link href="/favoris" className="flex flex-col items-center gap-1.5 py-4 rounded-2xl active:scale-95 transition-transform"
                style={{ background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)" }}>
                <span className="relative">
                  <Heart size={20} className="text-[#FF2DA0]" />
                  {favCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full text-[8px] font-mono flex items-center justify-center text-white" style={{ background: "#FF2DA0" }}>{favCount}</span>
                  )}
                </span>
                <span className="font-mono text-[9px] tracking-wide text-[#101014]/55">{C.qFavoris}</span>
              </Link>
              <button onClick={() => setTab("Commandes")} className="flex flex-col items-center gap-1.5 py-4 rounded-2xl active:scale-95 transition-transform"
                style={{ background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)" }}>
                <Package size={20} className="text-[#7A2BF0]" />
                <span className="font-mono text-[9px] tracking-wide text-[#101014]/55">{C.qCommandes}</span>
              </button>
              <Link href="/compte/adresses" className="flex flex-col items-center gap-1.5 py-4 rounded-2xl active:scale-95 transition-transform"
                style={{ background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)" }}>
                <MapPin size={20} className="text-[#2323C4]" />
                <span className="font-mono text-[9px] tracking-wide text-[#101014]/55">{C.qAdresses}</span>
              </Link>
            </div>

            {/* Vendor / become-vendor row */}
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-2 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg,rgba(255,61,127,0.14),rgba(109,45,181,0.14))", border: "1px solid rgba(255,61,127,0.25)" }}>
                <LayoutDashboard size={17} className="text-[#FF2DA0]" />
                <span className="flex-1 font-hanken text-[14px] text-[#101014]">{C.administration}</span>
                <ChevronRight size={16} className="text-[#101014]/30" />
              </Link>
            )}
            {profile?.is_vendor ? (
              <>
                <Link href="/vendeur" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-2 active:scale-[0.98] transition-transform"
                  style={{ background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)" }}>
                  <Store size={17} className="text-[#2323C4]" />
                  <span className="flex-1 font-hanken text-[14px] text-[#101014]">{C.espaceVendeur}</span>
                  <ChevronRight size={16} className="text-[#101014]/30" />
                </Link>
                <Link href="/publier" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-4 active:scale-[0.98] transition-transform"
                  style={{ background: "linear-gradient(135deg,#7A2BF0,#FF2DA0)", boxShadow: "0 4px 18px rgba(109,45,181,.35)" }}>
                  <PlusCircle size={17} className="text-white" />
                  <span className="flex-1 font-hanken font-semibold text-[14px] text-white">{C.publierCreation}</span>
                  <ChevronRight size={16} className="text-white/60" />
                </Link>
              </>
            ) : (
              <Link href="/vendeur/onboarding" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-4 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg,rgba(109,45,181,0.16),rgba(255,61,127,0.16))", border: "1px solid rgba(109,45,181,0.3)" }}>
                <Store size={17} className="text-[#FF2DA0]" />
                <span className="flex-1 font-hanken text-[14px] text-[#101014]">{C.vendsTesCreations}</span>
                <ChevronRight size={16} className="text-[#101014]/30" />
              </Link>
            )}
          </div>

          {/* Profile header · desktop */}
          <div className="hidden md:flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#FF2DA0]/10 border border-[#FF2DA0]/30 flex items-center justify-center">
              <span className="font-fraunces text-2xl text-[#FF2DA0]">{(pseudo?.[0] ?? "?").toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-fraunces text-2xl text-[#101014]">{pseudo}</h1>
                {pronouns && <span className="font-mono text-xs text-[#101014]/35">{pronouns}</span>}
              </div>
              <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">{user.email}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {isAdmin && (
                <Button variant="primary" href="/admin" className="text-sm py-2 px-4 bg-[#FF2DA0]">
                  <LayoutDashboard size={14} /> {C.admin}
                </Button>
              )}
              {profile?.is_vendor ? (
                <Button variant="secondary" href="/vendeur" className="text-sm py-2 px-4">
                  <Store size={14} /> {C.espaceVendeurShort}
                </Button>
              ) : (
                <Button variant="secondary" href="/vendeur/onboarding" className="text-sm py-2 px-4">
                  <Store size={14} /> {C.devenirVendeur}
                </Button>
              )}
              <button onClick={signOut}
                className="p-2.5 rounded-xl border border-[#101014]/15 text-[#101014]/40 hover:text-red-400 hover:border-red-400/20 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#101014]/10 mb-8 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {TABS.map((t) => {
              const Icon = TAB_ICONS[t];
              return (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 font-hanken text-sm border-b-2 transition-all duration-200 ${
                    tab === t
                      ? "border-[#FF2DA0] text-[#FF2DA0]"
                      : "border-transparent text-[#101014]/40 hover:text-[#101014]/70"
                  }`}>
                  <Icon size={14} /> {C.tabs[t]}
                </button>
              );
            })}
          </div>

          {/* Réservations */}
          {tab === "Commandes" && bookings.length > 0 && (
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{C.mesReservations}</p>
              <div className="space-y-2">
                {bookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between rounded-2xl border border-[#101014]/10 bg-white px-4 py-3">
                    <div>
                      <p className="font-hanken text-sm text-[#101014]">{b.products?.name || b.products?.title || C.service}</p>
                      <p className="font-mono text-[11px] text-[#101014]/45">{new Date(b.start_at).toLocaleString(C.dateLocale, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${b.status === "confirmed" ? "text-green-600 border-green-400/30 bg-green-400/10" : b.status === "cancelled" ? "text-red-500 border-red-400/30" : "text-[#101014]/40 border-[#101014]/20"}`}>
                        {b.status === "confirmed" ? C.confirme : b.status === "cancelled" ? C.annule : C.enAttente}
                      </span>
                      {b.status !== "cancelled" && new Date(b.start_at).getTime() > Date.now() && (
                        <button onClick={async () => {
                          if (!confirm(C.confirmCancelBooking)) return;
                          const res = await fetch("/api/bookings/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booking_id: b.id }) });
                          if (res.ok) setBookings(bs => bs.map(x => x.id === b.id ? { ...x, status: "cancelled" } : x));
                          else { const j = await res.json().catch(() => ({})); alert(C.errorPrefix + (j.error ?? res.status)); }
                        }} className="font-mono text-[10px] text-[#101014]/40 hover:text-red-500 transition-colors">{C.annuler}</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commandes */}
          {tab === "Commandes" && (
            orders.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto mb-4 text-[#101014]/15" />
                <p className="font-hanken text-[#101014]/40 mb-6">{C.noOrders}</p>
                <Button variant="primary" href="/decouvrir">{C.explorerMarketplace}</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} hoverable={false} className="p-5 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs text-[#101014]/30">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`font-mono text-[10px] px-2 py-0.5 border rounded-full ${STATUS_COLOR[order.status] ?? "text-[#101014]/40 border-[#101014]/20"}`}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </div>
                      <p className="font-hanken text-xs text-[#101014]/35 mt-1">
                        {new Date(order.created_at).toLocaleDateString(C.dateLocale, { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      {(shipments[order.id] ?? []).map((s, i) => (
                        <div key={i} className="mt-1.5">
                          <p className="font-mono text-[10px] text-[#101014]/45">
                            📦 {s.method_label ?? C.colis} ·{" "}
                            {s.status === "delivered" ? C.livre : s.status === "shipped" ? C.expedie : C.enPreparation}
                            {s.tracking_number ? <> · {s.carrier ?? C.suivi} <strong className="text-[#101014]/70">{s.tracking_number}</strong></> : null}
                          </p>
                          {user && (
                            <ReturnRequestButton orderId={order.id} shopId={s.shop_id} userId={user.id}
                              existingStatus={returns[`${order.id}|${s.shop_id}`]} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-fraunces text-lg text-[#101014]">{formatPrice(Number(order.total_amount))}</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/compte/recu/${order.id}`}
                          className="rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-wide border border-[#101014]/15 text-[#101014]/55 hover:text-[#101014] hover:border-[#101014]/30 transition-colors">
                          {C.recu}
                        </Link>
                        <button onClick={() => rebuy(order.id)} disabled={rebuying === order.id}
                          className="rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-wide text-white disabled:opacity-50" style={{ background: "#101014" }}>
                          {rebuying === order.id ? "…" : C.racheter}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* Favoris */}
          {tab === "Favoris" && <FavoritesTab userId={user?.id} />}

          {/* Paramètres */}
          {tab === "Paramètres" && (
            <SettingsTab user={user} pseudo={pseudo} pronouns={pronouns} />
          )}

          {/* Avis */}
          {tab === "Avis" && <ReviewsTab userId={user?.id} />}
        </div>
      </main>
      <div className="hidden md:block"><Footer /></div>
    </>
  );
}

// ── Onglet Favoris (données réelles) ────────────────────────────────────────
function FavoritesTab({ userId }: { userId?: string }) {
  const { locale, formatPrice } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const [items, setItems] = useState<{ id: string; name: string; title: string; price: number; images: string[] | null; image_url: string | null; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const supabase = createClient();
    (async () => {
      const { data: favs } = await supabase.from("favorites").select("product_id").eq("user_id", userId);
      const ids = (favs ?? []).map(f => f.product_id as string);
      if (!ids.length) { setItems([]); setLoading(false); return; }
      const { data: prods } = await supabase.from("products")
        .select("id,name,title,price,images,image_url,slug").in("id", ids).eq("is_active", true);
      setItems((prods ?? []) as typeof items); setLoading(false);
    })();
  }, [userId]);

  if (loading) return <div className="py-16 flex justify-center"><SpectrumLoader size="sm" /></div>;
  if (!items.length) return (
    <div className="text-center py-16">
      <Heart size={48} className="mx-auto mb-4 text-[#101014]/15" />
      <p className="font-hanken text-[#101014]/40 mb-6">{C.aucunFavori}</p>
      <Button variant="primary" href="/decouvrir">{C.decouvrirCreations}</Button>
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[11px] text-[#101014]/40">{items.length} {C.favori}{items.length > 1 ? C.favoriPlural : ""}</p>
        <Link href="/favoris" className="font-hanken text-[13px] font-semibold text-[#FF2DA0]">{C.toutGerer}</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map(p => {
          const img = p.images?.[0] ?? p.image_url;
          return (
            <Link key={p.id} href={`/produit/${p.slug}`} className="rounded-2xl overflow-hidden border border-[#101014]/8 bg-white">
              <div className="aspect-square bg-[#F1ECE3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {img ? <img src={img} alt={p.name || p.title} loading="lazy" className="w-full h-full object-cover" /> : null}
              </div>
              <div className="p-2.5">
                <p className="font-hanken text-[13px] text-[#101014] line-clamp-1">{p.name || p.title}</p>
                <p className="font-mono text-[12px] text-[#FF2DA0] mt-0.5">{formatPrice(Number(p.price))}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ── Onglet Avis (données réelles) ───────────────────────────────────────────
function ReviewsTab({ userId }: { userId?: string }) {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const [reviews, setReviews] = useState<{ id: string; rating: number; comment: string | null; created_at: string; products: { name: string | null; title: string | null; slug: string } | null }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const supabase = createClient();
    supabase.from("reviews")
      .select("id, rating, comment, created_at, products(name,title,slug)")
      .eq("user_id", userId).order("created_at", { ascending: false })
      .then(({ data }) => { setReviews((data ?? []) as unknown as typeof reviews); setLoading(false); });
  }, [userId]);

  if (loading) return <div className="py-16 flex justify-center"><SpectrumLoader size="sm" /></div>;
  if (!reviews.length) return (
    <div className="text-center py-16">
      <Star size={48} className="mx-auto mb-4 text-[#101014]/15" />
      <p className="font-hanken text-[#101014]/40">{C.avisIci}</p>
    </div>
  );
  return (
    <div className="space-y-3">
      {reviews.map(r => {
        const prod = r.products && !Array.isArray(r.products) ? r.products : null;
        return (
          <div key={r.id} className="rounded-2xl border border-[#101014]/8 bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              {prod ? <Link href={`/produit/${prod.slug}`} className="font-bricolage font-semibold text-[14px] text-[#101014] hover:text-[#FF2DA0]">{prod.name || prod.title}</Link> : <span className="font-bricolage font-semibold text-[14px]">{C.creation}</span>}
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className={i < r.rating ? "text-[#F2A03D] fill-[#F2A03D]" : "text-[#101014]/15"} />)}
              </span>
            </div>
            {r.comment && <p className="font-hanken text-[13.5px] text-[#101014]/65 leading-relaxed">{r.comment}</p>}
          </div>
        );
      })}
    </div>
  );
}

function SettingsTab({ user, pseudo, pronouns }: { user: { id: string; email?: string }; pseudo: string; pronouns: string }) {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const [form, setForm] = useState({ pseudo, pronouns, discrete: false });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ full_name: form.pseudo }).eq("id", user.id);
    await supabase.auth.updateUser({ data: { pseudo: form.pseudo, pronouns: form.pronouns } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="max-w-md space-y-5">
      {[
        { key: "pseudo", label: C.pseudoLabel, placeholder: C.pseudoPlaceholder, type: "text" },
        { key: "pronouns", label: C.pronounsLabel, placeholder: C.pronounsPlaceholder, type: "text" },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{label}</label>
          <input type={type} value={form[key as keyof typeof form] as string}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
        </div>
      ))}

      <div>
        <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{C.emailLabel}</label>
        <input type="email" value={user.email ?? ""} disabled
          className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 text-[#101014]/40 font-hanken text-sm cursor-not-allowed" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <input type="checkbox" checked={form.discrete} onChange={(e) => setForm({ ...form, discrete: e.target.checked })} className="w-4 h-4 rounded accent-[#FF2DA0]" />
        <span className="font-hanken text-sm text-[#101014]/60 group-hover:text-[#101014]/80">{C.colisDiscrets}</span>
      </label>

      <Button variant="primary" type="submit" disabled={saving} className="py-3">
        {saving ? C.enregistrement : saved ? C.enregistre : C.enregistrer}
      </Button>

      {/* ── RGPD ── */}
      <div className="pt-8 mt-8 border-t border-[#101014]/8 space-y-3">
        <p className="font-mono text-[10px] tracking-wide text-[#101014]/30 mb-4">{C.rgpdTitle}</p>

        <a
          href="/api/account/export"
          download
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#101014]/12 text-[#101014]/60 font-hanken text-sm hover:border-[#2323C4]/40 hover:text-[#2323C4] transition-all"
        >
          <Download size={14} />
          {C.exporter}
        </a>

        <DeleteAccountButton />
      </div>
    </form>
  );
}

function DeleteAccountButton() {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (res.ok) window.location.href = "/";
    else setDeleting(false);
  };

  return confirm ? (
    <div className="p-4 rounded-xl border border-red-400/30 bg-red-400/5 space-y-3">
      <p className="font-hanken text-sm text-red-400">{C.deleteWarning}</p>
      <div className="flex gap-2">
        <button onClick={handleDelete} disabled={deleting}
          className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 font-hanken text-sm border border-red-400/30 hover:bg-red-500/30 transition-colors disabled:opacity-50">
          {deleting ? C.suppression : C.confirmerSuppression}
        </button>
        <button onClick={() => setConfirm(false)}
          className="flex-1 py-2 rounded-xl border border-[#101014]/12 text-[#101014]/50 font-hanken text-sm hover:border-[#101014]/25 transition-colors">
          {C.annulerBtn}
        </button>
      </div>
    </div>
  ) : (
    <button onClick={() => setConfirm(true)}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#101014]/12 text-[#101014]/40 font-hanken text-sm hover:border-red-400/30 hover:text-red-400 transition-all">
      <Trash2 size={14} />
      {C.supprimerCompte}
    </button>
  );
}
