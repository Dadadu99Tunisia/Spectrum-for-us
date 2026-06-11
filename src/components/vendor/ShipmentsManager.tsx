"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Package, MapPin, Truck, Hand, Check, Loader2, ExternalLink } from "lucide-react";

type Shipment = {
  id: string; order_id: string; method_type: "relay" | "home" | "pickup"; method_label: string | null;
  shipping_cost: number; relay_point: { name?: string; address?: string; zip?: string; city?: string } | null;
  carrier: string | null; tracking_number: string | null; status: string; created_at: string;
  orders: { shipping_name: string | null; shipping_address: string | null; shipping_zip: string | null; shipping_city: string | null; shipping_country: string | null; created_at: string } | null;
};

const STATUS: Record<string, { label: string; cls: string }> = {
  pending:   { label: "À expédier", cls: "bg-[#FCEAD2] text-[#9A6516]" },
  shipped:   { label: "Expédié",    cls: "bg-[#DDEBFB] text-[#2660B8]" },
  delivered: { label: "Livré",      cls: "bg-[#DCF0E5] text-[#1E8A5A]" },
};
const ICON = { relay: MapPin, home: Truck, pickup: Hand };
const CARRIERS = ["Mondial Relay", "Colissimo", "Chronopost", "Relais Colis", "UPS", "DHL", "Autre"];

export function ShipmentsManager({ shopId }: { shopId: string }) {
  const [items, setItems] = useState<Shipment[] | null>(null);
  const [draft, setDraft] = useState<Record<string, { carrier: string; tracking: string }>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("order_shipments")
      .select("*, orders(shipping_name, shipping_address, shipping_zip, shipping_city, shipping_country, created_at)")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as unknown as Shipment[]);
  }, [shopId]);

  useEffect(() => { load(); }, [load]);

  const markShipped = async (s: Shipment, status: "shipped" | "delivered") => {
    setBusy(s.id);
    const d = draft[s.id] ?? { carrier: s.carrier ?? "Mondial Relay", tracking: s.tracking_number ?? "" };
    const res = await fetch("/api/vendor/shipment", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipment_id: s.id, carrier: d.carrier, tracking_number: d.tracking, status }),
    });
    setBusy(null);
    if (res.ok) load();
    else { const j = await res.json().catch(() => ({})); alert("Erreur : " + (j.error ?? res.status)); }
  };

  const genLabel = async (id: string) => {
    setBusy(id);
    const res = await fetch("/api/vendor/sendcloud-label", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipment_id: id }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.ok) { if (j.label_url) window.open(j.label_url, "_blank"); load(); }
    else alert("Erreur : " + (j.error ?? res.status));
  };

  if (items === null) return <div className="flex items-center gap-2 text-[#101014]/40 py-4"><Loader2 size={15} className="animate-spin" /> Chargement des colis…</div>;
  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-fraunces text-lg text-[#101014] mb-3 flex items-center gap-2"><Package size={16} /> Colis à expédier</h3>
      <div className="space-y-3">
        {items.map(s => {
          const Icon = ICON[s.method_type] ?? Truck;
          const st = STATUS[s.status] ?? STATUS.pending;
          const o = s.orders;
          const dest = s.method_type === "relay"
            ? [s.relay_point?.name, s.relay_point?.address, [s.relay_point?.zip, s.relay_point?.city].filter(Boolean).join(" ")].filter(Boolean).join(" · ")
            : [o?.shipping_name, o?.shipping_address, [o?.shipping_zip, o?.shipping_city].filter(Boolean).join(" "), o?.shipping_country].filter(Boolean).join(" · ");
          const d = draft[s.id] ?? { carrier: s.carrier ?? (s.method_type === "relay" ? "Mondial Relay" : "Colissimo"), tracking: s.tracking_number ?? "" };
          return (
            <div key={s.id} className="rounded-2xl border border-[#101014]/12 bg-white p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] text-[#101014]/45">Commande #{s.order_id.slice(0, 8).toUpperCase()}</span>
                <span className={`font-mono text-[9px] px-2 py-1 rounded-full ${st.cls}`}>{st.label}</span>
              </div>
              <div className="flex items-start gap-2 mb-3">
                <Icon size={14} className="text-[#101014]/40 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-hanken text-[13px] text-[#101014]">{s.method_label ?? s.method_type}</p>
                  <p className="font-hanken text-xs text-[#101014]/55 break-words">{dest || "—"}</p>
                </div>
              </div>

              {s.status === "pending" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <select value={d.carrier}
                    onChange={e => setDraft(p => ({ ...p, [s.id]: { ...d, carrier: e.target.value } }))}
                    className="bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-2 py-1.5 font-mono text-xs">
                    {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input placeholder="N° de suivi" value={d.tracking}
                    onChange={e => setDraft(p => ({ ...p, [s.id]: { ...d, tracking: e.target.value } }))}
                    className="flex-1 min-w-[140px] bg-[#101014]/5 border border-[#101014]/12 rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#FF2DA0]/50" />
                  <button onClick={() => markShipped(s, "shipped")} disabled={busy === s.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101014] text-white font-hanken text-xs hover:brightness-125 disabled:opacity-40">
                    {busy === s.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Marquer expédié
                  </button>
                  <button onClick={() => genLabel(s.id)} disabled={busy === s.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FF2DA0]/40 text-[#FF2DA0] font-hanken text-xs hover:bg-[#FF2DA0]/5 disabled:opacity-40">
                    🏷️ Étiquette Sendcloud
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[11px] text-[#101014]/55">
                    {s.carrier ?? "Transporteur"}{s.tracking_number ? <> · <strong className="text-[#101014]">{s.tracking_number}</strong></> : null}
                  </p>
                  {s.status === "shipped" && (
                    <button onClick={() => markShipped(s, "delivered")} disabled={busy === s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#101014]/15 text-[#101014]/60 font-hanken text-xs hover:border-[#1E8A5A]/40 hover:text-[#1E8A5A]">
                      <Check size={12} /> Marquer livré
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
