"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Copy, Check, TrendingUp, Users, Euro } from "lucide-react";

type Ambassador = {
  id: string; referral_code: string; commission_rate: number;
  total_earnings: number; status: string;
};
type Referral = { id: string; commission_amount: number; status: string; created_at: string; };

function generateCode(userId: string) {
  return "SFU-" + userId.slice(0, 6).toUpperCase();
}

export default function AmbassadeursPage() {
  const { user } = useAuth();
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const supabase = createClient();
    supabase.from("ambassadors").select("*").eq("user_id", user.id).single()
      .then(({ data }) => {
        setAmbassador(data);
        if (data) {
          supabase.from("referrals").select("*").eq("ambassador_id", data.id).order("created_at", { ascending: false })
            .then(({ data: r }) => setReferrals(r ?? []));
        }
        setLoading(false);
      });
  }, [user]);

  const joinProgram = async () => {
    if (!user) return;
    setJoining(true);
    const supabase = createClient();
    const { data } = await supabase.from("ambassadors").insert({
      user_id: user.id,
      referral_code: generateCode(user.id),
      status: "active",
    }).select().single();
    setAmbassador(data);
    setJoining(false);
  };

  const copyCode = () => {
    if (!ambassador) return;
    navigator.clipboard.writeText(`https://spectrumforus.com?ref=${ambassador.referral_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#3D1F5C] text-[#F3EADB]">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-widest text-[#E0337E] uppercase mb-4">Programme Ambassadeur·rice</p>
        <h1 className="font-fraunces text-5xl md:text-6xl font-light mb-4">
          Partage. Gagne.<br /><span className="text-[#E0337E]">Fais grandir</span> la communauté.
        </h1>
        <p className="font-hanken text-[#F3EADB]/60 text-lg mb-8">
          Partage Spectrum For Us et touche <strong className="text-[#F3EADB]">10% de commission</strong> sur chaque vente générée via ton lien.
        </p>

        {/* Comment ça marche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
          {[
            { step: "01", title: "Rejoins le programme", desc: "Crée ton compte ambassadeur·rice gratuitement." },
            { step: "02", title: "Partage ton lien", desc: "Sur tes réseaux, à ta communauté, partout." },
            { step: "03", title: "Touche ta commission", desc: "10% sur chaque achat via ton lien unique." },
          ].map(s => (
            <div key={s.step} className="p-5 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02]">
              <span className="font-mono text-3xl font-bold text-[#E0337E]/30">{s.step}</span>
              <h3 className="font-fraunces text-lg mt-2 mb-1">{s.title}</h3>
              <p className="font-hanken text-sm text-[#F3EADB]/50">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard ambassadeur */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="h-32 rounded-2xl bg-[#F3EADB]/5 animate-pulse" />
        ) : !user ? (
          <div className="text-center p-8 rounded-2xl border border-[#F3EADB]/10">
            <p className="font-hanken text-[#F3EADB]/60 mb-4">Connecte-toi pour rejoindre le programme.</p>
            <Button href="/auth?mode=ambassador">Se connecter</Button>
          </div>
        ) : !ambassador ? (
          <div className="text-center p-8 rounded-2xl border border-[#E0337E]/20 bg-[#E0337E]/5">
            <h2 className="font-fraunces text-2xl mb-2">Prêt·e à rejoindre ?</h2>
            <p className="font-hanken text-[#F3EADB]/60 mb-6">Ton code personnalisé sera créé instantanément.</p>
            <Button onClick={joinProgram} disabled={joining}>
              {joining ? "Création…" : "Rejoindre le programme →"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Euro, label: "Gains totaux", value: `${ambassador.total_earnings.toFixed(2)}€` },
                { icon: Users, label: "Parrainages", value: String(referrals.length) },
                { icon: TrendingUp, label: "Commission", value: `${(ambassador.commission_rate * 100).toFixed(0)}%` },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl border border-[#F3EADB]/8 text-center">
                  <s.icon size={18} className="text-[#E0337E] mx-auto mb-2" />
                  <p className="font-fraunces text-xl">{s.value}</p>
                  <p className="font-mono text-[10px] text-[#F3EADB]/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Code */}
            <div className="p-5 rounded-2xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.02]">
              <p className="font-mono text-xs text-[#F3EADB]/40 uppercase tracking-widest mb-2">Ton lien ambassadeur·rice</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 font-mono text-sm text-[#E0337E] bg-[#E0337E]/5 px-3 py-2 rounded-lg truncate">
                  spectrumforus.com?ref={ambassador.referral_code}
                </code>
                <button
                  onClick={copyCode}
                  className="p-2 rounded-lg border border-[#F3EADB]/10 text-[#F3EADB]/60 hover:text-[#E0337E] hover:border-[#E0337E]/30 transition-all"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Referrals */}
            {referrals.length > 0 && (
              <div className="rounded-2xl border border-[#F3EADB]/8 overflow-hidden">
                <div className="p-4 border-b border-[#F3EADB]/8">
                  <h3 className="font-fraunces text-lg">Historique des parrainages</h3>
                </div>
                <div className="divide-y divide-[#F3EADB]/5">
                  {referrals.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-hanken text-sm">{new Date(r.created_at).toLocaleDateString("fr-FR")}</p>
                        <p className="font-mono text-[10px] text-[#F3EADB]/40">{r.status}</p>
                      </div>
                      <span className="font-mono text-sm text-[#E0337E]">+{r.commission_amount.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
