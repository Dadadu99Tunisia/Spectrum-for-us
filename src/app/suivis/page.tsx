"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Price } from "@/components/ui/Price";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, ArrowRight } from "lucide-react";

const T = { ink: "#101014", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF2DA0", tint: "#F1ECE3" };

interface Product { id: string; name: string | null; title: string | null; price: number; image_url: string | null; images: string[] | null; slug: string | null; shops: { name: string; slug: string } | null; }
interface Shop { id: string; name: string; slug: string; logo_url: string | null; }

export default function SuivisPage() {
  const { user, loading: authLoading } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    const supabase = createClient();
    (async () => {
      const { data: follows } = await supabase.from("follows").select("shop_id").eq("user_id", user.id);
      const ids = (follows ?? []).map((f) => f.shop_id);
      if (!ids.length) { setLoading(false); return; }
      const [{ data: sh }, { data: pr }] = await Promise.all([
        supabase.from("shops").select("id,name,slug,logo_url").in("id", ids),
        supabase.from("products").select("id,name,title,price,image_url,images,slug,shops(name,slug)").in("shop_id", ids).eq("is_active", true).order("created_at", { ascending: false }).limit(24),
      ]);
      setShops((sh ?? []) as Shop[]);
      setProducts((pr ?? []) as unknown as Product[]);
      setLoading(false);
    })();
  }, [user, authLoading]);

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "#FBFAF8", color: T.ink }}>
        <section className="max-w-6xl mx-auto px-6 md:px-8 pt-28 pb-8">
          <h1 className="font-fraunces leading-[1.02] tracking-[-0.02em]" style={{ fontSize: "clamp(30px,5vw,50px)" }}>Tes suivis</h1>
          <p className="max-w-xl mt-3 text-[15.5px]" style={{ color: T.soft }}>Les nouveautés des créateur·ices et boutiques que tu suis.</p>
        </section>

        {!user && !authLoading ? (
          <Empty title="Connecte-toi pour suivre" cta="Se connecter" href="/auth"
            text="Suis tes créateur·ices préféré·es et retrouve leurs nouveautés ici." />
        ) : loading ? (
          <div className="max-w-6xl mx-auto px-8 py-20 text-center" style={{ color: T.faint }}>Chargement…</div>
        ) : shops.length === 0 ? (
          <Empty title="Tu ne suis personne (encore)" cta="Explorer la marketplace" href="/decouvrir"
            text="Ouvre une boutique et clique sur « Suivre » pour voir ses nouveautés ici." />
        ) : (
          <>
            {/* Boutiques suivies */}
            <section className="max-w-6xl mx-auto px-6 md:px-8 pb-8">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {shops.map((s) => (
                  <Link key={s.id} href={`/boutique/${s.slug}`} className="shrink-0 flex items-center gap-2.5 rounded-full pl-2 pr-4 py-2" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                    {s.logo_url ? <img src={s.logo_url} alt="" className="w-7 h-7 rounded-full object-cover" /> : <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: T.mag }}>{s.name[0]?.toUpperCase()}</span>}
                    <span className="font-bricolage font-semibold text-[14px]">{s.name}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Nouveautés */}
            <section className="max-w-6xl mx-auto px-6 md:px-8 pb-20">
              <h2 className="font-fraunces text-[24px] mb-5">Nouveautés</h2>
              {products.length === 0 ? (
                <p style={{ color: T.soft }}>Pas encore de produits chez les boutiques suivies.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {products.map((p) => {
                    const img = p.images?.[0] ?? p.image_url;
                    const shop = !Array.isArray(p.shops) ? p.shops?.name : null;
                    return (
                      <Link key={p.id} href={`/produit/${p.slug}`} className="group">
                        <div className="aspect-square rounded-2xl overflow-hidden" style={{ background: T.tint }}>
                          {img ? <img src={img} alt={p.name || p.title || ""} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                            : <div className="w-full h-full flex items-center justify-center p-8"><img src="/logo-dark.png" alt="" className="w-full h-full object-contain opacity-25" /></div>}
                        </div>
                        <p className="font-bricolage font-semibold text-[15px] mt-2.5 leading-tight line-clamp-2">{p.name || p.title}</p>
                        {shop && <p className="text-[12.5px]" style={{ color: T.faint }}>{shop}</p>}
                        <Price eur={p.price} className="font-mono font-bold text-[15px] mt-1 block" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function Empty({ title, text, cta, href }: { title: string; text: string; cta: string; href: string }) {
  return (
    <section className="max-w-xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "#fff", boxShadow: "inset 0 0 0 1px #ECE6DB" }}>
        <Heart size={26} style={{ color: "#FF2DA0" }} />
      </div>
      <h2 className="font-fraunces text-[24px] mb-2">{title}</h2>
      <p className="text-[15px] mb-6" style={{ color: "#6B6258" }}>{text}</p>
      <Link href={href} className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 font-semibold text-[15px] text-white" style={{ background: "#101014" }}>{cta} <ArrowRight size={15} /></Link>
    </section>
  );
}
