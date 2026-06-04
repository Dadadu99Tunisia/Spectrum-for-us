"use client";
import { useEffect, useRef, useState } from "react";
import {
  Bot, Send, Copy, Check, Trash2, Sparkles,
  ChevronDown, Loader2, RefreshCw
} from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; id: string };
type Context = { key: string; label: string };

const CONTEXT_ICONS: Record<string, string> = {
  general:    "🤖",
  sales:      "📊",
  newsletter: "📬",
  social:     "📱",
  vendor:     "🏪",
  moderation: "🛡️",
};

const STARTERS: Record<string, string[]> = {
  general:    ["Résume l'état de la plateforme en 3 points", "Quelles actions prioritaires pour ce mois ?", "Propose des KPIs pertinents pour une marketplace queer"],
  sales:      ["Analyse les tendances de ventes du dernier mois", "Quel est notre taux de conversion moyen ?", "Comment améliorer le panier moyen ?"],
  newsletter: ["Rédige une newsletter pour la Pride 2026", "Crée une newsletter de lancement pour un·e nouveau·elle vendeur·se", "Newsletter mensuelle avec les nouveautés"],
  social:     ["Post Instagram pour annoncer un nouveau·elle artisan·e", "Série de posts TikTok sur l'artisanat queer", "Post LinkedIn sur notre impact social"],
  vendor:     ["Rédige un email de bienvenue pour un·e nouveau·elle vendeur·se", "Notification de rejet de produit (ton bienveillant)", "Rappel de paiement commission (ton doux)"],
  moderation: ["Politique de modération pour les produits adultes", "Comment modérer un contenu limite ?", "Rédige les règles de la marketplace"],
};

