"use client";

/**
 * ScatterText · effet « signature éclatée » de la charte (lettres décalées et
 * pivotées, écho du logo). Déterministe par index → pas de souci d'hydratation.
 */

// motifs cycliques (px / deg) — subtils pour rester lisibles
const DY = [-2.5, 2, -1, 2.5, -3, 1.5, -1.5, 3];
const ROT = [-7, 5, -3, 6, -5, 4, -2, 7];

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
