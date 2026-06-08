"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Trophy, Sparkles, Star, Check, Flame, ArrowRight } from "lucide-react";

const T = { bg: "#FBFAF8", ink: "#101014", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF2DA0", gold: "#C9A227", violet: "#7A2BF0", teal: "#2323C4" };

interface Counts {
  founder_count: number; early_adopter_count: number;
  founder_remaining: number; early_remaining: number;
}

function AnimatedNumber({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now(); const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v}</>;
}

type Tier = {
  key: string; emoji: string; name: string; accent: string; sub: string;
  count?: number; total?: number; remaining?: number; soft?: string;
  benefits: { label: string; bold?: boolean }[];
};

export default function ProgrammeFondateurPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  useEffect(() => {
    fetch("/api/founder-program").then(r => r.json()).then(d => setCounts(d?.data ?? d ?? null)).catch(() => {});
  }, []);

  const founderCount = counts?.founder_count ?? 0;
  const earlyCount = counts?.early_adopter_count ?? 0;
  const founderLeft = counts?.founder_remaining ?? 20;
  const earlyLeft = counts?.early_remaining ?? 100;
  const totalInscrits = founderCount + earlyCount;
  const placesLeft = founderLeft + earlyLeft;

  const tiers: Tier[] = [
    {
      key: "super", emoji: "🥇", name: "Super Fondateur·ices", accent: T.gold,
      sub: "Les tout premiers à rejoindre Spectrum.",
      count: founderCount, total: 20, remaining: founderLeft,
      benefits: [
        { label: "Abonnement offert pendant 12 mois", bold: true },
        { label: "0 % de commission pendant 6 mois", bold: true },
        { label: "Badge exclusif 🏆 à vie sur ton profil" },
        { label: "Mise en avant prioritaire à vie dans la marketplace" },
        { label: "Accès anticipé à toutes les nouvelles fonctionnalités" },
        { label: "Statut fondateur gravé dans la base (non transférable)" },
      ],
    },
    {
      key: "fondateur", emoji: "🏆", name: "Fondateur·ices", accent: T.mag,
      sub: "Les premiers piliers de la communauté Spectrum.",
      count: earlyCount, total: 100, remaining: earlyLeft,
      benefits: [
        { label: "Abonnement offert pendant 12 mois", bold: true },
        { label: "0 % de commission pendant 3 mois", bold: true },
        { label: "Badge fondateur 🏆 à vie" },
        { label: "Mise en avant prioritaire dans les résultats de recherche" },
        { label: "Accès anticipé aux nouvelles fonctionnalités" },
        { label: "Statut à vie, non transférable" },
      ],
    },
    {
      key: "pionnier", emoji: "✨", name: "Pionnier·es", accent: T.violet,
      sub: "Les derniers membres du lancement fondateur.", soft: "Dernières places",
      benefits: [
        { label: "Abonnement offert pendant 6 mois", bold: true },
        { label: "0 % de commission pendant 3 mois", bold: true },
        { label: "Badge pionnier ✨ à vie" },
        { label: "Visibilité prioritaire dans la marketplace" },
        { label: "Accès early adopters aux nouveautés" },
      ],
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: T.bg, color: T.ink }}>
        {/* ── Hero ── */}
        <section className="max-w-5xl mx-auto px-6 md:px-8 pt-28 pb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] mb-6"
            style={{ background: "#fff", color: T.soft, boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            <Trophy size={12} style={{ color: T.gold }} /> Programme exclusif · Limité à 120 places
          </span>
          <h1 className="font-fraunces leading-[1] tracking-[-0.02em]" style={{ fontSize: "clamp(38px,6vw,72px)" }}>
            Programme <span style={{ color: T.mag }}>Fondateur</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-5 text-[16.5px] leading-relaxed" style={{ color: T.soft }}>
            Les premières places pour les créateur·ices qui veulent construire Spectrum dès le début.
            Une fois rempli, plus jamais disponible.
          </p>

          {/* Compteur live */}
          <div className="mt-9 inline-flex items-stretch gap-px rounded-2xl overflow-hidden" style={{ boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            {[
              { val: <AnimatedNumber to={placesLeft} />, label: "places restantes", hi: true },
              { val: <AnimatedNumber to={totalInscrits} />, label: "déjà inscrit·es" },
              { val: <>120</>, label: "au total" },
            ].map((s, i) => (
              <div key={i} className="px-7 py-4" style={{ background: "#fff" }}>
                <div className="font-fraunces text-[30px] leading-none" style={{ color: s.hi ? T.mag : T.ink }}>{s.val}</div>
                <div className="font-mono text-[10px] mt-1" style={{ color: T.faint }}>{s.label}</div>
              </div>
            ))}
          </div>

          {founderLeft > 0 && founderLeft <= 8 && (
            <p className="flex items-center justify-center gap-2 mt-5 font-hanken text-sm" style={{ color: T.mag }}>
              <Flame size={15} /> Plus que {founderLeft} place{founderLeft > 1 ? "s" : ""} Super Fondateur·ice !
            </p>
          )}

          <div className="mt-8">
            <Link href="/vendeur/onboarding" className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white text-[15px]" style={{ background: T.ink }}>
              Rejoindre le programme <ArrowRight size={17} />
            </Link>
            <p className="font-mono text-[11px] mt-3" style={{ color: T.faint }}>Statut attribué à vie · Non transférable · Compteur réel</p>
          </div>
        </section>

        {/* ── Paliers ── */}
        <section className="max-w-6xl mx-auto px-6 md:px-8 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {tiers.map((t) => {
              const full = t.remaining !== undefined && t.remaining <= 0;
              return (
                <div key={t.key} className="rounded-3xl p-7 flex flex-col" style={{ background: "#fff", boxShadow: `inset 0 0 0 1.5px ${full ? T.line : t.accent + "55"}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{t.emoji}</span>
                    {t.total !== undefined ? (
                      <span className="font-mono text-[11px] rounded-full px-2.5 py-1" style={{ background: t.accent + "14", color: t.accent }}>
                        {t.count}/{t.total} places
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] rounded-full px-2.5 py-1" style={{ background: t.accent + "14", color: t.accent }}>{t.soft}</span>
                    )}
                  </div>
                  <h2 className="font-fraunces text-[24px] mt-4">{t.name}</h2>
                  <p className="text-[14px] mt-1" style={{ color: T.soft }}>{t.sub}</p>

                  {t.total !== undefined && (
                    <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: T.line }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, ((t.count ?? 0) / t.total) * 100)}%`, background: t.accent }} />
                    </div>
                  )}

                  <ul className="mt-5 space-y-2.5 flex-1">
                    {t.benefits.map((b) => (
                      <li key={b.label} className="flex items-start gap-2.5 text-[14px]" style={{ color: b.bold ? T.ink : T.soft }}>
                        <Check size={15} className="mt-0.5 shrink-0" style={{ color: t.accent }} />
                        <span className={b.bold ? "font-semibold" : ""}>{b.label}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/vendeur/onboarding"
                    className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full py-3 font-semibold text-[14px]"
                    style={full ? { background: T.line, color: T.faint } : { background: T.ink, color: "#fff" }}>
                    {full ? "Complet" : "Réserver ma place"} {!full && <ArrowRight size={15} />}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Après le programme ── */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 pb-14">
          <div className="rounded-3xl p-8 md:p-10" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            <h2 className="font-fraunces text-[26px] mb-2">Après le Programme Fondateur</h2>
            <p className="text-[15px] mb-6" style={{ color: T.soft }}>Une fois les 120 places complètes, le tarif standard s'applique :</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { t: "Créateur·ices & artistes", p: "9,90 €", s: "/mois" },
                { t: "Entreprises", p: "19,90 €", s: "/mois" },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl p-5" style={{ background: T.bg }}>
                  <p className="font-bricolage font-semibold text-[15px]">{x.t}</p>
                  <p className="font-fraunces text-[28px] mt-1">{x.p}<span className="font-hanken text-[14px]" style={{ color: T.faint }}>{x.s}</span></p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-5 text-[14px]" style={{ color: T.soft }}>
              <span className="flex items-center gap-2"><Check size={15} style={{ color: T.teal }} /> Commission 5 % sur les produits</span>
              <span className="flex items-center gap-2"><Check size={15} style={{ color: T.teal }} /> Commission 8 à 12 % sur les services</span>
            </div>
          </div>
        </section>

        {/* ── Pourquoi + Important ── */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 pb-20 grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl p-8" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
            <Sparkles size={20} style={{ color: T.mag }} />
            <h3 className="font-fraunces text-[20px] mt-3 mb-2">Pourquoi ce programme existe</h3>
            <p className="text-[14.5px] leading-relaxed" style={{ color: T.soft }}>
              Spectrum se construit avec ses premier·es créateur·ices. Ces places ne sont pas juste une offre :
              c'est l'opportunité de devenir visible dès le début et de façonner la plateforme.
            </p>
          </div>
          <div className="rounded-3xl p-8" style={{ background: T.ink, color: "#fff" }}>
            <Flame size={20} style={{ color: T.mag }} />
            <h3 className="font-fraunces text-[20px] mt-3 mb-3">Important</h3>
            <ul className="space-y-2 text-[14.5px]" style={{ color: "rgba(255,255,255,.8)" }}>
              <li className="flex items-start gap-2"><Star size={15} className="mt-0.5 shrink-0" style={{ color: T.gold }} /> Les places sont limitées à 120</li>
              <li className="flex items-start gap-2"><Star size={15} className="mt-0.5 shrink-0" style={{ color: T.gold }} /> Une fois prises, elles ne seront jamais rouvertes</li>
              <li className="flex items-start gap-2"><Star size={15} className="mt-0.5 shrink-0" style={{ color: T.gold }} /> Le statut fondateur est permanent</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
