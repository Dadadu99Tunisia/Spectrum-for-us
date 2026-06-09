"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Accessibility } from "lucide-react";
import {
  Eye, Type, Palette, Minus, Plus,
  ChevronUp, ChevronDown, MousePointer2, ZoomIn, Space, X
} from "lucide-react";

// SVG filter pour daltonisme (deutéranopie)
const ColorblindSVGFilter = () => (
  <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
    <defs>
      <filter id="colorblind-filter">
        <feColorMatrix type="matrix" values="
          0.625 0.375 0   0 0
          0.7   0.3   0   0 0
          0     0.3   0.7 0 0
          0     0     0   1 0
        "/>
      </filter>
    </defs>
  </svg>
);

type ToggleMode = "dyslexia" | "contrast" | "colorblind" | "reduce-motion" | "focus-visible" | "spacing";
type TextSize = "normal" | "lg" | "xl" | "xxl";

const TEXT_SIZES: { key: TextSize; label: string }[] = [
  { key: "normal", label: "A" },
  { key: "lg",     label: "A+" },
  { key: "xl",     label: "A++" },
  { key: "xxl",    label: "A+++" },
];

const TOGGLE_MODES: {
  key: ToggleMode;
  icon: React.ElementType;
  label: string;
  detail: string;
}[] = [
  { key: "dyslexia",      icon: Type,         label: "Dyslexie",         detail: "Police OpenDyslexic + espacement élargi" },
  { key: "contrast",      icon: Eye,          label: "Contraste élevé",  detail: "Fond noir, texte blanc, bordures renforcées" },
  { key: "colorblind",    icon: Palette,      label: "Daltonien·ne",     detail: "Filtre deutéranopie (rouge-vert)" },
  { key: "reduce-motion", icon: Minus,        label: "Moins d'animations", detail: "Désactive transitions et animations" },
  { key: "focus-visible", icon: MousePointer2, label: "Focus clavier",   detail: "Indicateur de focus visible pour navigation clavier" },
  { key: "spacing",       icon: Space,        label: "Espacement +",     detail: "Augmente l'interligne et les espaces" },
];

const STORAGE_KEY = "sfu_a11y";

function loadPrefs(): { modes: ToggleMode[]; textSize: TextSize } {
  if (typeof window === "undefined") return { modes: [], textSize: "normal" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { modes: [], textSize: "normal" };
  } catch { return { modes: [], textSize: "normal" }; }
}

function savePrefs(modes: Set<ToggleMode>, textSize: TextSize) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ modes: [...modes], textSize }));
}

function applyToDOM(modes: Set<ToggleMode>, textSize: TextSize) {
  const html = document.documentElement;
  // Supprimer tous les modes
  TOGGLE_MODES.forEach(m => html.classList.remove(`mode-${m.key}`));
  TEXT_SIZES.forEach(s => html.classList.remove(`mode-text-${s.key}`));
  // Appliquer les modes actifs
  modes.forEach(m => html.classList.add(`mode-${m}`));
  if (textSize !== "normal") html.classList.add(`mode-text-${textSize}`);
}

