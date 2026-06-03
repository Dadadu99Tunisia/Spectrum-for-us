"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "vendor" ? "signup" : (searchParams.get("mode") as "login" | "signup") ?? "login";
  const redirect = searchParams.get("redirect") ?? "/";
  const asVendor = searchParams.get("mode") === "vendor";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials"
          ? "E-mail ou mot de passe incorrect."
          : error.message);
      } else {
        router.push(redirect);
        router.refresh();
      }
    } else {
      if (password.length < 8) { setError("Le mot de passe doit faire 8 caractères minimum."); setLoading(false); return; }
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: {
            pseudo: pseudo.trim() || email.split("@")[0],
            pronouns: pronouns.trim(),
            wants_vendor: asVendor,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
      else setSuccess("Vérifie ton e-mail pour confirmer ton compte. Pense à regarder tes spams ! ✦");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1C0E29] flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(110,45,181,0.15) 0%, transparent 70%)"
      }} />

      <div className="relative z-10 w-full max-w-md">
        <a href="/" className="inline-flex items-center gap-2 text-[#F3EADB]/40 hover:text-[#F3EADB] text-sm font-hanken mb-8 transition-colors">
          <ArrowLeft size={14} /> Retour à l&apos;accueil
        </a>

        <div className="text-center mb-8">
          <span className="font-fraunces text-3xl text-[#F3EADB]">B<span className="text-[#E0337E]">(u)</span>y us</span>
          {asVendor && (
            <p className="font-hanken text-sm text-[#F2B79E] mt-2">Devenir créateur·rice sur Spectrum</p>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-full border border-[#F3EADB]/15 p-1 mb-8" role="tablist">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-hanken font-medium transition-all duration-200 ${
                mode === m ? "bg-[#E0337E] text-[#F3EADB]" : "text-[#F3EADB]/50 hover:text-[#F3EADB]"
              }`}
            >
              {m === "login" ? "Se connecter" : "Créer un compte"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "signup" && (
            <>
              <div>
                <label htmlFor="pseudo" className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">Pseudo *</label>
                <input id="pseudo" type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)}
                  placeholder="ton_pseudo"
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
              </div>
              <div>
                <label htmlFor="pronouns" className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">
                  Pronoms <span className="normal-case tracking-normal text-[#F3EADB]/20">(facultatif)</span>
                </label>
                <input id="pronouns" type="text" value={pronouns} onChange={(e) => setPronouns(e.target.value)}
                  placeholder="il/lui, elle, iel…"
                  className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">E-mail *</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
          </div>

          <div>
            <label htmlFor="password" className="block font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/40 mb-2">Mot de passe *</label>
            <div className="relative">
              <input id="password" type={showPw ? "text" : "password"} required autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "8 caractères minimum" : "••••••••"}
                className="w-full bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-xl px-4 py-3 pr-12 text-[#F3EADB] font-hanken text-sm placeholder-[#F3EADB]/25 focus:outline-none focus:border-[#E0337E]/60 transition-colors" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EADB]/30 hover:text-[#F3EADB]/60 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-400 font-hanken bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="text-sm text-[#1C9C95] font-hanken bg-[#1C9C95]/10 border border-[#1C9C95]/20 rounded-xl px-4 py-3">
              {success}
            </div>
          )}

          <Button variant="primary" className="w-full py-3.5 text-base mt-2" disabled={loading} type="submit">
            {loading
              ? "Chargement…"
              : mode === "login"
              ? "Se connecter"
              : asVendor ? "Créer mon compte vendeur" : "Créer mon compte"}
          </Button>
        </form>

        {mode === "login" && (
          <p className="text-center mt-4 font-hanken text-sm text-[#F3EADB]/40">
            Pas encore de compte ?{" "}
            <button onClick={() => setMode("signup")} className="text-[#E0337E] hover:underline">S&apos;inscrire</button>
          </p>
        )}

        {mode === "signup" && (
          <p className="text-center mt-5 text-xs font-hanken text-[#F3EADB]/25 leading-relaxed max-w-sm mx-auto">
            En créant un compte, tu acceptes notre{" "}
            <a href="/charte" className="text-[#F3EADB]/40 hover:text-[#E0337E] transition-colors">charte communautaire</a>{" "}
            et nos <a href="/cgu" className="text-[#F3EADB]/40 hover:text-[#E0337E] transition-colors">CGU</a>.
            Tes données sensibles sont protégées (RGPD).
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
