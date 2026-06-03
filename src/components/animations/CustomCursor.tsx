"use client";
import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const haloPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

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
      haloPos.current.x += (pos.current.x - haloPos.current.x) * 0.1;
      haloPos.current.y += (pos.current.y - haloPos.current.y) * 0.1;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate(${haloPos.current.x - 20}px, ${haloPos.current.y - 20}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(
        !!(t.closest("a") || t.closest("button") || t.closest("[data-cursor-hover]"))
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full bg-[#E0337E] mix-blend-difference transition-transform duration-75"
        style={{ willChange: "transform" }}
      />
      {/* Halo */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full transition-all duration-200"
        style={{
          width: hovering ? 56 : 40,
          height: hovering ? 56 : 40,
          marginLeft: hovering ? -8 : 0,
          marginTop: hovering ? -8 : 0,
          background: clicking
            ? "radial-gradient(circle, rgba(224,51,126,0.25) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(110,45,181,0.12) 0%, transparent 70%)",
          boxShadow: hovering
            ? "0 0 0 1px rgba(224,51,126,0.3)"
            : "none",
          willChange: "transform",
          transform: `translate(${haloPos.current.x - 20}px, ${haloPos.current.y - 20}px)`,
        }}
      />
    </>
  );
}
