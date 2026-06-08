"use client";

/**
 * track · envoi d'un événement analytics first-party vers /api/track.
 * Fire-and-forget (sendBeacon si possible), ne casse jamais l'UX.
 */
function anonId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem("sfu-anon");
    if (!id) {
      id = (crypto?.randomUUID?.() ?? String(Math.floor(performance.now()) + "-" + performance.timeOrigin));
      localStorage.setItem("sfu-anon", id);
    }
    return id;
  } catch { return ""; }
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    event,
    props: { ...props, path: window.location.pathname, anon_id: anonId() },
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    }
  } catch { /* silencieux */ }
}
