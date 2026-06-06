"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useSiteContent } from "@/lib/useSiteContent";

function useCMS(key: string, fallback: string) {
  const { value } = useSiteContent(key);
  return value ?? fallback;
}

// ── Glitch text wrapper ──────────────────────────────────
function GlitchText({ text, className }: { text: string; className?: string }) {
  const [active, setActive] = useState(false);

  return (
    <span
      className={`glitch-wrapper ${active ? "is-glitching" : ""} ${className ?? ""}`}
      data-text={text}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {text}
    </span>
  );
}

export function Hero() {
  const [phase, setPhase] = useState<"line" | "prism" | "parens" | "text" | "done">("line");
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Intro animation sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("prism"), 300);
    const t2 = setTimeout(() => setPhase("parens"), 800);
    const t3 = setTimeout(() => setPhase("text"), 1300);
    const t4 = setTimeout(() => setPhase("done"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  // Mouse spotlight
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!spotlightRef.current) return;
    const rect = sectionRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(circle 500px at ${x}px ${y}px, rgba(110,45,181,0.22) 0%, rgba(110,45,181,0.06) 40%, transparent 70%)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.background =
      "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(110,45,181,0.18) 0%, transparent 70%)";
  }, []);

  const description = useCMS("hero_description", "Parce que nos mains créent, nos voix existent, et nos histoires ont une valeur. Un espace construit par et pour la communauté queer.");
  const btn1Label   = useCMS("hero_btn1_label", "Découvrir les créations");
  const btn1Url     = useCMS("hero_btn1_url", "/decouvrir");
  const btn2Label   = useCMS("hero_btn2_label", "Rejoindre le mouvement");
  const btn2Url     = useCMS("hero_btn2_url", "/rejoindre");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Dynamic spotlight — follows cursor */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none transition-[background] duration-300"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(110,45,181,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Animated intro line */}
      <div className="relative flex flex-col items-center gap-0 select-none mb-2" aria-hidden>
        <div
          className="h-px transition-all duration-500 ease-out"
          style={{
            width: phase === "line" ? "4px" : phase === "prism" ? "220px" : "0px",
            background: "linear-gradient(90deg, #E0533A, #E0901E, #CF3F7C, #6D2DB5, #1C9C95)",
            opacity: phase === "line" || phase === "prism" ? 1 : 0,
            transitionDuration: phase === "prism" ? "500ms" : "300ms",
          }}
        />
      </div>

      {/* Main heading */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1
          className="font-fraunces leading-[0.92] mb-6"
          style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
        >
          <span
            className="block text-[#F3EADB] transition-all duration-700"
            style={{
              opacity: phase === "parens" || phase === "text" || phase === "done" ? 1 : 0,
              transform: phase === "parens" || phase === "text" || phase === "done" ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <GlitchText text="B" />
            <span className="transition-colors duration-500" style={{ color: "#E0337E" }}>(u)</span>
            <GlitchText text="y us," />
          </span>
          <span
            className="block text-[#F3EADB] transition-all duration-700 delay-200"
            style={{
              opacity: phase === "text" || phase === "done" ? 1 : 0,
              transform: phase === "text" || phase === "done" ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <GlitchText text="for us." />
          </span>
        </h1>

        <p
          className="font-hanken text-lg md:text-xl text-[#F3EADB]/70 max-w-xl mx-auto mb-10 transition-all duration-700 delay-300"
          style={{
            opacity: phase === "done" ? 1 : 0,
            transform: phase === "done" ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {description}
        </p>

        <div
          className="flex flex-wrap gap-4 justify-center transition-all duration-700 delay-500"
          style={{
            opacity: phase === "done" ? 1 : 0,
            transform: phase === "done" ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <Button variant="primary" href={btn1Url} className="text-base px-8 py-3.5">
            {btn1Label}
          </Button>
          <Button variant="secondary" href={btn2Url} className="text-base px-8 py-3.5">
            {btn2Label}
          </Button>
          <Button variant="ghost" href="/vendre"
            className="text-base px-8 py-3.5 border border-[#F3EADB]/15 text-[#F3EADB]/60 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5 rounded-2xl font-hanken">
            Vendre ici
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700 delay-[1200ms]"
        style={{
          opacity: phase === "done" ? 0.5 : 0,
        }}
      >
        <p className="font-mono text-[10px] tracking-wide text-[#F3EADB]/40">
          Ce n&apos;est pas juste une marketplace
        </p>
        <div className="w-px h-8 bg-gradient-to-b from-[#F3EADB]/20 to-transparent animate-pulse" />
      </div>

    </section>
  );
}
