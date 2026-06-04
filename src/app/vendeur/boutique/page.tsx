"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

export default function ParametresBoutiquePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopSlug, setShopSlug] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", tagline: "", description: "", city: "",
    contact_email: "", logo_url: "", banner_url: "",
  });

  const inputCls = "w-full bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-xl px-4 py-3 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50 transition-colors";

  useEffect(() => {
    if (!loading && !user) { router.push("/auth"); return; }
    if (!user) return;
    const supabase = createClient();
    supabase.from("shops").select("*").eq("owner_id", user.id).single()
      .then(({ data }) => {
        if (!data) { router.push("/vendeur/onboarding"); return; }
        setShopId(data.id);
        setShopSlug(data.slug ?? "");
        setForm({
          name: String(data.name || ""),
          tagline: String(data.tagline || ""),
          description: String(data.description || ""),
          city: String(data.city || ""),
          contact_email: String(data.contact_email || ""),
          logo_url: String(data.logo_url || ""),
          banner_url: String(data.banner_url || ""),
        });
      });
  }, [user, loading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) return;
    if (!form.name.trim()) { setError("Le nom est obligatoire."); return; }
    setSaving(true); setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("shops").update({
      name: form.name.trim(),
      tagline: form.tagline.trim() || null,
      description: form.description.trim() || null,
      city: form.city.trim() || null,
      contact_email: form.contact_email.trim() || null,
      logo_url: form.logo_url || null,
      banner_url: form.banner_url || null,
    }).eq("id", shopId);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setToast("Boutique mise à jour ✓");
    setTimeout(() => setToast(""), 2500);
  };

  if (loading || !shopId) return (
    <div className="min-h-screen bg-[#3D1F5C] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#E0337E] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#3D1F5C]">
      <Header />
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0e061a] border border-[#E0337E]/30 text-[#F3EADB] font-hanken text-sm shadow-2xl">
          {toast}
        </div>
      )}
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/vendeur")} className="p-2 rounded-xl border border-[#F3EADB]/10 text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors">
            <ArrowLeft size={16} />
          </button>
          <h1 className="font-fraunces text-2xl text-[#F3EADB] flex-1">Paramètres de la boutique</h1>
          {shopSlug && (
            <a href={`/boutique/${shopSlug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-[#F3EADB]/35 hover:text-[#E0337E] transition-colors">
              <ExternalLink size={12} /> Voir ma boutique
            </a>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Visuels */}
          <div className="rounded-2xl border border-[#F3EADB]/8 p-6 space-y-5">
            <h2 className="font-bricolage font-semibold text-[#F3EADB] text-sm uppercase tracking-wider">Visuels</h2>

            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-3">Logo de la boutique</label>
              <ImageUploader
                bucket="shop-images"
                folder={shopId}
                value={form.logo_url}
                onChange={(url) => setForm(p => ({ ...p, logo_url: url }))}
                label="Logo (carré recommandé)"
              />
            </div>

            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-3">Bannière de la boutique</label>
              <ImageUploader
                bucket="shop-images"
                folder={shopId}
                value={form.banner_url}
                onChange={(url) => setForm(p => ({ ...p, banner_url: url }))}
                label="Bannière (format large recommandé)"
              />
            </div>
          </div>

          {/* Infos */}
          <div className="rounded-2xl border border-[#F3EADB]/8 p-6 space-y-4">
            <h2 className="font-bricolage font-semibold text-[#F3EADB] text-sm uppercase tracking-wider">Informations</h2>

            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-2">Nom de la boutique *</label>
              <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Ma Boutique" className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-2">Slogan</label>
              <input value={form.tagline} onChange={e => setForm(p => ({...p, tagline: e.target.value}))} placeholder="Ce qui te rend unique en une phrase" className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-2">Description</label>
              <textarea rows={4} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                placeholder="Présente ta boutique, ton histoire, ta démarche…" className={`${inputCls} resize-y`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-2">Ville</label>
                <input value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} placeholder="Paris" className={inputCls} />
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-2">Email de contact</label>
                <input type="email" value={form.contact_email} onChange={e => setForm(p => ({...p, contact_email: e.target.value}))} placeholder="contact@maboutique.fr" className={inputCls} />
              </div>
            </div>
          </div>

          {error && <p className="font-hanken text-sm text-red-400 bg-red-400/8 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>}

          <Button type="submit" variant="primary" className="w-full py-3 flex items-center justify-center gap-2" disabled={saving}>
            <Save size={14} /> {saving ? "Sauvegarde…" : "Enregistrer les modifications"}
          </Button>
        </form>
      </div>
    </div>
  );
}
