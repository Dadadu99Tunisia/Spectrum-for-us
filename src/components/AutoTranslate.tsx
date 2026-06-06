"use client";

/**
 * AutoTranslate — traduction automatique runtime de tout le texte affiché.
 * Quand la locale n'est pas "fr" (langue source), on parcourt les nœuds texte
 * du DOM et on les traduit via l'API MyMemory (gratuite, CORS, sans clé), avec
 * cache mémoire + localStorage. Repasser en "fr" restaure les textes d'origine.
 *
 * Les nombres/prix, et les éléments [translate="no"] / .notranslate sont ignorés.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";

// Sections interactives (React lourd) où la réécriture DOM casserait l'app
const EXCLUDED = ["/admin", "/vendeur", "/panier", "/checkout", "/compte", "/auth"];

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "SVG", "PATH"]);
const hasLetters = (s: string) => /\p{L}/u.test(s);
const CACHE_KEY = "sfu-translations-v1";

export function AutoTranslate() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const originals = useRef<WeakMap<Text, string>>(new WeakMap());
  const touched = useRef<Set<Text>>(new Set());
  const cache = useRef<Map<string, string>>(new Map());
  const loaded = useRef(false);

  // load persisted cache once
  if (!loaded.current && typeof window !== "undefined") {
    loaded.current = true;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) cache.current = new Map(Object.entries(JSON.parse(raw)));
    } catch { /* ignore */ }
  }

  useEffect(() => {
    const excluded = EXCLUDED.some((p) => pathname?.startsWith(p));
    const target = excluded ? "fr" : locale; // ne pas traduire les sections interactives
    document.documentElement.lang = excluded ? "fr" : locale;
    document.documentElement.dir = (!excluded && locale === "ar") ? "rtl" : "ltr";

    let cancelled = false;
    let observer: MutationObserver | null = null;
    let applying = false;

    const persist = () => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(cache.current)));
      } catch { /* ignore */ }
    };

    const skipEl = (el: Element | null): boolean => {
      while (el) {
        if (SKIP_TAGS.has(el.tagName)) return true;
        if (el.getAttribute?.("translate") === "no") return true;
        if (el.classList?.contains("notranslate")) return true;
        el = el.parentElement;
      }
      return false;
    };

    const collect = (root: Node): Text[] => {
      const out: Text[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const v = n.nodeValue ?? "";
          if (!v.trim() || !hasLetters(v)) return NodeFilter.FILTER_REJECT;
          if (skipEl((n as Text).parentElement)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let cur: Node | null;
      while ((cur = walker.nextNode())) out.push(cur as Text);
      return out;
    };

    const setVal = (node: Text, value: string) => {
      applying = true;
      node.nodeValue = value;
      applying = false;
    };

    // Restore to French
    if (target === "fr") {
      touched.current.forEach((node) => {
        const orig = originals.current.get(node);
        if (orig != null) node.nodeValue = orig;
      });
      touched.current.clear();
      return;
    }

    const translateOne = async (text: string): Promise<string> => {
      const key = `${target}:${text}`;
      const cached = cache.current.get(key);
      if (cached != null) return cached;
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${target}`;
        const res = await fetch(url);
        const json = await res.json();
        const tr = json?.responseData?.translatedText;
        if (typeof tr === "string" && tr.trim() && !/MYMEMORY WARNING|INVALID/i.test(tr)) {
          cache.current.set(key, tr);
          return tr;
        }
      } catch { /* ignore */ }
      return text;
    };

    const process = async (nodes: Text[]) => {
      // register originals + collect unique source strings
      const jobs: { node: Text; src: string }[] = [];
      for (const node of nodes) {
        if (cancelled) return;
        if (!originals.current.has(node)) originals.current.set(node, node.nodeValue ?? "");
        const src = (originals.current.get(node) ?? "").trim();
        if (!src || !hasLetters(src)) continue;
        touched.current.add(node);
        const cached = cache.current.get(`${target}:${src}`);
        if (cached != null) { setVal(node, leadTrail(node.nodeValue ?? "", cached)); }
        else jobs.push({ node, src });
      }
      // fetch missing with small concurrency
      const unique = [...new Set(jobs.map((j) => j.src))];
      const pool = 5;
      for (let i = 0; i < unique.length; i += pool) {
        if (cancelled) return;
        await Promise.all(unique.slice(i, i + pool).map((s) => translateOne(s)));
      }
      if (cancelled) return;
      for (const { node, src } of jobs) {
        const tr = cache.current.get(`${target}:${src}`);
        if (tr != null) setVal(node, leadTrail(node.nodeValue ?? "", tr));
      }
      persist();
    };

    // keep leading/trailing whitespace of the live node around the translation
    const leadTrail = (live: string, translated: string) => {
      const lead = live.match(/^\s*/)?.[0] ?? "";
      const trail = live.match(/\s*$/)?.[0] ?? "";
      return lead + translated.trim() + trail;
    };

    process(collect(document.body));

    // observe new content (route changes, lazy lists)
    let timer: ReturnType<typeof setTimeout> | null = null;
    const pending: Set<Node> = new Set();
    observer = new MutationObserver((muts) => {
      if (applying) return;
      for (const m of muts) m.addedNodes.forEach((n) => pending.add(n));
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const roots = [...pending]; pending.clear();
        const nodes: Text[] = [];
        for (const r of roots) {
          if (r.nodeType === Node.TEXT_NODE) { if (!skipEl((r as Text).parentElement)) nodes.push(r as Text); }
          else if (r.nodeType === Node.ELEMENT_NODE) nodes.push(...collect(r));
        }
        if (nodes.length) process(nodes);
      }, 350);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => { cancelled = true; observer?.disconnect(); if (timer) clearTimeout(timer); };
  }, [locale, pathname]);

  return null;
}
