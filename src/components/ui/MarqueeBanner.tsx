"use client";

const DEFAULT_ITEMS = [
  "✦ Queer art",
  "◈ Fait avec amour",
  "✦ Mode non-genrée",
  "◈ Safe space garanti",
  "✦ Créateur·ices indépendant·es",
  "◈ B(u)y us, for us",
  "✦ Tout le spectre",
  "◈ Communauté LGBTQIA+",
  "✦ Art & culture queer",
  "◈ Première marketplace queer FR",
];

interface MarqueeBannerProps {
  items?: string[];
  className?: string;
  speed?: "slow" | "normal" | "fast";
  reverse?: boolean;
  variant?: "default" | "minimal" | "bold";
}

export function MarqueeBanner({
  items = DEFAULT_ITEMS,
  className = "",
  speed = "normal",
  reverse = false,
  variant = "default",
}: MarqueeBannerProps) {
  const duration = speed === "slow" ? "40s" : speed === "fast" ? "18s" : "28s";

  const variantStyles = {
    default: "py-3.5 border-y border-[#1A1612]/8 bg-[#1A1612]/[0.02]",
    minimal: "py-2.5",
    bold: "py-4 border-y-2 border-[#FF3D7F]/20 bg-[#FF3D7F]/[0.03]",
  };

  const textStyles = {
    default: "font-mono text-[11px] tracking-widest uppercase text-[#1A1612]/40",
    minimal: "font-mono text-[10px] tracking-widest uppercase text-[#1A1612]/25",
    bold: "font-hanken text-sm font-medium text-[#1A1612]/60",
  };

  const accentStyles = {
    default: "text-[#FF3D7F]/60",
    minimal: "text-[#FF3D7F]/40",
    bold: "text-[#FF3D7F]",
  };

  const doubled = [...items, ...items];

  return (
    <div
      className={`overflow-hidden select-none ${variantStyles[variant]} ${className}`}
      aria-hidden="true"
    >
      <div
        className="marquee-track"
        style={{
          animationDuration: duration,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((item, i) => {
          const [symbol, ...rest] = item.split(" ");
          return (
            <span
              key={i}
              className={`flex-shrink-0 flex items-center gap-3 px-6 ${textStyles[variant]}`}
            >
              <span className={accentStyles[variant]}>{symbol}</span>
              {rest.join(" ")}
            </span>
          );
        })}
      </div>
    </div>
  );
}
