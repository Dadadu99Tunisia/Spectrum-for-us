"use client";
import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [text,     setText]     = useState<string | null>(null);
  const pos     = useRef({ x: -100, y: -100 });
  const haloPos = useRef({ x: -100, y: -100 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setVisible(true);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const animate = () => {
      const speed = hovering ? 0.08 : 0.12;
      haloPos.current.x += (pos.current.x - haloPos.current.x) * speed;
      haloPos.current.y += (pos.current.y - haloPos.current.y) * speed;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate(${haloPos.current.x - 20}px, ${haloPos.current.y - 20}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a") || t.closest("button") || t.closest("[data-cursor-hover]");
      setHovering(!!interactive);

      // Custom text label
      const label = (interactive as HTMLElement | null)?.getAttribute("data-cursor-label");
      setText(label ?? null);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("mouseover", onOver);
    };
  }, [hovering]);

  if (!visible) return null;

  const haloSize = clicking ? 24 : hovering ? 64 : 40;

  return (
    <>
      {/* Core dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full"
        style={{
          background: clicking ? "#F3EADB" : "#E0337E",
          boxShadow: clicking ? "0 0 8px 2px rgba(243,234,219,0.6)" : "0 0 6px 1px rgba(224,51,126,0.7)",
          transition: "background 0.15s, box-shadow 0.15s, transform 0.06s",
          willChange: "transform",
        }}
      />

      {/* Halo */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full flex items-center justify-center"
        style={{
          width: haloSize,
          height: haloSize,
          marginLeft: -(haloSize / 2 - 4),
          marginTop: -(haloSize / 2 - 4),
          background: clicking
            ? "radial-gradient(circle, rgba(243,234,219,0.18) 0%, transparent 70%)"
            : hovering
            ? "radial-gradient(circle, rgba(224,51,126,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(110,45,181,0.10) 0%, transparent 70%)",
          boxShadow: hovering
            ? `0 0 0 1px rgba(224,51,126,0.35), 0 0 20px rgba(224,51,126,0.1)`
            : "none",
          transition: "width 0.35s cubic-bezier(0.23,1,0.32,1), height 0.35s cubic-bezier(0.23,1,0.32,1), margin 0.35s cubic-bezier(0.23,1,0.32,1), background 0.2s, box-shadow 0.2s",
          willChange: "transform",
        }}
      >
        {/* Label text inside halo */}
        {text && hovering && (
          <span
            className="font-mono text-[9px] tracking-wide text-[#F3EADB]/70 text-center leading-tight pointer-events-none select-none"
            style={{ whiteSpace: "nowrap" }}
          >
            {text}
          </span>
        )}
      </div>
    </>
  );
}
