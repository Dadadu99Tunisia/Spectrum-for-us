"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Store, Package, ShoppingCart, CornerDownLeft } from "lucide-react";

type Result = { type: string; id: string; title: string; subtitle: string; href: string };

const ICON: Record<string, React.ElementType> = { user: User, shop: Store, product: Package, order: ShoppingCart };

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(o => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 30); return; }
    const reset = () => { setQ(""); setResults([]); setActive(0); };
    reset();
  }, [open]);

  const search = useCallback((value: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (value.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data.results ?? []); setActive(0);
      } catch { setResults([]); }
      setLoading(false);
    }, 220);
  }, []);

  const go = (r: Result) => { setOpen(false); router.push(r.href); };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1612]/[0.08] border border-[#1A1612]/[0.12] cursor-pointer hover:bg-[#1A1612]/[0.06] transition-colors">
        <Search size={12} className="text-[#1A1612]/25" />
        <span className="font-mono text-[10px] text-[#1A1612]/25">Recherche rapide</span>
        <kbd className="ml-2 font-mono text-[9px] text-[#1A1612]/20 bg-[#1A1612]/[0.09] px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4" style={{ background: "rgba(10,6,20,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-xl rounded-2xl overflow-hidden"
            style={{ background: "#221a36", border: "1px solid rgba(243,234,219,0.14)", boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}>
            <div className="flex items-center gap-3 px-4 h-14 border-b" style={{ borderColor: "rgba(243,234,219,0.1)" }}>
              <Search size={18} className="text-[#1A1612]/40" />
              <input ref={inputRef} value={q}
                onChange={e => { setQ(e.target.value); search(e.target.value); }}
                onKeyDown={e => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
                  if (e.key === "Enter" && results[active]) go(results[active]);
                }}
                placeholder="Rechercher utilisateurs, boutiques, produits, commandes…"
                className="flex-1 bg-transparent outline-none text-[15px] text-[#1A1612] placeholder-[#1A1612]/30" />
              {loading && <span className="font-mono text-[10px] text-[#1A1612]/30">…</span>}
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {q.trim().length < 2 ? (
                <p className="px-4 py-6 text-center font-hanken text-sm text-[#1A1612]/30">Tape au moins 2 caractères.</p>
              ) : results.length === 0 && !loading ? (
                <p className="px-4 py-6 text-center font-hanken text-sm text-[#1A1612]/30">Aucun résultat pour « {q} ».</p>
              ) : (
                results.map((r, i) => {
                  const Icon = ICON[r.type] ?? Package;
                  return (
                    <button key={r.type + r.id} onClick={() => go(r)} onMouseEnter={() => setActive(i)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{ background: i === active ? "rgba(224,51,126,0.14)" : "transparent" }}>
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(243,234,219,0.07)" }}>
                        <Icon size={15} className="text-[#1A1612]/60" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-hanken text-sm text-[#1A1612] truncate">{r.title}</span>
                        <span className="block font-mono text-[10px] text-[#1A1612]/35 truncate">{r.subtitle}</span>
                      </span>
                      {i === active && <CornerDownLeft size={13} className="text-[#1A1612]/30 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
