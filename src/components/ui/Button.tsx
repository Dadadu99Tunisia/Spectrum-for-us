"use client";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  external?: boolean;
}

const base =
  "relative inline-flex items-center justify-center gap-2 font-hanken font-semibold text-sm tracking-wide transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D7F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF9F5] cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full px-8 py-3 bg-[#FF3D7F] text-white hover:brightness-110 active:scale-95",
  secondary:
    "rounded-full px-8 py-3 border border-[#1A1612]/40 text-[#1A1612] hover:border-[#1A1612] hover:bg-[#1A1612]/5",
  ghost:
    "px-4 py-2 text-[#1A1612]/70 hover:text-[#1A1612]",
};

export function Button({ variant = "primary", className, children, href, external, ...props }: ButtonProps) {
  const glintRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (variant !== "primary" || !glintRef.current) return;
    glintRef.current.style.animation = "none";
    glintRef.current.getBoundingClientRect();
    glintRef.current.style.animation = "glint 0.45s ease-out forwards";
  };

  const innerClass = cn(base, variants[variant], className);

  const inner = href ? (
    external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={innerClass} onMouseEnter={handleMouseEnter}>
        {variant === "primary" && (
          <span ref={glintRef} className="absolute inset-y-0 -left-4 w-8 bg-white/30 skew-x-[-15deg] pointer-events-none opacity-0" style={{ animation: "none" }} />
        )}
        {children}
      </a>
    ) : (
      <Link href={href} className={innerClass} onMouseEnter={handleMouseEnter}>
        {variant === "primary" && (
          <span ref={glintRef} className="absolute inset-y-0 -left-4 w-8 bg-white/30 skew-x-[-15deg] pointer-events-none opacity-0" style={{ animation: "none" }} />
        )}
        {children}
      </Link>
    )
  ) : (
    <button className={innerClass} onMouseEnter={handleMouseEnter} {...props}>
      {variant === "primary" && (
        <span ref={glintRef} className="absolute inset-y-0 -left-4 w-8 bg-white/30 skew-x-[-15deg] pointer-events-none opacity-0" style={{ animation: "none" }} />
      )}
      {children}
    </button>
  );

  return inner;
}
