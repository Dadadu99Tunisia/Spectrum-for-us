import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1612]">
      <Header />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <Link href="/" className="font-mono text-xs text-[#1A1612]/30 hover:text-[#FF3D7F] transition-colors mb-8 inline-block">
          ← Retour à l'accueil
        </Link>
        <div className="h-[2px] w-16 mb-8" style={{ background: "linear-gradient(90deg,#E0533A,#CF3F7C,#6D2DB5)" }} />
        <h1 className="font-fraunces text-4xl font-light mb-2">{title}</h1>
        <p className="font-mono text-xs text-[#1A1612]/30 mb-12">Dernière mise à jour : juin 2026</p>
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:font-fraunces prose-headings:font-light prose-headings:text-[#1A1612]
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-[#FF3D7F]
          prose-p:font-hanken prose-p:text-[#1A1612]/70 prose-p:leading-relaxed prose-p:mb-4
          prose-ul:font-hanken prose-ul:text-[#1A1612]/70
          prose-li:mb-1 prose-strong:text-[#1A1612] prose-a:text-[#FF3D7F]">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
