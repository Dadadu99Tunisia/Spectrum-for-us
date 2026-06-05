"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import {
  ArrowRight, Trophy, Rocket, Sparkles, Clock,
  Check, Shield, Zap, Star, ChevronDown, Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Counts {
  founder_count: number;
  early_adopter_count: number;
  founder_slots: number;
  early_adopter_slots: number;
  founder_remaining: number;
  early_remaining: number;
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    let start = 0;
    const step = to / (duration / 16);
    const id = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(Math.round(start));
      if (start >= to) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [to, duration]);
  return <>{val}</>;
}

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Progress ring ────────────────────────────────────────────────────────────
function ProgressRing({
  value, max, color, size = 72, stroke = 6,
}: {
  value: number; max: number; color: string; size?: number; stroke?: number;
}) {
  const r   = (size - stroke * 2) / 2;
  const c   = 2 * Math.PI * r;
  const pct = max > 0 ? value / max : 0;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(26,22,18,.08)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
    </svg>
  );
}

// ─── Spot card ────────────────────────────────────────────────────────────────
function SpotCard({
  icon: Icon, tier, rang, color, gradient, borderColor, glowColor,
  count, total, remaining, benefits, delay,
}: {
  icon: React.ElementType;
  tier: string; rang: string; color: string;
  gradient: string; borderColor: string; glowColor: string;
  count: number; total: number; remaining: number;
  benefits: { label: string; bold?: boolean }[];
  delay: number;
}) {
  const { ref, visible } = useInView();
  const full = remaining <= 0;

  return (
    <div ref={ref}
      className="relative rounded-3xl p-7 border flex flex-col transition-all duration-700"
      style={{
        background: gradient,
        borderColor,
        boxShadow: visible ? `0 0 40px ${glowColor}` : "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}>

      {/* Top — icon + tier */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
            <Icon size={22} style={{ color }} />
          </div>
          <div>
            <p className="font-fraunces text-xl text-[#1A1612]">{tier}</p>
            <p className="font-mono text-[10px] text-[#1A1612]/35 mt-0.5">{rang}</p>
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative">
          <ProgressRing value={count} max={total} color={full ? "#6b7280" : color} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-fraunces text-sm leading-none" style={{ color: full ? "#6b7280" : color }}>
              {count}
            </span>
            <span className="font-mono text-[8px] text-[#1A1612]/30 leading-none mt-0.5">/{total}</span>
          </div>
        </div>
      </div>

      {/* Status pill */}
      <div className="mb-5">
        {full ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] bg-[#1A1612]/5 border border-[#1A1612]/10 text-[#1A1612]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6b7280]" /> Complet
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] font-bold"
            style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
            {remaining} place{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Benefits */}
      <ul className="space-y-2.5 flex-1 mb-6">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check size={13} className="mt-0.5 shrink-0" style={{ color: full ? "#4b5563" : color }} />
            <span className={`font-hanken text-sm leading-snug ${full ? "text-[#1A1612]/25" : "text-[#1A1612]/70"} ${b.bold ? "font-semibold" : ""}`}>
              {b.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between font-mono text-[9px] text-[#1A1612]/25 mb-1.5">
          <span>{count} inscrits</span>
          <span>{total} places</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#1A1612]/8 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min((count / total) * 100, 100)}%`,
              background: full ? "#4b5563" : `linear-gradient(90deg, ${color}, ${color}aa)`,
              transitionDelay: `${delay + 400}ms`,
            }} />
        </div>
      </div>
    </div>
  );
}

// ─── Testimony card ────────────────────────────────────────────────────────────
function TestimonyCard({
  quote, author, role, delay,
}: {
  quote: string; author: string; role: string; delay: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref}
      className="rounded-2xl p-6 border border-[#1A1612]/8 bg-[#1A1612]/[0.025] transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}>
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} fill="#FF3D7F" className="text-[#FF3D7F]" />
        ))}
      </div>
      <p className="font-hanken text-sm text-[#1A1612]/70 leading-relaxed mb-4 italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <p className="font-hanken text-sm font-semibold text-[#1A1612]">{author}</p>
        <p className="font-mono text-[9px] text-[#1A1612]/35 mt-0.5">{role}</p>
      </div>
    </div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1A1612]/8 last:border-0">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group">
        <p className="font-hanken text-base text-[#1A1612]/80 group-hover:text-[#1A1612] transition-colors pr-4">
          {q}
        </p>
        <ChevronDown size={16} className="text-[#1A1612]/30 shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      <div className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "300px" : "0", opacity: open ? 1 : 0 }}>
        <p className="font-hanken text-sm text-[#1A1612]/50 leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TESTIMONIES = [
  { quote: "Enfin une marketplace queer pensée pour nous. J'attendais ça depuis des années.", author: "Maëva R.", role: "Créatrice textile indépendante" },
  { quote: "Le concept est exactement ce qu'il manquait à notre communauté. Je rejoins les premiers.", author: "Association Arc-en-Ciel Lyon", role: "Association LGBTQIA+" },
  { quote: "Vendre sans se battre contre un algorithme hostile, c'est une révolution.", author: "Théo D.", role: "Designer freelance, Paris" },
  { quote: "Les avantages fondateurs sont incroyables. 3 ans gratuits, ça change vraiment tout.", author: "Studio Queer Art", role: "Collectif artistique" },
];

