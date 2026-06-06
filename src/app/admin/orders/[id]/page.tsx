"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Package, User, MapPin, CreditCard, Clock,
  Truck, RefreshCw, AlertTriangle, CheckCircle2, XCircle,
  ExternalLink, Edit3, Check, X, Copy, CheckCheck,
} from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type OrderItem = {
  id: string; quantity: number; unit_price: number; total_price: number;
  product_id: string; product_title: string; product_image_url: string | null;
  shop_id: string; shop_name: string;
};

type Activity = {
  action: string; metadata: Record<string, unknown>;
  created_at: string; user_id: string;
};

type Order = {
  id: string; status: string; total_amount: number;
  created_at: string; updated_at: string;
  tracking_number: string | null; carrier: string | null;
  dispute_status: string | null; dispute_reason: string | null;
  refund_status: string | null; refund_amount: number | null;
  refund_reason: string | null; refunded_at: string | null;
  shipping_address: Record<string, string> | null;
  billing_address:  Record<string, string> | null;
  stripe_payment_intent_id: string | null;
  buyer: { id: string; full_name: string | null; pseudo: string | null; email: string } | null;
  items: OrderItem[];
  activity: Activity[];
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "En attente",  color: "#fbbf24", bg: "rgba(251,191,36,.12)" },
  paid:      { label: "Payé",        color: "#a78bfa", bg: "rgba(167,139,250,.12)" },
  shipped:   { label: "Expédié",     color: "#60a5fa", bg: "rgba(96,165,250,.12)" },
  delivered: { label: "Livré",       color: "#34d399", bg: "rgba(52,211,153,.12)" },
  cancelled: { label: "Annulé",      color: "#f87171", bg: "rgba(248,113,113,.12)" },
};

