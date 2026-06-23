"use client";
import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const CONTENT = {
  fr: {
    resetSuccess: "Vérifie ton e-mail · un lien de réinitialisation t'a été envoyé ✦",
    invalidCredentials: "E-mail ou mot de passe incorrect.",
    passwordTooShort: "Le mot de passe doit faire 8 caractères minimum.",
    signupSuccess: "Compte créé ! Connecte-toi pour continuer. ✦",
    backHome: "Retour à l'accueil",
    vendorSub: "Devenir créateur·rice sur Spectrum",
    tabLogin: "Se connecter",
    tabSignup: "Créer un compte",
    backToLogin: "Retour à la connexion",
    forgotTitle: "Mot de passe oublié",
    forgotSub: "Entre ton e-mail, on t'envoie un lien de réinitialisation.",
    emailLabel: "E-mail *",
    emailPlaceholder: "ton@email.com",
    pseudoLabel: "Pseudo *",
    pseudoPlaceholder: "ton_pseudo",
    pronounsLabel: "Pronoms",
    pronounsOptional: "(facultatif)",
    pronounsPlaceholder: "il/lui, elle, iel…",
    passwordLabel: "Mot de passe *",
    forgotLink: "Mot de passe oublié ?",
    passwordSignupPlaceholder: "8 caractères minimum",
    passwordLoginPlaceholder: "••••••••",
    hidePassword: "Masquer le mot de passe",
    showPassword: "Afficher le mot de passe",
    loading: "Chargement…",
    sendLink: "Envoyer le lien",
    submitLogin: "Se connecter",
    submitVendor: "Créer mon compte créateur·rice",
    submitSignup: "Créer mon compte",
    or: "ou",
    google: "Continuer avec Google",
    noAccount: "Pas encore de compte ?",
    signUpInline: "S'inscrire",
    termsPrefix: "En créant un compte, tu acceptes notre ",
    termsCharter: "charte communautaire",
    termsMiddle: " et nos ",
    termsCgu: "CGU",
    termsSuffix: ". Tes données sensibles sont protégées (RGPD).",
  },
  en: {
    resetSuccess: "Check your e-mail · a reset link is on its way to you ✦",
    invalidCredentials: "Incorrect e-mail or password.",
    passwordTooShort: "Your password must be at least 8 characters.",
    signupSuccess: "Account created! Log in to continue. ✦",
    backHome: "Back to home",
    vendorSub: "Become a creator on Spectrum",
    tabLogin: "Log in",
    tabSignup: "Sign up",
    backToLogin: "Back to login",
    forgotTitle: "Forgot your password",
    forgotSub: "Enter your e-mail and we'll send you a reset link.",
    emailLabel: "E-mail *",
    emailPlaceholder: "you@email.com",
    pseudoLabel: "Username *",
    pseudoPlaceholder: "your_username",
    pronounsLabel: "Pronouns",
    pronounsOptional: "(optional)",
    pronounsPlaceholder: "he/him, she/her, they…",
    passwordLabel: "Password *",
    forgotLink: "Forgot your password?",
    passwordSignupPlaceholder: "8 characters minimum",
    passwordLoginPlaceholder: "••••••••",
    hidePassword: "Hide password",
    showPassword: "Show password",
    loading: "Loading…",
    sendLink: "Send the link",
    submitLogin: "Log in",
    submitVendor: "Create my creator account",
    submitSignup: "Create my account",
    or: "or",
    google: "Continue with Google",
    noAccount: "Don't have an account yet?",
    signUpInline: "Sign up",
    termsPrefix: "By creating an account, you agree to our ",
    termsCharter: "community charter",
    termsMiddle: " and our ",
    termsCgu: "Terms",
    termsSuffix: ". Your sensitive data is protected (GDPR).",
  },
} as const;

