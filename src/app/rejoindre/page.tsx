"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const ACTIVITY_TYPES = [
  { value: "createur", label: "🎨  Créateur·ice (mode, bijoux, art…)" },
  { value: "artiste", label: "🎭  Artiste (musique, danse, performance…)" },
  { value: "freelance", label: "💻  Freelance (graphisme, photo, vidéo…)" },
  { value: "therapeute", label: "🌿  Thérapeute / Bien-être" },
  { value: "coach", label: "✨  Coach / Accompagnant·e" },
  { value: "avocat", label: "⚖️   Avocat·e / Juriste" },
  { value: "medecin", label: "🩺  Médecin / Professionnel·le de santé" },
  { value: "educateur", label: "📚  Éducateur·ice / Formateur·ice" },
  { value: "autre", label: "🌈  Autre activité" },
];

const PROFILES = [
  { emoji: "🎨", label: "Créateur·ices" },
  { emoji: "🎭", label: "Artistes" },
  { emoji: "🌿", label: "Thérapeutes" },
  { emoji: "⚖️", label: "Avocat·es" },
  { emoji: "💻", label: "Freelances" },
  { emoji: "📸", label: "Photographes" },
  { emoji: "✨", label: "Coachs" },
  { emoji: "🩺", label: "Médecins alliés" },
  { emoji: "🎵", label: "Musicien·nes" },
  { emoji: "📚", label: "Éducateur·ices" },
];

export default function RejoindrePage() {
  const [form, setForm] = useState({
    name: "", email: "", activity_type: "",
    description: "", website: "", instagram: "", is_queer: false,
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.activity_type) {
      setError("Merci de remplir tous les champs obligatoires."); return;
    }
    setSending(true); setError("");
    const res = await fetch("/api/rejoindre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setError(data.error || "Une erreur est survenue."); return; }
    setDone(true);
  };

  const inputCls = "w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-4 py-3 font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/50 transition-colors";

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #FF2DA0 0%, #7A2BF0 70%, transparent 100%)" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block font-mono text-[11px] tracking-wide text-[#FF2DA0] mb-6 px-4 py-1.5 rounded-full border border-[#FF2DA0]/25 bg-[#FF2DA0]/8">
            🏳️‍🌈 Pride 2025 · Lancement le 26 juin
          </span>
          <h1 className="font-fraunces text-5xl md:text-6xl font-light leading-[1.1] mb-6">
            Rejoins{" "}
            <span className="italic text-[#FF2DA0]">Spectrum.</span>
          </h1>
          <p className="font-hanken text-lg text-[#101014]/60 max-w-2xl mx-auto leading-relaxed">
            Spectrum For Us, c&apos;est la première plateforme queer pour les créateur·ices,
            artistes, thérapeutes, freelances et professionnel·les qui veulent être vus·es
            par une communauté qui leur ressemble.
          </p>
        </div>
      </section>

      {/* Qui peut rejoindre */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-[11px] tracking-wide text-[#101014]/35 text-center mb-6">Qui peut rejoindre ?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {PROFILES.map(p => (
              <div key={p.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#101014]/10 bg-[#101014]/[0.03] font-hanken text-sm text-[#101014]/70">
                <span>{p.emoji}</span> {p.label}
              </div>
            ))}
          </div>
          <p className="font-hanken text-sm text-[#101014]/40 text-center mt-5">
            Queer ou allié·e · Basé·e en France ou ailleurs · Débutant·e ou pro
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto">

          {done ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#2323C4]/15 flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-[#2323C4]" />
              </div>
              <h2 className="font-fraunces text-3xl mb-3">Demande reçue ✦</h2>
              <p className="font-hanken text-[#101014]/55 mb-8 leading-relaxed max-w-sm mx-auto">
                Merci {form.name.split(" ")[0]} ! On revient vers toi avant le 26 juin.
                Prépare-toi · la communauté t&apos;attend.
              </p>
              <Link href="/"
                className="inline-flex items-center gap-2 font-hanken text-sm text-[#FF2DA0] hover:text-[#FF2DA0]/80 transition-colors">
                ← Retour à l&apos;accueil
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="font-fraunces text-3xl mb-3">
                  Dis-nous qui tu es <Sparkles size={20} className="inline text-[#FFD400]" />
                </h2>
                <p className="font-hanken text-sm text-[#101014]/45">
                  On prend le temps de lire chaque demande. Pas de robot, pas de filtre arbitraire.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] tracking-wide text-[#101014]/35 mb-2">Prénom & Nom *</label>
                    <input value={form.name} onChange={f("name")} placeholder="Sasha Martin" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-wide text-[#101014]/35 mb-2">Email *</label>
                    <input type="email" value={form.email} onChange={f("email")} placeholder="sasha@email.com" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-wide text-[#101014]/35 mb-2">Ton activité *</label>
                  <select value={form.activity_type} onChange={f("activity_type")} className={inputCls}>
                    <option value="" className="bg-[#FBFAF8]">Sélectionner…</option>
                    {ACTIVITY_TYPES.map(a => (
                      <option key={a.value} value={a.value} className="bg-[#FBFAF8]">{a.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-wide text-[#101014]/35 mb-2">Présente-toi en quelques mots</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={f("description")}
                    placeholder="Je crée des bijoux queer à Paris depuis 3 ans, je vends sur Instagram mais je cherche une communauté qui me correspond vraiment…"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] tracking-wide text-[#101014]/35 mb-2">Instagram</label>
                    <input value={form.instagram} onChange={f("instagram")} placeholder="@ton_compte" className={inputCls} />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-wide text-[#101014]/35 mb-2">Site web</label>
                    <input value={form.website} onChange={f("website")} placeholder="monsite.fr" className={inputCls} />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group pt-1">
                  <input
                    type="checkbox"
                    checked={form.is_queer}
                    onChange={e => setForm(p => ({ ...p, is_queer: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded accent-[#FF2DA0]"
                  />
                  <span className="font-hanken text-sm text-[#101014]/55 group-hover:text-[#101014]/75 transition-colors leading-relaxed">
                    Je m&apos;identifie comme queer ou allié·e de la communauté LGBTQ+
                  </span>
                </label>

                {error && (
                  <div role="alert" className="font-hanken text-sm text-red-400 bg-red-400/8 border border-red-400/20 rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#FF2DA0] text-white font-hanken font-semibold text-base hover:bg-[#FF2DA0]/85 hover:scale-[1.01] transition-all duration-200 shadow-lg shadow-[#FF2DA0]/20 disabled:opacity-50 disabled:scale-100 mt-2"
                >
                  {sending ? "Envoi en cours…" : <>Rejoindre Spectrum <ArrowRight size={16} /></>}
                </button>

                <p className="font-hanken text-xs text-[#101014]/25 text-center">
                  On ne partage jamais tes données. Réponse garantie avant le 26 juin.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Already a vendor? */}
      <section className="py-10 px-6 border-t border-[#101014]/6">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-hanken text-sm text-[#101014]/40 mb-3">
            Tu veux ouvrir ta boutique directement ?
          </p>
          <Link href="/vendeur/onboarding"
            className="inline-flex items-center gap-2 font-hanken text-sm text-[#FF2DA0] hover:text-[#FF2DA0]/80 transition-colors">
            Ouvrir ma boutique maintenant <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
