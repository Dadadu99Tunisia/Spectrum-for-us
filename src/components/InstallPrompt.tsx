"use client";
import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const DISMISS_KEY = "sfu-install-dismissed";

export function InstallPrompt() {
  const [mode, setMode] = useState<"android" | "ios" | null>(null);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Déjà installée ?
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;
    // Déjà refusée ?
    try { if (localStorage.getItem(DISMISS_KEY)) return; } catch {}

    // Android / Chrome
    const onBip = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent); setMode("android"); };
    window.addEventListener("beforeinstallprompt", onBip);

    // iOS Safari (pas de beforeinstallprompt)
    const ua = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|chrome/i.test(ua);
    if (isIOS && isSafari) {
      const t = setTimeout(() => setMode("ios"), 2500);
      return () => { clearTimeout(t); window.removeEventListener("beforeinstallprompt", onBip); };
    }
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = () => { try { localStorage.setItem(DISMISS_KEY, "1"); } catch {} setMode(null); };

  const installAndroid = async () => {
    if (!deferred) return;
    await deferred.prompt();
    try { await deferred.userChoice; } catch {}
    dismiss();
  };

  if (!mode) return null;

  return (
    <div className="md:hidden fixed left-3 right-3 z-[55] rounded-2xl bg-white shadow-2xl border border-[#ECE6DB] p-3"
      style={{ bottom: "calc(78px + env(safe-area-inset-bottom))" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#ECE6DB]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="Spectrum" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bricolage font-bold text-[14px] text-[#101014] leading-tight">Installe l&apos;app Spectrum</p>
          <p className="font-hanken text-[11.5px] text-[#101014]/50 leading-tight">Accès rapide, plein écran, comme une vraie app.</p>
        </div>
        {mode === "android" ? (
          <button onClick={installAndroid}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FF2DA0] text-white font-hanken font-semibold text-[13px]">
            <Download size={14} /> Installer
          </button>
        ) : (
          <button onClick={() => setShowIosHelp(v => !v)}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#101014] text-white font-hanken font-semibold text-[13px]">
            <Share size={14} /> Comment ?
          </button>
        )}
        <button onClick={dismiss} aria-label="Fermer" className="shrink-0 text-[#101014]/30 hover:text-[#101014]/60 p-1"><X size={16} /></button>
      </div>

      {mode === "ios" && showIosHelp && (
        <div className="mt-2.5 pt-2.5 border-t border-[#ECE6DB] font-hanken text-[12.5px] text-[#101014]/70 leading-relaxed">
          1. Touche <Share size={12} className="inline -mt-0.5" /> <strong>Partager</strong> en bas de Safari.<br />
          2. Choisis <strong>« Sur l&apos;écran d&apos;accueil »</strong>.<br />
          3. Touche <strong>Ajouter</strong>. ✨
        </div>
      )}
    </div>
  );
}