const FAQS = [
  {
    q: "Est-ce que mon statut Fondateur·ice est vraiment permanent ?",
    a: "Oui, absolument. Le rang est attribué une fois à vie, de façon irréversible. Même si tu supprimes et recréés ta boutique, tu gardes ton statut. C'est une promesse gravée dans la base de données.",
  },
  {
    q: "Que se passe-t-il après les 3 ans d'abonnement gratuit ?",
    a: "Tu bascules sur le tarif standard en vigueur au moment du renouvellement. Mais tes 0% de commission pendant 12 mois restent actifs pendant cette période, indépendamment de l'abonnement.",
  },
  {
    q: "Puis-je rejoindre le programme si j'ai déjà une boutique Spectrum ?",
    a: "Le programme est attribué automatiquement à l'inscription. Si tu as créé ta boutique avant le lancement officiel du programme, contacte-nous — on régularise manuellement.",
  },
  {
    q: "Le programme concerne quels types de vendeurs ?",
    a: "Tous les vendeurs Spectrum : créateurs indépendants, artistes, designers, associations, entreprises queer & alliées. Il n'y a pas de restriction par catégorie.",
  },
  {
    q: "Y a-t-il des conditions pour conserver les avantages ?",
    a: "Le statut est irrévocable. Les avantages (abonnement gratuit, 0% commission) ont une durée définie mais le badge et la mise en avant prioritaire sont à vie.",
  },
];

