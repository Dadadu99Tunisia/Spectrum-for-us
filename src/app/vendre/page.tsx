"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FounderBanner } from "@/components/founder/FounderBanner";
import { useInView } from "@/lib/useInView";
import { useI18n } from "@/contexts/I18nContext";
import {
  Users, Shield, Eye, Zap, Check, BarChart3, Package,
  Star, ChevronDown, ArrowRight, HeartHandshake,
  Sparkles, Globe, Palette, MessageCircle, BookOpen, Megaphone,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */

// Contenu bilingue FR / EN (la structure JSX reste identique).
const CONTENT = {
  fr: {
    hero: { badge: "Deviens vendeur·euse", h1a: "Vends ce que tu es,", h1b: "sans compromis.",
      sub: "Spectrum For Us est la marketplace queer et inclusive pensée pour les créateur·ices qui méritent une audience qui comprend leur travail. Boutique en ligne, outils simples, communauté engagée.",
      cta1: "Ouvrir ma boutique gratuitement", cta2: "Voir comment ça marche",
      notReady: "Une question ?", leaveEmail: "Ouvre ta boutique en 10 min", notReadyEnd: " — c'est gratuit, tu publies quand tu veux." },
    studio: ["Plusieurs marques ? Le forfait ", "Studio à 19,90 €/mois", " débloque les activités illimitées — ", "offert aux fondateur·ices", "."],
    pillarsEyebrow: "Pourquoi Spectrum ?", pillarsH2a: "Pas juste une marketplace.", pillarsH2b: "Un espace.",
    stepsEyebrow: "Simple. Rapide. Efficace.", stepsH2a: "Lance-toi en", stepsH2b: "3 étapes", stepsCta: "Je commence maintenant",
    pricingEyebrow: "Tarification transparente", pricingH2a: "Ce que ça coûte,", pricingH2b: "sans mauvaise surprise.",
    pricingSub: "On croit en la transparence. Voilà exactement comment ça fonctionne.",
    perMonth: "/mois", allIncluded: "Tout est inclus dans l'abonnement :",
    founderOffer: ["🏆 ", "Offre de lancement", " — les 120 premier·ères rejoignent le programme Fondateur·ice : jusqu'à ", "12 mois d'abonnement offerts", " et ", "0 % de commission", "."],
    seeProgram: "Voir le programme", openShop: "Ouvrir ma boutique", afterFounder: "Après le programme fondateur · commission 0 % les 3 premiers mois",
    testiEyebrow: "Ils & Elles vendent déjà", testiH2a: "La communauté", testiH2b: "parle pour nous.",
    faqEyebrow: "Questions fréquentes", faqH2a: "On répond à tout,", faqH2b: "sans détour.",
    finalH2: "Ton espace t'attend.", finalSub: "Rejoins les créateur·ices qui vendent dans un espace qui leur ressemble vraiment.",
    finalNote: "Commission 0% pendant 3 mois · Résiliable à tout moment",
    footer: "Spectrum For Us · Marketplace queer & inclusive · Paiements sécurisés via Stripe",
    stats: [
      { value: "100 %", label: "Boutiques queers & alliées" },
      { value: "9,90 €", label: "Par mois, sans surprise" },
      { value: "10 min", label: "Pour ouvrir ta boutique" },
      { value: "0 €", label: "Commission les 3 premiers mois" },
    ],
    pillars: [
      { icon: HeartHandshake, color: "#FF2DA0", title: "Une communauté qui cherche ce que tu fais", desc: "Ici, ton audience est déjà là. Des milliers de personnes queer et alliées qui veulent acheter engagé, local, différent : exactement ce que tu crées." },
      { icon: Zap, color: "#FFD400", title: "Des outils pensés pour toi", desc: "Boutique personnalisée, gestion des produits & services, photos, stats, commandes. Tout ce dont tu as besoin, sans te noyer dans la tech." },
      { icon: Shield, color: "#2323C4", title: "Un espace vraiment safe", desc: "Modération active, charte communautaire, zéro tolérance pour la haine. Tu vends en sécurité, sans te battre contre des algorithmes hostiles." },
    ],
    steps: [
      { num: "01", color: "#FF2DA0", title: "Crée ton compte", desc: "Inscris-toi en 2 minutes. Choisis ton nom de boutique, décris ce que tu vends." },
      { num: "02", color: "#7A2BF0", title: "Ajoute tes produits", desc: "Photos, description, prix, stock. Met en ligne autant de produits & services que tu veux." },
      { num: "03", color: "#2323C4", title: "Commence à vendre", desc: "Ta boutique est en ligne. On s'occupe des paiements, toi tu t'occupes de créer." },
    ],
    pricing: [
      { label: "Abonnement mensuel", value: "9,90 €/mois", note: "Résiliable à tout moment" },
      { label: "Commission sur vente", value: "8 %", note: "Par transaction réalisée" },
      { label: "Frais de paiement", value: "Stripe standard", note: "~1,5 % + 0,25 € / paiement EU" },
      { label: "Mise en ligne des produits", value: "Gratuit", note: "Illimité inclus" },
      { label: "Commission les 3 premiers mois", value: "0 %", note: "Offert pour les nouveaux" },
    ],
    features: [
      { icon: Package, label: "Produits & services illimités" }, { icon: BarChart3, label: "Dashboard analytics" },
      { icon: Globe, label: "Boutique publique avec URL unique" }, { icon: Palette, label: "Personnalisation de ta page" },
      { icon: Star, label: "Mise en avant éditoriale" }, { icon: MessageCircle, label: "Support communauté prioritaire" },
      { icon: Megaphone, label: "Présence dans la newsletter" }, { icon: BookOpen, label: "Ressources & guides vendeur" },
      { icon: Sparkles, label: "Badge vérifié & certifié queer" },
    ],
    testimonials: [
      { name: "Sasha M.", shop: "Spectre Bijoux", stars: 5, quote: "Sur les autres plateformes, mes créations étaient noyées dans la masse. Ici, les gens qui achètent comprennent vraiment ce que je fais." },
      { name: "Léa D.", shop: "Zine Queer Paris", stars: 5, quote: "En deux semaines j'avais mes premières commandes. L'interface est simple, le support est humain. Je recommande à tous les créatifs." },
      { name: "Théo & Riley", shop: "Corps & Couleurs", stars: 5, quote: "Vendre sur une plateforme qui partage nos valeurs, c'est une différence énorme. On se sent enfin à notre place." },
    ],
    faqs: [
      { q: "Qui peut vendre sur Spectrum For Us ?", a: "Toute personne queer, alliée ou engagée qui crée des produits physiques, numériques, ou propose des services. Il suffit de respecter notre charte communautaire." },
      { q: "Qu'est-ce que je peux vendre ?", a: "Mode, bijoux, art, zines, cosmétiques, sextoys, services de coaching, ateliers, expériences, et plus encore. Tant que c'est légal et respecte la charte, tu peux le vendre." },
      { q: "Est-ce que je peux annuler à tout moment ?", a: "Oui. Aucun engagement. Tu peux annuler ton abonnement depuis ton dashboard, sans frais ni pénalité." },
      { q: "Comment fonctionne la commission 0% les 3 premiers mois ?", a: "Automatique. Pendant tes 3 premiers mois sur la plateforme, on ne prend aucune commission sur tes ventes. Ensuite, 8% par transaction." },
      { q: "Comment sont gérés les paiements ?", a: "Via Stripe (et versement manuel Payoneer/Wise/virement si Stripe n'est pas dans ton pays). Tu es payé·e où que tu sois dans le monde." },
      { q: "J'ai besoin d'aide pour configurer ma boutique ?", a: "On a des guides pas à pas, une communauté active et un support réactif. Tu ne seras jamais seul·e." },
    ],
  },
  en: {
    hero: { badge: "Become a seller", h1a: "Sell who you are,", h1b: "no compromise.",
      sub: "Spectrum For Us is the queer & inclusive marketplace built for creators who deserve an audience that gets their work. Online shop, simple tools, a community that shows up.",
      cta1: "Open my shop for free", cta2: "See how it works",
      notReady: "A question?", leaveEmail: "Open your shop in 10 min", notReadyEnd: " — it's free, publish whenever you want." },
    studio: ["Multiple brands? The ", "Studio plan at €19.90/mo", " unlocks unlimited shops — ", "free for founders", "."],
    pillarsEyebrow: "Why Spectrum?", pillarsH2a: "Not just a marketplace.", pillarsH2b: "A home.",
    stepsEyebrow: "Simple. Fast. Effective.", stepsH2a: "Get started in", stepsH2b: "3 steps", stepsCta: "Start now",
    pricingEyebrow: "Transparent pricing", pricingH2a: "What it costs,", pricingH2b: "no nasty surprises.",
    pricingSub: "We believe in transparency. Here's exactly how it works.",
    perMonth: "/mo", allIncluded: "Everything is included in the subscription:",
    founderOffer: ["🏆 ", "Launch offer", " — the first 120 join the Founder program: up to ", "12 months free", " and ", "0% commission", "."],
    seeProgram: "See the program", openShop: "Open my shop", afterFounder: "After the founder program · 0% commission for the first 3 months",
    testiEyebrow: "They already sell here", testiH2a: "The community", testiH2b: "speaks for us.",
    faqEyebrow: "Frequently asked", faqH2a: "We answer everything,", faqH2b: "no detours.",
    finalH2: "Your space is waiting.", finalSub: "Join the creators selling in a space that truly looks like them.",
    finalNote: "0% commission for 3 months · Cancel anytime",
    footer: "Spectrum For Us · Queer & inclusive marketplace · Secure payments via Stripe",
    stats: [
      { value: "100%", label: "Queer & ally shops" },
      { value: "€9.90", label: "Per month, no surprises" },
      { value: "10 min", label: "To open your shop" },
      { value: "0%", label: "Commission for 3 months" },
    ],
    pillars: [
      { icon: HeartHandshake, color: "#FF2DA0", title: "A community looking for what you make", desc: "Your audience is already here. Thousands of queer and ally people who want to buy meaningful, local, different — exactly what you create." },
      { icon: Zap, color: "#FFD400", title: "Tools built for you", desc: "Custom shop, products & services, photos, stats, orders. Everything you need, without drowning in tech." },
      { icon: Shield, color: "#2323C4", title: "A genuinely safe space", desc: "Active moderation, community charter, zero tolerance for hate. Sell safely, without fighting hostile algorithms." },
    ],
    steps: [
      { num: "01", color: "#FF2DA0", title: "Create your account", desc: "Sign up in 2 minutes. Pick your shop name, describe what you sell." },
      { num: "02", color: "#7A2BF0", title: "Add your products", desc: "Photos, description, price, stock. List as many products & services as you want." },
      { num: "03", color: "#2323C4", title: "Start selling", desc: "Your shop is live. We handle payments, you focus on creating." },
    ],
    pricing: [
      { label: "Monthly subscription", value: "€9.90/mo", note: "Cancel anytime" },
      { label: "Sales commission", value: "8%", note: "Per completed transaction" },
      { label: "Payment fees", value: "Stripe standard", note: "~1.5% + €0.25 / EU payment" },
      { label: "Listing products", value: "Free", note: "Unlimited included" },
      { label: "Commission for first 3 months", value: "0%", note: "Free for newcomers" },
    ],
    features: [
      { icon: Package, label: "Unlimited products & services" }, { icon: BarChart3, label: "Analytics dashboard" },
      { icon: Globe, label: "Public shop with unique URL" }, { icon: Palette, label: "Customize your page" },
      { icon: Star, label: "Editorial spotlight" }, { icon: MessageCircle, label: "Priority community support" },
      { icon: Megaphone, label: "Newsletter feature" }, { icon: BookOpen, label: "Seller guides & resources" },
      { icon: Sparkles, label: "Verified & queer-certified badge" },
    ],
    testimonials: [
      { name: "Sasha M.", shop: "Spectre Bijoux", stars: 5, quote: "On other platforms my work got lost in the crowd. Here, the people buying actually understand what I do." },
      { name: "Léa D.", shop: "Zine Queer Paris", stars: 5, quote: "Within two weeks I had my first orders. The interface is simple, support is human. I recommend it to every creative." },
      { name: "Théo & Riley", shop: "Corps & Couleurs", stars: 5, quote: "Selling on a platform that shares our values makes a huge difference. We finally feel like we belong." },
    ],
    faqs: [
      { q: "Who can sell on Spectrum For Us?", a: "Anyone queer, ally or engaged who creates physical or digital products, or offers services. Just follow our community charter." },
      { q: "What can I sell?", a: "Fashion, jewelry, art, zines, cosmetics, sextoys, coaching, workshops, experiences and more. As long as it's legal and respects the charter, you can sell it." },
      { q: "Can I cancel anytime?", a: "Yes. No commitment. Cancel your subscription from your dashboard, no fees, no penalty." },
      { q: "How does the 0% commission for 3 months work?", a: "Automatic. For your first 3 months we take no commission on your sales. After that, 8% per transaction." },
      { q: "How are payments handled?", a: "Via Stripe (and manual payout — Payoneer/Wise/bank transfer — if Stripe isn't in your country). You get paid wherever you are in the world." },
      { q: "Need help setting up my shop?", a: "We have step-by-step guides, an active community and responsive support. You're never on your own." },
    ],
  },
} as const;

/* ─── Components ────────────────────────────────────────────── */

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#101014]/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-hanken text-[#101014]/80 group-hover:text-[#101014] transition-colors text-sm md:text-base">
          {q}
        </span>
        <ChevronDown
          size={16}
          className="shrink-0 text-[#101014]/30 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0px" }}
      >
        <p className="font-hanken text-sm text-[#101014]/55 pb-5 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function VendrePage() {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #FF2DA0 0%, #7A2BF0 60%, transparent 100%)" }} />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none"
          style={{ background: "#2323C4" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <FadeIn>
            <span className="inline-block font-mono text-[11px] tracking-wide text-[#FF2DA0] mb-6 px-4 py-1.5 rounded-full border border-[#FF2DA0]/25 bg-[#FF2DA0]/8">
              {C.hero.badge}
            </span>
          </FadeIn>

          <FadeIn delay={80}>
            <h1 className="font-fraunces text-5xl md:text-7xl font-light leading-[1.1] mb-6">
              {C.hero.h1a}{" "}
              <span className="italic text-[#FF2DA0]">{C.hero.h1b}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={160}>
            <p className="font-hanken text-lg text-[#101014]/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              {C.hero.sub}
            </p>
          </FadeIn>

          <FadeIn delay={240}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/vendeur/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#FF2DA0] text-white font-hanken font-semibold text-base hover:bg-[#FF2DA0]/85 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-[#FF2DA0]/20"
              >
                {C.hero.cta1} <ArrowRight size={16} />
              </Link>
              <a
                href="#comment-ca-marche"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-[#101014]/15 text-[#101014]/70 font-hanken text-base hover:border-[#101014]/30 hover:text-[#101014] transition-all duration-200"
              >
                {C.hero.cta2}
              </a>
            </div>
            <p className="font-hanken text-sm text-[#101014]/45 mt-4">
              {C.hero.notReady} <Link href="/vendeur/onboarding" className="font-semibold underline text-[#FF2DA0]">{C.hero.leaveEmail}</Link>{C.hero.notReadyEnd}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── C.stats ── */}
      <section className="py-14 px-6 border-y border-[#101014]/6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {C.stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 60} className="text-center">
              <div className="font-fraunces text-4xl md:text-5xl text-[#FF2DA0] mb-1">{s.value}</div>
              <div className="font-hanken text-xs text-[#101014]/45 tracking-wide">{s.label}</div>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="max-w-4xl mx-auto mt-8 text-center">
          <p className="font-hanken text-sm text-[#101014]/55">
            {C.studio[0]}<strong className="text-[#6A44D6]">{C.studio[1]}</strong>{C.studio[2]}
            <strong className="text-[#101014]">{C.studio[3]}</strong>{C.studio[4]}
          </p>
        </FadeIn>
      </section>

      {/* ── PREUVE SOCIALE · rareté fondateur·ice (live) ── */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <FounderBanner />
        </div>
      </section>

      {/* ── C.pillars ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-[11px] tracking-wide text-[#2323C4] block mb-4">{C.pillarsEyebrow}</span>
            <h2 className="font-fraunces text-4xl md:text-5xl font-light">
              {C.pillarsH2a}{" "}
              <span className="italic text-[#FF2DA0]">{C.pillarsH2b}</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {C.pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <FadeIn key={p.title} delay={i * 100}>
                  <div className="rounded-3xl border border-[#101014]/8 bg-[#101014]/[0.025] p-8 h-full hover:border-[#101014]/15 transition-colors duration-300">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${p.color}18` }}
                    >
                      <Icon size={22} style={{ color: p.color }} />
                    </div>
                    <h3 className="font-bricolage font-semibold text-[#101014] text-xl mb-3">{p.title}</h3>
                    <p className="font-hanken text-[#101014]/55 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="comment-ca-marche" className="py-24 px-6 bg-[#2A1540]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-[11px] tracking-wide text-[#FFD400] block mb-4">{C.stepsEyebrow}</span>
            <h2 className="font-fraunces text-4xl md:text-5xl font-light">
              {C.stepsH2a}{" "}
              <span className="italic text-[#FF2DA0]">{C.stepsH2b}</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {C.steps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 100}>
                <div className="relative">
                  {i < C.steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px border-t border-dashed border-[#101014]/10 z-0" style={{ width: "calc(100% - 3rem)" }} />
                  )}
                  <div className="relative z-10">
                    <div
                      className="font-fraunces text-6xl font-light mb-4 leading-none"
                      style={{ color: `${s.color}50` }}
                    >
                      {s.num}
                    </div>
                    <h3 className="font-bricolage font-semibold text-[#101014] text-xl mb-3">{s.title}</h3>
                    <p className="font-hanken text-[#101014]/55 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={300} className="text-center mt-14">
            <Link
              href="/vendeur/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#FF2DA0] text-white font-hanken font-semibold text-base hover:bg-[#FF2DA0]/85 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-[#FF2DA0]/20"
            >
              {C.stepsCta} <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── C.pricing ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-[11px] tracking-wide text-[#7A2BF0] block mb-4">{C.pricingEyebrow}</span>
            <h2 className="font-fraunces text-4xl md:text-5xl font-light">
              {C.pricingH2a}{" "}
              <span className="italic text-[#FF2DA0]">{C.pricingH2b}</span>
            </h2>
            <p className="font-hanken text-[#101014]/50 mt-4 max-w-xl mx-auto text-sm">
              {C.pricingSub}
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Pricing table */}
            <FadeIn>
              <div className="rounded-3xl border border-[#101014]/10 overflow-hidden">
                {C.pricing.map((p, i) => (
                  <div
                    key={p.label}
                    className={`flex items-center justify-between px-6 py-5 ${i !== C.pricing.length - 1 ? "border-b border-[#101014]/6" : ""}`}
                  >
                    <div>
                      <div className="font-hanken text-sm text-[#101014]/80">{p.label}</div>
                      <div className="font-mono text-[11px] text-[#101014]/35 mt-0.5">{p.note}</div>
                    </div>
                    <div
                      className="font-bricolage font-semibold text-base"
                      style={{ color: i === 4 ? "#2323C4" : "#101014" }}
                    >
                      {p.value}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Features included */}
            <FadeIn delay={100}>
              <div className="rounded-3xl border border-[#FF2DA0]/25 bg-[#FF2DA0]/5 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="font-fraunces text-4xl">9,90€</span>
                  <span className="font-mono text-sm text-[#101014]/40">{C.perMonth}</span>
                </div>
                <p className="font-hanken text-sm text-[#101014]/60 mb-6">{C.allIncluded}</p>
                <div className="space-y-3">
                  {C.features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#FF2DA0]/20 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-[#FF2DA0]" />
                        </div>
                        <span className="font-hanken text-sm text-[#101014]/75 flex items-center gap-2">
                          <Icon size={12} className="text-[#101014]/30" />
                          {f.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Link href="/programme-fondateur"
                  className="mt-6 block rounded-xl border border-[#FFD400]/40 bg-[#FFD400]/10 px-4 py-3 hover:bg-[#FFD400]/15 transition-colors">
                  <p className="font-hanken text-[12.5px] text-[#101014]/80 leading-snug">
                    {C.founderOffer[0]}<strong>{C.founderOffer[1]}</strong>{C.founderOffer[2]}<strong>{C.founderOffer[3]}</strong>{C.founderOffer[4]}<strong>{C.founderOffer[5]}</strong>{C.founderOffer[6]}
                  </p>
                  <span className="font-mono text-[10px] text-[#FF2DA0] inline-flex items-center gap-1 mt-1">{C.seeProgram} <ArrowRight size={10} /></span>
                </Link>
                <Link
                  href="/vendeur/onboarding"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FF2DA0] text-white font-hanken font-semibold text-sm hover:bg-[#FF2DA0]/85 transition-all"
                >
                  {C.openShop} <ArrowRight size={14} />
                </Link>
                <p className="font-hanken text-[11px] text-[#101014]/25 text-center mt-3">
                  {C.afterFounder}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── C.testimonials ── */}
      <section className="py-24 px-6 bg-[#2A1540]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-[11px] tracking-wide text-[#FF2DA0] block mb-4">{C.testiEyebrow}</span>
            <h2 className="font-fraunces text-4xl md:text-5xl font-light">
              {C.testiH2a}{" "}
              <span className="italic text-[#FF2DA0]">{C.testiH2b}</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {C.testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                <div className="rounded-3xl border border-[#101014]/8 bg-[#101014]/[0.025] p-7 flex flex-col gap-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={13} fill="#FFD400" stroke="none" />
                    ))}
                  </div>
                  <p className="font-hanken text-sm text-[#101014]/70 leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <div className="font-bricolage font-semibold text-[#101014] text-sm">{t.name}</div>
                    <div className="font-mono text-[11px] text-[#FF2DA0]/70">{t.shop}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span className="font-mono text-[11px] tracking-wide text-[#2323C4] block mb-4">{C.faqEyebrow}</span>
            <h2 className="font-fraunces text-4xl md:text-5xl font-light">
              {C.faqH2a}{" "}
              <span className="italic text-[#FF2DA0]">{C.faqH2b}</span>
            </h2>
          </FadeIn>

          <FadeIn>
            <div className="rounded-3xl border border-[#101014]/8 bg-[#101014]/[0.025] px-8 py-2">
              {C.faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="relative rounded-3xl border border-[#FF2DA0]/20 bg-gradient-to-br from-[#FF2DA0]/8 via-[#7A2BF0]/8 to-[#2323C4]/5 p-12 md:p-16 text-center overflow-hidden">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none"
                style={{ background: "#FF2DA0" }} />
              <div className="prism-line absolute top-0 left-0 right-0" />

              <div className="relative z-10">
                <div className="text-4xl mb-5">✦</div>
                <h2 className="font-fraunces text-4xl md:text-5xl font-light mb-4">
                  {C.finalH2}
                </h2>
                <p className="font-hanken text-[#101014]/55 text-lg max-w-md mx-auto mb-10">
                  {C.finalSub}
                </p>
                <Link
                  href="/vendeur/onboarding"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#FF2DA0] text-white font-hanken font-semibold text-base hover:bg-[#FF2DA0]/85 hover:scale-[1.02] transition-all duration-200 shadow-xl shadow-[#FF2DA0]/25"
                >
                  {C.openShop} <ArrowRight size={16} />
                </Link>
                <p className="font-hanken text-xs text-[#101014]/25 mt-4">
                  {C.finalNote}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer note */}
      <div className="py-8 px-6 border-t border-[#101014]/6 text-center">
        <p className="font-hanken text-xs text-[#101014]/25">
          {C.footer}
        </p>
      </div>
    </div>
  );
}
