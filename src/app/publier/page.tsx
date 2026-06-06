"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, ArrowRight, Camera, X } from "lucide-react";

type PType = "product" | "service" | "event";

const TYPES: { id: PType; emoji: string; label: string; sub: string }[] = [
  { id: "product", emoji: "○",  label: "Produit",    sub: "Objet, création, pièce unique" },
  { id: "service", emoji: "◈",  label: "Service",    sub: "Coaching, soin, prestation" },
  { id: "event",   emoji: "✦",  label: "Événement",  sub: "Atelier, expo, rencontre" },
];

function slugify(t: string) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);
}

const STEPS = ["Type", "Titre", "Détails", "Publier"] as const;

export default function PublierPage() {
  const { user, loading } = useAuth();
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step,    setStep]    = useState(0);
  const [type,    setType]    = useState<PType>("product");
  const [title,   setTitle]   = useState("");
  const [price,   setPrice]   = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file,    setFile]    = useState<File | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBF9F5" }}>
      <span className="font-fraunces text-[#1A1612]/30 animate-pulse">Chargement…</span>
    </div>
  );
  if (!user) { if (typeof window !== "undefined") router.replace("/auth?redirect=/publier"); return null; }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const publish = async () => {
    if (!title.trim()) return;
    setSaving(true); setError("");

    const supabase = createClient();
    const { data: shop } = await supabase
      .from("shops").select("id").eq("owner_id", user.id).single();

    if (!shop) {
      setError("Crée d'abord une boutique via l'onboarding.");
      setSaving(false); return;
    }

    let imageUrl: string | null = null;
    if (file) {
      const ext  = file.name.split(".").pop() ?? "jpg";
      const path = `products/${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (!upErr) {
        const { data: u } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = u.publicUrl;
      }
    }

    const { error: err } = await supabase.from("products").insert({
      shop_id: shop.id, name: title, title,
      slug: slugify(title),
      price: price ? parseFloat(price) : 0,
      type, is_active: true,
      ...(imageUrl ? { image_url: imageUrl, images: [imageUrl] } : {}),
    });

    if (err) { setError(err.message); setSaving(false); return; }
    setDone(true); setSaving(false);
  };

  // ── Done ──────────────────────────────────────────────────────
  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#FBF9F5" }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(28,156,149,.12), transparent)" }} />
      <div className="relative z-10">
        <p className="text-5xl mb-6">✦</p>
        <h1 className="font-fraunces text-[34px] text-[#1A1612] mb-2">Publié !</h1>
        <p className="font-hanken text-[13px] text-[#1A1612]/45 mb-8 leading-relaxed">
          <span className="text-[#1A1612]">{title}</span> est maintenant<br />dans le spectre.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { setDone(false); setStep(0); setTitle(""); setPrice(""); setFile(null); setPreview(null); }}
            className="px-5 py-3 rounded-2xl font-mono text-[11px] tracking-wide"
            style={{ border: "1px solid rgba(26,22,18,0.12)", color: "rgba(26,22,18,0.40)" }}>
            + Nouveau
          </button>
          <button onClick={() => router.push("/vendeur")}
            className="px-6 py-3 rounded-2xl font-fraunces text-[15px] text-white"
            style={{ background: "linear-gradient(135deg,#6D2DB5,#FF3D7F)" }}>
            Ma boutique
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col text-[#1A1612]" style={{ background: "#FBF9F5" }}>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(109,45,181,.20) 0%, transparent 65%)" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 px-5 pt-[max(20px,env(safe-area-inset-top))] pb-4"
        style={{ borderBottom: "1px solid rgba(26,22,18,0.06)" }}>
        <button onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "rgba(26,22,18,0.06)" }}>
          <ArrowLeft size={15} />
        </button>

        <div className="flex-1">
          <p className="font-fraunces text-[17px]">Publier</p>
          <p className="font-mono text-[8px] text-[#1A1612]/28 tracking-wide mt-0.5">
            {STEPS[step]}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex gap-1.5 items-center">
          {STEPS.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 14 : 5,
                height: 5,
                background: i <= step ? "#FF3D7F" : "rgba(26,22,18,0.15)",
              }} />
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 px-5 py-7">

        {/* ── Step 0: Type ── */}
        {step === 0 && (
          <div>
            <h2 className="font-fraunces text-[28px] leading-tight mb-1">Que crées-tu ?</h2>
            <p className="font-hanken text-[13px] text-[#1A1612]/40 mb-7">Choisis le type de publication</p>
            <div className="space-y-3">
              {TYPES.map(({ id, emoji, label, sub }) => (
                <button key={id} onClick={() => setType(id)}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                  style={{
                    background: type === id ? "rgba(255,61,127,.08)" : "rgba(26,22,18,0.04)",
                    border: `1px solid ${type === id ? "rgba(255,61,127,.35)" : "rgba(26,22,18,0.08)"}`,
                  }}>
                  <span className="text-[26px] leading-none"
                    style={{ color: type === id ? "#FF3D7F" : "rgba(26,22,18,0.30)" }}>
                    {emoji}
                  </span>
                  <div>
                    <p className="font-fraunces text-[16px] text-[#1A1612]">{label}</p>
                    <p className="font-hanken text-[11px] text-[#1A1612]/35">{sub}</p>
                  </div>
                  {type === id && (
                    <span className="ml-auto font-mono text-[10px]" style={{ color: "#FF3D7F" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Title ── */}
        {step === 1 && (
          <div>
            <h2 className="font-fraunces text-[28px] leading-tight mb-1">
              {type === "event" ? "L'intitulé" : "Le nom"}
            </h2>
            <p className="font-hanken text-[13px] text-[#1A1612]/40 mb-7">Court, clair, percutant</p>
            <textarea
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={
                type === "product" ? "ex. Bague lune, édition limitée…"
                : type === "service" ? "ex. Massage inclusif 1h, coaching identité…"
                : "ex. Vernissage queer, atelier sérigraphie…"
              }
              maxLength={80}
              rows={3}
              className="w-full rounded-2xl px-5 py-4 font-fraunces text-[18px] text-[#1A1612] placeholder-[#1A1612]/20 outline-none resize-none"
              style={{ background: "rgba(26,22,18,0.06)", border: "1px solid rgba(26,22,18,0.10)" }}
            />
            <p className="font-mono text-[8px] text-[#1A1612]/20 mt-1.5 text-right">{title.length}/80</p>
          </div>
        )}

        {/* ── Step 2: Price + Photo ── */}
        {step === 2 && (
          <div className="space-y-7">
            <div>
              <h2 className="font-fraunces text-[28px] leading-tight mb-1">Le prix</h2>
              <p className="font-hanken text-[13px] text-[#1A1612]/40 mb-5">Laisse vide pour prix libre</p>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-fraunces text-[22px] text-[#1A1612]/25">€</span>
                <input
                  type="number" value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00" min="0" step="0.01"
                  className="w-full pl-10 pr-5 py-4 rounded-2xl font-fraunces text-[28px] text-[#1A1612] placeholder-[#1A1612]/20 outline-none"
                  style={{ background: "rgba(26,22,18,0.06)", border: "1px solid rgba(26,22,18,0.10)" }}
                />
              </div>
            </div>

            <div>
              <h2 className="font-fraunces text-[22px] mb-4">Une photo ?</h2>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
              {preview ? (
                <div className="relative rounded-2xl overflow-hidden aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,.55)" }}>
                    <X size={13} className="text-white" />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-[0.97] transition-transform"
                  style={{
                    border: "1.5px dashed rgba(26,22,18,0.14)",
                    background: "rgba(26,22,18,0.03)",
                  }}>
                  <Camera size={28} className="text-[#1A1612]/20" />
                  <span className="font-hanken text-[13px] text-[#1A1612]/35">Ajouter une photo</span>
                  <span className="font-mono text-[8px] text-[#1A1612]/18 tracking-wide">JPG · PNG · WEBP</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <div>
            <h2 className="font-fraunces text-[28px] leading-tight mb-1">Prêt·e ?</h2>
            <p className="font-hanken text-[13px] text-[#1A1612]/40 mb-7">Vérifie avant de publier</p>

            <div className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(26,22,18,0.08)", background: "rgba(26,22,18,0.03)" }}>
              {/* Prism top */}
              <div className="h-px" style={{ background: "linear-gradient(90deg,#E0533A,#CF3F7C,#6D2DB5,#1C9C95)" }} />
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="w-full aspect-video object-cover" />
              )}
              <div className="p-5">
                <span className="font-mono text-[8px] tracking-wide px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,61,127,.10)", color: "#FF3D7F", border: "1px solid rgba(255,61,127,.20)" }}>
                  {type}
                </span>
                <p className="font-fraunces text-[22px] text-[#1A1612] mt-3">{title || "—"}</p>
                <p className="font-fraunces text-[26px] mt-1" style={{ color: "#1A1612" }}>
                  {price ? `${parseFloat(price).toFixed(2)} €` : "Prix libre"}
                </p>
              </div>
            </div>

            {error && (
              <p className="font-hanken text-[12px] text-red-400 bg-red-400/10 rounded-xl px-4 py-3 mt-4">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* CTA footer */}
      <div className="relative z-10 px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-4"
        style={{ borderTop: "1px solid rgba(26,22,18,0.06)" }}>
        {step < 3 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 && !title.trim()}
            className="w-full py-4 rounded-2xl font-fraunces text-[17px] text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-30"
            style={{ background: "linear-gradient(135deg,#6D2DB5,#FF3D7F)", boxShadow: "0 6px 24px rgba(109,45,181,.40)" }}>
            Continuer <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={publish} disabled={saving}
            className="w-full py-4 rounded-2xl font-fraunces text-[17px] text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#6D2DB5,#FF3D7F)", boxShadow: "0 6px 24px rgba(109,45,181,.40)" }}>
            {saving
              ? <><div className="w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin" /> Publication…</>
              : <>✦ Publier maintenant</>
            }
          </button>
        )}
      </div>
    </div>
  );
}
