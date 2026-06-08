"use client";

/**
 * ScatterText · effet « signature éclatée » de la charte (lettres décalées et
 * pivotées, écho du logo). Déterministe par index → pas de souci d'hydratation.
 */

// motifs cycliques (px / deg) — éclaté marqué, écho du logo
const DY = [-5, 4, -2, 5, -6, 3, -3, 6];
const ROT = [-11, 8, -5, 10, -9, 6, -4, 12];

export function ScatterText({ text, className, intensity = 1, style }: { text: string; className?: string; intensity?: number; style?: React.CSSProperties }) {
  return (
    <span className={`inline-flex ${className ?? ""}`} aria-label={text} style={style}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden="true" className="inline-block transition-transform duration-200"
          style={{
            transform: `translateY(${DY[i % DY.length] * intensity}px) rotate(${ROT[i % ROT.length] * intensity}deg)`,
            whiteSpace: "pre",
          }}>
          {ch}
        </span>
      ))}
    </span>
  );
}
