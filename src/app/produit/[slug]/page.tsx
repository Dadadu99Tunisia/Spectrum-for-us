"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/store/cart";
import { Price } from "@/components/ui/Price";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tag } from "@/components/ui/Tag";
import { Heart, ArrowLeft, ShoppingBag, Check, Package, Zap, CalendarDays, AlertCircle } from "lucide-react";
import Link from "next/link";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { ProductReviews } from "@/components/ProductReviews";
import { BookingWidget } from "@/components/booking/BookingWidget";

type Product = {
  id: string; name: string; title: string; description: string;
  price: number; category: string; subcategory: string | null;
  slug: string; shop_id: string; image_url: string | null;
  images: string[] | null; tags: string[] | null;
  quantity: number; is_active: boolean; is_adult?: boolean; type: string | null;
  event_date?: string | null; event_end?: string | null; event_location?: string | null; event_city?: string | null; event_capacity?: number | null;
  shops?: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

type RelatedProduct = {
  id: string; name: string; title: string; price: number;
  slug: string; images: string[] | null; image_url: string | null;
};

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; cta: string; ctaAdding: string }> = {
  product: { label: "Produit",    icon: Package,      color: "#FF2DA0", cta: "Ajouter au panier",   ctaAdding: "Ajouté ✓" },
  service: { label: "Service",    icon: Zap,          color: "#FFD400", cta: "Réserver ce service", ctaAdding: "Réservé ✓" },
  event:   { label: "Événement",  icon: CalendarDays, color: "#7A2BF0", cta: "S'inscrire",          ctaAdding: "Inscrit·e ✓" },
};

