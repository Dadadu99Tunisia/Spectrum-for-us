"use client";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ArrowLeft, Save, Eye, Upload, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

type Form = {
  title_fr: string; title_en: string; title_ar: string;
  excerpt_fr: string; excerpt_en: string; excerpt_ar: string;
  content_fr: string; content_en: string; content_ar: string;
  cover_url: string; cover_position: string; category: string; tags: string;
};

const EMPTY: Form = {
  title_fr: "", title_en: "", title_ar: "",
  excerpt_fr: "", excerpt_en: "", excerpt_ar: "",
  content_fr: "", content_en: "", content_ar: "",
  cover_url: "", cover_position: "50", category: "editorial", tags: "",
};

export default function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Form>(EMPTY);
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverGen, setCoverGen] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/articles/${id}`);
        const j = await res.json();
        if (!res.ok) { setErr(j.error ?? "Chargement impossible"); return; }
        const d = j.data;
        setForm({
          title_fr: d.title_fr ?? "", title_en: d.title_en ?? "", title_ar: d.title_ar ?? "",
          excerpt_fr: d.excerpt_fr ?? "", excerpt_en: d.excerpt_en ?? "", excerpt_ar: d.excerpt_ar ?? "",
          content_fr: d.content_fr ?? "", content_en: d.content_en ?? "", content_ar: d.content_ar ?? "",
          cover_url: d.cover_url ?? "", cover_position: d.cover_position ?? "50", category: d.category ?? "editorial",
          tags: Array.isArray(d.tags) ? d.tags.join(", ") : "",
        });
      } catch { setErr("Erreur réseau"); } finally { setLoading(false); }
    })();
  }, [id]);

  const update = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const uploadBanner = async (file: File) => {
    setUploading(true); setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "event-images");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Upload échoué"); return; }
      setForm((f) => ({ ...f, cover_url: j.url }));
    } catch { setErr("Erreur réseau"); } finally { setUploading(false); }
  };

  const genCover = async () => {
    const subject = form.title_fr;
    if (!subject.trim()) { setErr("Titre FR vide."); return; }
    setCoverGen(true); setErr("");
    try {
      const res = await fetch("/api/admin/blog/cover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: subject }) });
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Erreur"); return; }
      setForm((f) => ({ ...f, cover_url: j.data.cover_url }));
    } catch { setErr("Erreur réseau"); } finally { setCoverGen(false); }
  };

  const save = async (publish?: boolean) => {
    setSaving(true); setErr("");
    try {
      const payload: Record<string, unknown> = { ...form };
      if (publish !== undefined) payload.published = publish;
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Mise à jour échouée"); return; }
      router.push("/admin?tab=articles");
    } catch { setErr("Erreur réseau"); } finally { setSaving(false); }
  };

  const CATS = ["editorial", "lifestyle", "culture", "news", "guide"];

  if (loading) return <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center"><Loader2 className="animate-spin text-[#FF2DA0]" /></div>;

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin?tab=articles" className="flex items-center gap-2 text-[#101014]/40 hover:text-[#FF2DA0] transition-colors font-hanken text-sm">
            <ArrowLeft size={14} /> Retour
          </Link>
          <div className="flex gap-3">
            <button onClick={() => save(undefined)} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#101014]/15 font-hanken text-sm text-[#101014]/60 hover:text-[#101014] transition-all disabled:opacity-50">
              <Save size={14} /> Enregistrer
            </button>
            <button onClick={() => save(true)} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF2DA0] font-hanken text-sm text-white hover:bg-[#FF2DA0]/80 transition-all disabled:opacity-50">
              <Eye size={14} /> Publier
            </button>
          </div>
        </div>

        <h1 className="font-fraunces text-3xl mb-2">Modifier l’article</h1>
        {err && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 font-hanken text-sm text-red-600">{err}</p>}

        {/* ── Bannière ── */}
        <div className="mb-8">
          <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-2">Bannière de l’article</label>
          {form.cover_url && (
            <>
              {/* Aperçu au ratio réel de la page article (h-64 md:h-96) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.cover_url} alt="Bannière" className="w-full h-64 object-cover rounded-2xl mb-3"
                style={{ objectPosition: `center ${form.cover_position}%` }} />
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest whitespace-nowrap">Cadrage vertical</span>
                <input type="range" min={0} max={100} value={form.cover_position}
                  onChange={(e) => update("cover_position", e.target.value)}
                  className="flex-1 accent-[#FF2DA0]" />
                <span className="font-mono text-[11px] text-[#101014]/50 w-10 text-right">{form.cover_position}%</span>
              </div>
            </>
          )}
          <div className="flex flex-wrap gap-2">
            <input ref={fileInput} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadBanner(f); }} />
            <button onClick={() => fileInput.current?.click()} disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-[#FF2DA0] text-white font-hanken text-sm disabled:opacity-50">
              {uploading ? <><Loader2 size={15} className="animate-spin" /> Upload…</> : <><Upload size={15} /> Uploader une image</>}
            </button>
            <button onClick={genCover} disabled={coverGen}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white text-[#7A2BF0] font-hanken text-sm disabled:opacity-50" style={{ boxShadow: "inset 0 0 0 1px rgba(122,43,240,.25)" }}>
              {coverGen ? <><Loader2 size={15} className="animate-spin" /> …</> : <><Sparkles size={15} /> Couverture IA</>}
            </button>
          </div>
          <input value={form.cover_url} onChange={(e) => update("cover_url", e.target.value)}
            className="mt-2 w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-2.5 font-hanken text-xs text-[#101014]/60 outline-none"
            placeholder="…ou colle une URL d’image" />
        </div>

        {/* Lang tabs */}
        <div className="flex gap-2 mb-6">
          {(["fr", "en", "ar"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${lang === l ? "bg-[#FF2DA0]/20 text-[#FF2DA0]" : "text-[#101014]/40 hover:bg-[#101014]/5"}`}>
              {l === "fr" ? "🇫🇷 Français" : l === "en" ? "🇬🇧 English" : "🇲🇦 عربي"}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Titre ({lang.toUpperCase()})</label>
            <input value={form[`title_${lang}` as keyof Form]} onChange={(e) => update(`title_${lang}` as keyof Form, e.target.value)}
              className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none" dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>
          <div>
            <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Résumé ({lang.toUpperCase()})</label>
            <textarea value={form[`excerpt_${lang}` as keyof Form]} onChange={(e) => update(`excerpt_${lang}` as keyof Form, e.target.value)} rows={2}
              className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none resize-none" dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>
          <div>
            <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Contenu ({lang.toUpperCase()})</label>
            <textarea value={form[`content_${lang}` as keyof Form]} onChange={(e) => update(`content_${lang}` as keyof Form, e.target.value)} rows={16}
              className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none resize-none" dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Catégorie</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}
                className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none">
                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Tags (virgules)</label>
              <input value={form.tags} onChange={(e) => update("tags", e.target.value)}
                className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none" placeholder="queer, mode, culture" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
