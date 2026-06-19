"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus, X } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import { ImageUploader } from "@/components/ui/ImageUploader";

import { CATEGORY_LIST, getSubcategories } from "@/lib/categories";
const TYPES = [
  { value: "product", label: "Produit physique ou numérique" },
  { value: "service", label: "Service (sur rendez-vous)" },
  { value: "event", label: "Expérience / Événement" },
] as const;

function slugify(t: string) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 5);
}

export default function NouveauProduitPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [variant, setVariant] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", price: "", type: "product" as "product" | "service" | "event",
    category: "", subcategory: "", quantity: "1", is_active: true, is_adult: false, variants: [] as string[],
    image_url: "", weight_grams: "500",
    event_date: "", event_end: "", event_location: "", event_city: "", event_capacity: "",
  });

  useEffect(() => {
    if (!loading && !user) { router.push("/auth?redirect=/vendeur/nouveau-produit"); return; }
    if (!user) return;
    // Cible l'activité ACTIVE du dashboard (parmi toutes les activités du seller).
    createClient().from("shops").select("id").eq("owner_id", user.id).order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!data?.length) { router.push("/vendeur/onboarding"); return; }
        let id = data[0].id as string;
        try { const saved = localStorage.getItem("sfu_active_activity"); if (saved && data.some(s => s.id === saved)) id = saved; } catch {}
        setShopId(id);
      });
  }, [user, loading, router]);

  const addVariant = () => {
    const v = variant.trim();
    if (v && !form.variants.includes(v)) {
      setForm((f) => ({ ...f, variants: [...f.variants, v] }));
    }
    setVariant("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId || !user) return;
    if (!form.name.trim() || !form.price || !form.description.trim()) {
      setError("Nom, description et prix sont obligatoires."); return;
    }
    setSaving(true); setError("");
    const supabase = createClient();
    const { data: created, error: err } = await supabase.from("products").insert({
      shop_id: shopId,
      vendor_id: user.id,
      name: form.name.trim(),
      slug: slugify(form.name),
      title: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category: form.category || null,
      subcategory: form.subcategory || null,
      quantity: parseInt(form.quantity) || 0,
      is_active: form.is_active,
      is_adult: form.is_adult,
      weight_grams: parseInt(form.weight_grams) || 500,
      type: form.type,
      listing_status: "approved",
      image_url: form.image_url || null,
      images: form.image_url ? [form.image_url] : null,
      ...(form.type === "event" ? {
        event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
        event_end: form.event_end ? new Date(form.event_end).toISOString() : null,
        event_location: form.event_location.trim() || null,
        event_city: form.event_city.trim() || null,
        event_capacity: form.event_capacity ? parseInt(form.event_capacity) : null,
      } : {}),
    }).select("id").single();
    setSaving(false);
    if (err) { setError(err.message); return; }
    // Notifie les abonné·es de la boutique (si le produit est visible)
    if (created?.id && form.is_active) {
      fetch("/api/products/notify-followers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: created.id }), keepalive: true,
      }).catch(() => {});
    }
    setSuccess(true);
    setTimeout(() => router.push("/vendeur"), 1800);
  };

  if (loading || !shopId) return (
    <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#FF2DA0] border-t-transparent animate-spin" />
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-5xl mb-4">✦</div>
        <h1 className="font-fraunces text-3xl text-[#101014] mb-2">Produit ajouté !</h1>
        <p className="font-hanken text-[#101014]/50">Redirection vers ton dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFAF8] px-6 py-12">
      <div className="max-w-xl mx-auto">
        <Button variant="ghost" href="/vendeur" className="mb-6 text-sm text-[#101014]/40">
          <ArrowLeft size={14} /> Retour au dashboard
        </Button>
        <h1 className="font-fraunces text-3xl text-[#101014] mb-8">Nouveau produit</h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Image */}
          <div>
            <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-3">Photo du produit</label>
            {shopId && user && (
              <ImageUploader
                bucket="product-images"
                folder={user.id}
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                label="Ajoute une belle photo (carré recommandé)"
              />
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-3">Type d&apos;offre *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-hanken text-left transition-all duration-200 ${
                    form.type === t.value ? "border-[#FF2DA0] bg-[#FF2DA0]/10 text-[#FF2DA0]" : "border-[#101014]/15 text-[#101014]/55 hover:border-[#101014]/30"
                  }`}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Champs Événement (billetterie interne) */}
          {form.type === "event" && (
            <div className="rounded-2xl border border-[#7A2BF0]/30 bg-[#7A2BF0]/[0.04] p-4 space-y-3">
              <p className="font-mono text-[10px] tracking-wide text-[#7A2BF0]">🎟️ Détails de l'événement · billetterie Spectrum</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Date & heure de début *</label>
                  <input type="datetime-local" value={form.event_date} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                    className="w-full bg-white border border-[#101014]/15 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7A2BF0]/50" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Fin (facultatif)</label>
                  <input type="datetime-local" value={form.event_end} onChange={(e) => setForm((f) => ({ ...f, event_end: e.target.value }))}
                    className="w-full bg-white border border-[#101014]/15 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7A2BF0]/50" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Lieu / salle</label>
                  <input type="text" value={form.event_location} onChange={(e) => setForm((f) => ({ ...f, event_location: e.target.value }))}
                    placeholder="La Mutinerie" className="w-full bg-white border border-[#101014]/15 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7A2BF0]/50" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Ville</label>
                  <input type="text" value={form.event_city} onChange={(e) => setForm((f) => ({ ...f, event_city: e.target.value }))}
                    placeholder="Paris" className="w-full bg-white border border-[#101014]/15 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7A2BF0]/50" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#101014]/40 mb-1">Nombre de places (capacité)</label>
                  <input type="number" min="1" value={form.event_capacity} onChange={(e) => setForm((f) => ({ ...f, event_capacity: e.target.value }))}
                    placeholder="50" className="w-full bg-white border border-[#101014]/15 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#7A2BF0]/50" />
                </div>
              </div>
              <p className="font-mono text-[9px] text-[#101014]/35">Le « stock » (champ quantité plus bas) = nombre de billets disponibles.</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Nom du produit *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Bague Spectre" required
              className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Description *</label>
            <textarea rows={5} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Décris ton produit avec précision…" required
              className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Prix (€) *</label>
              <input type="number" min="0.01" step="0.01" value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="29.90"
                className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
            </div>
            {/* Stock */}
            {form.type === "product" && (
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Stock</label>
                <input type="number" min="0" value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  placeholder="10"
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
            )}
            {form.type === "product" && (
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Poids (grammes)</label>
                <input type="number" min="1" value={form.weight_grams}
                  onChange={(e) => setForm((f) => ({ ...f, weight_grams: e.target.value }))}
                  placeholder="500"
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
                <p className="font-mono text-[9px] text-[#101014]/35 mt-1">Sert à calculer le bon tarif d&apos;expédition (ex. bijou ≈ 100 g, vêtement ≈ 400 g).</p>
              </div>
            )}
          </div>

          {/* Catégorie + Sous-catégorie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Catégorie</label>
              <select value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value, subcategory: "" }))}
                className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/60 transition-colors">
                <option value="" className="bg-[#FBFAF8]">Sélectionner…</option>
                {CATEGORY_LIST.map((c) => <option key={c} value={c} className="bg-[#FBFAF8]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">
                Sous-catégorie
                {!form.category && <span className="text-[#101014]/20 normal-case tracking-normal ml-1">(après catégorie)</span>}
              </label>
              <select value={form.subcategory}
                onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))}
                disabled={!form.category}
                className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/60 transition-colors disabled:opacity-40">
                <option value="" className="bg-[#FBFAF8]">- Choisir -</option>
                {getSubcategories(form.category).map((s) => <option key={s} value={s} className="bg-[#FBFAF8]">{s}</option>)}
              </select>
            </div>
          </div>

          {/* Variants */}
          {form.type === "product" && (
            <div>
              <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Variantes (taille, couleur…)</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={variant} onChange={(e) => setVariant(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVariant(); } }}
                  placeholder="S, M, Rouge…"
                  className="flex-1 bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-2.5 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
                <button type="button" onClick={addVariant}
                  className="px-3 py-2.5 rounded-xl bg-[#FF2DA0]/10 text-[#FF2DA0] hover:bg-[#FF2DA0]/20 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              {form.variants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.variants.map((v) => (
                    <span key={v} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101014]/5 border border-[#101014]/15 text-xs font-hanken text-[#101014]/70">
                      {v}
                      <button type="button" onClick={() => setForm((f) => ({ ...f, variants: f.variants.filter((x) => x !== v) }))}
                        className="text-[#101014]/30 hover:text-red-400 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 rounded accent-[#FF2DA0]" />
            <span className="font-hanken text-sm text-[#101014]/60 group-hover:text-[#101014]/80">Mettre en ligne immédiatement</span>
          </label>

          {/* 18+ */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={form.is_adult} onChange={(e) => setForm((f) => ({ ...f, is_adult: e.target.checked }))}
              className="w-4 h-4 rounded accent-[#FF2DA0]" />
            <span className="font-hanken text-sm text-[#101014]/60 group-hover:text-[#101014]/80">Produit réservé aux adultes 🔞 (affiche un badge 18+)</span>
          </label>

          {error && <div role="alert" className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}

          <Button variant="primary" type="submit" disabled={saving} className="w-full py-3.5 text-base">
            {saving ? "Publication…" : "Publier le produit ✦"}
          </Button>
        </form>
      </div>
    </div>
  );
}
