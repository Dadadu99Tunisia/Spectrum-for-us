"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, ArrowRight, Package, Briefcase, Calendar, Camera, Check, X } from "lucide-react";

type PublishType = "product" | "service" | "event";

const TYPES: { id: PublishType; icon: React.ElementType; label: string; sub: string }[] = [
  { id: "product", icon: Package,   label: "Produit",    sub: "Article physique ou numérique" },
  { id: "service", icon: Briefcase, label: "Service",    sub: "Prestation, coaching, création" },
  { id: "event",   icon: Calendar,  label: "Événement",  sub: "Festival, atelier, rencontre" },
];

function slugify(t: string) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);
}

export default function PublierPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [type, setType]       = useState<PublishType>("product");
  const [title, setTitle]     = useState("");
  const [price, setPrice]     = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [done, setDone]               = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (loading) return (
    <div className="min-h-screen bg-[#3D1F5C] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#E0337E] border-t-transparent animate-spin" />
    </div>
  );

  if (!user) {
    if (typeof window !== "undefined") router.replace("/auth?redirect=/publier");
    return null;
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    setError("");

    const supabase = createClient();

    // Get vendor's shop
    const { data: shop } = await supabase
      .from("shops")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!shop) {
      setError("Tu dois d'abord créer une boutique.");
      setSubmitting(false);
      return;
    }

    let imageUrl: string | null = null;

    // Upload image if provided
    if (imageFile) {
      const ext  = imageFile.name.split(".").pop() ?? "jpg";
      const path = `products/${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, imageFile, { upsert: true });
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    const slug = slugify(title);

    const { error: insertErr } = await supabase.from("products").insert({
      shop_id:   shop.id,
      name:      title,
      title:     title,
      slug,
      price:     price ? parseFloat(price) : 0,
      type,
      is_active: true,
      ...(imageUrl ? { image_url: imageUrl, images: [imageUrl] } : {}),
    });

    if (insertErr) {
      setError(insertErr.message);
      setSubmitting(false);
      return;
    }

    setDone(true);
    setSubmitting(false);
  };

  // ── Done screen ──
  if (done) {
    return (
      <div className="min-h-screen bg-[#3D1F5C] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#1C9C95]/15 border border-[#1C9C95]/30 flex items-center justify-center mb-6">
          <Check size={36} className="text-[#1C9C95]" />
        </div>
        <h1 className="font-fraunces text-3xl text-[#F3EADB] mb-2">Publié ! ✦</h1>
        <p className="font-hanken text-sm text-[#F3EADB]/50 mb-8">{title} est maintenant dans le spectre.</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => { setDone(false); setStep(0); setTitle(""); setPrice(""); setImageFile(null); setImagePreview(null); }}
            className="flex-1 py-3 rounded-xl border border-white/15 font-hanken text-sm text-[#F3EADB]/60 active:scale-95 transition-transform">
            + Nouveau
          </button>
          <button onClick={() => router.push("/vendeur")}
            className="flex-1 py-3 rounded-xl font-hanken text-sm text-white active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg,#6D2DB5,#E0337E)" }}>
            Ma boutique
          </button>
        </div>
      </div>
    );
  }

  const canNext = step === 0
    ? true
    : step === 1 ? title.trim().length > 0
    : true;

  return (
    <div className="min-h-screen bg-[#3D1F5C] text-[#F3EADB] flex flex-col">

      {/* Header */}
      <header className="px-5 pt-5 pb-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(243,234,219,0.07)" }}>
        <button onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
          className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <p className="font-fraunces text-[16px]">Publier</p>
          <p className="font-mono text-[9px] text-[#F3EADB]/30">Étape {step + 1} / 4</p>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[0,1,2,3].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ background: i <= step ? "#E0337E" : "rgba(243,234,219,0.15)" }} />
          ))}
        </div>
      </header>

      <div className="flex-1 px-5 py-6">

        {/* Step 0 — Type */}
        {step === 0 && (
          <div>
            <h2 className="font-fraunces text-xl text-[#F3EADB] mb-1">Que publies-tu ?</h2>
            <p className="font-hanken text-sm text-[#F3EADB]/40 mb-6">Choisis le type de création</p>
            <div className="space-y-3">
              {TYPES.map(({ id, icon: Icon, label, sub }) => (
                <button key={id} onClick={() => setType(id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all active:scale-95"
                  style={{
                    background: type === id ? "rgba(224,51,126,.10)" : "rgba(243,234,219,0.04)",
                    borderColor: type === id ? "rgba(224,51,126,.4)" : "rgba(243,234,219,0.10)",
                  }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: type === id ? "rgba(224,51,126,.2)" : "rgba(243,234,219,0.07)" }}>
                    <Icon size={18} style={{ color: type === id ? "#E0337E" : "rgba(243,234,219,0.40)" }} />
                  </div>
                  <div>
                    <p className="font-hanken text-sm font-medium text-[#F3EADB]">{label}</p>
                    <p className="font-hanken text-xs text-[#F3EADB]/40">{sub}</p>
                  </div>
                  {type === id && <Check size={14} className="ml-auto text-[#E0337E]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Title */}
        {step === 1 && (
          <div>
            <h2 className="font-fraunces text-xl mb-1">
              {type === "product" ? "Nom du produit" : type === "service" ? "Nom du service" : "Titre de l'événement"}
            </h2>
            <p className="font-hanken text-sm text-[#F3EADB]/40 mb-6">Court et percutant</p>
            <textarea
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ex. Bague lune argent, massé inclusif, Pride Paris…"
              maxLength={80}
              rows={3}
              className="w-full rounded-2xl px-4 py-4 font-hanken text-[15px] text-[#F3EADB] placeholder-[#F3EADB]/25 outline-none resize-none"
              style={{ background: "rgba(243,234,219,0.07)", border: "1px solid rgba(243,234,219,0.12)" }}
            />
            <p className="font-mono text-[10px] text-[#F3EADB]/25 mt-1 text-right">{title.length}/80</p>
          </div>
        )}

        {/* Step 2 — Price + Image */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-fraunces text-xl mb-1">Prix <span className="text-[#F3EADB]/30 text-base font-hanken">(optionnel)</span></h2>
              <div className="relative mt-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-fraunces text-lg text-[#F3EADB]/40">€</span>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-9 pr-4 py-4 rounded-2xl font-fraunces text-[22px] text-[#F3EADB] placeholder-[#F3EADB]/25 outline-none"
                  style={{ background: "rgba(243,234,219,0.07)", border: "1px solid rgba(243,234,219,0.12)" }}
                />
              </div>
            </div>

            <div>
              <h2 className="font-fraunces text-xl mb-4">Photo <span className="text-[#F3EADB]/30 text-base font-hanken">(optionnelle)</span></h2>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 active:scale-98 transition-transform"
                  style={{ borderColor: "rgba(243,234,219,0.15)", background: "rgba(243,234,219,0.04)" }}>
                  <Camera size={32} className="text-[#F3EADB]/20" />
                  <p className="font-hanken text-sm text-[#F3EADB]/40">Ajouter une photo</p>
                  <p className="font-mono text-[9px] text-[#F3EADB]/20">JPG, PNG, WEBP</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — Review & Publish */}
        {step === 3 && (
          <div>
            <h2 className="font-fraunces text-xl mb-1">Prêt·e à publier ?</h2>
            <p className="font-hanken text-sm text-[#F3EADB]/40 mb-6">Vérifie avant de publier</p>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden mb-6">
              {imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="" className="w-full aspect-video object-cover" />
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border"
                    style={{ borderColor: "rgba(224,51,126,.3)", color: "#E0337E" }}>
                    {type}
                  </span>
                </div>
                <p className="font-fraunces text-[17px] text-[#F3EADB]">{title || "—"}</p>
                <p className="font-fraunces text-[20px] text-[#E0337E]">
                  {price ? `${parseFloat(price).toFixed(2)} €` : "Prix libre"}
                </p>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3 mb-4">{error}</div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-3"
        style={{ borderTop: "1px solid rgba(243,234,219,0.07)" }}>
        {step < 3 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            className="w-full py-4 rounded-2xl font-hanken font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#6D2DB5,#E0337E)" }}>
            Continuer <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={submitting}
            className="w-full py-4 rounded-2xl font-hanken font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#6D2DB5,#E0337E)", boxShadow: "0 8px 28px rgba(109,45,181,.4)" }}>
            {submitting ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Publication…</>
            ) : (
              <><Check size={16} /> Publier maintenant</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
