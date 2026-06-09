"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/store/cart";
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

export default function ComptePage() {
  const { user, isAdmin, loading, signOut } = useAuth();
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
  const [shipments, setShipments] = useState<Record<string, Array<{ method_label: string | null; status: string; carrier: string | null; tracking_number: string | null }>>>({});
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
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(async ({ data }) => {
        setOrders(data ?? []);
        const ids = (data ?? []).map(o => o.id);
        if (ids.length) {
          const { data: sh } = await supabase
            .from("order_shipments")
            .select("order_id, method_label, status, carrier, tracking_number")
            .in("order_id", ids);
          const byOrder: Record<string, Array<{ method_label: string | null; status: string; carrier: string | null; tracking_number: string | null }>> = {};
          (sh ?? []).forEach(s => { (byOrder[s.order_id] ??= []).push(s); });
          setShipments(byOrder);
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
  const STATUS_LABEL: Record<string, string> = {
    pending: "En attente", paid: "Payé", shipped: "Expédié", delivered: "Livré", cancelled: "Annulé",
  };

  return (
    <>
      <div className="hidden md:block"><Header /></div>
      <MobilePageHeader title="Mon compte" backHref="/" />

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
                <span className="font-mono text-[9px] tracking-wide text-[#101014]/55">Favoris</span>
              </Link>
              <button onClick={() => setTab("Commandes")} className="flex flex-col items-center gap-1.5 py-4 rounded-2xl active:scale-95 transition-transform"
                style={{ background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)" }}>
                <Package size={20} className="text-[#7A2BF0]" />
                <span className="font-mono text-[9px] tracking-wide text-[#101014]/55">Commandes</span>
              </button>
              <Link href="/compte/adresses" className="flex flex-col items-center gap-1.5 py-4 rounded-2xl active:scale-95 transition-transform"
                style={{ background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)" }}>
                <MapPin size={20} className="text-[#2323C4]" />
                <span className="font-mono text-[9px] tracking-wide text-[#101014]/55">Adresses</span>
              </Link>
            </div>

            {/* Vendor / become-vendor row */}
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-2 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg,rgba(255,61,127,0.14),rgba(109,45,181,0.14))", border: "1px solid rgba(255,61,127,0.25)" }}>
                <LayoutDashboard size={17} className="text-[#FF2DA0]" />
                <span className="flex-1 font-hanken text-[14px] text-[#101014]">Administration</span>
                <ChevronRight size={16} className="text-[#101014]/30" />
              </Link>
            )}
            {profile?.is_vendor ? (
              <>
                <Link href="/vendeur" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-2 active:scale-[0.98] transition-transform"
                  style={{ background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)" }}>
                  <Store size={17} className="text-[#2323C4]" />
                  <span className="flex-1 font-hanken text-[14px] text-[#101014]">Espace vendeur·rice</span>
                  <ChevronRight size={16} className="text-[#101014]/30" />
                </Link>
                <Link href="/publier" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-4 active:scale-[0.98] transition-transform"
                  style={{ background: "linear-gradient(135deg,#7A2BF0,#FF2DA0)", boxShadow: "0 4px 18px rgba(109,45,181,.35)" }}>
                  <PlusCircle size={17} className="text-white" />
                  <span className="flex-1 font-hanken font-semibold text-[14px] text-white">Publier une création</span>
                  <ChevronRight size={16} className="text-white/60" />
                </Link>
              </>
            ) : (
              <Link href="/vendeur/onboarding" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-4 active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(135deg,rgba(109,45,181,0.16),rgba(255,61,127,0.16))", border: "1px solid rgba(109,45,181,0.3)" }}>
                <Store size={17} className="text-[#FF2DA0]" />
                <span className="flex-1 font-hanken text-[14px] text-[#101014]">Vends tes créations ici</span>
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
                  <LayoutDashboard size={14} /> Admin
                </Button>
              )}
              {profile?.is_vendor ? (
                <Button variant="secondary" href="/vendeur" className="text-sm py-2 px-4">
                  <Store size={14} /> Espace vendeur
                </Button>
              ) : (
                <Button variant="secondary" href="/vendeur/onboarding" className="text-sm py-2 px-4">
                  <Store size={14} /> Devenir vendeur·rice
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
                  <Icon size={14} /> {t}
                </button>
              );
            })}
          </div>

          {/* Commandes */}
          {tab === "Commandes" && (
            orders.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto mb-4 text-[#101014]/15" />
                <p className="font-hanken text-[#101014]/40 mb-6">Aucune commande pour l&apos;instant.</p>
                <Button variant="primary" href="/decouvrir">Explorer la marketplace</Button>
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
                        {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      {(shipments[order.id] ?? []).map((s, i) => (
                        <p key={i} className="font-mono text-[10px] text-[#101014]/45 mt-1.5">
                          📦 {s.method_label ?? "Colis"} ·{" "}
                          {s.status === "delivered" ? "Livré" : s.status === "shipped" ? "Expédié" : "En préparation"}
                          {s.tracking_number ? <> · {s.carrier ?? "Suivi"} <strong className="text-[#101014]/70">{s.tracking_number}</strong></> : null}
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-fraunces text-lg text-[#101014]">{Number(order.total_amount).toFixed(2)} €</span>
                      <button onClick={() => rebuy(order.id)} disabled={rebuying === order.id}
                        className="rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-wide text-white disabled:opacity-50" style={{ background: "#101014" }}>
                        {rebuying === order.id ? "…" : "↻ Racheter"}
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* Favoris */}
          {tab === "Favoris" && (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto mb-4 text-[#101014]/15" />
              <p className="font-hanken text-[#101014]/40 mb-6">Tu n&apos;as pas encore de favoris.</p>
              <Button variant="primary" href="/decouvrir">Découvrir des créations</Button>
            </div>
          )}

          {/* Paramètres */}
          {tab === "Paramètres" && (
            <SettingsTab user={user} pseudo={pseudo} pronouns={pronouns} />
          )}

          {/* Avis */}
          {tab === "Avis" && (
            <div className="text-center py-16">
              <Star size={48} className="mx-auto mb-4 text-[#101014]/15" />
              <p className="font-hanken text-[#101014]/40">Tes avis apparaîtront ici après tes achats.</p>
            </div>
          )}
        </div>
      </main>
      <div className="hidden md:block"><Footer /></div>
    </>
  );
}

function SettingsTab({ user, pseudo, pronouns }: { user: { id: string; email?: string }; pseudo: string; pronouns: string }) {
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
        { key: "pseudo", label: "Pseudo / Nom affiché", placeholder: "ton_pseudo", type: "text" },
        { key: "pronouns", label: "Pronoms (public)", placeholder: "iel, elle, il…", type: "text" },
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
        <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">E-mail (non modifiable)</label>
        <input type="email" value={user.email ?? ""} disabled
          className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 text-[#101014]/40 font-hanken text-sm cursor-not-allowed" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <input type="checkbox" checked={form.discrete} onChange={(e) => setForm({ ...form, discrete: e.target.checked })} className="w-4 h-4 rounded accent-[#FF2DA0]" />
        <span className="font-hanken text-sm text-[#101014]/60 group-hover:text-[#101014]/80">Colis discrets (aucune mention Spectrum à l&apos;extérieur)</span>
      </label>

      <Button variant="primary" type="submit" disabled={saving} className="py-3">
        {saving ? "Enregistrement…" : saved ? "✓ Enregistré !" : "Enregistrer"}
      </Button>

      {/* ── RGPD ── */}
      <div className="pt-8 mt-8 border-t border-[#101014]/8 space-y-3">
        <p className="font-mono text-[10px] tracking-wide text-[#101014]/30 mb-4">Données personnelles (RGPD)</p>

        <a
          href="/api/account/export"
          download
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#101014]/12 text-[#101014]/60 font-hanken text-sm hover:border-[#2323C4]/40 hover:text-[#2323C4] transition-all"
        >
          <Download size={14} />
          Exporter mes données (Art. 20)
        </a>

        <DeleteAccountButton />
      </div>
    </form>
  );
}

function DeleteAccountButton() {
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
      <p className="font-hanken text-sm text-red-400">⚠️ Cette action est irréversible. Ton compte sera supprimé définitivement.</p>
      <div className="flex gap-2">
        <button onClick={handleDelete} disabled={deleting}
          className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 font-hanken text-sm border border-red-400/30 hover:bg-red-500/30 transition-colors disabled:opacity-50">
          {deleting ? "Suppression…" : "Confirmer la suppression"}
        </button>
        <button onClick={() => setConfirm(false)}
          className="flex-1 py-2 rounded-xl border border-[#101014]/12 text-[#101014]/50 font-hanken text-sm hover:border-[#101014]/25 transition-colors">
          Annuler
        </button>
      </div>
    </div>
  ) : (
    <button onClick={() => setConfirm(true)}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#101014]/12 text-[#101014]/40 font-hanken text-sm hover:border-red-400/30 hover:text-red-400 transition-all">
      <Trash2 size={14} />
      Supprimer mon compte (Art. 17)
    </button>
  );
}