const NEXT_STATUSES: Record<string, string[]> = {
  pending:   ["paid","cancelled"],
  paid:      ["shipped","cancelled"],
  shipped:   ["delivered","cancelled"],
  delivered: [],
  cancelled: [],
};

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#F3EADB]/35 mb-4">{title}</p>
      {children}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editTracking, setEditTracking] = useState(false);
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier]   = useState("");
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(j => { setOrder(j.data ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!order) return;
    setUpdating(true);
    const res  = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (res.ok) setOrder(prev => prev ? { ...prev, ...json.data } : null);
    setUpdating(false);
  };

  const saveTracking = async () => {
    if (!order) return;
    setUpdating(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_number: tracking, carrier }),
    });
    setOrder(prev => prev ? { ...prev, tracking_number: tracking, carrier } : null);
    setEditTracking(false);
    setUpdating(false);
  };

  const copyId = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <SpectrumLoader size="sm" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-32">
      <Package size={40} className="mx-auto mb-3 text-[#F3EADB]/10" />
      <p className="font-hanken text-[#F3EADB]/30">Commande introuvable</p>
      <button onClick={() => router.push("/admin/orders")}
        className="mt-4 font-mono text-xs text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors">
        ← Retour aux commandes
      </button>
    </div>
  );

  const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.pending;
  const nextStatuses = NEXT_STATUSES[order.status] ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link href="/admin/orders"
        className="inline-flex items-center gap-2 font-hanken text-sm text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors">
        <ArrowLeft size={14} /> Commandes
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-fraunces text-xl text-[#F3EADB]">Commande</h1>
            <button onClick={copyId}
              className="flex items-center gap-1.5 font-mono text-sm text-[#F3EADB]/40 hover:text-[#F3EADB] transition-colors">
              <code className="text-[#a78bfa]">#{id.slice(0, 12)}…</code>
              {copied ? <CheckCheck size={12} className="text-[#34d399]" /> : <Copy size={11} />}
            </button>
          </div>
          <p className="font-mono text-[10px] text-[#F3EADB]/30">
            Créée le {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status badge */}
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl font-hanken text-sm font-medium"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
            <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
            {cfg.label}
          </span>
          {/* Status transitions */}
          {nextStatuses.map(s => {
            const c = STATUS_CFG[s];
            return (
              <button key={s} onClick={() => updateStatus(s)} disabled={updating}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-hanken text-sm border transition-all hover:scale-105 disabled:opacity-40"
                style={{ borderColor: `${c.color}30`, color: c.color, background: c.bg }}>
                {updating ? <RefreshCw size={12} className="animate-spin" /> : null}
                → {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left col: items + total */}
        <div className="lg:col-span-2 space-y-5">

          {/* Items */}
          <InfoCard title={`${order.items.length} article${order.items.length !== 1 ? "s" : ""}`}>
            <div className="space-y-3">
              {order.items.length === 0 ? (
                <p className="font-hanken text-sm text-[#F3EADB]/30 italic">Aucun article trouvé</p>
              ) : order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  {item.product_image_url ? (
                    <img src={item.product_image_url} alt={item.product_title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 bg-white/[0.05]" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                      <Package size={16} className="text-[#F3EADB]/20" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-hanken text-sm text-[#F3EADB] truncate">{item.product_title}</p>
                    <p className="font-mono text-[10px] text-[#F3EADB]/35 mt-0.5">{item.shop_name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-hanken text-sm text-[#F3EADB]">{fmt(item.total_price)}</p>
                    <p className="font-mono text-[10px] text-[#F3EADB]/35">{item.quantity} × {fmt(item.unit_price)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="font-mono text-xs text-[#F3EADB]/40 uppercase tracking-widest">Total</span>
              <span className="font-fraunces text-xl text-[#F3EADB]">{fmt(order.total_amount)}</span>
            </div>
          </InfoCard>

          {/* Tracking */}
          <InfoCard title="Expédition">
            {editTracking ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[9px] text-[#F3EADB]/30 uppercase tracking-widest block mb-1.5">Transporteur</label>
                    <input value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="Colissimo, UPS…"
                      className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#a78bfa]/50" />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-[#F3EADB]/30 uppercase tracking-widest block mb-1.5">N° de suivi</label>
                    <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="AB123456789FR"
                      className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-3 py-2 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#a78bfa]/50" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveTracking} disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C9C95] text-white font-hanken text-sm hover:bg-[#1C9C95]/90 transition-colors disabled:opacity-40">
                    <Check size={13} /> Enregistrer
                  </button>
                  <button onClick={() => setEditTracking(false)}
                    className="px-4 py-2 rounded-xl border border-white/[0.08] text-[#F3EADB]/40 font-hanken text-sm hover:text-[#F3EADB] transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-[#F3EADB]/30" />
                  {order.tracking_number ? (
                    <div>
                      <p className="font-hanken text-sm text-[#F3EADB]">{order.carrier ?? "—"} — <code className="text-[#60a5fa]">{order.tracking_number}</code></p>
                    </div>
                  ) : (
                    <p className="font-hanken text-sm text-[#F3EADB]/35 italic">Aucun numéro de suivi</p>
                  )}
                </div>
                <button onClick={() => { setTracking(order.tracking_number ?? ""); setCarrier(order.carrier ?? ""); setEditTracking(true); }}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-[#F3EADB]/35 hover:text-[#F3EADB] transition-colors">
                  <Edit3 size={11} /> Modifier
                </button>
              </div>
            )}
          </InfoCard>

          {/* Dispute / Refund */}
          {(order.dispute_status || order.refund_status) && (
            <InfoCard title="Litige / Remboursement">
              {order.dispute_status && (
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle size={14} className="text-[#fbbf24] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-hanken text-sm text-[#F3EADB]">Litige : <span className="text-[#fbbf24]">{order.dispute_status}</span></p>
                    {order.dispute_reason && <p className="font-hanken text-xs text-[#F3EADB]/40 mt-1">{order.dispute_reason}</p>}
                  </div>
                </div>
              )}
              {order.refund_status && (
                <div className="flex items-start gap-3">
                  <RefreshCw size={14} className="text-[#60a5fa] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-hanken text-sm text-[#F3EADB]">
                      Remboursement : <span className="text-[#60a5fa]">{order.refund_status}</span>
                      {order.refund_amount ? ` — ${fmt(order.refund_amount)}` : ""}
                    </p>
                    {order.refund_reason && <p className="font-hanken text-xs text-[#F3EADB]/40 mt-1">{order.refund_reason}</p>}
                    {order.refunded_at && <p className="font-mono text-[10px] text-[#F3EADB]/25 mt-1">{new Date(order.refunded_at).toLocaleDateString("fr-FR")}</p>}
                  </div>
                </div>
              )}
              {/* Refund action */}
              {!order.refund_status && order.status !== "cancelled" && (
                <Link href={`/api/admin/orders/${id}/refund`}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#f87171]/25 text-[#f87171] bg-[#f87171]/10 font-hanken text-sm hover:bg-[#f87171]/15 transition-colors">
                  Rembourser cette commande
                </Link>
              )}
            </InfoCard>
          )}

          {/* Activity */}
          {order.activity.length > 0 && (
            <InfoCard title="Historique">
              <div className="space-y-2">
                {order.activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F3EADB]/20 mt-2 shrink-0" />
                    <div>
                      <p className="font-hanken text-sm text-[#F3EADB]/70">{a.action.replace(/_/g, " ")}</p>
                      <p className="font-mono text-[10px] text-[#F3EADB]/25">
                        {new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Buyer */}
          <InfoCard title="Acheteur·se">
            {order.buyer ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E0337E]/15 border border-[#E0337E]/20 flex items-center justify-center shrink-0">
                    <span className="font-fraunces text-sm text-[#E0337E]">
                      {(order.buyer.full_name ?? order.buyer.pseudo ?? "?")[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-hanken text-sm text-[#F3EADB]">{order.buyer.full_name ?? order.buyer.pseudo ?? "—"}</p>
                    <p className="font-mono text-[10px] text-[#F3EADB]/35">{order.buyer.email}</p>
                  </div>
                </div>
                <Link href={`/admin/users`}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-[#a78bfa]/60 hover:text-[#a78bfa] transition-colors">
                  <ExternalLink size={10} /> Voir le profil
                </Link>
              </div>
            ) : (
              <p className="font-hanken text-sm text-[#F3EADB]/30 italic">Acheteur inconnu</p>
            )}
          </InfoCard>

          {/* Shipping address */}
          {order.shipping_address && (
            <InfoCard title="Adresse de livraison">
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-[#F3EADB]/25 mt-0.5 shrink-0" />
                <div className="font-hanken text-sm text-[#F3EADB]/60 leading-relaxed">
                  {Object.values(order.shipping_address).filter(Boolean).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </InfoCard>
          )}

          {/* Payment */}
          <InfoCard title="Paiement">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#F3EADB]/35">Montant</span>
                <span className="font-fraunces text-lg text-[#F3EADB]">{fmt(order.total_amount)}</span>
              </div>
              {order.stripe_payment_intent_id && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#F3EADB]/35">Stripe PI</span>
                  <code className="font-mono text-[9px] text-[#F3EADB]/25">{order.stripe_payment_intent_id.slice(0, 20)}…</code>
                </div>
              )}
            </div>
          </InfoCard>

          {/* Timestamps */}
          <InfoCard title="Dates">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#F3EADB]/35 flex items-center gap-1.5"><Clock size={9} /> Créée</span>
                <span className="font-mono text-[10px] text-[#F3EADB]/50">{new Date(order.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#F3EADB]/35 flex items-center gap-1.5"><Clock size={9} /> Mise à jour</span>
                <span className="font-mono text-[10px] text-[#F3EADB]/50">{new Date(order.updated_at).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
