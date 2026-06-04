"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, Heart, Star, Settings, Store, LogOut, LayoutDashboard, Download, Trash2 } from "lucide-react";
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
  const [tab, setTab] = useState<Tab>("Commandes");
  const [profile, setProfile] = useState<{ full_name?: string; pseudo?: string; pronouns?: string; is_vendor?: boolean } | null>(null);
  const [orders, setOrders] = useState<Array<{ id: string; total_amount: number; status: string; created_at: string }>>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/auth?redirect=/compte");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from("profiles").select("*").eq("id", user.id).single()
      .then(({ data }) => setProfile(data));
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data ?? []));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#3D1F5C] flex items-center justify-center">
        <SpectrumLoader size="md" />
      </div>
    );
  }

  const pseudo = profile?.full_name || user.user_metadata?.pseudo || user.email?.split("@")[0];
  const pronouns = user.user_metadata?.pronouns || "";

  const STATUS_COLOR: Record<string, string> = {
    pending: "text-[#E0901E] border-[#E0901E]/40",
    paid: "text-[#6D2DB5] border-[#6D2DB5]/40",
    shipped: "text-[#1C9C95] border-[#1C9C95]/40",
    delivered: "text-[#1C9C95] border-[#1C9C95]/40",
    cancelled: "text-red-400 border-red-400/40",
  };
  const STATUS_LABEL: Record<string, string> = {
    pending: "En attente", paid: "Payé", shipped: "Expédié", delivered: "Livré", cancelled: "Annulé",
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#E0337E]/10 border border-[#E0337E]/30 flex items-center justify-center">
              <span className="font-fraunces text-2xl text-[#E0337E]">{(pseudo?.[0] ?? "?").toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-fraunces text-2xl text-[#F3EADB]">{pseudo}</h1>
                {pronouns && <span className="font-mono text-xs text-[#F3EADB]/35">{pronouns}</span>}
              </div>
              <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">{user.email}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {isAdmin && (
                <Button variant="primary" href="/admin" className="text-sm py-2 px-4 bg-[#E0337E]">
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
                className="p-2.5 rounded-xl border border-[#F3EADB]/15 text-[#F3EADB]/40 hover:text-red-400 hover:border-red-400/20 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#F3EADB]/10 mb-8">
            {TABS.map((t) => {
              const Icon = TAB_ICONS[t];
              return (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex items-center gap-2 px-4 py-2.5 font-hanken text-sm border-b-2 transition-all duration-200 ${
                    tab === t
                      ? "border-[#E0337E] text-[#E0337E]"
                      : "border-transparent text-[#F3EADB]/40 hover:text-[#F3EADB]/70"
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
                <Package size={48} className="mx-auto mb-4 text-[#F3EADB]/15" />
                <p className="font-hanken text-[#F3EADB]/40 mb-6">Aucune commande pour l&apos;instant.</p>
                <Button variant="primary" href="/decouvrir">Explorer la marketplace</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} hoverable={false} className="p-5 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs text-[#F3EADB]/30">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`font-mono text-[10px] px-2 py-0.5 border rounded-full ${STATUS_COLOR[order.status] ?? "text-[#F3EADB]/40 border-[#F3EADB]/20"}`}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </div>
                      <p className="font-hanken text-xs text-[#F3EADB]/35 mt-1">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span className="font-fraunces text-lg text-[#F3EADB]">{Number(order.total_amount).toFixed(2)} €</span>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* Favoris */}
          {tab === "Favoris" && (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto mb-4 text-[#F3EADB]/15" />
              <p className="font-hanken text-[#F3EADB]/40 mb-6">Tu n&apos;as pas encore de favoris.</p>
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
              <Star size={48} className="mx-auto mb-4 text-[#F3EADB]/15" />
              <p className="font-hanken text-[#F3EADB]/40">Tes avis apparaîtront ici après tes achats.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
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
          <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">{label}</label>
          <input type={type} value={form[key as keyof typeof form] as string}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
        </div>
      ))}

      <div>
        <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">E-mail (non modifiable)</label>
        <input type="email" value={user.email ?? ""} disabled
          className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-4 py-3 text-[#F3EADB]/40 font-hanken text-sm cursor-not-allowed" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <input type="checkbox" checked={form.discrete} onChange={(e) => setForm({ ...form, discrete: e.target.checked })} className="w-4 h-4 rounded accent-[#E0337E]" />
        <span className="font-hanken text-sm text-[#F3EADB]/60 group-hover:text-[#F3EADB]/80">Colis discrets (aucune mention Spectrum à l&apos;extérieur)</span>
      </label>

      <Button variant="primary" type="submit" disabled={saving} className="py-3">
        {saving ? "Enregistrement…" : saved ? "✓ Enregistré !" : "Enregistrer"}
      </Button>

      {/* ── RGPD ── */}
      <div className="pt-8 mt-8 border-t border-[#F3EADB]/8 space-y-3">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/30 mb-4">Données personnelles (RGPD)</p>

        <a
          href="/api/account/export"
          download
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#F3EADB]/12 text-[#F3EADB]/60 font-hanken text-sm hover:border-[#1C9C95]/40 hover:text-[#1C9C95] transition-all"
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
          className="flex-1 py-2 rounded-xl border border-[#F3EADB]/12 text-[#F3EADB]/50 font-hanken text-sm hover:border-[#F3EADB]/25 transition-colors">
          Annuler
        </button>
      </div>
    </div>
  ) : (
    <button onClick={() => setConfirm(true)}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#F3EADB]/12 text-[#F3EADB]/40 font-hanken text-sm hover:border-red-400/30 hover:text-red-400 transition-all">
      <Trash2 size={14} />
      Supprimer mon compte (Art. 17)
    </button>
  );
}
