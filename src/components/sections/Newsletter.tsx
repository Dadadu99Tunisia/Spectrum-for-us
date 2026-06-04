"use client";
import { useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export function Newsletter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else setError(data.error || t("newsletter.error"));
    } catch {
      setError(t("newsletter.error"));
    }
  };

  return (
    <section ref={ref} className="py-24 px-6 bg-[#F3EADB]/[0.02]">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-4">
            {t("newsletter.eyebrow")}
          </span>
          <h2 className="font-fraunces text-3xl md:text-4xl text-[#F3EADB] leading-tight mb-4">
            {t("newsletter.title")}{" "}
            <span className="prism-text">{t("newsletter.title_em")}</span>
          </h2>
          <p className="font-hanken text-[#F3EADB]/60 mb-10 text-lg">
            {t("newsletter.subtitle")}
          </p>
        </div>

        <div
          className="transition-all duration-700 delay-200"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-3 py-4 text-[#1C9C95]">
              <Check size={20} />
              <span className="font-hanken text-lg">
                {t("newsletter.success")}
              </span>
            </div>
          ) : (
            <>
            {error && <p className="font-hanken text-sm text-red-400 mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter.placeholder")}
                className="flex-1 bg-[#F3EADB]/5 border border-[#F3EADB]/15 rounded-full px-5 py-3 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/30 focus:outline-none focus:border-[#E0337E]/60 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center gap-2 px-5 py-3 bg-[#E0337E] text-[#F3EADB] rounded-full font-hanken font-semibold text-sm hover:brightness-110 transition-all duration-200 active:scale-95"
              >
                {t("newsletter.cta")}
                <ArrowRight size={14} />
              </button>
            </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
