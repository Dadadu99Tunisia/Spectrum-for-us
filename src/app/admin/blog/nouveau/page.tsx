"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ArrowLeft, Save, Eye } from "lucide-react";
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
    <div className="min-h-screen bg-[#3D1F5C] text-[#1A1612]">
      <Header />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-[#1A1612]/40 hover:text-[#FF3D7F] transition-colors font-hanken text-sm">
            <ArrowLeft size={14} /> Retour admin
          </Link>
          <div className="flex gap-3">
            <button onClick={() => save(false)} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1A1612]/15 font-hanken text-sm text-[#1A1612]/60 hover:text-[#1A1612] transition-all">
              <Save size={14} /> Brouillon
            </button>
            <button onClick={() => save(true)} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF3D7F] font-hanken text-sm text-white hover:bg-[#FF3D7F]/80 transition-all">
              <Eye size={14} /> Publier
            </button>
          </div>
        </div>

        <h1 className="font-fraunces text-3xl mb-8">Nouvel article</h1>

        {/* Lang tabs */}
        <div className="flex gap-2 mb-6">
          {(["fr", "en", "ar"] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${lang === l ? "bg-[#FF3D7F]/20 text-[#FF3D7F]" : "text-[#1A1612]/40 hover:bg-[#1A1612]/5"}`}>
              {l === "fr" ? "🇫🇷 Français" : l === "en" ? "🇬🇧 English" : "🇲🇦 عربي"}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-mono text-[10px] text-[#1A1612]/40 uppercase tracking-widest block mb-1">
              Titre ({lang.toUpperCase()}) *
            </label>
            <input value={form[`title_${lang}` as keyof typeof form] as string}
              onChange={e => update(`title_${lang}`, e.target.value)}
              className="w-full bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF3D7F]/40 outline-none"
              placeholder={lang === "ar" ? "عنوان المقال" : "Titre de l'article"} dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#1A1612]/40 uppercase tracking-widest block mb-1">Résumé ({lang.toUpperCase()})</label>
            <textarea value={form[`excerpt_${lang}` as keyof typeof form] as string}
              onChange={e => update(`excerpt_${lang}`, e.target.value)} rows={2}
              className="w-full bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF3D7F]/40 outline-none resize-none"
              dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#1A1612]/40 uppercase tracking-widest block mb-1">Contenu ({lang.toUpperCase()})</label>
            <textarea value={form[`content_${lang}` as keyof typeof form] as string}
              onChange={e => update(`content_${lang}`, e.target.value)} rows={16}
              className="w-full bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF3D7F]/40 outline-none resize-none"
              dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] text-[#1A1612]/40 uppercase tracking-widest block mb-1">Catégorie</label>
              <select value={form.category} onChange={e => update("category", e.target.value)}
                className="w-full bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF3D7F]/40 outline-none">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#1A1612]/40 uppercase tracking-widest block mb-1">Tags (séparés par virgule)</label>
              <input value={form.tags} onChange={e => update("tags", e.target.value)}
                className="w-full bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF3D7F]/40 outline-none"
                placeholder="queer, mode, culture" />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#1A1612]/40 uppercase tracking-widest block mb-1">Image de couverture (URL)</label>
            <input value={form.cover_url} onChange={e => update("cover_url", e.target.value)}
              className="w-full bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-xl px-4 py-3 font-hanken text-sm focus:border-[#FF3D7F]/40 outline-none"
              placeholder="https://..." />
          </div>
        </div>
      </div>
    </div>
  );
}
