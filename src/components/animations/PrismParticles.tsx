"use client";
import { useEffect, useRef } from "react";

const COLORS = ["#E0533A", "#E0901E", "#CF3F7C", "#6D2DB5", "#1C9C95"];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  color: string; life: number;
}

export function PrismParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const particles: Particle[] = [];
    let raf = 0;

    const spawn = () => {
      if (particles.length > 60) return;
      particles.push({
        x: Math.random() * W,
        y: H + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.2 + Math.random() * 0.6),
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
      });
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      if (Math.random() < 0.15) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.003;
        p.alpha = p.life * 0.5;
        if (p.life <= 0 || p.y < -10) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden
    />
  );
}
