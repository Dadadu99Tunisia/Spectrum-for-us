"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Star } from "lucide-react";

const T = { ink: "#1A1612", soft: "#6B6258", line: "#ECE6DB", mag: "#FF3D7F", amber: "#F2A03D" };

type Review = {
  id: string; rating: number; comment: string | null; created_at: string;
  user_id: string; profiles?: { full_name: string | null } | null;
};

function Stars({ value, size = 14, onPick }: { value: number; size?: number; onPick?: (n: number) => void }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type={onPick ? "button" : undefined} disabled={!onPick}
          onClick={onPick ? () => onPick(n) : undefined}
          className={onPick ? "cursor-pointer active:scale-90 transition-transform" : "cursor-default"} aria-label={`${n} étoile${n > 1 ? "s" : ""}`}>
          <Star size={size} style={{ color: n <= value ? T.amber : "#D8CFC0" }} fill={n <= value ? T.amber : "none"} />
        </button>
      ))}
    </span>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const load = () => {
    const supabase = createClient();
    supabase.from("reviews")
      .select("id, rating, comment, created_at, user_id, profiles(full_name)")
      .eq("product_id", productId).order("created_at", { ascending: false })
      .then(({ data }) => { setReviews((data ?? []) as unknown as Review[]); setLoading(false); });
  };
  useEffect(load, [productId]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const mine = user && reviews.some(r => r.user_id === user.id);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({ product_id: productId, user_id: user.id, rating, comment: comment.trim() || null });
    setSubmitting(false);
    if (!error) { setDone(true); setComment(""); load(); }
  };

  return (
    <div className="border-t pt-8 mt-2" style={{ borderColor: T.line, color: T.ink }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-fraunces text-2xl" style={{ color: T.ink }}>Avis</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars value={Math.round(avg)} size={16} />
            <span className="font-mono text-sm" style={{ color: T.soft }}>{avg.toFixed(1)} · {reviews.length} avis</span>
          </div>
        )}
      </div>

      {/* Form */}
      {user && !mine && (
        <form onSubmit={submit} className="rounded-2xl p-4 mb-6" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
          {done ? (
            <p className="font-hanken text-sm" style={{ color: "#1B8155" }}>Merci pour ton avis ✦</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[11px] tracking-wide" style={{ color: T.soft }}>Ta note</span>
                <Stars value={rating} size={20} onPick={setRating} />
              </div>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                placeholder="Partage ton expérience (optionnel)…"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none" style={{ background: "#FBF9F5", boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }} />
              <button type="submit" disabled={submitting}
                className="mt-3 px-5 py-2.5 rounded-full font-hanken font-semibold text-sm text-white disabled:opacity-50" style={{ background: T.mag }}>
                {submitting ? "Envoi…" : "Publier mon avis"}
              </button>
            </>
          )}
        </form>
      )}
      {!user && (
        <p className="font-hanken text-sm mb-6" style={{ color: T.soft }}>
          <a href="/auth" className="underline" style={{ color: T.mag }}>Connecte-toi</a> pour laisser un avis.
        </p>
      )}

      {/* List */}
      {loading ? (
        <p className="font-hanken text-sm" style={{ color: T.soft }}>Chargement…</p>
      ) : reviews.length === 0 ? (
        <p className="font-hanken text-sm" style={{ color: T.soft }}>Aucun avis pour l&apos;instant — sois le·a premier·e ✦</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="rounded-2xl p-4" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bricolage font-semibold text-sm" style={{ color: T.ink }}>{r.profiles?.full_name || "Client·e"}</span>
                <Stars value={r.rating} size={13} />
              </div>
              {r.comment && <p className="font-hanken text-sm leading-relaxed" style={{ color: T.soft }}>{r.comment}</p>}
              <p className="font-mono text-[10px] mt-2" style={{ color: "#9B9285" }}>
                {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
