"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, FileText, Check, Loader2, ArrowLeft, Download } from "lucide-react";

// ── Parseur CSV minimal (gère guillemets + virgules dans les champs) ──
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* ignore */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ""));
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
// Synonymes de colonnes (FR + export Etsy EN)
const FIELD_MAP: Record<string, string[]> = {
  name:        ["title", "name", "nom", "titre", "produit", "product"],
  description: ["description", "desc"],
  price:       ["price", "prix", "tarif"],
  quantity:    ["quantity", "qty", "stock", "quantite", "quantité"],
  category:    ["category", "categorie", "catégorie", "type"],
  image:       ["image1", "image", "imageurl", "imageurl1", "photo", "imageurl0", "imagelink"],
};
const findCol = (headers: string[], keys: string[]) =>
  headers.findIndex(h => keys.includes(norm(h)));

function parsePrice(v: string): number {
  const cleaned = (v ?? "").replace(/[^\d.,]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

type Draft = { name: string; description: string; price: number; quantity: number; category: string | null; image: string | null };

export default function ImportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [fileName, setFileName] = useState("");
  const [active, setActive] = useState(true);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) { router.push("/auth"); return; }
    if (!user) return;
    createClient().from("shops").select("id").eq("owner_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle()
      .then(({ data }) => { if (!data) router.push("/vendeur/onboarding"); else setShopId(data.id); });
  }, [user, loading, router]);

  const onFile = async (file: File) => {
    setError(""); setDone(null); setFileName(file.name);
    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length < 2) { setError("Fichier vide ou sans données."); return; }
    const headers = rows[0];
    const ci = {
      name: findCol(headers, FIELD_MAP.name),
      description: findCol(headers, FIELD_MAP.description),
      price: findCol(headers, FIELD_MAP.price),
      quantity: findCol(headers, FIELD_MAP.quantity),
      category: findCol(headers, FIELD_MAP.category),
      image: findCol(headers, FIELD_MAP.image),
    };
    if (ci.name === -1 || ci.price === -1) {
      setError("Colonnes obligatoires manquantes : il faut au moins un nom/titre et un prix."); return;
    }
    const list: Draft[] = rows.slice(1).map(r => ({
      name: (r[ci.name] ?? "").trim(),
      description: ci.description >= 0 ? (r[ci.description] ?? "").trim() : "",
      price: parsePrice(r[ci.price] ?? ""),
      quantity: ci.quantity >= 0 ? Math.max(0, parseInt(r[ci.quantity] ?? "1") || 1) : 1,
      category: ci.category >= 0 ? ((r[ci.category] ?? "").trim() || null) : null,
      image: ci.image >= 0 ? ((r[ci.image] ?? "").trim() || null) : null,
    })).filter(d => d.name && d.price > 0);
    setDrafts(list);
  };

  const doImport = async () => {
    if (!shopId || !user || drafts.length === 0) return;
    setImporting(true); setError("");
    const supabase = createClient();
    const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
    const rows = drafts.map(d => ({
      shop_id: shopId, vendor_id: user.id,
      name: d.name, title: d.name, slug: slugify(d.name) + "-" + Math.random().toString(36).slice(2, 6),
      description: d.description || null, price: d.price, quantity: d.quantity,
      category: d.category, type: "product", is_active: active,
      listing_status: "approved", image_url: d.image, images: d.image ? [d.image] : null,
    }));
    // insertion par lots de 50
    let ok = 0;
    for (let i = 0; i < rows.length; i += 50) {
      const { error: e, data } = await supabase.from("products").insert(rows.slice(i, i + 50)).select("id");
      if (e) { setError("Erreur à l'import : " + e.message); setImporting(false); return; }
      ok += data?.length ?? 0;
    }
    setImporting(false); setDone(ok);
  };

  const downloadTemplate = () => {
    const csv = "name,description,price,quantity,category,image\nBague Spectre,Bijou fait main,29.90,5,Bijoux,https://exemple.com/photo.jpg\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "modele-catalogue-spectrum.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF8] px-4 md:px-6 pt-24 pb-20">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push("/vendeur")} className="inline-flex items-center gap-2 font-hanken text-sm text-[#101014]/55 hover:text-[#101014] mb-6">
          <ArrowLeft size={16} /> Tableau de bord
        </button>

        <h1 className="font-fraunces text-2xl md:text-3xl text-[#101014] mb-2">Importer mon catalogue</h1>
        <p className="font-hanken text-sm text-[#101014]/55 mb-6">
          Migre tes produits en masse depuis un fichier <strong>CSV</strong> (export Etsy compatible). Colonnes reconnues : nom/titre, description, prix, stock, catégorie, image.
        </p>

        {done !== null ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 text-center">
            <Check size={32} className="text-green-600 mx-auto mb-2" />
            <p className="font-fraunces text-xl text-[#101014] mb-1">{done} produit{done > 1 ? "s" : ""} importé{done > 1 ? "s" : ""} ✓</p>
            <p className="font-hanken text-sm text-[#101014]/55 mb-4">Retrouve-les dans « Produits » pour les ajuster.</p>
            <Link href="/vendeur" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#101014] text-white font-hanken text-sm">Voir mes produits</Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF2DA0] text-white font-hanken text-sm cursor-pointer hover:brightness-110">
                <Upload size={15} /> Choisir un fichier CSV
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
              </label>
              <button onClick={downloadTemplate} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#2323C4] hover:underline">
                <Download size={12} /> Modèle CSV
              </button>
            </div>

            {fileName && <p className="font-mono text-[11px] text-[#101014]/40 mb-3 flex items-center gap-1.5"><FileText size={12} /> {fileName}</p>}
            {error && <p className="font-hanken text-sm text-red-500 bg-red-500/5 border border-red-400/20 rounded-xl px-4 py-3 mb-3">{error}</p>}

            {drafts.length > 0 && (
              <>
                <div className="rounded-2xl border border-[#ECE6DB] bg-white overflow-hidden mb-4">
                  <div className="px-4 py-2.5 border-b border-[#ECE6DB] font-mono text-[11px] text-[#101014]/50">{drafts.length} produit{drafts.length > 1 ? "s" : ""} détecté{drafts.length > 1 ? "s" : ""} · aperçu</div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#101014]/5">
                    {drafts.slice(0, 30).map((d, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#F1ECE3] overflow-hidden shrink-0">
                          {d.image && <img src={d.image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-hanken text-sm text-[#101014] truncate">{d.name}</p>
                          <p className="font-mono text-[10px] text-[#101014]/40">{d.category ?? "—"} · stock {d.quantity}</p>
                        </div>
                        <span className="font-mono text-sm text-[#101014]">{d.price.toFixed(2)} €</span>
                      </div>
                    ))}
                    {drafts.length > 30 && <p className="px-4 py-2 font-mono text-[10px] text-[#101014]/30">+ {drafts.length - 30} autres…</p>}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 mb-4 cursor-pointer">
                  <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="w-4 h-4 accent-[#FF2DA0]" />
                  <span className="font-hanken text-sm text-[#101014]/70">Mettre les produits en ligne immédiatement</span>
                </label>

                <button onClick={doImport} disabled={importing}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#101014] text-white font-hanken font-semibold disabled:opacity-50">
                  {importing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {importing ? "Import en cours…" : `Importer ${drafts.length} produit${drafts.length > 1 ? "s" : ""}`}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
