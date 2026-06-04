"use client";
import { useRef, useEffect, useState } from "react";
import { useInView } from "@/lib/useInView";
import { useSiteContent } from "@/lib/useSiteContent";

function useCMS(key: string, fallback: string) {
  const { value } = useSiteContent(key);
  return value ?? fallback;
}

// ── Animated counter ──────────────────────────────────────
function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1800,
  inView,
}: {
  value: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  inView: boolean;
}) {
  const [display, setDisplay] = useState("0");
  const started = useRef(false);

  // Try to parse a numeric target
  const numericMatch = value.match(/[\d.]+/);
  const numericTarget = numericMatch ? parseFloat(numericMatch[0]) : null;
  const isNumeric = numericTarget !== null && !isNaN(numericTarget);

  useEffect(() => {
    if (!inView || started.current || !isNumeric) {
      if (!isNumeric) setDisplay(value);
      return;
    }
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * numericTarget!;

      if (Number.isInteger(numericTarget)) {
        setDisplay(Math.round(current).toString());
      } else {
        setDisplay(current.toFixed(1));
      }

      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, isNumeric, numericTarget, duration, value]);

  return (
    <span>
      {prefix}{display}{suffix}
    </span>
  );
}

export function Manifeste() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  const eyebrow      = useCMS("manifeste_eyebrow",      "Notre manifeste");
  const title        = useCMS("manifeste_title",        "Cultiver les différences pour une société");
  const titleItalic  = useCMS("manifeste_title_italic", "plus ouverte.");
  const p1           = useCMS("manifeste_p1",           "La communauté queer représente la <strong>4ᵉ économie mondiale</strong>. Pourtant, presque aucune marketplace ne lui est réellement dédiée — ni pensée par elle, ni construite pour elle.");
  const p2           = useCMS("manifeste_p2",           "Spectrum For Us est cet espace. Un lieu où chaque achat est un geste de soin envers quelqu'un·e de ta communauté. Où chaque création porte une histoire vraie. Où appartenir est suffisant pour être ici.");
  const p3           = useCMS("manifeste_p3",           "Pas un site marchand. Un <strong>refuge prismatique</strong> — ouvert, tenu, traversé de lumière.");

  const stats = [
    { num: "4",    suffix: "ème", label: useCMS("manifeste_stat1_label", "économie mondiale") },
    { num: "100",  suffix: "%",   label: useCMS("manifeste_stat2_label", "communautaire") },
    { num: "3",    suffix: "",    label: useCMS("manifeste_stat3_label", "types d'offres") },
    { num: "Safe", suffix: "",    label: useCMS("manifeste_stat4_label", "space garanti") },
  ];

  return (
    <section
      ref={ref}
      id="manifeste"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Left prism accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          background: "linear-gradient(180deg, #E0533A, #E0901E, #CF3F7C, #6D2DB5, #1C9C95)",
        }}
      />

      <div className="max-w-3xl mx-auto">
        <span
          className="font-mono text-[11px] tracking-widest uppercase text-[#E0337E] block mb-8 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {eyebrow}
        </span>

        <h2
          className="font-fraunces text-4xl md:text-5xl lg:text-6xl text-[#F3EADB] leading-[1.05] mb-10 transition-all duration-700 delay-100"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {title}{" "}
          <span className="italic text-[#F2B79E]">{titleItalic}</span>
        </h2>

        <div
          className="space-y-5 text-[#F3EADB]/70 text-lg leading-relaxed transition-all duration-700 delay-200"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: p1 }} />
          <p dangerouslySetInnerHTML={{ __html: p2 }} />
          <p dangerouslySetInnerHTML={{ __html: p3 }} />
        </div>

        {/* Stats with animated counters */}
        <div
          className="mt-12 pt-8 border-t border-[#F3EADB]/10 flex flex-wrap gap-8 transition-all duration-700 delay-400"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {stats.map(({ num, suffix, label }, i) => (
            <div key={label} style={{ transitionDelay: `${400 + i * 80}ms` }}>
              <div className="font-fraunces text-3xl text-[#E0337E] leading-none tabular-nums">
                <AnimatedCounter
                  value={num}
                  suffix={suffix}
                  duration={1600 + i * 200}
                  inView={inView}
                />
              </div>
              <div className="font-mono text-xs tracking-wide text-[#F3EADB]/40 uppercase mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
