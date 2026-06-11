"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Truck, Hand, Loader2 } from "lucide-react";
import type { CartItem } from "@/store/cart";

type Method = { id: string; type: "relay" | "home" | "pickup"; label: string; price: number; free_above: number | null; enabled: boolean };
type ShopGroup = { shop_id: string; shop_name: string; subtotal: number; methods: Method[] };
type RelayPoint = { id?: string; name: string; address: string; zip: string; city: string };
export type ShipmentSelection = {
  shop_id: string; shop_name: string;
  method_id: string; method_type: Method["type"]; method_label: string;
  cost: number; relay_point: RelayPoint | null;
};

const ICON: Record<Method["type"], React.ElementType> = { relay: MapPin, home: Truck, pickup: Hand };

function costOf(m: Method, subtotal: number) {
  if (m.free_above != null && subtotal >= m.free_above) return 0;
  return Math.max(0, Number(m.price) || 0);
}

export function ShippingStep({
  items, onChange,
}: {
  items: CartItem[];
  onChange: (sel: ShipmentSelection[], shippingTotal: number, complete: boolean) => void;
}) {
  const [groups, setGroups] = useState<ShopGroup[] | null>(null);
  const [chosen, setChosen] = useState<Record<string, string>>({});       // shop_id -> method_id
  const [relays, setRelays] = useState<Record<string, RelayPoint>>({});    // shop_id -> relay point

  // Charge les boutiques du panier + leurs options de livraison
  useEffect(() => {
    let cancel = false;
    (async () => {
      const supabase = createClient();
      const ids = items.map(i => i.id);
      const { data: products } = await supabase.from("products").select("id, shop_id, price").in("id", ids);
      const shopOf: Record<string, string> = {};
      (products ?? []).forEach(p => { shopOf[p.id] = p.shop_id; });
      const shopIds = [...new Set(Object.values(shopOf).filter(Boolean))];
      if (!shopIds.length) { if (!cancel) setGroups([]); return; }
      const { data: shops } = await supabase.from("shops").select("id, name, shipping_options").in("id", shopIds);

      const subtotalByShop: Record<string, number> = {};
      items.forEach(i => { const sid = shopOf[i.id]; if (sid) subtotalByShop[sid] = (subtotalByShop[sid] ?? 0) + i.price * i.quantity; });

      const g: ShopGroup[] = (shops ?? []).map(s => {
        const all = (Array.isArray(s.shipping_options) ? s.shipping_options : []) as Method[];
        const methods = all.filter(m => m && m.enabled);
        return { shop_id: s.id, shop_name: s.name, subtotal: subtotalByShop[s.id] ?? 0, methods };
      });
      if (!cancel) {
        setGroups(g);
        // pré-sélection : 1re méthode dispo de chaque boutique
        setChosen(Object.fromEntries(g.map(x => [x.shop_id, x.methods[0]?.id]).filter(([, v]) => v)) as Record<string, string>);
      }
    })();
    return () => { cancel = true; };
  }, [items]);

  // Calcule + remonte la sélection au parent
  const emit = useCallback(() => {
    if (!groups) return;
    const sel: ShipmentSelection[] = [];
    let complete = true;
    let total = 0;
    for (const g of groups) {
      const mid = chosen[g.shop_id];
      const m = g.methods.find(x => x.id === mid);
      if (!m) { complete = false; continue; }
      const cost = costOf(m, g.subtotal);
      total += cost;
      const rp = m.type === "relay" ? (relays[g.shop_id] ?? null) : null;
      if (m.type === "relay" && (!rp || !rp.name || !rp.zip)) complete = false;
      sel.push({ shop_id: g.shop_id, shop_name: g.shop_name, method_id: m.id, method_type: m.type, method_label: m.label, cost, relay_point: rp });
    }
    if (groups.length === 0) complete = true; // panier sans boutique physique (services/events)
    onChange(sel, total, complete);
  }, [groups, chosen, relays, onChange]);

  useEffect(() => { emit(); }, [emit]);

  if (groups === null) return <div className="flex items-center gap-2 text-[#101014]/40 py-6"><Loader2 size={15} className="animate-spin" /> Chargement des modes de livraison…</div>;
  if (groups.length === 0) return null;

  return (
    <div className="space-y-4">
      {groups.map(g => {
        const noMethod = g.methods.length === 0;
        return (
          <div key={g.shop_id} className="rounded-2xl border border-[#ECE6DB] bg-white p-4">
            <p className="font-bricolage font-semibold text-[13.5px] text-[#101014] mb-3">Livraison · {g.shop_name}</p>
            {noMethod ? (
              <p className="font-hanken text-xs text-[#101014]/40">Cette boutique n'a pas encore configuré ses modes de livraison. Contacte-la ou réessaie plus tard.</p>
            ) : (
              <div className="space-y-2">
                {g.methods.map(m => {
                  const Icon = ICON[m.type];
                  const cost = costOf(m, g.subtotal);
                  const active = chosen[g.shop_id] === m.id;
                  return (
                    <div key={m.id}>
                      <label className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${active ? "border-[#FF2DA0] bg-[#FF2DA0]/5" : "border-[#101014]/12 hover:border-[#101014]/25"}`}>
                        <input type="radio" name={`ship_${g.shop_id}`} checked={active}
                          onChange={() => setChosen(c => ({ ...c, [g.shop_id]: m.id }))}
                          className="accent-[#FF2DA0]" />
                        <Icon size={15} className="text-[#101014]/45 shrink-0" />
                        <span className="font-hanken text-sm text-[#101014] flex-1">{m.label}</span>
                        <span className="font-mono text-xs text-[#101014]/70">{cost === 0 ? "Offert" : `${cost.toFixed(2)} €`}</span>
                      </label>

                      {active && m.type === "relay" && (
                        <div className="mt-2 ml-7">
                          <RelayPicker value={relays[g.shop_id] ?? null}
                            onPick={rp => setRelays(r => ({ ...r, [g.shop_id]: rp }))} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Sélecteur de point relais (alimenté par Sendcloud) ──
type SP = { id: string; name: string; street: string; postal_code: string; city: string; distance: number | null };
function RelayPicker({ value, onPick }: { value: RelayPoint | null; onPick: (rp: RelayPoint) => void }) {
  const [zip, setZip] = useState(value?.zip ?? "");
  const [list, setList] = useState<SP[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const search = async () => {
    if (!zip.trim()) return;
    setLoading(true); setErr(""); setList([]);
    try {
      const res = await fetch(`/api/shipping/service-points?country=fr&postal_code=${encodeURIComponent(zip.trim())}&carrier=mondial_relay`);
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Recherche impossible"); }
      else setList(j.service_points ?? []);
    } catch { setErr("Erreur réseau"); }
    setLoading(false);
  };

  return (
    <div className="rounded-xl bg-[#101014]/[0.02] border border-[#101014]/8 p-3 space-y-2">
      <p className="font-mono text-[10px] text-[#101014]/40">Choisis ton point relais</p>
      {value?.name && (
        <div className="flex items-start gap-2 rounded-lg bg-[#FF2DA0]/5 border border-[#FF2DA0]/20 px-2.5 py-2">
          <MapPin size={13} className="text-[#FF2DA0] mt-0.5 shrink-0" />
          <div className="text-[12px] text-[#101014]"><strong>{value.name}</strong><br /><span className="text-[#101014]/55">{value.address} · {value.zip} {value.city}</span></div>
        </div>
      )}
      <div className="flex gap-2">
        <input value={zip} onChange={e => setZip(e.target.value)} placeholder="Ton code postal" inputMode="numeric"
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), search())}
          className="flex-1 bg-white border border-[#101014]/10 rounded-lg px-3 py-2 font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/50" />
        <button type="button" onClick={search} disabled={loading}
          className="px-3 rounded-lg bg-[#101014] text-white font-hanken text-xs disabled:opacity-50">
          {loading ? "…" : "Chercher"}
        </button>
      </div>
      {err && <p className="font-hanken text-[11px] text-amber-600">{err}</p>}
      {list.length > 0 && (
        <div className="max-h-44 overflow-y-auto divide-y divide-[#101014]/5 rounded-lg border border-[#101014]/8 bg-white">
          {list.map(sp => (
            <button key={sp.id} type="button"
              onClick={() => onPick({ id: sp.id, name: String(sp.name), address: sp.street, zip: sp.postal_code, city: sp.city })}
              className="w-full text-left px-2.5 py-2 hover:bg-[#FF2DA0]/5 transition-colors">
              <p className="font-hanken text-[12.5px] text-[#101014]">{sp.name}</p>
              <p className="font-mono text-[10px] text-[#101014]/45">{sp.street} · {sp.postal_code} {sp.city}{sp.distance ? ` · ${Math.round(sp.distance / 1000 * 10) / 10} km` : ""}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
