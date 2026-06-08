"use client";
import { useEffect, useState, useCallback } from "react";
import { FileText, Search, Plus, Eye, Edit, Globe, EyeOff, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Article = {
  id: string;
  slug: string;
  title_fr: string | null;
  title_en: string | null;
  excerpt_fr: string | null;
  cover_url: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [pubFilter, setPubFilter] = useState<"all" | "published" | "draft">("all");
  const [total, setTotal]       = useState(0);
  const [toast, setToast]       = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let q = supabase.from("articles").select("id,slug,title_fr,title_en,excerpt_fr,cover_url,category,tags,published,published_at,created_at,updated_at", { count: "exact" })
        .order("created_at", { ascending: false });
      if (pubFilter === "published") q = q.eq("published", true);
      if (pubFilter === "draft")     q = q.eq("published", false);
      if (search) q = q.ilike("title_fr", `%${search}%`);
      const { data, count } = await q.limit(50);
      setArticles(data ?? []);
      setTotal(count ?? 0);
    } catch {
      // silently fail · show empty state
    } finally {
      setLoading(false);
    }
  }, [pubFilter, search]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const togglePublish = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("articles").update({
      published: !current,
      published_at: !current ? new Date().toISOString() : null,
    }).eq("id", id);
    showToast(!current ? "Article publié ✓" : "Article dépublié");
    fetch_();
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#FF2DA0] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#101014]">Articles</h1>
          <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">{total} article{total !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/blog/nouveau"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF2DA0] text-white font-hanken text-sm hover:bg-[#FF2DA0]/90 transition-colors">
          <Plus size={14} /> Nouvel article
        </Link>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101014]/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un article…"
            className="w-full pl-9 pr-4 py-2 bg-[#101014]/5 border border-[#101014]/10 rounded-lg font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/50 transition-colors" />
        </div>
        <div className="flex gap-1 p-1 bg-[#101014]/4 rounded-lg">
          {[["all","Tous"],["published","Publiés"],["draft","Brouillons"]].map(([v,l]) => (
            <button key={v} onClick={() => setPubFilter(v as typeof pubFilter)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${pubFilter === v ? "bg-[#FF2DA0] text-white" : "text-[#101014]/40 hover:text-[#101014]"}`}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><SpectrumLoader size="sm" /></div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20"><FileText size={40} className="mx-auto mb-3 text-[#101014]/10" /><p className="font-hanken text-[#101014]/30">Aucun article</p></div>
      ) : (
        <div className="space-y-2">
          {articles.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#101014]/8 hover:border-[#101014]/15 transition-all group">
              {a.cover_url ? (
                <img src={a.cover_url} alt="" className="w-14 h-10 rounded-lg object-cover border border-[#101014]/10 flex-shrink-0" />
              ) : (
                <div className="w-14 h-10 rounded-lg bg-[#101014]/5 border border-[#101014]/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-[#101014]/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="font-hanken text-sm text-[#101014] truncate">{a.title_fr || a.title_en || "(Sans titre)"}</p>
                  {a.category && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#7A2BF0]/15 text-[#7A2BF0]/80 uppercase">{a.category}</span>
                  )}
                </div>
                {a.excerpt_fr && <p className="font-hanken text-xs text-[#101014]/30 truncate">{a.excerpt_fr}</p>}
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-[9px] text-[#101014]/20">
                    {new Date(a.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  {a.tags?.slice(0,3).map(t => (
                    <span key={t} className="font-mono text-[8px] text-[#101014]/20 border border-[#101014]/8 px-1.5 rounded">#{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`font-mono text-[9px] px-2 py-1 rounded-full border ${
                  a.published
                    ? "text-green-600 bg-green-400/10 border-green-400/20"
                    : "text-[#101014]/30 bg-[#101014]/5 border-[#101014]/10"
                }`}>{a.published ? "Publié" : "Brouillon"}</span>
                <button onClick={() => togglePublish(a.id, a.published)}
                  className="p-1.5 rounded-lg text-[#101014]/25 hover:text-[#101014] border border-transparent hover:border-[#101014]/10 transition-colors"
                  title={a.published ? "Dépublier" : "Publier"}>
                  {a.published ? <EyeOff size={12} /> : <Globe size={12} />}
                </button>
                <Link href={`/admin/blog/${a.id}`}
                  className="p-1.5 rounded-lg text-[#101014]/25 hover:text-[#101014] border border-transparent hover:border-[#101014]/10 transition-colors">
                  <Edit size={12} />
                </Link>
                {a.slug && (
                  <a href={`/media/${a.slug}`} target="_blank" rel="noreferrer"
                    className="p-1.5 rounded-lg text-[#101014]/25 hover:text-[#101014] border border-transparent hover:border-[#101014]/10 transition-colors">
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
