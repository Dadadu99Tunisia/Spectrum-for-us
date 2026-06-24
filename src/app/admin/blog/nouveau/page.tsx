"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ArrowLeft, Save, Eye, Sparkles, Wand2, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NouvelArticle() {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title_fr: "", title_en: "", title_ar: "",
    excerpt_fr: "", excerpt_en: "", excerpt_ar: "",
    content_fr: "", content_en: "", content_ar: "",
    cover_url: "", category: "editorial", tags: "",
    published: false,
  });
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");

  // ── Générateur IA (veille + rédaction trilingue) ──
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<{ title: string; angle: string; category: string }[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiErr, setAiErr] = useState("");

  const runVeille = async () => {
    setLoadingIdeas(true); setAiErr("");
    try {
      const res = await fetch("/api/admin/blog/ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const j = await res.json();
      if (!res.ok) { setAiErr(j.error ?? "Erreur"); return; }
      setIdeas(j.data?.ideas ?? []);
    } catch { setAiErr("Erreur réseau"); } finally { setLoadingIdeas(false); }
  };

  const generate = async () => {
    if (!topic.trim()) return;
    setGenerating(true); setAiErr("");
    try {
      const res = await fetch("/api/admin/blog/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, category: form.category }) });
      const j = await res.json();
      if (!res.ok) { setAiErr(j.error ?? "Erreur de génération"); return; }
      const d = j.data;
      setForm(f => ({
        ...f,
        title_fr: d.title_fr, title_en: d.title_en, title_ar: d.title_ar,
        excerpt_fr: d.excerpt_fr, excerpt_en: d.excerpt_en, excerpt_ar: d.excerpt_ar,
        content_fr: d.content_fr, content_en: d.content_en, content_ar: d.content_ar,
        tags: Array.isArray(d.tags) ? d.tags.join(", ") : f.tags,
      }));
      setLang("fr");
    } catch { setAiErr("Erreur réseau"); } finally { setGenerating(false); }
  };

  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const save = async (publish = false) => {
    if (!form.title_fr) return;
    setSaving(true);
    const supabase = createClient();
    const slug = slugify(form.title_fr);
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const { error } = await supabase.from("articles").insert({
      slug, ...form, tags,
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
      author_id: user?.id,
    });
    setSaving(false);
    if (!error) router.push("/admin?tab=articles");
  };

  const CATS = ["editorial", "lifestyle", "culture", "news", "guide"];

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-[#101014]/40 hover:text-[#FF2DA0] transition-colors font-hanken text-sm">
            <ArrowLeft size={14} /> Retour admin
          </Link>
          <div className="flex gap-3">
            <button onClick={() => save(false)} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#101014]/15 font-hanken text-sm text-[#101014]/60 hover:text-[#101014] transition-all">
              <Save size={14} /> Brouillon
            </button>
            <button onClick={() => save(true)} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF2DA0] font-hanken text-sm text-white hover:bg-[#FF2DA0]/80 transition-all">
              <Eye size={14} /> Publier
            </button>
          </div>
        </div>

        <h1 className="font-fraunces text-3xl mb-6">Nouvel article</h1>

        {/* ── Générateur IA ── */}
        <div className="mb-8 rounded-2xl p-5" style={{ background: "linear-gradient(135deg,rgba(122,43,240,.06),rgba(255,45,160,.05))", boxShadow: "inset 0 0 0 1px rgba(122,43,240,.18)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#7A2BF0]" />
            <h2 className="font-bricolage font-semibold text-[15px] text-[#101014]">Générateur IA · FR / EN / عربي</h2>
            <button onClick={runVeille} disabled={loadingIdeas}
              className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] rounded-full px-3 py-1.5 bg-white text-[#7A2BF0] disabled:opacity-50" style={{ boxShadow: "inset 0 0 0 1px rgba(122,43,240,.25)" }}>
              {loadingIdeas ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Veille · idées de sujets
            </button>
          </div>

          {ideas.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-2 mb-3">
              {ideas.map((it, i) => (
                <button key={i} onClick={() => { setTopic(it.title); update("category", it.category); }}
                  className="text-left rounded-xl bg-white px-3 py-2.5 hover:-translate-y-0.5 transition-transform" style={{ boxShadow: "inset 0 0 0 1px #ECE6DB" }}>
                  <p className="font-hanken text-[13px] font-semibold text-[#101014] leading-snug">{it.title}</p>
                  <p className="font-hanken text-[11px] text-[#101014]/50 mt-0.5">{it.angle} · <span className="font-mono">{it.category}</span></p>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="Sujet de l'article (ex : « L'histoire des drapeaux Pride »)"
              className="flex-1 bg-white border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm outline-none focus:border-[#7A2BF0]/40" />
            <button onClick={generate} disabled={generating || !topic.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-hanken font-semibold text-sm text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg,#7A2BF0,#FF2DA0)" }}>
              {generating ? <><Loader2 size={15} className="animate-spin" /> Rédaction…</> : <><Wand2 size={15} /> Générer l'article</>}
            </button>
          </div>
          {aiErr && <p className="font-hanken text-xs text-red-500 mt-2">{aiErr}</p>}
          <p className="font-mono text-[10px] text-[#101014]/40 mt-2">L'IA remplit les 3 langues + le résumé + les tags. Tu relis/édites, puis « Brouillon » ou « Publier ».</p>
        </div>

        {/* Lang tabs */}
        <div className="flex gap-2 mb-6">
          {(["fr", "en", "ar"] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${lang === l ? "bg-[#FF2DA0]/20 text-[#FF2DA0]" : "text-[#101014]/40 hover:bg-[#101014]/5"}`}>
              {l === "fr" ? "🇫🇷 Français" : l === "en" ? "🇬🇧 English" : "🇲🇦 عربي"}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">
              Titre ({lang.toUpperCase()}) *
            </label>
            <input value={form[`title_${lang}` as keyof typeof form] as string}
              onChange={e => update(`title_${lang}`, e.target.value)}
              className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF2DA0]/40 outline-none"
              placeholder={lang === "ar" ? "عنوان المقال" : "Titre de l'article"} dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Résumé ({lang.toUpperCase()})</label>
            <textarea value={form[`excerpt_${lang}` as keyof typeof form] as string}
              onChange={e => update(`excerpt_${lang}`, e.target.value)} rows={2}
              className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF2DA0]/40 outline-none resize-none"
              dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Contenu ({lang.toUpperCase()})</label>
            <textarea value={form[`content_${lang}` as keyof typeof form] as string}
              onChange={e => update(`content_${lang}`, e.target.value)} rows={16}
              className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF2DA0]/40 outline-none resize-none"
              dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Catégorie</label>
              <select value={form.category} onChange={e => update("category", e.target.value)}
                className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF2DA0]/40 outline-none">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Tags (séparés par virgule)</label>
              <input value={form.tags} onChange={e => update("tags", e.target.value)}
                className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF2DA0]/40 outline-none"
                placeholder="queer, mode, culture" />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#101014]/40 uppercase tracking-widest block mb-1">Image de couverture (URL)</label>
            <input value={form.cover_url} onChange={e => update("cover_url", e.target.value)}
              className="w-full bg-[#101014]/5 border border-[#101014]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF2DA0]/40 outline-none"
              placeholder="https://..." />
          </div>
        </div>
      </div>
    </div>
  );
}
