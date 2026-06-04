"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { Button } from "@/components/ui/Button";
import { Users, Shield, Eye, Zap } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const ARGS = [
  {
    icon: Users,
    title: "Communauté engagée",
    desc: "Accède directement à une audience qui cherche ce que tu crées.",
    color: "#E0337E",
  },
  {
    icon: Shield,
    title: "Safe space garanti",
    desc: "Modération active, charte communautaire, zéro tolérance pour la haine.",
    color: "#1C9C95",
  },
  {
    icon: Eye,
    title: "Visibilité offerte",
    desc: "Mise en avant éditoriale, newsletter, réseaux : ton travail mérite d'être vu.",
    color: "#6D2DB5",
  },
  {
    icon: Zap,
    title: "Lancez-vous en 10 min",
    desc: "Boutique en ligne, outils simples. Pas de tech, pas de fric, juste toi.",
    color: "#E0901E",
  },
];

export function VendreIci() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const { t } = useI18n();

  return (
    <section ref={ref} id="vendre" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative rounded-3xl border border-[#F3EADB]/10 bg-[#F3EADB]/[0.025] p-8 md:p-14 overflow-hidden transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)" }}
        >
          {/* Background glow */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: "#E0337E" }}
          />
          <div className="prism-line absolute top-0 left-0 right-0" />

          <div className="relative z-10">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-4">
              {t("vendre_ici.eyebrow")}
            </span>
            <h2 className="font-fraunces text-3xl md:text-5xl text-[#F3EADB] leading-tight mb-3">
              {t("vendre_ici.title")}{" "}
              <span className="italic text-[#F2B79E]">{t("vendre_ici.title_em")}</span>
            </h2>
            <p className="font-hanken text-[#F3EADB]/60 text-lg mb-12 max-w-xl">
              {t("vendre_ici.subtitle")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {ARGS.map((arg, i) => {
                const Icon = arg.icon;
                return (
                  <div
                    key={arg.title}
                    className="flex gap-4 transition-all duration-700"
                    style={{
                      opacity: inView ? 1 : 0,
                      transitionDelay: `${i * 80 + 200}ms`,
                      transform: inView ? "none" : "translateY(16px)",
                    }}
                  >
                    <div
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${arg.color}18` }}
                    >
                      <Icon size={18} style={{ color: arg.color }} />
                    </div>
                    <div>
                      <h3 className="font-bricolage font-semibold text-[#F3EADB] text-base mb-1">
                        {arg.title}
                      </h3>
                      <p className="font-hanken text-sm text-[#F3EADB]/55 leading-relaxed">
                        {arg.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" href="/vendeur/onboarding" className="text-base px-8 py-3.5">
                {t("vendre_ici.cta_open")}
              </Button>
              <Button variant="secondary" href="/vendre" className="text-base px-8 py-3.5">
                {t("vendre_ici.cta_more")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
