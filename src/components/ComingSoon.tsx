import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle: string;
  accent?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function ComingSoon({ icon: Icon, label, title, subtitle, accent = "#FF2DA0", features, ctaLabel, ctaHref }: ComingSoonProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 px-6 flex flex-col items-center justify-center bg-[#FBFAF8]">
        <div className="max-w-2xl mx-auto text-center">

          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
            <Icon size={36} style={{ color: accent }} />
          </div>

          {/* Label */}
          <span className="font-mono text-[11px] tracking-wide mb-3 block" style={{ color: accent }}>
            {label}
          </span>

          {/* Title */}
          <h1 className="font-fraunces text-4xl md:text-5xl text-[#101014] leading-tight mb-4">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="font-hanken text-lg text-[#101014]/60 leading-relaxed mb-10 max-w-xl mx-auto">
            {subtitle}
          </p>

          {/* Features preview */}
          {features && features.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {features.map((f) => (
                <span key={f}
                  className="px-4 py-1.5 rounded-full border border-[#101014]/10 font-mono text-[11px] tracking-wide text-[#101014]/40">
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Prism line */}
          <div className="h-px w-32 mx-auto mb-10"
            style={{ background: "linear-gradient(90deg,#2323C4, #7A2BF0, #FF2DA0, #F93C2C, #FFD400)" }} />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#101014]/15 bg-[#101014]/[0.03] mb-8">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
            <span className="font-mono text-xs text-[#101014]/50 tracking-wide">En construction</span>
          </div>

          {/* CTA */}
          <div className="flex gap-4 justify-center flex-wrap">
            {ctaLabel && ctaHref && (
              <Link href={ctaHref}
                className="px-6 py-3 rounded-full font-hanken font-medium text-sm text-white transition-all duration-200 hover:brightness-110"
                style={{ background: accent }}>
                {ctaLabel}
              </Link>
            )}
            <Link href="/"
              className="px-6 py-3 rounded-full border border-[#101014]/15 font-hanken text-sm text-[#101014]/60 hover:text-[#101014] hover:border-[#101014]/30 transition-all duration-200">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