export default function ProgrammeFondateurPage() {
  const [counts, setCounts]   = useState<Counts | null>(null);
  const heroRef               = useRef<HTMLDivElement>(null);
  const { ref: statsRef, visible: statsVisible } = useInView(0.2);

  useEffect(() => {
    fetch("/api/founder-program")
      .then(r => r.json())
      .then(setCounts)
      .catch(() => null);
  }, []);

  const founderCount   = counts?.founder_count        ?? 0;
  const earlyCount     = counts?.early_adopter_count  ?? 0;
  const founderLeft    = counts?.founder_remaining    ?? 20;
  const earlyLeft      = counts?.early_remaining      ?? 100;
  const totalInscrits  = founderCount + earlyCount;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#0a0515 0%,#0f0820 40%,#09101a 100%)" }}>
      <Header />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-5 overflow-hidden">

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] opacity-20"
            style={{ background: "radial-gradient(ellipse,#6D2DB5 0%,transparent 70%)" }} />
          <div className="absolute top-20 left-1/4 w-60 h-60 blur-3xl opacity-10"
            style={{ background: "radial-gradient(circle,#FF3D7F,transparent)" }} />
          <div className="absolute top-10 right-1/4 w-40 h-40 blur-3xl opacity-10"
            style={{ background: "radial-gradient(circle,#FFD700,transparent)" }} />
        </div>

        {/* Rainbow stripe */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg,#FF0018,#FFA52C,#FFFF41,#008018,#0000F9,#86007D)" }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">

          {/* Pre-badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-[11px] text-[#a78bfa] mb-8"
            style={{ background: "rgba(109,45,181,.12)", borderColor: "rgba(109,45,181,.3)" }}>
            <Sparkles size={11} />
            Programme exclusif · Limité à 120 places au total
          </div>

          {/* Headline */}
          <h1 className="font-fraunces text-5xl sm:text-6xl md:text-7xl text-[#1A1612] leading-[1.05] mb-6">
            Programme Fondateur
            <span className="block mt-2 text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg,#FFD700,#FF3D7F,#a78bfa)" }}>
              Spectrum 🌈
            </span>
          </h1>

          {/* Subhead */}
          <p className="font-hanken text-xl text-[#1A1612]/55 max-w-2xl mx-auto leading-relaxed mb-10">
            Rejoins les premiers créateur·ices de Spectrum et prends une place
            que personne ne pourra racheter plus tard.
          </p>

          {/* Live counter */}
          <div ref={statsRef} className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-10 px-8 py-5 rounded-2xl border"
            style={{ background: "rgba(26,22,18,.03)", borderColor: "rgba(26,22,18,.1)" }}>

            <div className="text-center">
              <div className="font-fraunces text-4xl text-[#FFD700] leading-none">
                {statsVisible ? <AnimatedNumber to={founderCount} /> : 0}
                <span className="text-[#1A1612]/25 text-2xl"> / 20</span>
              </div>
              <p className="font-mono text-[10px] text-[#1A1612]/30 mt-1.5 flex items-center gap-1 justify-center">
                <Trophy size={9} /> Fondateur·ices inscrits
              </p>
            </div>

            <div className="hidden sm:block w-px h-10 bg-[#1A1612]/10" />

            <div className="text-center">
              <div className="font-fraunces text-4xl text-[#a78bfa] leading-none">
                {statsVisible ? <AnimatedNumber to={earlyCount} /> : 0}
                <span className="text-[#1A1612]/25 text-2xl"> / 100</span>
              </div>
              <p className="font-mono text-[10px] text-[#1A1612]/30 mt-1.5 flex items-center gap-1 justify-center">
                <Rocket size={9} /> Pionnier·es inscrits
              </p>
            </div>

            <div className="hidden sm:block w-px h-10 bg-[#1A1612]/10" />

            <div className="text-center">
              <div className="font-fraunces text-4xl text-[#1C9C95] leading-none">
                {statsVisible ? <AnimatedNumber to={founderLeft + earlyLeft} /> : 0}
              </div>
              <p className="font-mono text-[10px] text-[#1A1612]/30 mt-1.5 flex items-center gap-1 justify-center">
                <Clock size={9} /> Places encore disponibles
              </p>
            </div>
          </div>

          {/* Urgency pill */}
          {founderLeft > 0 && founderLeft <= 8 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] text-[#FFD700] mb-6 border animate-pulse"
              style={{ background: "rgba(255,215,0,.08)", borderColor: "rgba(255,215,0,.25)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
              🔥 Plus que {founderLeft} place{founderLeft > 1 ? "s" : ""} Fondateur·ice
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/vendre/onboarding"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl font-hanken text-base font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg,#6D2DB5,#FF3D7F)",
                boxShadow: "0 12px 40px rgba(109,45,181,.45)",
              }}>
              Rejoindre le Programme Fondateur
              <ArrowRight size={17} />
            </Link>
            <a href="#avantages"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-hanken text-sm text-[#1A1612]/50 hover:text-[#1A1612] border border-[#1A1612]/10 hover:border-[#1A1612]/20 transition-all">
              Voir les avantages <ChevronDown size={14} />
            </a>
          </div>

          <p className="font-mono text-[10px] text-[#1A1612]/20 mt-5">
            🌈 Statut attribué à vie · Non transférable · Le compteur est réel
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TIERS — 3 colonnes
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="avantages" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#1A1612]/25 mb-3">Avantages exclusifs</p>
            <h2 className="font-fraunces text-3xl sm:text-4xl text-[#1A1612]">3 niveaux. 1 seule chance.</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <SpotCard
              icon={Trophy}
              tier="Fondateur·ice"
              rang="Rangs 1 — 20"
              color="#FFD700"
              gradient="linear-gradient(145deg,rgba(255,215,0,.06) 0%,rgba(255,107,53,.03) 100%)"
              borderColor="rgba(255,215,0,.2)"
              glowColor="rgba(255,215,0,.08)"
              count={founderCount}
              total={20}
              remaining={founderLeft}
              delay={0}
              benefits={[
                { label: "Abonnement gratuit pendant 3 ans", bold: true },
                { label: "0 % de commission pendant 12 mois", bold: true },
                { label: "Badge exclusif 🏆 à vie sur ton profil" },
                { label: "Mise en avant prioritaire dans les résultats" },
                { label: "Accès anticipé à toutes les nouvelles fonctionnalités" },
                { label: "Statut permanent — jamais révocable" },
              ]}
            />

            <SpotCard
              icon={Rocket}
              tier="Pionnier·e"
              rang="Rangs 21 — 100"
              color="#a78bfa"
              gradient="linear-gradient(145deg,rgba(167,139,250,.06) 0%,rgba(255,61,127,.03) 100%)"
              borderColor="rgba(167,139,250,.2)"
              glowColor="rgba(167,139,250,.06)"
              count={earlyCount}
              total={100}
              remaining={earlyLeft}
              delay={100}
              benefits={[
                { label: "Abonnement gratuit pendant 6 mois", bold: true },
                { label: "0 % de commission pendant 6 mois", bold: true },
                { label: "Badge Pionnier·e 🚀 sur ton profil" },
                { label: "Visibilité boostée au lancement" },
                { label: "Accès anticipé aux nouvelles fonctionnalités" },
                { label: "Statut permanent — jamais révocable" },
              ]}
            />

            <SpotCard
              icon={Star}
              tier="Après lancement"
              rang="Rangs 101 +"
              color="#6b7280"
              gradient="linear-gradient(145deg,rgba(107,114,128,.05) 0%,transparent 100%)"
              borderColor="rgba(107,114,128,.15)"
              glowColor="transparent"
              count={0}
              total={1}
              remaining={1}
              delay={200}
              benefits={[
                { label: "9,90 €/mois pour les créateurs & artistes" },
                { label: "19,90 €/mois pour les entreprises" },
                { label: "Commission 5 % sur les produits" },
                { label: "Commission 8–12 % sur les services" },
                { label: "Accès à toutes les fonctionnalités standard" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          URGENCE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-10 border text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,rgba(109,45,181,.12) 0%,rgba(255,61,127,.08) 100%)",
              borderColor: "rgba(167,139,250,.2)",
            }}>

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full blur-3xl opacity-15"
                style={{ background: "radial-gradient(circle,#FF3D7F,transparent)" }} />
            </div>

            <div className="relative z-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#a78bfa]/50 mb-4">Pourquoi maintenant ?</p>
              <h2 className="font-fraunces text-3xl sm:text-4xl text-[#1A1612] mb-6 leading-tight">
                Après les 100 premiers vendeurs,<br />
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg,#FF3D7F,#a78bfa)" }}>
                  ce statut n&apos;existera plus jamais.
                </span>
              </h2>
              <p className="font-hanken text-base text-[#1A1612]/50 max-w-xl mx-auto leading-relaxed mb-8">
                Les Fondateur·ices et Pionnier·es seront les seul·es à bénéficier de ces avantages à vie.
                Chaque jour, des places disparaissent. Le compteur est réel — il est directement connecté à notre base de données.
              </p>

              {/* Mini stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                {[
                  { icon: Users, val: totalInscrits, label: "vendeur·ses déjà inscrit·es" },
                  { icon: Clock, val: founderLeft, label: `place${founderLeft !== 1 ? "s" : ""} Fondateur restante${founderLeft !== 1 ? "s" : ""}` },
                  { icon: Zap,   val: founderLeft + earlyLeft, label: "places early adopter restantes" },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Icon size={13} className="text-[#a78bfa]" />
                      <span className="font-fraunces text-2xl text-[#1A1612]">{val}</span>
                    </div>
                    <p className="font-mono text-[9px] text-[#1A1612]/30">{label}</p>
                  </div>
                ))}
              </div>

              <Link href="/vendre/onboarding"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-hanken font-semibold text-white transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#6D2DB5,#FF3D7F)",
                  boxShadow: "0 12px 40px rgba(109,45,181,.4)",
                }}>
                Je veux ma place maintenant
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SOCIAL PROOF
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#1A1612]/25 mb-3">Ils et elles rejoignent déjà</p>
            <h2 className="font-fraunces text-3xl text-[#1A1612]">Spectrum se construit avec vous</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TESTIMONIES.map((t, i) => (
              <TestimonyCard key={i} {...t} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          GUARANTEES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                color: "#1C9C95",
                title: "Statut garanti à vie",
                desc: "Ton rang est inscrit en base de données de façon permanente et immuable. Personne ne peut le retirer.",
              },
              {
                icon: Zap,
                color: "#FFD700",
                title: "Zéro commission immédiat",
                desc: "Dès ton inscription, la commission est appliquée à 0 %. Automatiquement, sans démarche supplémentaire.",
              },
              {
                icon: Sparkles,
                color: "#FF3D7F",
                title: "Accès à tout l'écosystème",
                desc: "Marketplace, annuaire LGBTQ+, événements, communauté. Un seul programme, tous les accès.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="rounded-2xl p-6 border border-[#1A1612]/8 bg-[#1A1612]/[0.02]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}15` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="font-hanken text-base font-semibold text-[#1A1612] mb-2">{title}</p>
                <p className="font-hanken text-sm text-[#1A1612]/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#1A1612]/25 mb-3">Questions fréquentes</p>
            <h2 className="font-fraunces text-3xl text-[#1A1612]">Tout ce que tu veux savoir</h2>
          </div>
          <div className="rounded-2xl border border-[#1A1612]/8 bg-[#1A1612]/[0.02] divide-y divide-[#1A1612]/8 px-6">
            {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 pb-32">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl p-12 text-center border relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#0f0820 0%,#1a0d35 50%,#0d1a2e 100%)",
              borderColor: "rgba(167,139,250,.2)",
              boxShadow: "0 0 80px rgba(109,45,181,.15)",
            }}>

            {/* Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-20"
                style={{ background: "radial-gradient(ellipse,#6D2DB5,transparent)" }} />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgba(167,139,250,.5),transparent)" }} />
            </div>

            <div className="relative z-10">
              <div className="text-4xl mb-5">🌈</div>
              <h2 className="font-fraunces text-3xl sm:text-4xl text-[#1A1612] mb-4 leading-tight">
                Rejoindre les Fondateur·ices Spectrum
              </h2>
              <p className="font-hanken text-base text-[#1A1612]/45 mb-8 max-w-md mx-auto leading-relaxed">
                Une seule chance. Une seule fois.
                Ensuite, ce sera trop tard.
              </p>

              {/* Remaining spots */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {founderLeft > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-[11px] font-bold"
                    style={{ background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.25)", color: "#FFD700" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                    {founderLeft} place{founderLeft > 1 ? "s" : ""} Fondateur·ice
                  </span>
                )}
                {earlyLeft > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-[11px] font-bold"
                    style={{ background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.25)", color: "#a78bfa" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
                    {earlyLeft} place{earlyLeft > 1 ? "s" : ""} Pionnier·e
                  </span>
                )}
              </div>

              <Link href="/vendre/onboarding"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-hanken text-lg font-semibold text-white transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#6D2DB5,#FF3D7F)",
                  boxShadow: "0 16px 50px rgba(109,45,181,.5)",
                }}>
                Je veux ma place
                <ArrowRight size={19} />
              </Link>

              <p className="font-mono text-[10px] text-[#1A1612]/20 mt-5">
                🌈 Programme limité à 20 Fondateur·ices + 100 Early Adopters · Statut à vie
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
