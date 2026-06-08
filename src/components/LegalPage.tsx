import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <Link href="/" className="font-mono text-xs text-[#101014]/30 hover:text-[#FF2DA0] transition-colors mb-8 inline-block">
          ← Retour à l'accueil
        </Link>
        <div className="h-[2px] w-16 mb-8" style={{ background: "linear-gradient(90deg,#F93C2C,#FF2DA0,#7A2BF0)" }} />
        <h1 className="font-fraunces text-4xl font-light mb-2">{title}</h1>
        <p className="font-mono text-xs text-[#101014]/30 mb-12">Dernière mise à jour : juin 2026</p>
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:font-fraunces prose-headings:font-light prose-headings:text-[#101014]
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-[#FF2DA0]
          prose-p:font-hanken prose-p:text-[#101014]/70 prose-p:leading-relaxed prose-p:mb-4
          prose-ul:font-hanken prose-ul:text-[#101014]/70
          prose-li:mb-1 prose-strong:text-[#101014] prose-a:text-[#FF2DA0]">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
