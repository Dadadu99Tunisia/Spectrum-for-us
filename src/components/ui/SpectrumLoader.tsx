"use client";

interface Props {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullscreen?: boolean;
}

const SIZES = {
  sm: { outer: 24, inner: 16, stroke: 2, text: "text-xs" },
  md: { outer: 40, inner: 28, stroke: 2.5, text: "text-sm" },
  lg: { outer: 64, inner: 44, stroke: 3, text: "text-base" },
};

export function SpectrumLoader({ size = "md", label, fullscreen = false }: Props) {
  const { outer, inner, stroke } = SIZES[size];
  const r = (outer / 2) - stroke;
  const circumference = 2 * Math.PI * r;

  const loader = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: outer, height: outer }}>
        {/* Background track */}
        <svg width={outer} height={outer} className="absolute inset-0">
          <circle
            cx={outer / 2} cy={outer / 2} r={r}
            fill="none"
            stroke="rgba(243,234,219,0.08)"
            strokeWidth={stroke}
          />
        </svg>

        {/* Animated prism arc */}
        <svg
          width={outer} height={outer}
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "1.2s", animationTimingFunction: "linear" }}
        >
          <defs>
            <linearGradient id="prism-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#F93C2C" />
              <stop offset="25%"  stopColor="#FF2DA0" />
              <stop offset="50%"  stopColor="#7A2BF0" />
              <stop offset="75%"  stopColor="#2323C4" />
              <stop offset="100%" stopColor="#F93C2C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx={outer / 2} cy={outer / 2} r={r}
            fill="none"
            stroke="url(#prism-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.7} ${circumference * 0.3}`}
            strokeDashoffset={0}
          />
        </svg>

        {/* Center ✦ */}
        <div
          className="absolute inset-0 flex items-center justify-center text-[#FF2DA0]"
          style={{ fontSize: inner * 0.5 }}
        >
          ✦
        </div>
      </div>

      {label && (
        <p className="font-mono text-[10px] tracking-wide text-[#101014]/30">
          {label}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-[#FBFAF8] flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
}