function AuthForm() {
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "vendor" ? "signup" : (searchParams.get("mode") as "login" | "signup") ?? "login";
  const redirect = searchParams.get("redirect") ?? "/";
  const asVendor = searchParams.get("mode") === "vendor";

  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
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

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/compte`,
      });
      if (error) setError(error.message);
      else setSuccess(C.resetSuccess);
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials"
          ? C.invalidCredentials
          : error.message);
      } else {
        window.location.assign(redirect || "/");
      }
    } else {
      if (password.length < 8) { setError(C.passwordTooShort); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({
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
      if (error) { setError(error.message); }
      else {
        let session = data.session;
        // Pas de session = confirmation e-mail activée → on auto-confirme puis on connecte (avec reprise)
        if (!session && data.user) {
          await fetch("/api/auth/autoconfirm", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: data.user.id }),
          }).catch(() => {});
          for (let i = 0; i < 3 && !session; i++) {
            const { data: signed } = await supabase.auth.signInWithPassword({ email, password });
            session = signed.session ?? null;
            if (!session) await new Promise((r) => setTimeout(r, 500));
          }
        }
        if (session) {
          // Navigation complète (pas router.push) → la session est relue, pas de rebond du garde
          window.location.assign(asVendor ? "/vendeur/onboarding" : (redirect || "/"));
        } else {
          setSuccess(C.signupSuccess);
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(110,45,181,0.15) 0%, transparent 70%)"
      }} />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-[#101014]/40 hover:text-[#101014] text-sm font-hanken mb-8 transition-colors">
          <ArrowLeft size={14} /> {C.backHome}
        </Link>

        <div className="text-center mb-8">
          <span className="font-fraunces text-3xl text-[#101014]">B<span className="text-[#FF2DA0]">(u)</span>y us</span>
          {asVendor && (
            <p className="font-hanken text-sm text-[#FF2DA0] mt-2">{C.vendorSub}</p>
          )}
        </div>

        {/* Tab switcher */}
        {mode !== "reset" && (
          <div className="flex rounded-full border border-[#101014]/15 p-1 mb-8" role="tablist">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                className={`flex-1 py-2.5 rounded-full text-sm font-hanken font-medium transition-all duration-200 ${
                  mode === m ? "bg-[#FF2DA0] text-[#101014]" : "text-[#101014]/50 hover:text-[#101014]"
                }`}
              >
                {m === "login" ? C.tabLogin : C.tabSignup}
              </button>
            ))}
          </div>
        )}
        {mode === "reset" && (
          <div className="mb-8">
            <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className="flex items-center gap-2 text-[#101014]/40 hover:text-[#101014] text-sm font-hanken transition-colors">
              <ArrowLeft size={14} /> {C.backToLogin}
            </button>
            <h2 className="font-fraunces text-xl text-[#101014] mt-4">{C.forgotTitle}</h2>
            <p className="font-hanken text-sm text-[#101014]/50 mt-1">{C.forgotSub}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "reset" && (
            <div>
              <label htmlFor="email-reset" className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{C.emailLabel}</label>
              <input id="email-reset" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={C.emailPlaceholder}
                className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
            </div>
          )}
          {mode === "signup" && (
            <>
              <div>
                <label htmlFor="pseudo" className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{C.pseudoLabel}</label>
                <input id="pseudo" type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)}
                  placeholder={C.pseudoPlaceholder}
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
              <div>
                <label htmlFor="pronouns" className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">
                  {C.pronounsLabel} <span className="normal-case tracking-normal text-[#101014]/20">{C.pronounsOptional}</span>
                </label>
                <input id="pronouns" type="text" value={pronouns} onChange={(e) => setPronouns(e.target.value)}
                  placeholder={C.pronounsPlaceholder}
                  className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              </div>
            </>
          )}

          {mode !== "reset" && <div>
            <label htmlFor="email" className="block font-mono text-[10px] tracking-wide text-[#101014]/40 mb-2">{C.emailLabel}</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={C.emailPlaceholder}
              className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
          </div>}

          {mode !== "reset" && <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block font-mono text-[10px] tracking-wide text-[#101014]/40">{C.passwordLabel}</label>
              {mode === "login" && (
                <button type="button" onClick={() => { setMode("reset"); setError(""); setSuccess(""); }}
                  className="font-hanken text-[10px] text-[#101014]/30 hover:text-[#FF2DA0] transition-colors">
                  {C.forgotLink}
                </button>
              )}
            </div>
            <div className="relative">
              <input id="password" type={showPw ? "text" : "password"} required autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? C.passwordSignupPlaceholder : C.passwordLoginPlaceholder}
                className="w-full bg-[#101014]/5 border border-[#101014]/15 rounded-xl px-4 py-3 pr-12 text-[#101014] font-hanken text-sm placeholder-[#101014]/25 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? C.hidePassword : C.showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#101014]/30 hover:text-[#101014]/60 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>}

          {error && (
            <div role="alert" className="text-sm text-red-400 font-hanken bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="text-sm text-[#2323C4] font-hanken bg-[#2323C4]/10 border border-[#2323C4]/20 rounded-xl px-4 py-3">
              {success}
            </div>
          )}

          <Button variant="primary" className="w-full py-3.5 text-base mt-2" disabled={loading} type="submit">
            {loading
              ? C.loading
              : mode === "reset"
              ? C.sendLink
              : mode === "login"
              ? C.submitLogin
              : asVendor ? C.submitVendor : C.submitSignup}
          </Button>
        </form>

        {/* ── OAuth ── */}
        {mode !== "reset" && <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#101014]/10" />
            <span className="font-mono text-[10px] text-[#101014]/30 tracking-wide">{C.or}</span>
            <div className="flex-1 h-px bg-[#101014]/10" />
          </div>
          <button
            type="button"
            onClick={async () => {
              const { createClient } = await import("@/lib/supabase/client");
              await createClient().auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
              });
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#101014]/15 text-[#101014]/70 font-hanken text-sm hover:border-[#101014]/30 hover:text-[#101014] hover:bg-[#101014]/5 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583Z" fill="#EA4335"/>
            </svg>
            {C.google}
          </button>
        </div>}

        {mode === "login" && (
          <p className="text-center mt-4 font-hanken text-sm text-[#101014]/40">
            {C.noAccount}{" "}
            <button onClick={() => setMode("signup")} className="text-[#FF2DA0] hover:underline">{C.signUpInline}</button>
          </p>
        )}

        {mode === "signup" && (
          <p className="text-center mt-5 text-xs font-hanken text-[#101014]/25 leading-relaxed max-w-sm mx-auto">
            {C.termsPrefix}
            <a href="/legal/cgu" className="text-[#101014]/40 hover:text-[#FF2DA0] transition-colors">{C.termsCharter}</a>
            {C.termsMiddle}<a href="/legal/cgu" className="text-[#101014]/40 hover:text-[#FF2DA0] transition-colors">{C.termsCgu}</a>{C.termsSuffix}
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