export default function AIPage() {
  const [contexts, setContexts]   = useState<Context[]>([]);
  const [context, setContext]     = useState("general");
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [streamText, setStreamText] = useState("");
  const [copied, setCopied]       = useState<string | null>(null);
  const [contextOpen, setContextOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/admin/ai").then(r => r.json()).then(j => setContexts(j.data?.contexts ?? []));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  const currentCtx = contexts.find(c => c.key === context);

  const send = async (overrideInput?: string) => {
    const text = (overrideInput ?? input).trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text, id: Date.now().toString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamText("");

    // Resize textarea
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context,
          stream: true,
        }),
      });

      if (!res.body) throw new Error("No body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              setStreamText(fullText);
            }
          } catch { /* skip */ }
        }
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: fullText,
        id: Date.now().toString() + "_a",
      };
      setMessages(prev => [...prev, assistantMsg]);
      setStreamText("");
    } catch (err) {
      const errMsg: Message = {
        role: "assistant",
        content: `Erreur : ${String(err)}`,
        id: Date.now().toString() + "_err",
      };
      setMessages(prev => [...prev, errMsg]);
      setStreamText("");
    } finally {
      setLoading(false);
    }
  };

  const copyMsg = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearConv = () => {
    setMessages([]);
    setStreamText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const starters = STARTERS[context] ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB] flex items-center gap-2">
            <Sparkles size={20} className="text-[#E0337E]" /> IA Spectrum
          </h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">Propulsé par Claude — Anthropic</p>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button onClick={clearConv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#F3EADB]/10 text-[#F3EADB]/30 hover:text-[#F3EADB] transition-colors font-mono text-[10px]">
              <Trash2 size={12} /> Vider
            </button>
          )}

          {/* Context selector */}
          <div className="relative">
            <button onClick={() => setContextOpen(!contextOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#F3EADB]/10 bg-[#F3EADB]/3 text-[#F3EADB]/70 hover:text-[#F3EADB] transition-colors font-hanken text-sm">
              <span>{CONTEXT_ICONS[context] ?? "🤖"}</span>
              <span>{currentCtx?.label ?? "Contexte"}</span>
              <ChevronDown size={12} className={`transition-transform ${contextOpen ? "rotate-180" : ""}`} />
            </button>
            {contextOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#0e061a] border border-[#F3EADB]/10 rounded-xl overflow-hidden z-20 shadow-2xl">
                {contexts.map(c => (
                  <button key={c.key}
                    onClick={() => { setContext(c.key); setContextOpen(false); clearConv(); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 font-hanken text-sm transition-colors text-left ${
                      context === c.key
                        ? "bg-[#E0337E]/10 text-[#E0337E]"
                        : "text-[#F3EADB]/50 hover:text-[#F3EADB] hover:bg-[#F3EADB]/5"
                    }`}>
                    <span>{CONTEXT_ICONS[c.key] ?? "🤖"}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.length === 0 && !streamText ? (
          /* Welcome state */
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E0337E]/10 border border-[#E0337E]/20 flex items-center justify-center">
              <Bot size={28} className="text-[#E0337E]" />
            </div>
            <div>
              <p className="font-fraunces text-lg text-[#F3EADB] mb-1">
                {CONTEXT_ICONS[context]} {currentCtx?.label ?? "Assistant"}
              </p>
              <p className="font-hanken text-sm text-[#F3EADB]/40">
                Comment puis-je t&apos;aider aujourd&apos;hui ?
              </p>
            </div>
            {starters.length > 0 && (
              <div className="flex flex-col gap-2 w-full max-w-lg">
                {starters.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="px-4 py-3 rounded-xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02] text-[#F3EADB]/60 hover:text-[#F3EADB] hover:border-[#F3EADB]/20 transition-all font-hanken text-sm text-left">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-fraunces ${
                  msg.role === "user"
                    ? "bg-[#6D2DB5]/20 border border-[#6D2DB5]/30 text-[#6D2DB5]"
                    : "bg-[#E0337E]/15 border border-[#E0337E]/25 text-[#E0337E]"
                }`}>
                  {msg.role === "user" ? "A" : "✦"}
                </div>

                {/* Bubble */}
                <div className={`group relative max-w-[80%] ${msg.role === "user" ? "items-end" : ""}`}>
                  <div className={`px-4 py-3 rounded-2xl font-hanken text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#6D2DB5]/15 border border-[#6D2DB5]/20 text-[#F3EADB]"
                      : "bg-[#F3EADB]/3 border border-[#F3EADB]/8 text-[#F3EADB]/90"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => copyMsg(msg.content, msg.id)}
                      className="absolute -bottom-5 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-mono text-[9px] text-[#F3EADB]/30 hover:text-[#F3EADB] px-2 py-1 rounded bg-[#F3EADB]/5">
                      {copied === msg.id ? <><Check size={9} /> Copié</> : <><Copy size={9} /> Copier</>}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {streamText && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#E0337E]/15 border border-[#E0337E]/25 text-[#E0337E] text-xs font-fraunces">
                  ✦
                </div>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-[#F3EADB]/3 border border-[#F3EADB]/8 font-hanken text-sm leading-relaxed text-[#F3EADB]/90 whitespace-pre-wrap">
                  {streamText}
                  <span className="inline-block w-1.5 h-4 bg-[#E0337E] ml-0.5 animate-pulse rounded-sm" />
                </div>
              </div>
            )}

            {/* Thinking indicator */}
            {loading && !streamText && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#E0337E]/15 border border-[#E0337E]/25 text-[#E0337E]">
                  <Loader2 size={12} className="animate-spin" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#F3EADB]/3 border border-[#F3EADB]/8">
                  <div className="flex gap-1.5 items-center">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E0337E]/50 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 mt-2">
        <div className={`flex gap-3 p-3 rounded-2xl border transition-colors ${
          loading ? "border-[#E0337E]/20 bg-[#E0337E]/3" : "border-[#F3EADB]/10 bg-[#F3EADB]/[0.02]"
        }`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder={`Message à ${currentCtx?.label ?? "l'IA"}… (Entrée pour envoyer, Maj+Entrée pour saut de ligne)`}
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/25 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
            style={{ minHeight: "24px", maxHeight: "160px" }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 self-end w-8 h-8 rounded-xl bg-[#E0337E] flex items-center justify-center hover:bg-[#E0337E]/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            {loading
              ? <Loader2 size={14} className="text-white animate-spin" />
              : <Send size={14} className="text-white" />
            }
          </button>
        </div>
        <p className="font-mono text-[9px] text-[#F3EADB]/15 text-center mt-2">
          Claude Opus · Spectrum For Us Internal · {messages.filter(m => m.role === "assistant").length} réponse{messages.filter(m => m.role === "assistant").length !== 1 ? "s" : ""} générée{messages.filter(m => m.role === "assistant").length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
