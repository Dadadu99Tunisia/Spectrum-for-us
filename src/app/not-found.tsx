import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Search, Store, Sparkles } from "lucide-react";

export default function NotFound() {
  const suggestions = [
    { label: "Explorer les créations", href: "/decouvrir", icon: Search, color: "#FF3D7F" },
    { label: "Voir les boutiques", href: "/decouvrir?view=shops", icon: Store, color: "#6D2DB5" },
    { label: "Rejoindre Spectrum", href: "/rejoindre", icon: Sparkles, color: "#1C9C95" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">

        {/* Glow bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #FF3D7F, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #6D2DB5, transparent 70%)", filter: "blur(60px)" }} />
        </div>

        <div className="relative text-center max-w-xl mx-auto">

          {/* 404 big display */}
          <div className="relative mb-8 select-none">
            <p
              className="font-fraunces font-bold leading-none"
              style={{
                fontSize: "clamp(120px, 20vw, 200px)",
                background: "linear-gradient(135deg, rgba(255,61,127,0.15), rgba(109,45,181,0.15))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </p>
            {/* ✦ overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#FF3D7F]/40 text-6xl">✦</span>
            </div>
          </div>

          {/* Prism line */}
          <div className="w-24 h-[2px] mx-auto mb-8 rounded-full"
            style={{ background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)" }} />

          <h1 className="font-fraunces text-3xl text-[#1A1612] mb-3">
            Cette page n&apos;existe pas
          </h1>
          <p className="font-hanken text-[#1A1612]/50 mb-10 leading-relaxed">
            La page que tu cherches a peut-être été déplacée, supprimée,<br />
            ou l&apos;URL contient une erreur.
          </p>

          {/* Suggestion cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {suggestions.map(({ label, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-[#1A1612]/8 bg-[#1A1612]/[0.02] hover:border-[#FF3D7F]/30 hover:bg-[#FF3D7F]/5 transition-all duration-200 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="font-hanken text-sm text-[#1A1612]/60 group-hover:text-[#1A1612] transition-colors text-center">
                  {label}
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 font-hanken text-sm text-[#1A1612]/40 hover:text-[#1A1612] transition-colors"
          >
            <ArrowLeft size={14} />
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
