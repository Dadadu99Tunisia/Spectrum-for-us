"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = true }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative rounded-[18px] border border-[#1A1612]/10 bg-[#1A1612]/[0.03] overflow-hidden transition-all duration-300",
        hoverable && "cursor-pointer",
        hovered && hoverable && "border-[#1A1612]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] -translate-y-1",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Prism top line */}
      <div className="prism-line absolute top-0 left-0 right-0 opacity-70" />

      {/* Chromatic glint on hover */}
      {hoverable && hovered && (
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: "linear-gradient(135deg, #FF3D7F 0%, transparent 50%, #1C9C95 100%)",
          }}
        />
      )}

      {children}
    </div>
  );
}
