import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Star, Package, MapPin } from "lucide-react";

const MOCK_SHOP = {
  name: "Atelier Lumis",
  owner: "Théo",
  pronouns: "il/lui",
  location: "Lyon",
  bio: "Bijoux forgés à la main, pièces uniques et petites séries. Matériaux durables, sourcés localement. Chaque pièce est pensée pour être portée sans genre.",
  rating: 4.8,
  sales: 142,
  verified: true,
  category: "Bijoux",
  accent: "#1C9C95",
  products: [
    { name: "Bague Spectre", price: "68 €", slug: "bague-spectre", bg: "#2d1545" },
    { name: "Collier Prisme", price: "45 €", slug: "collier-prisme", bg: "#1a0d28" },
    { name: "Anneau Néon", price: "32 €", slug: "anneau-neon", bg: "#111f20" },
    { name: "Boucles Vague", price: "55 €", slug: "boucles-vague", bg: "#1f1408" },
  ],
};

export default function BoutiquePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        {/* Banner */}
        <div
          className="relative h-48 md:h-64 flex items-end px-6 pb-0 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0e1e1f 0%, #1a0d28 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(ellipse at 30% 50%, #1C9C9560, transparent 60%)" }}
          />
          <div className="prism-line absolute bottom-0 left-0 right-0" />
        </div>

        {/* Creator info */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-8 mb-10">
            <div
              className="w-20 h-20 rounded-2xl border-4 border-[#1C0E29] flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${MOCK_SHOP.accent}20`, borderColor: "#1C0E29" }}
            >
              <span className="font-fraunces text-3xl font-semibold" style={{ color: MOCK_SHOP.accent }}>
                {MOCK_SHOP.name[0]}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-fraunces text-3xl text-[#F3EADB]">{MOCK_SHOP.name}</h1>
                {MOCK_SHOP.verified && (
                  <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border border-[#1C9C95]/40 text-[#1C9C95] rounded-full">
                    Vérifié·e ✦
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#F3EADB]/50 font-hanken">
                <span>{MOCK_SHOP.owner} · <span className="font-mono text-xs">{MOCK_SHOP.pronouns}</span></span>
                <span className="flex items-center gap-1"><MapPin size={12} />{MOCK_SHOP.location}</span>
                <span className="flex items-center gap-1"><Star size={12} className="fill-[#E0901E] text-[#E0901E]" />{MOCK_SHOP.rating}</span>
                <span className="flex items-center gap-1"><Package size={12} />{MOCK_SHOP.sales} ventes</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* About */}
            <div className="lg:col-span-1">
              <Tag variant="teal" className="mb-4">{MOCK_SHOP.category}</Tag>
              <p className="font-hanken text-sm text-[#F3EADB]/55 leading-relaxed mb-6">
                {MOCK_SHOP.bio}
              </p>
              <button className="w-full py-3 rounded-full border border-[#F3EADB]/15 text-sm font-hanken text-[#F3EADB]/60 hover:border-[#E0337E]/40 hover:text-[#E0337E] transition-all duration-200">
                Contacter la boutique
              </button>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bricolage font-bold text-[#F3EADB] text-xl">
                  Créations ({MOCK_SHOP.products.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {MOCK_SHOP.products.map((p) => (
                  <a key={p.slug} href={`/produit/${p.slug}`}>
                    <Card className="overflow-hidden group">
                      <div className="h-40 flex items-center justify-center" style={{ backgroundColor: p.bg }}>
                        <span className="font-fraunces text-4xl text-[#F3EADB]/10 group-hover:text-[#F3EADB]/20 transition-colors">(u)</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bricolage font-semibold text-[#F3EADB] text-sm mb-1">{p.name}</h3>
                        <span className="font-mono text-sm text-[#F3EADB]">{p.price}</span>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
