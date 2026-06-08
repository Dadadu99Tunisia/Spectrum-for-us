"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { track } from "@/lib/track";

const T = { ink: "#1A1612", line: "#ECE6DB", mag: "#FF3D7F" };

/**
 * NewsletterForm · capture réelle d'e-mails (table newsletter_subscribers via
 * /api/newsletter). Remplace les faux formulaires mailto. Construit l'audience.
 */
export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading"); setMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source }),
      });
      const json = await res.json();
      if (res.ok) { setState("ok"); setEmail(""); track("newsletter_subscribe", { source }); }
      else { setState("error"); setMsg(json.error ?? "Erreur"); }
    } catch {
      setState("error"); setMsg("Erreur réseau");
    }
  };

  if (state === "ok") {
    return (
      <div className="flex items-center gap-2 rounded-full px-5 py-3 w-full md:w-auto"
        style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }}>
        <Check size={16} style={{ color: T.mag }} />
        <span className="font-hanken text-[14px]">{t("footer.subscribed") || "Inscription confirmée, merci !"}</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-1 w-full md:w-auto">
      <div className="flex items-center gap-2">
        <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder={t("footer.email_placeholder")}
          className="flex-1 md:w-64 rounded-full px-5 py-3 text-[14px] outline-none"
          style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }} />
        <button type="submit" disabled={state === "loading"}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-5 py-3 font-semibold text-[14px] text-white disabled:opacity-60"
          style={{ background: T.ink }}>
          {state === "loading" ? "…" : t("footer.subscribe")} <ArrowRight size={15} />
        </button>
      </div>
      {state === "error" && <span className="font-hanken text-[12px] px-2" style={{ color: "#c0392b" }}>{msg}</span>}
    </form>
  );
}
