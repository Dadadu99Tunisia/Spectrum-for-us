"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/store/cart";
import { Search, ShoppingBag, Menu, Heart, Truck, RefreshCw, ShieldCheck, ArrowRight, X } from "lucide-react";

// ── Light theme tokens ─────────────────────────────────────────────────────
const T = { bg: "#FBFAF8", ink: "#101014", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF2DA0" };
const CAT: Record<string, { tint: string; ink: string; dot: string }> = {
  Mode: { tint: "#FBE3EC", ink: "#C23B6B", dot: "#FF6FA3" },
  Bijoux: { tint: "#FBEAD3", ink: "#B5742A", dot: "#F2A03D" },
  Zines: { tint: "#D9EEF3", ink: "#1E7E91", dot: "#1FB6C9" },
  Corps: { tint: "#DCF0E5", ink: "#1B8155", dot: "#16A06A" },
  Art: { tint: "#EAE0FB", ink: "#6A44D6", dot: "#8B5CF6" },
  Maison: { tint: "#F1E8D7", ink: "#9A7B3A", dot: "#D6A94B" },
  "Intimité": { tint: "#F3E0EE", ink: "#9B3D86", dot: "#C44CFF" },
  Services: { tint: "#E3E6FB", ink: "#4A56C6", dot: "#6B5CFF" },
};
const tintFor = (c: string) => CAT[Object.keys(CAT).find(k => (c || "").toLowerCase().includes(k.toLowerCase())) ?? "Mode"] ?? CAT.Mode;

const COLLECTIONS = [
  { title: "Fierté toute l'année", sub: "Pièces qui affirment", cat: "Mode", bg: "linear-gradient(135deg,#FF2DA0,#C44CFF)" },
  { title: "Fait main & local", sub: "Créateur·ices près de toi", cat: "Bijoux", bg: "linear-gradient(135deg,#F2A03D,#FF2DA0)" },
  { title: "Corps & soin", sub: "Doux, inclusif, naturel", cat: "Corps", bg: "linear-gradient(135deg,#16A06A,#1FB6C9)" },
  { title: "Zines & édition", sub: "Nos voix, nos histoires", cat: "Zines", bg: "linear-gradient(135deg,#1FB6C9,#6B5CFF)" },
];
const CHIPS = ["Tout", "Mode", "Art", "Bijoux", "Zines", "Corps", "Services"];

interface Product {
  id: string; name: string; title: string; price: number;
  images: string[] | null; image_url: string | null; slug: string; category: string;
  is_adult?: boolean;
  shops: { name: string; slug: string } | null;
}
interface Shop { id: string; name: string; slug: string; logo_url: string | null; tagline: string | null; }

// Striped placeholder when a product has no image
function Ph({ category, h }: { category: string; h: number }) {
  const c = tintFor(category);
  return (
    <div className="relative w-full overflow-hidden" style={{ height: h, background: c.tint }}>
      <div className="absolute inset-0 opacity-50"
        style={{ background: `repeating-linear-gradient(135deg,transparent,transparent 11px,${c.ink}10 11px,${c.ink}10 12px)` }} />
      <span className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full" style={{ background: c.dot }} />
      <div className="absolute inset-0 flex items-center justify-center font-bricolage font-bold text-3xl" style={{ color: c.ink, opacity: 0.5 }}>
        {(category || "✦")[0]?.toUpperCase()}
      </div>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const img = p.images?.[0] ?? p.image_url;
  const shopName = !Array.isArray(p.shops) ? p.shops?.name : null;
  const { add } = useCart();
  const [liked, setLiked] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]").includes(p.id); } catch { return false; }
  });
  const c = tintFor(p.category);
  const tall = (p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1)) % 2 === 0;

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const favs: string[] = JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]");
    const next = liked ? favs.filter(f => f !== p.id) : [...favs, p.id];
    localStorage.setItem("spectrum_favorites", JSON.stringify(next));
    setLiked(!liked);
  };
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    add({ id: p.id, name: p.name || p.title, price: p.price, creator: shopName ?? "", quantity: 1, type: "product", image: img ?? undefined });
  };

  return (
    <Link href={`/produit/${p.slug}`} className="block active:scale-[0.98] transition-transform">
      <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 0 rgba(0,0,0,.03)" }}>
        {img ? <img src={img} alt={p.name || p.title} loading="lazy" className="w-full object-cover" style={{ height: tall ? 220 : 160 }} />
          : <Ph category={p.category} h={tall ? 220 : 160} />}
        {p.is_adult && (
          <span className="absolute top-2 left-2 font-mono text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(16,16,20,.78)", color: "#fff" }}>🔞 18+</span>
        )}
        <button onClick={toggleLike} aria-label="Favori"
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,.85)", backdropFilter: "blur(6px)" }}>
          <Heart size={17} style={{ color: liked ? T.mag : T.ink }} fill={liked ? T.mag : "none"} />
        </button>
      </div>
      <div className="flex flex-col gap-0.5 px-0.5 pt-2">
        <p className="font-bricolage font-semibold text-[15px] leading-tight" style={{ color: T.ink }}>{p.name || p.title}</p>
        {shopName && (
          <span className="flex items-center gap-1.5 mt-0.5">
            <span className="w-[17px] h-[17px] rounded-full flex items-center justify-center font-bricolage font-bold text-[8px]" style={{ background: c.tint, color: c.ink }}>{shopName[0]?.toUpperCase()}</span>
            <span className="text-[12.5px]" style={{ color: T.soft }}>{shopName}</span>
          </span>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="font-mono font-bold text-[15px]" style={{ color: T.ink }}>{Number(p.price).toFixed(2)}&nbsp;€</span>
          <button onClick={handleAdd} aria-label="Ajouter au panier"
            className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90" style={{ background: T.ink }}>
            <ShoppingBag size={13} color="#fff" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function MobileHomeView() {
  const { user } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("Tout");
  const [search, setSearch] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let q = supabase
      .from("products")
      .select("id,name,title,price,images,image_url,slug,category,is_adult,shops(name,slug)")
      .eq("is_active", true).order("created_at", { ascending: false }).limit(20);
    if (cat !== "Tout") q = q.ilike("category", `%${cat}%`);
    if (search.trim()) q = q.or(`name.ilike.%${search}%,title.ilike.%${search}%`);
    q.then(({ data }) => { setProducts((data ?? []) as unknown as Product[]); setLoading(false); });
  }, [cat, search]);

  const searching = search.trim().length > 0;
  const showExtras = !searching && cat === "Tout";

  return (
    <div className="md:hidden min-h-screen" style={{ background: T.bg, color: T.ink, fontFamily: "var(--font-hanken),sans-serif" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-30" style={{ background: T.bg, paddingTop: "max(14px,env(safe-area-inset-top))" }}>
        <div className="flex items-center justify-between px-4 pb-2 pt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Link href="/" aria-label="Spectrum For Us"><img src="/logo-dark.png" alt="Spectrum For Us" className="h-8 w-auto" /></Link>
          <div className="flex items-center gap-2">
            {!user && (
              <Link href="/auth" className="font-mono text-[10px] tracking-wide px-3 py-1.5 rounded-full" style={{ border: `1px solid ${T.line}`, color: T.soft }}>Connexion</Link>
            )}
            <Link href="/panier" className="relative w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
              <ShoppingBag size={20} style={{ color: T.ink }} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white" style={{ background: T.mag }}>{cartCount}</span>}
            </Link>
            <button onClick={() => setNavOpen(true)} aria-label="Menu" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu de navigation mobile */}
      {navOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => setNavOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-0 right-0 h-full w-[78%] max-w-[320px] bg-[#FBFAF8] shadow-2xl p-5 overflow-y-auto" style={{ paddingTop: "max(20px,env(safe-area-inset-top))" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="font-fraunces font-bold text-lg" style={{ color: T.ink }}>Menu</span>
              <button onClick={() => setNavOpen(false)} aria-label="Fermer" style={{ color: T.soft }}><X size={20} /></button>
            </div>
            <nav className="flex flex-col">
              {[
                { l: "Shop", h: "/decouvrir" },
                { l: "Services", h: "/services" },
                { l: "Associations", h: "/annuaire" },
                { l: "Événements & Ateliers", h: "/evenements" },
                { l: "Média", h: "/media" },
                { l: "Communauté", h: "/communaute" },
              ].map(n => (
                <Link key={n.h} href={n.h} onClick={() => setNavOpen(false)}
                  className="py-3.5 font-bricolage font-semibold text-[16px] border-b" style={{ color: T.ink, borderColor: T.line }}>
                  {n.l}
                </Link>
              ))}
              <Link href="/vendeur/onboarding" onClick={() => setNavOpen(false)}
                className="mt-5 text-center font-bold text-[15px] py-3 rounded-full text-white" style={{ background: T.mag }}>
                Vendre sur Spectrum
              </Link>
              <Link href={user ? "/compte" : "/auth"} onClick={() => setNavOpen(false)}
                className="mt-2 text-center font-semibold text-[14px] py-3 rounded-full" style={{ color: T.soft, border: `1px solid ${T.line}` }}>
                {user ? "Mon compte" : "Connexion"}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Hero (editorial, dark) */}
      {showExtras && (
        <div className="relative overflow-hidden mx-0 mb-2 px-5 pt-5 pb-[18px]" style={{
          borderRadius: "0 0 30px 30px", color: "#F1E7D7",
          background: "radial-gradient(120% 90% at 12% 0%, #4A2A6B 0%, transparent 60%), radial-gradient(120% 110% at 108% 112%, #C9296F 0%, transparent 52%), linear-gradient(180deg,#2C1746,#2A1742)",
        }}>
          <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase flex items-center gap-2 mb-3" style={{ color: "rgba(241,231,215,.6)" }}>
            <span style={{ color: "#FF6FA3" }}>✦</span> La première marketplace queer
          </p>
          <h1 className="font-fraunces m-0 leading-[0.98] tracking-[-0.01em]" style={{ fontSize: 44, color: "#F1E7D7" }}>
            B<span style={{ color: T.mag }}>(u)</span>y us,<br />for us.
          </h1>
          <p className="mt-3.5 mb-4 text-[14px] leading-snug max-w-[320px]" style={{ color: "rgba(241,231,215,.72)" }}>
            Parce que nos mains créent, nos voix existent, et nos histoires ont une valeur. Un espace par et pour la communauté queer.
          </p>
          <Link href="/decouvrir" className="block text-center font-bold text-[15px] py-3.5 rounded-full" style={{ background: T.mag, color: "#fff" }}>
            Découvrir les créations
          </Link>
          <div className="flex gap-2.5 mt-2.5">
            <Link href="/communaute" className="flex-1 text-center font-semibold text-[13.5px] py-3 rounded-full" style={{ color: "#F1E7D7", border: "1.5px solid rgba(241,231,215,.4)" }}>Rejoindre</Link>
            <Link href="/vendeur/onboarding" className="flex-1 text-center font-semibold text-[13.5px] py-3 rounded-full" style={{ color: "rgba(241,231,215,.78)", border: "1.5px solid rgba(241,231,215,.22)" }}>Vendre ici</Link>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 pt-2.5 pb-3.5">
        <div className="flex items-center gap-2.5 h-[46px] rounded-[14px] px-3.5" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
          <Search size={18} style={{ color: T.faint }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une création, une boutique…"
            className="flex-1 min-w-0 bg-transparent outline-none text-[14px]" style={{ color: T.ink }} />
        </div>
      </div>

      {/* Reassurance */}
      {showExtras && (
        <div className="flex gap-2 px-4 pb-4">
          {[[Truck, "Livraison suivie"], [RefreshCw, "Retours 14 j"], [ShieldCheck, "Paiement sécurisé"]].map(([Ic, t], i) => {
            const Icon = Ic as typeof Truck;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[14px]" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                <Icon size={20} style={{ color: T.ink }} strokeWidth={1.7} />
                <span className="text-[11px] text-center leading-tight" style={{ color: T.soft }}>{t as string}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Collections */}
      {showExtras && (
        <div className="flex gap-3 overflow-x-auto px-4 pb-[18px]" style={{ scrollbarWidth: "none" }}>
          {COLLECTIONS.map(c => (
            <Link key={c.title} href={`/decouvrir?category=${encodeURIComponent(c.cat)}`}
              className="shrink-0 w-[250px] h-[124px] rounded-[18px] p-4 flex flex-col justify-end relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{ background: c.bg, color: "#fff" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent,rgba(0,0,0,.28))" }} />
              <div className="relative">
                <p className="font-mono text-[10px] tracking-[0.1em] uppercase opacity-90">Collection</p>
                <p className="font-bricolage font-bold text-[22px] leading-none">{c.title}</p>
                <p className="text-[12px] opacity-90 mt-1">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: "none" }}>
        {CHIPS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="shrink-0 whitespace-nowrap font-semibold text-[14px] px-[15px] py-2 rounded-full active:scale-95"
            style={c === cat ? { background: T.ink, color: "#fff" } : { background: "#fff", color: T.ink, boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            {c}
          </button>
        ))}
      </div>

      {/* Feed header */}
      <div className="flex items-baseline justify-between px-4 pb-3">
        <span className="font-bricolage font-bold text-[20px]">{searching ? "Résultats" : cat !== "Tout" ? cat : "Pour toi"}</span>
        <span className="font-mono text-[12px]" style={{ color: T.soft }}>{products.length} {products.length > 1 ? "pièces" : "pièce"}</span>
      </div>

      {/* Masonry feed */}
      {loading ? (
        <div className="px-4 pb-6" style={{ columnCount: 2, columnGap: 12 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="mb-[18px] rounded-2xl animate-pulse" style={{ height: i % 2 ? 220 : 160, background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="font-bricolage font-bold text-[17px] mb-1.5">{searching ? "Aucun résultat" : "Le spectre se remplit"}</p>
          <p className="text-[13.5px] mb-5" style={{ color: T.soft }}>{searching ? "Essaie un autre mot." : "Sois parmi les premier·es à créer ici."}</p>
          {!searching && (
            <Link href="/vendeur/onboarding" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[14px] text-white" style={{ background: T.mag }}>
              Ouvrir ma boutique <ArrowRight size={15} />
            </Link>
          )}
        </div>
      ) : (
        <div className="px-4 pb-6" style={{ columnCount: 2, columnGap: 12 }}>
          {products.map(p => <div key={p.id} className="mb-[18px]" style={{ breakInside: "avoid" }}><ProductCard p={p} /></div>)}
        </div>
      )}

      {/* Sell CTA */}
      {!loading && showExtras && (
        <div className="px-4 pb-6">
          <Link href="/vendeur/onboarding" className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: "linear-gradient(135deg,#6B5CFF,#FF2DA0)" }}>✦</span>
            <div className="flex-1 min-w-0">
              <p className="font-bricolage font-bold text-[15px]" style={{ color: T.ink }}>Vends tes créations ici</p>
              <p className="text-[12px]" style={{ color: T.soft }}>0 % de commission les premiers mois</p>
            </div>
            <ArrowRight size={18} style={{ color: T.faint }} />
          </Link>
        </div>
      )}
    </div>
  );
}
