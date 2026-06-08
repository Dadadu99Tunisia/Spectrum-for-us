"use client";

/**
 * IntroSplash · intro cinématique plein écran "Spectrum For Us".
 *
 * Issu du handoff Claude Design (Intro Animation). Porté en composant overlay
 * autonome pour Next.js App Router : ne réorganise pas le layout, se superpose
 * en plein écran puis se retire.
 *
 * Comportement :
 *  - Joue une fois par session de navigation (sessionStorage `sfu_intro_seen`).
 *  - Sauté si prefers-reduced-motion: reduce.
 *  - Skippable (bouton, Échap, Entrée). Auto-dismiss ~4,6 s.
 *  - 60fps : seuls transform / opacity / filter sont animés (GPU).
 */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const WORDS = ["CREATE", "SELL", "DISCOVER", "CONNECT", "SUPPORT"];
const SPECTRUM = "linear-gradient(90deg,#FF2DA0,#C44CFF,#6B5CFF,#1FB6C9,#16A06A,#F2A03D)";
const FINAL = "Marketplace for and by queer communities";
const EASE = [0.2, 0.7, 0.2, 1] as const;
const STORAGE_KEY = "sfu_intro_seen";
const DURATION = 4600;

export function IntroSplash({ force = false }: { force?: boolean }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState<boolean | null>(null); // null = avant décision (anti-flash hydratation)

  useEffect(() => {
    const decide = () => {
      if (force) { setShow(true); return; }
      if (reduce === null) return; // attendre la résolution de prefers-reduced-motion
      let seen = false;
      try { seen = !!sessionStorage.getItem(STORAGE_KEY); } catch {}
      const play = !seen && !reduce;
      // si on ne joue pas, s'assurer que le voile pré-paint éventuel est retiré
      if (!play) document.documentElement.removeAttribute("data-intro");
      setShow(play);
    };
    decide();
  }, [reduce, force]);

  const finish = useCallback(() => {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
    // retire le voile pré-paint pour révéler la page (l'overlay couvre pendant sa sortie)
    document.documentElement.removeAttribute("data-intro");
    setShow(false);
  }, []);

  useEffect(() => {
    if (!show) return;
    // bloque le scroll pendant l'intro
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(finish, DURATION);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter") finish(); };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [show, finish]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="intro"
          role="dialog"
          aria-label="Introduction Spectrum For Us"
          exit={{ opacity: 0, scale: 1.09, filter: "blur(4px)" }}
          transition={{ duration: 0.6, ease: [0.5, 0, 0.2, 1] }}
          style={S.intro}
        >
          <div style={S.stage}>
            {/* ligne spectre lumineuse */}
            <motion.div
              aria-hidden
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.92 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.7, 0, 0.2, 1] }}
              style={S.line}
            />
            {/* bloom arc-en-ciel */}
            <motion.div
              aria-hidden
              initial={{ scale: 0.45, opacity: 0 }}
              animate={{ scale: [0.45, 1.1, 1.25], opacity: [0, 0.5, 0.38], rotate: 90 }}
              transition={{ duration: 1.9, delay: 0.65, ease: [0.3, 0.6, 0.2, 1] }}
              style={S.bloom}
            />
            {/* logo qui émerge */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(22px)", y: 10, scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
              style={{ position: "relative", zIndex: 3 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/spectrum-white.png" alt="Spectrum For Us" style={S.logo} />
            </motion.div>

            {/* mots cinétiques */}
            <div style={S.words} aria-hidden>
              {WORDS.map((w, i) => (
                <motion.span
                  key={w}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [16, 0, 0, -14],
                    filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"],
                  }}
                  transition={{ duration: 0.56, delay: 1.35 + i * 0.36, times: [0, 0.26, 0.7, 1] }}
                  style={S.word}
                >
                  {w}
                </motion.span>
              ))}
            </div>

            {/* message final */}
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 3.4, ease: EASE }}
              style={S.msg}
            >
              {FINAL}
            </motion.div>
          </div>

          <button onClick={finish} aria-label="Passer l'introduction" style={S.skip}>
            Passer ✦
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const S: Record<string, React.CSSProperties> = {
  intro: {
    position: "fixed", inset: 0, zIndex: 9999, overflow: "hidden",
    background: "radial-gradient(120% 120% at 50% 50%, #0E0816 0%, #000 70%)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  stage: {
    position: "relative", width: "min(680px,90vw)", height: "min(420px,60vh)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  line: {
    position: "absolute", top: "50%", left: "50%", width: "min(360px,60vw)", height: 3,
    borderRadius: 999, background: SPECTRUM, transform: "translate(-50%,-50%)",
    boxShadow: "0 0 30px rgba(255,80,160,.6),0 0 60px rgba(120,90,255,.35)",
  },
  bloom: {
    position: "absolute", top: "50%", left: "50%", width: "min(560px,80vw)", height: "min(560px,80vw)",
    borderRadius: "50%",
    background: "conic-gradient(from 0deg,#FF2DA0,#C44CFF,#6B5CFF,#1FB6C9,#16A06A,#F2A03D,#FF2DA0)",
    filter: "blur(60px)", transform: "translate(-50%,-50%)", mixBlendMode: "screen",
  },
  logo: { height: "min(150px,22vh)", width: "auto", display: "block" },
  words: {
    position: "absolute", left: 0, right: 0, top: "calc(50% + min(120px,17vh))",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4, pointerEvents: "none",
  },
  word: {
    position: "absolute", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 800,
    fontSize: "clamp(22px,4.4vw,40px)", letterSpacing: "0.34em", textTransform: "uppercase",
    whiteSpace: "nowrap", background: SPECTRUM,
    WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  msg: {
    position: "absolute", left: 0, right: 0, top: "calc(50% + min(120px,17vh))", zIndex: 4,
    textAlign: "center", padding: "0 24px",
    fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic",
    fontSize: "clamp(15px,2.6vw,24px)", color: "rgba(242,233,218,.92)", letterSpacing: "0.02em",
  },
  skip: {
    position: "absolute", right: 20, bottom: "max(20px, env(safe-area-inset-bottom))", zIndex: 6,
    background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.16)",
    color: "rgba(242,233,218,.8)", cursor: "pointer",
    fontFamily: "var(--font-space-mono), monospace", fontSize: 11, letterSpacing: "0.1em",
    textTransform: "uppercase", padding: "9px 16px", borderRadius: 999, backdropFilter: "blur(6px)",
  },
};
