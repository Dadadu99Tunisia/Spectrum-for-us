"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus, X } from "lucide-react";

const CATEGORIES = ["Mode non-genrée", "Art & Culture", "Bijoux", "Zines & Édition", "Corps & Soin", "Intimité", "Maison", "Services", "Expériences"];
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
    category: "", quantity: "1", is_active: true, variants: [] as string[],
  });

  useEffect(() => {
    if (!loading && !user) { router.push("/auth?redirect=/vendeur/nouveau-produit"); return; }
    if (!user) return;
    createClient().from("shops").select("id").eq("owner_id", user.id).single()
      .then(({ data }) => {
        if (!data) router.push("/vendeur/onboarding");
        else setShopId(data.id);
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
    const { error: err } = await supabase.from("products").insert({
      shop_id: shopId,
      vendor_id: user.id,
      name: form.name.trim(),
      slug: slugify(form.name),
      title: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category: form.category || null,
      quantity: parseInt(form.quantity) || 0,
      is_active: form.is_active,
      listing_status: "approved",
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(() => router.push("/vendeur"), 1800);
  };

  if (loading || !shopId) return (
    <div className="min-h-screen bg-[#1C0E29] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#E0337E] border-t-transparent animate-spin" />
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-[#1C0E29] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-5xl mb-4">✦</div>
        <h1 className="font-fraunces text-3xl text-[#F3EADB] mb-2">Produit ajouté !</h1>
        <p className="font-hanken text-[#F3EADB]/50">Redirection vers ton dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1C0E29] px-6 py-12">
      <div className="max-w-xl mx-auto">
        <Button variant="ghost" href="/vendeur" className="mb-6 text-sm text-[#F3EADB]/40">
          <ArrowLeft size={14} /> Retour au dashboard
        </Button>
        <h1 className="font-fraunces text-3xl text-[#F3EADB] mb-8">Nouveau produit</h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Type */}
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-3">Type d&apos;offre *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-hanken text-left transition-all duration-200 ${
                    form.type === t.value ? "border-[#E0337E] bg-[#E0337E]/10 text-[#E0337E]" : "border-[#F3EADB]/15 text-[#F3EADB]/55 hover:border-[#F3EADB]/30"
                  }`}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">Nom du produit *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Bague Spectre" required
              className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">Description *</label>
            <textarea rows={5} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Décris ton produit avec précision…" required
              className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">Prix (€) *</label>
              <input type="number" min="0.01" step="0.01" value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="29.90"
                className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
            </div>
            {/* Stock */}
            {form.type === "product" && (
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">Stock</label>
                <input type="number" min="0" value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  placeholder="10"
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">Catégorie</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm focus:outline-none focus:border-[#E0337E]/60 transition-colors">
              <option value="" className="bg-[#1C0E29]">Sélectionner…</option>
              {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#1C0E29]">{c}</option>)}
            </select>
          </div>

          {/* Variants */}
          {form.type === "product" && (
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">Variantes (taille, couleur…)</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={variant} onChange={(e) => setVariant(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVariant(); } }}
                  placeholder="S, M, Rouge…"
                  className="flex-1 bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-2.5 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
                <button type="button" onClick={addVariant}
                  className="px-3 py-2.5 rounded-xl bg-[#E0337E]/10 text-[#E0337E] hover:bg-[#E0337E]/20 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              {form.variants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.variants.map((v) => (
                    <span key={v} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 text-xs font-hanken text-[#F3EADB]/70">
                      {v}
                      <button type="button" onClick={() => setForm((f) => ({ ...f, variants: f.variants.filter((x) => x !== v) }))}
                        className="text-[#F3EADB]/30 hover:text-red-400 transition-colors">
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
              className="w-4 h-4 rounded accent-[#E0337E]" />
            <span className="font-hanken text-sm text-[#F3EADB]/60 group-hover:text-[#F3EADB]/80">Mettre en ligne immédiatement</span>
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
