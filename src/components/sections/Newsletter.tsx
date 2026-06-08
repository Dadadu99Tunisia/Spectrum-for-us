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
    <section ref={ref} className="py-24 px-6 bg-[#101014]/[0.02]">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <span className="font-mono text-[11px] tracking-wide text-[#FF2DA0] block mb-4">
            {t("newsletter.eyebrow")}
          </span>
          <h2 className="font-fraunces text-3xl md:text-4xl text-[#101014] leading-tight mb-4">
            {t("newsletter.title")}{" "}
            <span className="prism-text">{t("newsletter.title_em")}</span>
          </h2>
          <p className="font-hanken text-[#101014]/60 mb-10 text-lg">
            {t("newsletter.subtitle")}
          </p>
        </div>

        <div
          className="transition-all duration-700 delay-200"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-3 py-4 text-[#2323C4]">
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
                className="flex-1 bg-[#101014]/5 border border-[#101014]/15 rounded-full px-5 py-3 font-hanken text-sm text-[#101014] placeholder-[#101014]/30 focus:outline-none focus:border-[#FF2DA0]/60 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center gap-2 px-5 py-3 bg-[#FF2DA0] text-[#101014] rounded-full font-hanken font-semibold text-sm hover:brightness-110 transition-all duration-200 active:scale-95"
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
