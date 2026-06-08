"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, ArrowLeft, MessageSquare, ArrowRight } from "lucide-react";

const T = { ink: "#101014", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF2DA0", tint: "#F4F0E8" };

interface Msg { id: string; sender_id: string; recipient_id: string; body: string; read: boolean | null; created_at: string; }
interface Profile { id: string; full_name: string | null; avatar_url: string | null; }

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [active, setActive] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);
  const endRef = useRef<HTMLDivElement>(null);

  const load = async (uid: string) => {
    const { data } = await supabase.from("messages")
      .select("id,sender_id,recipient_id,body,read,created_at")
      .or(`sender_id.eq.${uid},recipient_id.eq.${uid}`)
      .order("created_at", { ascending: true });
    const list = (data ?? []) as Msg[];
    setMsgs(list);
    const others = [...new Set(list.map((m) => (m.sender_id === uid ? m.recipient_id : m.sender_id)))];
    if (others.length) {
      const { data: profs } = await supabase.from("profiles").select("id,full_name,avatar_url").in("id", others);
      const map: Record<string, Profile> = {};
      (profs ?? []).forEach((p) => { map[p.id] = p as Profile; });
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    load(user.id);
  }, [user, authLoading]);

  // threads grouped by other party
  const threads = useMemo(() => {
    if (!user) return [];
    const byOther: Record<string, Msg[]> = {};
    for (const m of msgs) {
      const other = m.sender_id === user.id ? m.recipient_id : m.sender_id;
      (byOther[other] ??= []).push(m);
    }
    return Object.entries(byOther)
      .map(([other, list]) => ({
        other, list,
        last: list[list.length - 1],
        unread: list.some((m) => m.recipient_id === user.id && !m.read),
      }))
      .sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
  }, [msgs, user]);

  const activeThread = threads.find((t) => t.other === active);
  const unreadTotal = threads.filter((t) => t.unread).length;

  // open thread -> mark read
  const openThread = async (other: string) => {
    setActive(other);
    if (!user) return;
    const toRead = msgs.filter((m) => m.sender_id === other && m.recipient_id === user.id && !m.read).map((m) => m.id);
    if (toRead.length) {
      await supabase.from("messages").update({ read: true }).in("id", toRead);
      setMsgs((prev) => prev.map((m) => (toRead.includes(m.id) ? { ...m, read: true } : m)));
    }
  };

  const send = async () => {
    if (!user || !active || !reply.trim()) return;
    const body = reply.trim(); setReply("");
    const { data } = await supabase.from("messages").insert({ sender_id: user.id, recipient_id: active, body }).select().single();
    if (data) setMsgs((prev) => [...prev, data as Msg]);
    fetch("/api/messages/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipientId: active }), keepalive: true }).catch(() => {});
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const name = (id: string) => profiles[id]?.full_name || "Utilisateur";

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20" style={{ background: "#FBFAF8", color: T.ink }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          <h1 className="font-fraunces text-[28px] mb-4">Messages {unreadTotal > 0 && <span className="font-mono text-[13px] align-middle rounded-full px-2 py-0.5 text-white" style={{ background: T.mag }}>{unreadTotal}</span>}</h1>

          {!user && !authLoading ? (
            <Empty />
          ) : loading ? (
            <p className="py-16 text-center" style={{ color: T.faint }}>Chargement…</p>
          ) : threads.length === 0 ? (
            <EmptyThreads />
          ) : (
            <div className="grid md:grid-cols-[300px_1fr] gap-4 rounded-2xl overflow-hidden" style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, minHeight: 460 }}>
              {/* Threads list */}
              <div className={`${active ? "hidden md:block" : "block"} md:border-r`} style={{ borderColor: T.line, background: "#fff" }}>
                {threads.map((t) => (
                  <button key={t.other} onClick={() => openThread(t.other)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-[#FBFAF8]"
                    style={{ borderBottom: `1px solid ${T.line}`, background: active === t.other ? "#FBFAF8" : undefined }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: T.mag }}>{name(t.other)[0]?.toUpperCase()}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bricolage font-semibold text-[14px] truncate">{name(t.other)}</p>
                      <p className="text-[12.5px] truncate" style={{ color: T.soft }}>{t.last.body}</p>
                    </div>
                    {t.unread && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: T.mag }} />}
                  </button>
                ))}
              </div>

              {/* Thread view */}
              <div className={`${active ? "flex" : "hidden md:flex"} flex-col`} style={{ background: "#fff", minHeight: 460 }}>
                {!activeThread ? (
                  <div className="flex-1 flex items-center justify-center" style={{ color: T.faint }}>Sélectionne une conversation</div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${T.line}` }}>
                      <button className="md:hidden" onClick={() => setActive(null)} style={{ color: T.soft }}><ArrowLeft size={18} /></button>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: T.mag }}>{name(activeThread.other)[0]?.toUpperCase()}</div>
                      <p className="font-bricolage font-semibold text-[15px]">{name(activeThread.other)}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ maxHeight: 360 }}>
                      {activeThread.list.map((m) => {
                        const mine = m.sender_id === user!.id;
                        return (
                          <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px]" style={mine ? { background: T.ink, color: "#fff" } : { background: T.tint, color: T.ink }}>{m.body}</div>
                          </div>
                        );
                      })}
                      <div ref={endRef} />
                    </div>
                    <div className="p-3 flex items-center gap-2" style={{ borderTop: `1px solid ${T.line}` }}>
                      <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
                        placeholder="Écris un message…" className="flex-1 rounded-full px-4 py-2.5 text-[14px] outline-none" style={{ boxShadow: `inset 0 0 0 1px ${T.line}` }} />
                      <button onClick={send} disabled={!reply.trim()} className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-40" style={{ background: T.ink }}><Send size={16} /></button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Empty() {
  return (
    <div className="text-center py-20">
      <MessageSquare size={30} className="mx-auto mb-3" style={{ color: "#9B9285" }} />
      <p className="font-fraunces text-[20px] mb-2">Connecte-toi pour voir tes messages</p>
      <Link href="/auth" className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-white font-semibold text-sm mt-2" style={{ background: "#101014" }}>Se connecter <ArrowRight size={15} /></Link>
    </div>
  );
}
function EmptyThreads() {
  return (
    <div className="text-center py-20">
      <MessageSquare size={30} className="mx-auto mb-3" style={{ color: "#9B9285" }} />
      <p className="font-fraunces text-[20px] mb-2">Aucun message</p>
      <p className="font-hanken text-[15px]" style={{ color: "#6B6258" }}>Contacte une boutique depuis sa page pour démarrer une conversation.</p>
      <Link href="/decouvrir" className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-white font-semibold text-sm mt-4" style={{ background: "#101014" }}>Explorer <ArrowRight size={15} /></Link>
    </div>
  );
}
