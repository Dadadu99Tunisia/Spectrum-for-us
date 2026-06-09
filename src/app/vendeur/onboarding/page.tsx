"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, Check, Store, Shield, Eye, Zap } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";
import { FounderBanner } from "@/components/founder/FounderBanner";

const CATEGORIES = ["Mode non-genrée", "Art & Culture", "Bijoux", "Zines & Édition", "Corps & Soin", "Intimité", "Maison", "Services", "Expériences"];

const STEPS = ["Bienvenue", "Ta boutique", "Programme", "Charte", "Confirmation"] as const;
type Step = 0 | 1 | 2 | 3 | 4;

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState({ name: "", tagline: "", description: "", city: "", category: "", contact_email: "", charter: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/auth?mode=vendor"); return; }
    // Anti-doublon : si une boutique existe déjà, on va au dashboard
    createClient().from("shops").select("id").eq("owner_id", user.id).limit(1)
      .then(({ data }) => { if (data && data.length) router.replace("/vendeur"); });
  }, [user, loading, router]);

  const handleSubmit = async () => {
    if (!user || !form.charter) return;
    setSubmitting(true);
    setError("");
    const supabase = createClient();

    // Garde-fou : ne pas créer un 2e shop si l'utilisateur en a déjà un
    const { data: existing } = await supabase.from("shops").select("id").eq("owner_id", user.id).limit(1);
    if (existing && existing.length) { setSubmitting(false); router.replace("/vendeur"); return; }

    const slug = slugify(form.name) + "-" + Math.random().toString(36).slice(2, 6);

    const { error: shopError } = await supabase.from("shops").insert({
      owner_id: user.id,
      name: form.name,
      slug,
      tagline: form.tagline,
      description: form.description,
      city: form.city,
      contact_email: form.contact_email || null,
      tags: [form.category].filter(Boolean),
      charter_accepted_at: new Date().toISOString(),
      is_active: true,
    });

    if (shopError) { setError(shopError.message); setSubmitting(false); return; }
    await supabase.from("profiles").update({ is_vendor: true }).eq("id", user.id);
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
            <h1 className="font-fraunces text-3xl text-[#101014] mb-3">Ouvre ta boutique</h1>
            <p className="font-hanken text-[#101014]/55 mb-10 leading-relaxed">
              Bienvenue dans le spectre. En 3 étapes, ta boutique est en ligne, visible par une communauté qui cherche exactement ce que tu crées.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
              {[
                { icon: Shield, text: "Safe space garanti · charte communautaire" },
                { icon: Eye, text: "Visibilité offerte · mise en avant éditoriale" },
                { icon: Zap, text: "10 min pour être en ligne" },
                { icon: Store, text: "9,90 €/mois, sans commission cachée" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-[#101014]/[0.03] border border-[#101014]/8">
                  <Icon size={14} className="text-[#FF2DA0] mt-0.5 shrink-0" />
                  <p className="font-hanken text-xs text-[#101014]/60 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <Button variant="primary" className="w-full py-3.5 text-base" onClick={() => setStep(1)}>
              Commencer <ArrowRight size={16} />
            </Button>
          </div>
        )}

        {/* Step 1 · Ta boutique */}
        {step === 1 && (
          <div>
            <h2 className="font-fraunces text-2xl text-[#101014] mb-6">Présente ta boutique</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Nom de ta boutique *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Atelier Lumière"
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Accroche (1 ligne)</label>
                <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Bijoux forgés à la main, pièces uniques"
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Description *</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Présente ton travail, ton univers, ta démarche…"
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors resize-none" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">
                  Email de contact <span className="normal-case tracking-normal text-[#101014]/25">(visible sur ta boutique)</span>
                </label>
                <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  placeholder="ta@boutique.com"
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Ville</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Paris"
                    className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">Catégorie principale</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/60 transition-colors">
                    <option value="" className="bg-[#FBFAF8]">Choisir…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#FBFAF8]">{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="py-3 px-5" onClick={() => setStep(0)}><ArrowLeft size={14} /></Button>
              <Button variant="primary" className="flex-1 py-3"
                disabled={!form.name.trim() || !form.description.trim()}
                onClick={() => setStep(2)}>
                Continuer <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 · Programme Fondateur */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <h2 className="font-fraunces text-2xl text-[#101014] mb-1">Programme Fondateur·ice</h2>
              <p className="font-hanken text-sm text-[#101014]/45">
                En ouvrant ta boutique aujourd&apos;hui, tu rejoins automatiquement le programme · découvre tes avantages.
              </p>
            </div>
            <FounderBanner hideCta />
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="py-3 px-5" onClick={() => setStep(1)}><ArrowLeft size={14} /></Button>
              <Button variant="primary" className="flex-1 py-3" onClick={() => setStep(3)}>
                Continuer <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 · Charte */}
        {step === 3 && (
          <div>
            <h2 className="font-fraunces text-2xl text-[#101014] mb-2">Charte communautaire</h2>
            <p className="font-hanken text-sm text-[#101014]/50 mb-6">Spectrum For Us est un safe space. Ces engagements sont non-négociables.</p>
            <div className="rounded-2xl border border-[#101014]/10 bg-[#101014]/[0.02] p-5 mb-6 space-y-3 text-sm font-hanken text-[#101014]/60 leading-relaxed">
              {[
                "Je m'engage à ne proposer que des produits, services et événements authentiques et conformes à ma description.",
                "Je respecte chaque membre sans discrimination liée à l'identité de genre, l'orientation sexuelle, la race, la religion ou le handicap.",
                "Je traite mes client·e·s avec soin et réactivité (réponse sous 48h).",
                "Je ne publie aucun contenu haineux, trompeur ou illégal.",
                "J'accepte que Spectrum For Us puisse retirer mes annonces si elles enfreignent la charte, sans remboursement d'abonnement.",
                "Je comprends que les données de mes client·e·s sont protégées par le RGPD et ne peuvent pas être exploitées à d'autres fins.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-[#FF2DA0] shrink-0 mt-0.5">✦</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-3 cursor-pointer group mb-6">
              <input type="checkbox" checked={form.charter} onChange={(e) => setForm({ ...form, charter: e.target.checked })} className="w-4 h-4 mt-0.5 rounded accent-[#FF2DA0]" />
              <span className="font-hanken text-sm text-[#101014]/70 group-hover:text-[#101014] transition-colors leading-relaxed">
                Je lis, comprends et m&apos;engage à respecter la charte communautaire de Spectrum For Us.
              </span>
            </label>
            {error && <div className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3 mb-4">{error}</div>}
            <div className="flex gap-3">
              <Button variant="secondary" className="py-3 px-5" onClick={() => setStep(2)}><ArrowLeft size={14} /></Button>
              <Button variant="primary" className="flex-1 py-3" disabled={!form.charter || submitting} onClick={handleSubmit}>
                {submitting ? "Création…" : "Ouvrir ma boutique ✦"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 · Confirmation */}
        {step === 4 && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#2323C4]/10 border border-[#2323C4]/30 flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-[#2323C4]" />
            </div>
            <h1 className="font-fraunces text-3xl text-[#101014] mb-3">Boutique créée ! ✦</h1>
            <p className="font-hanken text-[#101014]/55 mb-10 leading-relaxed">
              <strong className="text-[#101014]">{form.name}</strong> est maintenant dans le spectre.
              Ajoute tes premières créations pour commencer à vendre.
            </p>
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1 py-3.5" href="/vendeur/nouveau-produit">
                Ajouter un produit <ArrowRight size={16} />
              </Button>
              <Button variant="secondary" className="py-3.5 px-5" href="/vendeur">
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
