"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { track } from "@/lib/track";
import { Mail, X, Send, Check } from "lucide-react";

/**
 * ContactSellerButton · message in-app acheteur -> vendeur (table messages).
 * Crée la relation pré-achat et la rétention. Non connecté -> /auth.
 */
export function ContactSellerButton({ ownerId, shopName, productId, className = "" }: {
  ownerId: string; shopName: string; productId?: string; className?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [err, setErr] = useState("");

  const isOwner = user?.id === ownerId;
  if (isOwner) return null;

  const openModal = () => {
    if (!user) { router.push("/auth"); return; }
    setOpen(true); setState("idle"); setErr("");
  };

  const send = async () => {
    if (!user || !body.trim()) return;
    setState("sending"); setErr("");
    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id, recipient_id: ownerId, product_id: productId ?? null, body: body.trim(),
    });
    if (error) { setState("idle"); setErr(error.message); return; }
    setState("sent"); setBody(""); track("contact_seller", { ownerId, productId: productId ?? null });
    fetch("/api/messages/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipientId: ownerId }), keepalive: true }).catch(() => {});
  };

  return (
    <>
      <button onClick={openModal}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1A1612]/15 text-[#1A1612]/60 font-hanken text-sm hover:border-[#FF3D7F]/40 hover:text-[#FF3D7F] transition-all ${className}`}>
        <Mail size={14} /> Contacter
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#fff", boxShadow: "0 20px 60px rgba(26,22,18,.2)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-fraunces text-xl text-[#1A1612]">Contacter {shopName}</h2>
              <button onClick={() => setOpen(false)} className="text-[#1A1612]/40 hover:text-[#1A1612]"><X size={18} /></button>
            </div>

            {state === "sent" ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#FF3D7F1A" }}><Check size={22} style={{ color: "#FF3D7F" }} /></div>
                <p className="font-bricolage font-semibold text-[#1A1612]">Message envoyé !</p>
                <p className="font-hanken text-sm text-[#6B6258] mt-1">Retrouve la conversation dans tes messages.</p>
                <button onClick={() => router.push("/messages")} className="mt-4 rounded-full px-5 py-2.5 text-white font-semibold text-sm" style={{ background: "#1A1612" }}>Voir mes messages</button>
              </div>
            ) : (
              <>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} autoFocus
                  placeholder="Bonjour, j'ai une question sur…"
                  className="w-full rounded-xl px-4 py-3 text-[15px] outline-none resize-none" style={{ boxShadow: "inset 0 0 0 1px #ECE6DB", color: "#1A1612" }} />
                {err && <p className="text-[12px] mt-1.5" style={{ color: "#c0392b" }}>{err}</p>}
                <button onClick={send} disabled={state === "sending" || !body.trim()}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-white font-semibold text-sm disabled:opacity-50" style={{ background: "#1A1612" }}>
                  {state === "sending" ? "Envoi…" : <>Envoyer <Send size={15} /></>}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
