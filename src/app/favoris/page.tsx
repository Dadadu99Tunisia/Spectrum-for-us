"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Price } from "@/components/ui/Price";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Heart, Store, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  images: string[] | null;
  image_url: string | null;
  slug: string;
  shops: { name: string } | null;
}

// Favorites are stored client-side in localStorage (no DB table needed yet)
function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("spectrum_favorites") ?? "[]"); }
  catch { return []; }
}

export function toggleFavorite(id: string) {
  const favs = getFavorites();
  const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
  localStorage.setItem("spectrum_favorites", JSON.stringify(next));
  return next;
}

export default function FavorisPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { add } = useCart();
  const [favIds, setFavIds]     = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const ids = getFavorites();
    setFavIds(ids);
    if (ids.length === 0) { setFetching(false); return; }

    const supabase = createClient();
    supabase
      .from("products")
      .select("id,name,title,price,images,image_url,slug,shops(name)")
      .in("id", ids)
      .eq("is_active", true)
      .then(({ data }) => {
        setProducts((data ?? []) as unknown as Product[]);
        setFetching(false);
      });
  }, []);

  const remove = (id: string) => {
    const next = toggleFavorite(id);
    setFavIds(next);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#FF2DA0] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <>
      {/* Desktop: full header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 px-5 pt-5 pb-4 flex items-center gap-3"
        style={{
          background: "rgba(45,16,78,0.97)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(26,22,18,0.07)",
        }}>
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-[#FF2DA0]" />
          <p className="font-fraunces text-[16px]">Favoris</p>
        </div>
      </header>

      <main className="min-h-screen bg-[#FBFAF8] text-[#101014] px-4 py-5 md:max-w-4xl md:mx-auto md:px-6 md:py-12">

        {/* Desktop title */}
        <div className="hidden md:block mb-8">
          <h1 className="font-fraunces text-3xl text-[#101014]">Mes favoris</h1>
        </div>

        {fetching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 animate-pulse">
                <div className="aspect-square" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/8 rounded w-3/4" />
                  <div className="h-3 bg-white/8 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF2DA0]/10 flex items-center justify-center mb-5">
              <Heart size={28} className="text-[#FF2DA0]/40" />
            </div>
            <p className="font-fraunces text-xl text-[#101014]/40 mb-2">Aucun favori</p>
            <p className="font-hanken text-sm text-[#101014]/25 mb-6">
              Explore les créations et clique sur ❤️ pour les retrouver ici
            </p>
            <Link href="/decouvrir"
              className="px-6 py-3 rounded-xl font-hanken text-sm text-white active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#7A2BF0,#FF2DA0)" }}>
              Explorer les créations
            </Link>
          </div>
        ) : (
          <>
            <p className="font-mono text-[10px] text-[#101014]/30 mb-4">
              {products.length} création{products.length > 1 ? "s" : ""} sauvegardée{products.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {products.map(p => {
                const img = p.images?.[0] ?? p.image_url;
                const shopName = p.shops && !Array.isArray(p.shops) ? p.shops.name : null;
                return (
                  <div key={p.id} className="rounded-2xl overflow-hidden border border-white/8 bg-[#2d1050]/60">
                    <Link href={`/produit/${p.slug}`} className="block">
                      <div className="aspect-square relative overflow-hidden bg-white/5">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={p.name || p.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store size={28} className="text-white/10" />
                          </div>
                        )}
                        <button
                          onClick={e => { e.preventDefault(); e.stopPropagation(); remove(p.id); }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(255,61,127,.9)" }}>
                          <Heart size={14} fill="white" className="text-white" />
                        </button>
                      </div>
                    </Link>
                    <div className="p-3">
                      <p className="font-hanken text-[12px] text-[#101014]/80 leading-tight line-clamp-1">{p.name || p.title}</p>
                      {shopName && <p className="font-mono text-[9px] text-[#101014]/30">{shopName}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-fraunces text-[14px] text-[#FF2DA0]"><Price eur={p.price} /></p>
                        <button
                          onClick={() => add({ id: p.id, name: p.name || p.title, price: p.price, image: img ?? undefined, creator: "", quantity: 1, type: "product" })}
                          className="p-1.5 rounded-lg active:scale-90 transition-transform"
                          style={{ background: "rgba(255,61,127,.12)", border: "1px solid rgba(255,61,127,.2)" }}>
                          <ShoppingBag size={13} className="text-[#FF2DA0]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
