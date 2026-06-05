"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";
import { ArrowLeft, Save, Trash2, Eye, EyeOff } from "lucide-react";
import { MultiImageUploader } from "@/components/ui/ImageUploader";
import { CATEGORY_LIST, getSubcategories } from "@/lib/categories";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

export default function EditProduitPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]   = useState("");
  const [toast, setToast]   = useState("");
  const [shopId, setShopId] = useState<string | null>(null);
  const [form, setForm]     = useState({
    name: "", description: "", price: "", category: "", subcategory: "",
    quantity: "1", is_active: true, images: [] as string[], type: "product" as string,
  });

  useEffect(() => {
    if (!loading && !user) { router.push("/auth"); return; }
    if (!user) return;
    const supabase = createClient();
    // Charger la boutique du vendeur
    supabase.from("shops").select("id").eq("owner_id", user.id).single().then(({ data: shop }) => {
      if (!shop) { router.push("/vendeur/onboarding"); return; }
      setShopId(shop.id);
      // Charger le produit — vérifier qu'il appartient bien à cette boutique
      supabase.from("products").select("*").eq("id", id).eq("shop_id", shop.id).single()
        .then(({ data: p, error: err }) => {
          if (err || !p) { router.push("/vendeur"); return; }
          setForm({
            name: String(p.name || p.title || ""),
            description: String(p.description || ""),
            price: String(p.price || ""),
            category: String(p.category || ""),
            subcategory: String(p.subcategory || ""),
            quantity: String(p.quantity ?? 1),
            is_active: Boolean(p.is_active),
            images: (p.images as string[] | null) ?? (p.image_url ? [p.image_url as string] : []),
            type: String(p.type || "product"),
          });
        });
    });
  }, [user, loading, router, id]);

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) return;
    if (!form.name.trim() || !form.price) { setError("Nom et prix obligatoires."); return; }
    setSaving(true); setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("products").update({
      name: form.name.trim(),
      title: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category: form.category || null,
      subcategory: form.subcategory || null,
      quantity: parseInt(form.quantity) || 0,
      is_active: form.is_active,
      images: form.images,
      image_url: form.images[0] ?? null,
      type: form.type,
    }).eq("id", id).eq("shop_id", shopId);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setToast("Produit mis à jour ✓");
    setTimeout(() => setToast(""), 2500);
  };

  const toggleActive = async () => {
    if (!shopId) return;
    const supabase = createClient();
    const newVal = !form.is_active;
    await supabase.from("products").update({ is_active: newVal }).eq("id", id).eq("shop_id", shopId);
    setForm(p => ({ ...p, is_active: newVal }));
    setToast(newVal ? "Produit activé ✓" : "Produit désactivé");
    setTimeout(() => setToast(""), 2500);
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    if (!shopId) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id).eq("shop_id", shopId);
    router.push("/vendeur");
  };

  const inputCls = "w-full bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-4 py-3 font-hanken text-sm text-[#1A1612] placeholder-[#1A1612]/20 focus:outline-none focus:border-[#FF3D7F]/50 transition-colors";

  if (loading) return (
    <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#FF3D7F] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <Header />
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0e061a] border border-[#FF3D7F]/30 text-[#1A1612] font-hanken text-sm shadow-2xl">
          {toast}
        </div>
      )}
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/vendeur")} className="p-2 rounded-xl border border-[#1A1612]/10 text-[#1A1612]/40 hover:text-[#1A1612] transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h1 className="font-fraunces text-2xl text-[#1A1612]">Modifier le produit</h1>
          </div>
          {/* Toggle actif/inactif */}
          <button onClick={toggleActive}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-hanken text-sm transition-all ${
              form.is_active
                ? "border-green-400/30 text-green-400 bg-green-400/8 hover:bg-red-400/8 hover:text-red-400 hover:border-red-400/30"
                : "border-[#1A1612]/15 text-[#1A1612]/40 hover:text-green-400 hover:border-green-400/30"
            }`}>
            {form.is_active ? <><Eye size={13} /> En ligne</> : <><EyeOff size={13} /> Hors ligne</>}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Images */}
          {shopId && (
            <MultiImageUploader
              bucket="product-images"
              folder={shopId}
              values={form.images}
              onChange={imgs => setForm(p => ({ ...p, images: imgs }))}
              max={5}
              label="Photos du produit"
            />
          )}

          {/* Type */}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30 mb-2">Type d&apos;offre</label>
            <div className="grid grid-cols-3 gap-2">
              {[{v:"product",l:"Produit"},{v:"service",l:"Service"},{v:"event",l:"Événement"}].map(t => (
                <button key={t.v} type="button" onClick={() => setForm(p => ({ ...p, type: t.v }))}
                  className={`px-3 py-2 rounded-xl border text-xs font-hanken transition-all duration-200 ${
                    form.type === t.v ? "border-[#FF3D7F] bg-[#FF3D7F]/10 text-[#FF3D7F]" : "border-[#1A1612]/15 text-[#1A1612]/50 hover:border-[#1A1612]/30"
                  }`}>{t.l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30 mb-2">Nom *</label>
            <input value={form.name} onChange={f("name")} placeholder="Nom du produit" className={inputCls} />
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30 mb-2">Description</label>
            <textarea value={form.description} onChange={f("description")} rows={4} placeholder="Décris ton produit…"
              className={`${inputCls} resize-y`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30 mb-2">Prix (€) *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={f("price")} placeholder="0.00" className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30 mb-2">Stock</label>
              <input type="number" min="0" value={form.quantity} onChange={f("quantity")} placeholder="0" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30 mb-2">Catégorie</label>
              <select value={form.category} onChange={e => { setForm(p => ({ ...p, category: e.target.value, subcategory: "" })); }} className={inputCls}>
                <option value="">— Choisir —</option>
                {CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30 mb-2">
                Sous-catégorie
                {!form.category && <span className="text-[#1A1612]/20 normal-case ml-1">(choisir une catégorie d'abord)</span>}
              </label>
              <select value={form.subcategory} onChange={f("subcategory")} disabled={!form.category} className={`${inputCls} disabled:opacity-40`}>
                <option value="">— Choisir —</option>
                {getSubcategories(form.category).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="font-hanken text-sm text-red-400 bg-red-400/8 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1 py-3 flex items-center justify-center gap-2" disabled={saving}>
              <Save size={14} /> {saving ? "Sauvegarde…" : "Enregistrer les modifications"}
            </Button>
            <button type="button" onClick={handleDelete} disabled={deleting}
              className="px-4 py-3 rounded-xl border border-red-400/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-40">
              <Trash2 size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