export default function ProduitPage() {
  const params = useParams();
  const slug   = params?.slug as string;
  const [product,  setProduct]  = useState<Product | null>(null);
  const [related,  setRelated]  = useState<RelatedProduct[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [qty,      setQty]      = useState(1);
  const [liked,    setLiked]    = useState(false);
  const [added,    setAdded]    = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const { add } = useCart();

  useEffect(() => {
    if (!slug) return;
    const supabase = createClient();
    // Match par slug ; n'ajoute id.eq que si le param est un UUID valide
    // (sinon Postgres rejette id.eq.<non-uuid> et toute la requête échoue).
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    supabase
      .from("products")
      .select("*, shops(name, slug, stripe_charges_enabled)")
      .or(isUuid ? `slug.eq.${slug},id.eq.${slug}` : `slug.eq.${slug}`)
      .eq("is_active", true)
      .single()
      .then(({ data }) => {
        setProduct(data as Product | null);
        setLoading(false);
        if (data?.id) {
          try {
            const favs: string[] = JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]");
            setLiked(favs.includes(data.id));
          } catch { /* ignore */ }
        }
        if (data?.shop_id) {
          supabase
            .from("products")
            .select("id,name,title,price,slug,images,image_url")
            .eq("shop_id", data.shop_id)
            .eq("is_active", true)
            .neq("id", data.id)
            .limit(4)
            .then(({ data: rel }) => setRelated((rel as RelatedProduct[]) ?? []));
        }
      });
  }, [slug]);

  const toggleLike = () => {
    if (!product) return;
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]");
      const next = liked ? favs.filter(f => f !== product.id) : [...favs, product.id];
      localStorage.setItem("spectrum_favorites", JSON.stringify(next));
      setLiked(!liked);
    } catch { setLiked(!liked); }
  };

  const handleAdd = () => {
    if (!product || isOos) return;
    const shop = getShop();
    add({
      id: product.id,
      name: product.name || product.title,
      creator: shop?.name ?? "",
      price: product.price,
      quantity: qty,
      type: (product.type as "product" | "service" | "event") ?? "product",
      image: images[activeImg] ?? undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getShop = () => {
    if (!product?.shops) return null;
    return Array.isArray(product.shops) ? product.shops[0] : product.shops;
  };

  const productName = product?.name || product?.title || "";
  const images      = product?.images?.length ? product.images : product?.image_url ? [product.image_url] : [];
  const ptype       = product?.type ?? "product";
  const typeConf    = TYPE_CONFIG[ptype] ?? TYPE_CONFIG.product;
  const TypeIcon    = typeConf.icon;
  const isOos       = ptype === "product" && product?.quantity !== undefined && product.quantity !== null && product.quantity <= 0;

  const accentByCategory: Record<string, string> = {
    "Bijoux": "#2323C4", "Mode non-genrée": "#FF2DA0", "Art & Culture": "#7A2BF0",
    "Zines & Édition": "#101014", "Corps & Soin": "#2323C4", "Intimité": "#FF2DA0", "Maison": "#FFD400",
  };
  const accent = accentByCategory[product?.category ?? ""] ?? "#FF2DA0";

  if (loading) return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square rounded-2xl bg-[#101014]/5" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-[#101014]/8 rounded w-1/4" />
            <div className="h-12 bg-[#101014]/8 rounded w-3/4" />
            <div className="h-8 bg-[#101014]/8 rounded w-1/4 mt-6" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-6 flex flex-col items-center justify-center">
        <p className="font-fraunces text-3xl text-[#101014]/30 mb-4">Produit introuvable</p>
        <Link href="/decouvrir" className="font-mono text-sm text-[#FF2DA0] hover:underline">← Retour à la marketplace</Link>
      </main>
      <Footer />
    </>
  );

  const shop = getShop();
  const payReady = !!(shop as { stripe_charges_enabled?: boolean } | null)?.stripe_charges_enabled;

  return (
    <>
      {/* Desktop header */}
      <div className="hidden md:block"><Header /></div>
      {/* Mobile header */}
      <MobilePageHeader title={productName} backHref="/decouvrir" />

      <main className="min-h-screen md:pt-24 pb-20 md:pb-20 px-4 md:px-6 bg-[#FBFAF8] text-[#101014]">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb · desktop only */}
          <div className="hidden md:flex items-center gap-2 mb-8 flex-wrap">
            <Link href="/decouvrir" className="flex items-center gap-1.5 text-[#101014]/40 hover:text-[#FF2DA0] text-sm font-hanken transition-colors">
              <ArrowLeft size={14} /> Découvrir
            </Link>
            {product.category && (
              <>
                <span className="text-[#101014]/20">/</span>
                <Link href={`/decouvrir?category=${encodeURIComponent(product.category)}`} className="text-[#101014]/40 hover:text-[#FF2DA0] text-sm font-hanken transition-colors">
                  {product.category}
                </Link>
              </>
            )}
            {shop && (
              <>
                <span className="text-[#101014]/20">/</span>
                <Link href={`/boutique/${shop.slug || product.shop_id}`} className="text-[#101014]/40 hover:text-[#FF2DA0] text-sm font-hanken transition-colors">
                  {shop.name}
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ── Images ── */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-[#F1ECE3]">
                {images.length > 0 ? (
                  <img src={images[activeImg]} alt={productName} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 40% 40%, ${accent}30, transparent 60%)` }} />
                    <Package size={64} className="text-[#101014]/10" />
                  </>
                )}
                <button onClick={toggleLike}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#FBFAF8]/60 backdrop-blur-sm transition-all hover:scale-110">
                  <Heart size={18} className={liked ? "fill-[#FF2DA0] text-[#FF2DA0]" : "text-[#101014]/50"} />
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`flex-1 aspect-square rounded-xl border-2 overflow-hidden transition-all duration-200 ${activeImg === i ? "border-[#FF2DA0]" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="lg:pt-4">
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-4">
                {product.category && <Tag variant="magenta">{product.category}</Tag>}
                <span
                  className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wide px-2 py-1 rounded-full border"
                  style={{ color: typeConf.color, borderColor: `${typeConf.color}40`, backgroundColor: `${typeConf.color}10` }}
                >
                  <TypeIcon size={10} /> {typeConf.label}
                </span>
                {product.is_adult && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wide px-2 py-1 rounded-full border border-[#101014]/15 bg-[#101014]/5 text-[#101014]/70">
                    🔞 Réservé aux adultes
                  </span>
                )}
              </div>

              <h1 className="font-fraunces text-4xl md:text-5xl text-[#101014] leading-tight mb-2">{productName}</h1>

              {ptype === "event" && (product.event_date || product.event_location || product.event_city) && (
                <div className="rounded-xl border border-[#7A2BF0]/25 bg-[#7A2BF0]/[0.05] p-3 my-3 space-y-1">
                  {product.event_date && (
                    <p className="flex items-center gap-2 font-hanken text-sm text-[#101014]">
                      <CalendarDays size={14} className="text-[#7A2BF0]" />
                      <span className="capitalize">{new Date(product.event_date).toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
                    </p>
                  )}
                  {(product.event_location || product.event_city) && (
                    <p className="flex items-center gap-2 font-hanken text-sm text-[#101014]/70">
                      <span className="text-[#7A2BF0]">📍</span>
                      {[product.event_location, product.event_city].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              )}

              {shop && (
                <Link href={`/boutique/${shop.slug || product.shop_id}`}
                  className="font-mono text-sm text-[#101014]/40 hover:text-[#FF2DA0] transition-colors block mb-8">
                  par {shop.name}
                </Link>
              )}

              <div className="text-4xl font-fraunces text-[#101014] mb-8">
                <Price eur={Number(product.price)} />
              </div>

              {/* Out of stock warning */}
              {isOos && (
                <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-[#101014]/5 border border-[#101014]/15">
                  <AlertCircle size={14} className="text-[#101014]/40 shrink-0" />
                  <span className="font-hanken text-sm text-[#101014]/50">Ce produit est actuellement épuisé.</span>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-[#101014]/10 text-[#101014]/40 font-mono text-[10px] tracking-wide">{tag}</span>
                  ))}
                </div>
              )}

              {/* Qty · only for physical products in stock */}
              {ptype === "product" && !isOos && (
                <div className="flex items-center gap-4 mb-8">
                  <p className="font-mono text-[10px] tracking-wide text-[#101014]/40">Qté</p>
                  <div className="flex items-center border border-[#101014]/15 rounded-xl overflow-hidden">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 text-[#101014]/60 hover:text-[#101014] text-xl transition-colors">-</button>
                    <span className="w-10 text-center font-mono text-sm text-[#101014]">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.quantity || 99, qty + 1))} className="w-11 h-11 text-[#101014]/60 hover:text-[#101014] text-xl transition-colors">+</button>
                  </div>
                  <span className="font-mono text-sm text-[#101014]/40">= <Price eur={product.price * qty} /></span>
                </div>
              )}

              {/* CTAs */}
              {!payReady && (
                <p className="mb-3 text-[13px] font-hanken px-4 py-3 rounded-xl" style={{ background: "#FFF4D6", color: "#8A6D1A" }}>
                  ✦ Cette boutique finalise sa configuration de paiement. Suis-la pour être prévenu·e dès l'ouverture des ventes.
                </p>
              )}
              {ptype === "service" && payReady && (
                <div className="mb-8"><BookingWidget productId={product.id} price={Number(product.price)} /></div>
              )}
              <div className="flex gap-3 mb-8">
                {!(ptype === "service" && payReady) && (
                <button
                  onClick={handleAdd}
                  disabled={isOos || !payReady}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-hanken font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: added ? "#2323C4" : (isOos || !payReady) ? "#10101420" : typeConf.color,
                    color: (isOos || !payReady) ? "#10101480" : "#fff",
                  }}
                >
                  {added ? <><Check size={16} /> {typeConf.ctaAdding}</> : <><ShoppingBag size={16} /> {isOos ? "Épuisé" : !payReady ? "Bientôt en vente" : typeConf.cta}</>}
                </button>
                )}
                <button onClick={toggleLike}
                  className="p-4 border border-[#101014]/15 rounded-full hover:border-[#FF2DA0]/40 transition-colors">
                  <Heart size={18} className={liked ? "fill-[#FF2DA0] text-[#FF2DA0]" : "text-[#101014]/50"} />
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-[#101014]/8 pt-6">
                  <p className="font-hanken text-[#101014]/60 leading-relaxed text-sm whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {/* Stock info */}
              {ptype === "product" && product.quantity !== null && product.quantity > 0 && (
                <p className="mt-4 font-mono text-xs text-[#101014]/25">
                  {product.quantity <= 5 ? `⚠ Plus que ${product.quantity} en stock` : `${product.quantity} en stock`}
                </p>
              )}
            </div>
          </div>

          {/* ── Autres créations de la boutique ── */}
          {related.length > 0 && shop && (
            <div className="mt-20 border-t border-[#101014]/8 pt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-fraunces text-2xl text-[#101014]">Autres créations de {shop.name}</h2>
                <Link href={`/boutique/${shop.slug}`} className="font-mono text-xs text-[#FF2DA0] hover:text-[#FF2DA0]/70 transition-colors tracking-wide">
                  Voir tout →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map((r) => {
                  const img = r.images?.[0] ?? r.image_url;
                  return (
                    <Link key={r.id} href={`/produit/${r.slug || r.id}`}
                      className="group rounded-2xl border border-[#101014]/8 overflow-hidden hover:border-[#FF2DA0]/25 transition-all">
                      <div className="aspect-square bg-[#F1ECE3] overflow-hidden">
                        {img
                          ? <img src={img} alt={r.name || r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          : <div className="w-full h-full flex items-center justify-center"><Package size={24} className="text-[#101014]/10" /></div>
                        }
                      </div>
                      <div className="p-3">
                        <p className="font-hanken text-sm text-[#101014] truncate">{r.name || r.title}</p>
                        <p className="font-mono text-sm text-[#FF2DA0] mt-0.5"><Price eur={Number(r.price)} /></p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Avis ── */}
          <div className="mt-16 max-w-3xl">
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </main>

      {/* ── Mobile sticky CTA bar (masquée pour les services : réservation inline) ── */}
      <div className={`${ptype === "service" && payReady ? "hidden" : "md:hidden"} fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3`}
        style={{
          background: "rgba(251,249,245,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(26,22,18,0.09)",
        }}>
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="font-fraunces text-[22px] leading-none text-[#101014]">
              <Price eur={Number(product.price) * qty} />
            </p>
            {ptype === "product" && !isOos && (
              <div className="flex items-center gap-1.5 mt-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuer la quantité"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-[#101014]/60 text-xl active:scale-90 transition-transform"
                  style={{ background: "rgba(26,22,18,0.08)" }}>-</button>
                <span className="font-mono text-[12px] text-[#101014]/70 w-5 text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.quantity || 99, qty + 1))} aria-label="Augmenter la quantité"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-[#101014]/60 text-xl active:scale-90 transition-transform"
                  style={{ background: "rgba(26,22,18,0.08)" }}>+</button>
              </div>
            )}
          </div>
          <button onClick={handleAdd} disabled={!payReady}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-fraunces text-[16px] text-white active:scale-[0.97] transition-transform disabled:opacity-60"
            style={{
              background: added ? "#2323C4" : !payReady ? "#10101430" : `linear-gradient(135deg,${typeConf.color}dd,${typeConf.color})`,
              boxShadow: payReady ? `0 4px 20px ${typeConf.color}40` : "none",
            }}>
            {added ? <><Check size={16} /> {typeConf.ctaAdding}</> : <><ShoppingBag size={16} /> {!payReady ? "Bientôt en vente" : typeConf.cta}</>}
          </button>
          <button onClick={toggleLike}
            className="w-12 h-12 flex items-center justify-center rounded-2xl shrink-0"
            style={{ background: liked ? "rgba(255,61,127,.15)" : "rgba(26,22,18,0.06)", border: `1px solid ${liked ? "rgba(255,61,127,.35)" : "rgba(26,22,18,.10)"}` }}>
            <Heart size={18} className={liked ? "fill-[#FF2DA0] text-[#FF2DA0]" : "text-[#101014]/40"} />
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