export function AccessibilityBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Set<ToggleMode>>(new Set());
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [mounted, setMounted] = useState(false);

  // Charger les préférences sauvegardées
  useEffect(() => {
    const prefs = loadPrefs();
    const modes = new Set(prefs.modes as ToggleMode[]);
    setActive(modes);
    setTextSize(prefs.textSize);
    applyToDOM(modes, prefs.textSize);
    setMounted(true);
  }, []);

  const toggleMode = (mode: ToggleMode) => {
    const next = new Set(active);
    if (next.has(mode)) next.delete(mode);
    else next.add(mode);
    setActive(next);
    applyToDOM(next, textSize);
    savePrefs(next, textSize);
  };

  const changeTextSize = (size: TextSize) => {
    setTextSize(size);
    applyToDOM(active, size);
    savePrefs(active, size);
  };

  const resetAll = () => {
    const empty = new Set<ToggleMode>();
    setActive(empty);
    setTextSize("normal");
    applyToDOM(empty, "normal");
    savePrefs(empty, "normal");
  };

  const hasAnyActive = active.size > 0 || textSize !== "normal";

  // ── FAB mobile déplaçable ──
  const [fab, setFab] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef<{ ox: number; oy: number; sx: number; sy: number; moved: boolean } | null>(null);
  useEffect(() => { try { const s = localStorage.getItem("sfu-a11y-fab"); if (s) setFab(JSON.parse(s)); } catch {} }, []);
  const onDown = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { ox: r.left, oy: r.top, sx: e.clientX, sy: e.clientY, moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.sx, dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 6) drag.current.moved = true;
    const x = Math.min(window.innerWidth - 56, Math.max(8, drag.current.ox + dx));
    const y = Math.min(window.innerHeight - 64, Math.max(64, drag.current.oy + dy));
    setFab({ x, y });
  };
  const onUp = () => {
    const d = drag.current; drag.current = null;
    if (!d) return;
    if (!d.moved) setOpen((o) => !o);
    else if (fab) { try { localStorage.setItem("sfu-a11y-fab", JSON.stringify(fab)); } catch {} }
  };

  if (!mounted) return null;

  // La bottom-nav (mobile) est présente sauf sur ces sections → décaler au-dessus d'elle
  const hasBottomNav = !(
    pathname.startsWith("/admin") || pathname.startsWith("/auth") ||
    pathname.startsWith("/checkout") || pathname.startsWith("/produit") ||
    pathname.startsWith("/vendeur")
  );

  return (
    <>
      <ColorblindSVGFilter />

      {/* ── Mobile : bouton rond flottant déplaçable ── */}
      <button
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
        aria-label="Options d'accessibilité"
        className="md:hidden fixed z-[61] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl ring-2 ring-white/70 touch-none active:scale-95 transition-transform"
        style={fab
          ? { left: fab.x, top: fab.y, background: "#FF2DA0" }
          : { right: 16, bottom: hasBottomNav ? 84 : 24, background: "#FF2DA0" }}
      >
        <Accessibility size={22} />
      </button>

      {/* Mobile : feuille d'options */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/30" onClick={() => setOpen(false)}>
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl p-5 pb-[max(20px,env(safe-area-inset-bottom))]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bricolage font-bold text-[17px] text-[#101014]">Accessibilité</h3>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-[#101014]/40"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-wide text-[#101014]/35 mb-2">Taille du texte</p>
                <div className="flex items-center gap-1.5">
                  {TEXT_SIZES.map(({ key, label }) => (
                    <button key={key} onClick={() => changeTextSize(key)} aria-pressed={textSize === key}
                      className={`px-3.5 py-2 rounded-xl border font-mono text-xs ${textSize === key ? "border-[#FF2DA0] text-[#FF2DA0] bg-[#FF2DA0]/10" : "border-[#101014]/15 text-[#101014]/50"}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-wide text-[#101014]/35 mb-2">Modes visuels & navigation</p>
                <div className="flex flex-wrap gap-2">
                  {TOGGLE_MODES.map(({ key, icon: Icon, label }) => {
                    const isActive = active.has(key);
                    return (
                      <button key={key} onClick={() => toggleMode(key)} aria-pressed={isActive}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[13px] font-hanken ${isActive ? "border-[#FF2DA0] text-[#FF2DA0] bg-[#FF2DA0]/10" : "border-[#101014]/15 text-[#101014]/55"}`}>
                        <Icon size={13} /> {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {hasAnyActive && (
                <button onClick={resetAll} className="self-start flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#101014]/15 text-[#101014]/40 text-[13px] font-hanken">
                  <X size={13} /> Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop : barre en bas ── */}
      <div
        role="region"
        aria-label="Options d'accessibilité"
        className="hidden md:block fixed left-0 right-0 bottom-0 z-40"
      >
        {/* Toggle button */}
        <div className="flex justify-center">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="a11y-panel"
            className={`flex items-center gap-2 px-5 py-2 border border-b-0 rounded-t-xl text-xs font-mono tracking-wide transition-all duration-200 ${
              hasAnyActive
                ? "bg-[#FF2DA0]/15 border-[#FF2DA0]/40 text-[#FF2DA0]"
                : "bg-[#FFFFFF] border-[#101014]/15 text-[#101014]/50 hover:text-[#101014]"
            }`}
          >
            {hasAnyActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF2DA0] animate-pulse" />}
            <span>Accessibilité</span>
            {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
        </div>

        {/* Panel */}
        <div
          id="a11y-panel"
          role="group"
          className="bg-[#FFFFFF]/98 backdrop-blur-md border-t border-[#101014]/10 transition-all duration-300 overflow-hidden"
          style={{ maxHeight: open ? "220px" : "0px" }}
          aria-hidden={!open}
        >
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-start gap-6 flex-wrap">

              {/* Taille du texte */}
              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[9px] tracking-wide text-[#101014]/30">
                  Taille du texte
                </p>
                <div className="flex items-center gap-1">
                  {TEXT_SIZES.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => changeTextSize(key)}
                      aria-pressed={textSize === key}
                      aria-label={`Taille de texte ${label}`}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all duration-200 ${
                        textSize === key
                          ? "border-[#FF2DA0] text-[#FF2DA0] bg-[#FF2DA0]/10"
                          : "border-[#101014]/15 text-[#101014]/40 hover:border-[#101014]/30 hover:text-[#101014]/70"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Séparateur */}
              <div className="w-px self-stretch bg-[#101014]/8 hidden sm:block" />

              {/* Modes toggle */}
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="font-mono text-[9px] tracking-wide text-[#101014]/30">
                  Modes visuels & navigation
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOGGLE_MODES.map(({ key, icon: Icon, label, detail }) => {
                    const isActive = active.has(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleMode(key)}
                        aria-pressed={isActive}
                        title={detail}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-hanken transition-all duration-200 ${
                          isActive
                            ? "border-[#FF2DA0] text-[#FF2DA0] bg-[#FF2DA0]/10"
                            : "border-[#101014]/15 text-[#101014]/45 hover:border-[#101014]/30 hover:text-[#101014]/70"
                        }`}
                      >
                        <Icon size={11} aria-hidden="true" />
                        <span>{label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2DA0]" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset */}
              {hasAnyActive && (
                <button
                  onClick={resetAll}
                  aria-label="Réinitialiser tous les paramètres d'accessibilité"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#101014]/15 text-[#101014]/30 font-hanken text-xs hover:border-red-400/30 hover:text-red-400 transition-all self-end"
                >
                  <X size={11} />
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Description du mode actif */}
            {hasAnyActive && (
              <p className="mt-3 font-hanken text-[10px] text-[#101014]/30 text-center" aria-live="polite">
                Actif·ves : {[
                  textSize !== "normal" ? `Texte ${TEXT_SIZES.find(s => s.key === textSize)?.label}` : null,
                  ...[...active].map(m => TOGGLE_MODES.find(t => t.key === m)?.label),
                ].filter(Boolean).join(" · ")} · Préférences sauvegardées
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
