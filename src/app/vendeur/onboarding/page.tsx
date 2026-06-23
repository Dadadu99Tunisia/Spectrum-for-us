"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, Check, Store, Shield, Eye, Zap } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import { FounderBanner } from "@/components/founder/FounderBanner";
import { useI18n } from "@/contexts/I18nContext";

import { CATEGORIES as TAXONOMY } from "@/lib/categories";

const STEPS = ["Bienvenue", "Ta boutique", "Programme", "Charte", "Confirmation"] as const;
type Step = 0 | 1 | 2 | 3 | 4;

const ONB_TX = {
  fr: {
    openShop: "Ouvre ta boutique",
    welcome: "Bienvenue dans le spectre. En 3 étapes, ta boutique est en ligne, visible par une communauté qui cherche exactement ce que tu crées.",
    perks: ["Safe space garanti · charte communautaire", "Visibilité offerte · mise en avant éditoriale", "10 min pour être en ligne", "9,90 €/mois, sans commission cachée"],
    start: "Commencer",
    presentShop: "Présente ta boutique",
    fName: "Nom de ta boutique *", phName: "Atelier Lumière",
    fTagline: "Accroche (1 ligne)", phTagline: "Bijoux forgés à la main, pièces uniques",
    fDesc: "Description *", phDesc: "Présente ton travail, ton univers, ta démarche…",
    fEmail: "Email de contact", fEmailHint: "(visible sur ta boutique)", phEmail: "ta@boutique.com",
    fCity: "Ville", phCity: "Paris", fCategory: "Catégorie principale", choose: "Choisir…", allSuffix: "(tout)",
    cont: "Continuer",
    founderTitle: "Programme Fondateur·ice",
    founderSub: "En ouvrant ta boutique aujourd'hui, tu rejoins automatiquement le programme · découvre tes avantages.",
    charterTitle: "Charte communautaire", charterSub: "Spectrum For Us est un safe space. Ces engagements sont non-négociables.",
    charter: [
      "Je m'engage à ne proposer que des produits, services et événements authentiques et conformes à ma description.",
      "Je respecte chaque membre sans discrimination liée à l'identité de genre, l'orientation sexuelle, la race, la religion ou le handicap.",
      "Je traite mes client·e·s avec soin et réactivité (réponse sous 48h).",
      "Je ne publie aucun contenu haineux, trompeur ou illégal.",
      "J'accepte que Spectrum For Us puisse retirer mes annonces si elles enfreignent la charte, sans remboursement d'abonnement.",
      "Je comprends que les données de mes client·e·s sont protégées par le RGPD et ne peuvent pas être exploitées à d'autres fins.",
    ],
    charterAgree: "Je lis, comprends et m'engage à respecter la charte communautaire de Spectrum For Us.",
    creating: "Création…", openShopCta: "Ouvrir ma boutique ✦",
    online: (n: string) => ({ pre: "Bravo, ", name: n, post: " est en ligne ! 🎉" }),
    onlineSub: ["Voici tes prochaines étapes pour déclencher ta ", "première vente", ". On t'accompagne — ça prend quelques minutes."],
    nextSteps: [
      { t: "Ajoute tes 3 premières créations", d: "De belles photos lumineuses = plus de ventes. Vise au moins 3 produits.", cta: "Ajouter un produit" },
      { t: "Active ton paiement", d: "Connecte Stripe pour être payé·e — ou le versement manuel (Payoneer/Wise/virement) où que tu sois dans le monde.", cta: "Configurer le paiement" },
      { t: "Vérifie ta livraison", d: "Les modes (point relais, domicile…) sont déjà préréglés — ajuste si besoin.", cta: "Voir la livraison" },
      { t: "Partage ta boutique", d: "Le bouche-à-oreille fait tes premières ventes. Envoie ton lien à ta communauté.", cta: "Voir ma boutique publique" },
    ],
    addFirst: "Ajouter mon 1ᵉʳ produit", dashboard: "Dashboard",
  },
  en: {
    openShop: "Open your shop",
    welcome: "Welcome to the spectrum. In 3 steps, your shop is live, visible to a community looking for exactly what you create.",
    perks: ["Safe space guaranteed · community charter", "Free visibility · editorial spotlight", "10 min to go live", "€9.90/month, no hidden commission"],
    start: "Get started",
    presentShop: "Introduce your shop",
    fName: "Your shop name *", phName: "Light Studio",
    fTagline: "Tagline (1 line)", phTagline: "Hand-forged jewelry, one-of-a-kind pieces",
    fDesc: "Description *", phDesc: "Introduce your work, your universe, your approach…",
    fEmail: "Contact email", fEmailHint: "(visible on your shop)", phEmail: "you@shop.com",
    fCity: "City", phCity: "Paris", fCategory: "Main category", choose: "Choose…", allSuffix: "(all)",
    cont: "Continue",
    founderTitle: "Founder Program",
    founderSub: "By opening your shop today, you automatically join the program · discover your benefits.",
    charterTitle: "Community charter", charterSub: "Spectrum For Us is a safe space. These commitments are non-negotiable.",
    charter: [
      "I commit to offering only authentic products, services and events that match my description.",
      "I respect every member without discrimination based on gender identity, sexual orientation, race, religion or disability.",
      "I treat my customers with care and responsiveness (reply within 48h).",
      "I publish no hateful, misleading or illegal content.",
      "I accept that Spectrum For Us may remove my listings if they breach the charter, with no subscription refund.",
      "I understand that my customers' data is protected by GDPR and cannot be used for other purposes.",
    ],
    charterAgree: "I have read, understand and commit to respecting the Spectrum For Us community charter.",
    creating: "Creating…", openShopCta: "Open my shop ✦",
    online: (n: string) => ({ pre: "Congrats, ", name: n, post: " is live! 🎉" }),
    onlineSub: ["Here are your next steps to trigger your ", "first sale", ". We've got you — it takes a few minutes."],
    nextSteps: [
      { t: "Add your first 3 creations", d: "Bright, beautiful photos = more sales. Aim for at least 3 products.", cta: "Add a product" },
      { t: "Activate your payment", d: "Connect Stripe to get paid — or manual payout (Payoneer/Wise/transfer) wherever you are in the world.", cta: "Set up payment" },
      { t: "Check your shipping", d: "The methods (pickup point, home…) are already preset — adjust if needed.", cta: "View shipping" },
      { t: "Share your shop", d: "Word of mouth drives your first sales. Send your link to your community.", cta: "View my public shop" },
    ],
    addFirst: "Add my 1st product", dashboard: "Dashboard",
  },
} as const;

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const { locale } = useI18n();
  const TX = ONB_TX[locale === "en" ? "en" : "fr"];
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState({ name: "", tagline: "", description: "", city: "", category: "", contact_email: "", charter: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [shopSlug, setShopSlug] = useState("");

  const isNewActivity = () =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("nouvelle") === "1";

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/auth?mode=vendor"); return; }
    // Création d'une activité SUPPLÉMENTAIRE → vérifie l'éligibilité (Studio ou fondateur·ice offert).
    if (isNewActivity()) {
      const sb = createClient();
      Promise.all([
        sb.from("sellers").select("plan").eq("user_id", user.id).maybeSingle(),
        sb.from("founder_program_members").select("subscription_free_until").eq("user_id", user.id).maybeSingle(),
      ]).then(([{ data: sel }, { data: f }]) => {
        const founderFree = !!f?.subscription_free_until && new Date(f.subscription_free_until).getTime() > Date.now();
        if (sel?.plan !== "studio" && !founderFree) router.replace("/vendeur/abonnement?upgrade=studio");
      });
      return;
    }
    // Sinon anti-doublon : si une boutique existe déjà, on va au dashboard.
    createClient().from("shops").select("id").eq("owner_id", user.id).limit(1)
      .then(({ data }) => { if (data && data.length) router.replace("/vendeur"); });
  }, [user, loading, router]);

  const handleSubmit = async () => {
    if (!user || !form.charter) return;
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const newActivity = isNewActivity();

    // Garde-fou (1re boutique uniquement) : ne pas créer un doublon involontaire
    if (!newActivity) {
      const { data: existing } = await supabase.from("shops").select("id").eq("owner_id", user.id).limit(1);
      if (existing && existing.length) { setSubmitting(false); router.replace("/vendeur"); return; }
    }

    // Rattache l'activité au seller existant (entité financière partagée) si présent.
    const { data: sellerRow } = await supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle();

    const slug = slugify(form.name) + "-" + Math.random().toString(36).slice(2, 6);

    const { data: created, error: shopError } = await supabase.from("shops").insert({
      owner_id: user.id,
      seller_id: sellerRow?.id ?? null,
      name: form.name,
      slug,
      tagline: form.tagline,
      description: form.description,
      city: form.city,
      contact_email: form.contact_email || null,
      tags: [form.category].filter(Boolean),
      charter_accepted_at: new Date().toISOString(),
      is_active: true,
    }).select("id").single();

    if (shopError) {
      if (shopError.message?.includes("STUDIO_REQUIRED")) {
        router.replace("/vendeur/abonnement?upgrade=studio");
        return;
      }
      setError(shopError.message); setSubmitting(false); return;
    }
    await supabase.from("profiles").update({ is_vendor: true }).eq("id", user.id);
    // L'activité créée devient l'activité active du dashboard.
    try { if (created?.id) localStorage.setItem("sfu_active_activity", created.id); } catch {}
    setShopSlug(slug);
    setStep(4);
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#FF2DA0] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFAF8] px-6 py-12">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(110,45,181,0.12) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Logo */}
        <a href="/" className="block text-center mb-8">
          <span className="font-fraunces text-2xl text-[#101014]">B<span className="text-[#FF2DA0]">(u)</span>y us</span>
        </a>

        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center gap-2 justify-center mb-10">
            {STEPS.slice(0, 4).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full border text-xs font-mono flex items-center justify-center transition-all duration-300 ${
                  i < step ? "bg-[#2323C4] border-[#2323C4] text-[#101014]"
                  : i === step ? "border-[#FF2DA0] text-[#FF2DA0]"
                  : "border-[#101014]/20 text-[#101014]/30"
                }`}>
                  {i < step ? "✓" : i + 1}
                </div>
                {i < 3 && <div className={`w-6 h-px transition-colors ${i < step ? "bg-[#2323C4]" : "bg-[#101014]/15"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 0 · Bienvenue */}
        {step === 0 && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF2DA0]/10 border border-[#FF2DA0]/30 flex items-center justify-center mx-auto mb-6">
              <Store size={28} className="text-[#FF2DA0]" />
            </div>
            <h1 className="font-fraunces text-3xl text-[#101014] mb-3">{TX.openShop}</h1>
            <p className="font-hanken text-[#101014]/55 mb-10 leading-relaxed">
              {TX.welcome}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
              {[
                { icon: Shield, text: TX.perks[0] },
                { icon: Eye, text: TX.perks[1] },
                { icon: Zap, text: TX.perks[2] },
                { icon: Store, text: TX.perks[3] },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-[#101014]/[0.03] border border-[#101014]/8">
                  <Icon size={14} className="text-[#FF2DA0] mt-0.5 shrink-0" />
                  <p className="font-hanken text-xs text-[#101014]/60 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <Button variant="primary" className="w-full py-3.5 text-base" onClick={() => setStep(1)}>
              {TX.start} <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* Step 1 · Ta boutique */}
        {step === 1 && (
          <div>
            <h2 className="font-fraunces text-2xl text-[#101014] mb-6">{TX.presentShop}</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{TX.fName}</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={TX.phName}
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{TX.fTagline}</label>
                <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder={TX.phTagline}
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{TX.fDesc}</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={TX.phDesc}
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors resize-none" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">
                  {TX.fEmail} <span className="normal-case tracking-normal text-[#101014]/25">{TX.fEmailHint}</span>
                </label>
                <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  placeholder={TX.phEmail}
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{TX.fCity}</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder={TX.phCity}
                    className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{TX.fCategory}</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/60 transition-colors">
                    <option value="">{TX.choose}</option>
                    {Object.entries(TAXONOMY).map(([cat, subs]) => (
                      <optgroup key={cat} label={cat}>
                        <option value={cat}>{cat} {TX.allSuffix}</option>
                        {(subs as string[]).map((s) => <option key={s} value={s}>{s}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="py-3 px-5" onClick={() => setStep(0)}><ArrowLeft size={14} /></Button>
              <Button variant="primary" className="flex-1 py-3"
                disabled={!form.name.trim() || !form.description.trim()}
                onClick={() => setStep(2)}>
                {TX.cont} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 · Programme Fondateur */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <h2 className="font-fraunces text-2xl text-[#101014] mb-1">{TX.founderTitle}</h2>
              <p className="font-hanken text-sm text-[#101014]/45">
                {TX.founderSub}
              </p>
            </div>
            <FounderBanner hideCta />
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="py-3 px-5" onClick={() => setStep(1)}><ArrowLeft size={14} /></Button>
              <Button variant="primary" className="flex-1 py-3" onClick={() => setStep(3)}>
                {TX.cont} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 · Charte */}
        {step === 3 && (
          <div>
            <h2 className="font-fraunces text-2xl text-[#101014] mb-2">{TX.charterTitle}</h2>
            <p className="font-hanken text-sm text-[#101014]/50 mb-6">{TX.charterSub}</p>
            <div className="rounded-2xl border border-[#101014]/10 bg-[#101014]/[0.02] p-5 mb-6 space-y-3 text-sm font-hanken text-[#101014]/60 leading-relaxed">
              {TX.charter.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-[#FF2DA0] shrink-0 mt-0.5">✦</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-3 cursor-pointer group mb-6">
              <input type="checkbox" checked={form.charter} onChange={(e) => setForm({ ...form, charter: e.target.checked })} className="w-4 h-4 mt-0.5 rounded accent-[#FF2DA0]" />
              <span className="font-hanken text-sm text-[#101014]/70 group-hover:text-[#101014] transition-colors leading-relaxed">
                {TX.charterAgree}
              </span>
            </label>
            {error && <div className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3 mb-4">{error}</div>}
            <div className="flex gap-3">
              <Button variant="secondary" className="py-3 px-5" onClick={() => setStep(2)}><ArrowLeft size={14} /></Button>
              <Button variant="primary" className="flex-1 py-3" disabled={!form.charter || submitting} onClick={handleSubmit}>
                {submitting ? TX.creating : TX.openShopCta}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 · Coaching "première vente" */}
        {step === 4 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#2323C4]/10 border border-[#2323C4]/30 flex items-center justify-center mx-auto mb-5">
                <Check size={36} className="text-[#2323C4]" />
              </div>
              <h1 className="font-fraunces text-3xl text-[#101014] mb-2">{TX.online(form.name).pre}<strong>{form.name}</strong>{TX.online(form.name).post}</h1>
              <p className="font-hanken text-[#101014]/55 leading-relaxed">
                {TX.onlineSub[0]}<strong className="text-[#101014]">{TX.onlineSub[1]}</strong>{TX.onlineSub[2]}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                { n: 1, ...TX.nextSteps[0], href: "/vendeur/nouveau-produit" },
                { n: 2, ...TX.nextSteps[1], href: "/vendeur" },
                { n: 3, ...TX.nextSteps[2], href: "/vendeur" },
                { n: 4, ...TX.nextSteps[3], href: shopSlug ? `/boutique/${shopSlug}` : "/vendeur" },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3 rounded-2xl border border-[#101014]/12 bg-white p-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-fraunces font-bold text-sm shrink-0" style={{ background: "#FF2DA0", color: "#fff" }}>{s.n}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bricolage font-semibold text-[15px] text-[#101014]">{s.t}</p>
                    <p className="font-hanken text-[13px] text-[#101014]/55 mb-2">{s.d}</p>
                    <a href={s.href} target={s.n === 4 ? "_blank" : undefined} rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#FF2DA0] hover:underline">
                      {s.cta} <ArrowRight size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1 py-3.5" href="/vendeur/nouveau-produit">
                {TX.addFirst} <ArrowRight size={16} />
              </Button>
              <Button variant="secondary" className="py-3.5 px-5" href="/vendeur">{TX.dashboard}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
