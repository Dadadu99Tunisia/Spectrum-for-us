"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Package, Check, Loader2, Pencil } from "lucide-react";

type Creds = {
  public_key: string; secret_key: string;
  sender_name: string; sender_address: string; sender_zip: string; sender_city: string; sender_country: string;
};
const EMPTY: Creds = { public_key: "", secret_key: "", sender_name: "", sender_address: "", sender_zip: "", sender_city: "", sender_country: "FR" };

export function SendcloudConnect({ shopId }: { shopId: string }) {
  const [c, setC] = useState<Creds>(EMPTY);
  const [connected, setConnected] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof Creds, v: string) => setC(s => ({ ...s, [k]: v }));

  useEffect(() => {
    createClient().from("vendor_shipping_credentials").select("*").eq("shop_id", shopId).maybeSingle()
      .then(({ data }) => {
        if (data?.public_key && data?.secret_key) {
          setConnected(true);
          setC({ public_key: data.public_key, secret_key: data.secret_key, sender_name: data.sender_name ?? "", sender_address: data.sender_address ?? "", sender_zip: data.sender_zip ?? "", sender_city: data.sender_city ?? "", sender_country: data.sender_country ?? "FR" });
        } else setEditing(true);
        setLoading(false);
      });
  }, [shopId]);

  const save = async () => {
    if (!c.public_key.trim() || !c.secret_key.trim()) { alert("Clé API publique et secrète requises."); return; }
    setSaving(true);
    const { error } = await createClient().from("vendor_shipping_credentials").upsert({
      shop_id: shopId, provider: "sendcloud",
      public_key: c.public_key.trim(), secret_key: c.secret_key.trim(),
      sender_name: c.sender_name.trim() || null, sender_address: c.sender_address.trim() || null,
      sender_zip: c.sender_zip.trim() || null, sender_city: c.sender_city.trim() || null, sender_country: c.sender_country.trim() || "FR",
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { alert("Erreur : " + error.message); return; }
    setConnected(true); setEditing(false);
  };

  if (loading) return null;
  const I = "w-full bg-[#101014]/5 border border-[#101014]/12 rounded-xl px-3 py-2.5 font-hanken text-sm focus:outline-none focus:border-[#FF2DA0]/50";

  return (
    <div className="mt-6 rounded-2xl border border-[#101014]/12 bg-white p-4 max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <Package size={16} className="text-[#FF2DA0]" />
        <h3 className="font-bricolage font-semibold text-[15px] text-[#101014]">Étiquettes automatiques · Sendcloud</h3>
        {connected && !editing && <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] rounded-full px-2 py-0.5 bg-green-500/10 text-green-600"><Check size={11} /> Connecté</span>}
      </div>

      {connected && !editing ? (
        <div>
          <p className="font-hanken text-[13px] text-[#101014]/55">Ton compte Sendcloud est connecté. Tu pourras générer tes étiquettes (et le suivi) en un clic depuis tes commandes.</p>
          <button onClick={() => setEditing(true)} className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#FF2DA0]"><Pencil size={11} /> Modifier</button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <p className="font-hanken text-[13px] text-[#101014]/55">
            Connecte <strong>ton</strong> compte Sendcloud (gratuit). C&apos;est ton compte qui paie les étiquettes — couvert par les frais de port que tu reçois. La clé se trouve sur Sendcloud → Paramètres → Intégrations → API.
          </p>
          <input value={c.public_key} onChange={e => set("public_key", e.target.value)} placeholder="Clé API publique Sendcloud" className={I} />
          <input value={c.secret_key} onChange={e => set("secret_key", e.target.value)} placeholder="Clé API secrète Sendcloud" type="password" className={I} />
          <p className="font-mono text-[10px] text-[#101014]/40 pt-1">Adresse d&apos;expédition (l&apos;expéditeur·rice qui figurera sur l&apos;étiquette)</p>
          <input value={c.sender_name} onChange={e => set("sender_name", e.target.value)} placeholder="Nom / boutique" className={I} />
          <input value={c.sender_address} onChange={e => set("sender_address", e.target.value)} placeholder="Adresse" className={I} />
          <div className="flex gap-2">
            <input value={c.sender_zip} onChange={e => set("sender_zip", e.target.value)} placeholder="Code postal" className={I + " w-1/3"} />
            <input value={c.sender_city} onChange={e => set("sender_city", e.target.value)} placeholder="Ville" className={I + " flex-1"} />
            <input value={c.sender_country} onChange={e => set("sender_country", e.target.value)} placeholder="Pays" className={I + " w-20"} />
          </div>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101014] text-white font-hanken text-sm hover:brightness-125 disabled:opacity-40">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Connecter Sendcloud
          </button>
        </div>
      )}
    </div>
  );
}
