"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Store, CheckCircle, XCircle, AlertCircle, Clock,
  ExternalLink, Package, Globe, Link2, Trash2, Save, Power, BadgeCheck
} from "lucide-react";

type VendorDetail = {
  shop: Record<string, unknown>;
  kyc: Record<string, unknown> | null;
  recent_products: Record<string, unknown>[];
  recent_orders: Record<string, unknown>[];
  product_count: number;
};

const KYC_STATUS_UI: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:   { label: "En attente",   color: "text-[#1A1612]/50", bg: "bg-[#1A1612]/5 border-[#1A1612]/10",   icon: Clock },
  submitted: { label: "Soumis",       color: "text-[#E0901E]",    bg: "bg-[#E0901E]/10 border-[#E0901E]/20",   icon: AlertCircle },
  verified:  { label: "Vérifié ✓",   color: "text-green-600",    bg: "bg-green-500/10 border-green-500/20",   icon: CheckCircle },
  rejected:  { label: "Rejeté",       color: "text-red-600",      bg: "bg-red-500/10 border-red-500/20",       icon: XCircle },
};

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData]       = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes]     = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast]     = useState<string | null>(null);
  const [form, setForm]       = useState<{ name: string; tagline: string; description: string; city: string; country: string; contact_email: string } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/vendors/${id}`)
      .then(r => r.json())
      .then(j => {
        setData(j.data); setLoading(false);
        const s = j.data?.shop ?? {};
        setForm({ name: s.name ?? "", tagline: s.tagline ?? "", description: s.description ?? "", city: s.city ?? "", country: s.country ?? "", contact_email: s.contact_email ?? "" });
      });
  }, [id]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  const patchShop = async (payload: Record<string, unknown>, label: string) => {
    setActionLoading(label);
    const res = await fetch(`/api/admin/vendors/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json(); setActionLoading(null);
    if (!json.error) { flash("Boutique mise à jour ✓"); setData(prev => prev ? { ...prev, shop: { ...prev.shop, ...json.data } } : prev); }
    else flash(`Erreur : ${json.error}`);
  };

  const deleteShop = async () => {
    if (!confirm("Supprimer définitivement cette boutique et tous ses produits ? Irréversible.")) return;
    setActionLoading("delete");
    const res = await fetch(`/api/admin/vendors/${id}`, { method: "DELETE" });
    const json = await res.json(); setActionLoading(null);
    if (!json.error) router.push("/admin/vendors");
    else flash(`Erreur : ${json.error}`);
  };

  const handleKyc = async (action: "approve" | "reject") => {
    setActionLoading(action);
    const res = await fetch(`/api/admin/vendors/${id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes }),
    });
    const json = await res.json();
    setActionLoading(null);
    if (!json.error) {
      setToast(action === "approve" ? "KYC approuvé ✓" : "KYC rejeté");
      setData(prev => prev ? { ...prev, kyc: json.data } : null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 border-[#FF3D7F] border-t-transparent animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="text-center py-20">
      <p className="font-hanken text-[#1A1612]/40">Boutique introuvable</p>
    </div>
  );

  const { shop, kyc, recent_products, recent_orders, product_count } = data;
  const kycStatus = (kyc?.kyc_status as string) ?? "pending";
  const kycUi = KYC_STATUS_UI[kycStatus] ?? KYC_STATUS_UI.pending;
  const KycIcon = kycUi.icon;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#FF3D7F] text-white font-hanken text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-[#1A1612]/40 hover:text-[#1A1612] transition-colors font-hanken text-sm">
        <ArrowLeft size={14} /> Retour
      </button>

      {/* Shop header */}
      <div className="flex items-start gap-5 p-6 rounded-2xl bg-[#1A1612]/3 border border-[#1A1612]/8">
        <div className="w-14 h-14 rounded-xl bg-[#6D2DB5]/20 border border-[#6D2DB5]/30 flex items-center justify-center flex-shrink-0">
          <Store size={22} className="text-[#6D2DB5]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-fraunces text-2xl text-[#1A1612]">{shop.name as string}</h1>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[9px] border ${kycUi.bg} ${kycUi.color}`}>
              <KycIcon size={9} /> {kycUi.label}
            </span>
            <span className={`w-2 h-2 rounded-full ${shop.is_active ? "bg-green-400" : "bg-[#1A1612]/15"}`} title={shop.is_active ? "Active" : "Inactive"} />
          </div>
          <p className="font-mono text-xs text-[#1A1612]/30 mt-1">/{shop.slug as string}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="font-mono text-[10px] text-[#1A1612]/25">
              Créée le {new Date(shop.created_at as string).toLocaleDateString("fr-FR")}
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[#1A1612]/25">
              <Package size={9} /> {product_count} produits
            </span>
          </div>
        </div>
        <a href={`/boutique/${shop.slug}`} target="_blank" rel="noreferrer"
          className="p-2 rounded-lg border border-[#1A1612]/10 text-[#1A1612]/30 hover:text-[#1A1612] transition-colors">
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Gestion boutique */}
      <div className="rounded-2xl border border-[#1A1612]/8 p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-fraunces text-base text-[#1A1612]">Gestion de la boutique</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => patchShop({ is_active: !shop.is_active }, "active")} disabled={!!actionLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[10px] transition-colors disabled:opacity-40 ${shop.is_active ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-[#1A1612]/[0.07] border-[#1A1612]/[0.14] text-[#1A1612]/50"}`}>
              <Power size={11} /> {shop.is_active ? "Active" : "Inactive"}
            </button>
            <button onClick={() => patchShop({ is_verified: !shop.is_verified }, "verified")} disabled={!!actionLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[10px] transition-colors disabled:opacity-40 ${shop.is_verified ? "bg-[#1C9C95]/10 border-[#1C9C95]/20 text-[#1C9C95]" : "bg-[#1A1612]/[0.07] border-[#1A1612]/[0.14] text-[#1A1612]/50"}`}>
              <BadgeCheck size={11} /> {shop.is_verified ? "Vérifiée" : "Non vérifiée"}
            </button>
            <button onClick={deleteShop} disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 font-mono text-[10px] hover:bg-red-500/20 disabled:opacity-40">
              <Trash2 size={11} /> Supprimer
            </button>
          </div>
        </div>
        {form && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {([["name","Nom"],["tagline","Slogan"],["city","Ville"],["country","Pays"],["contact_email","Email contact"]] as const).map(([k, label]) => (
              <div key={k} className={k === "tagline" ? "md:col-span-2" : ""}>
                <label className="block font-mono text-[10px] uppercase tracking-wide text-[#1A1612]/35 mb-1.5">{label}</label>
                <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1612]/[0.07] border border-[#1A1612]/[0.14] rounded-lg font-hanken text-sm text-[#1A1612] focus:outline-none focus:border-[#a78bfa]/50" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-wide text-[#1A1612]/35 mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1612]/[0.07] border border-[#1A1612]/[0.14] rounded-lg font-hanken text-sm text-[#1A1612] focus:outline-none focus:border-[#a78bfa]/50" />
            </div>
            <div className="md:col-span-2">
              <button onClick={() => patchShop(form, "save")} disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#FF3D7F] text-white font-hanken font-semibold text-sm hover:brightness-110 disabled:opacity-50">
                <Save size={14} /> Enregistrer les modifications
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KYC Panel */}
        <div className="rounded-2xl border border-[#1A1612]/8 p-5 space-y-4">
          <h2 className="font-fraunces text-base text-[#1A1612]">Informations KYC</h2>
          {kyc ? (
            <div className="space-y-3">
              {[
                ["Raison sociale",  kyc.legal_name],
                ["Type légal",      kyc.legal_type],
                ["SIRET",           kyc.siret],
                ["N° TVA",          kyc.vat_number],
                ["IBAN",            kyc.iban ? `${(kyc.iban as string).slice(0,8)}****` : null],
                ["BIC",             kyc.bic],
                ["Adresse",         kyc.address_line1 ? `${String(kyc.address_line1)}, ${String(kyc.address_zip ?? "")} ${String(kyc.address_city ?? "")}` : null],
              ].map(([label, value]) => value ? (
                <div key={String(label)} className="flex justify-between gap-4">
                  <span className="font-mono text-[10px] text-[#1A1612]/30 uppercase tracking-wide flex-shrink-0">{String(label)}</span>
                  <span className="font-hanken text-xs text-[#1A1612]/70 text-right">{String(value)}</span>
                </div>
              ) : null)}
              {Boolean(kyc.instagram_url) && (
                <a href={kyc.instagram_url as string} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-[#FF3D7F] font-hanken text-xs hover:underline">
                  <Link2 size={12} /> Instagram
                </a>
              )}
              {Boolean(kyc.website_url) && (
                <a href={kyc.website_url as string} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-[#1C9C95] font-hanken text-xs hover:underline">
                  <Globe size={12} /> Site web
                </a>
              )}
            </div>
          ) : (
            <p className="font-hanken text-sm text-[#1A1612]/30">KYC non soumis</p>
          )}

          {/* KYC Actions */}
          {kycStatus === "submitted" && (
            <div className="pt-3 border-t border-[#1A1612]/6 space-y-3">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notes (visible par le·la vendeur·se si rejeté·e)…"
                rows={2}
                className="w-full bg-[#1A1612]/5 border border-[#1A1612]/10 rounded-lg px-3 py-2 text-[#1A1612] font-hanken text-sm placeholder-[#1A1612]/25 focus:outline-none focus:border-[#FF3D7F]/50 resize-none" />
              <div className="flex gap-2">
                <button onClick={() => handleKyc("reject")} disabled={!!actionLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 font-hanken text-sm hover:bg-red-500/20 transition-colors disabled:opacity-40">
                  <XCircle size={13} /> Rejeter
                </button>
                <button onClick={() => handleKyc("approve")} disabled={!!actionLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 font-hanken text-sm hover:bg-green-500/20 transition-colors disabled:opacity-40">
                  <CheckCircle size={13} /> Approuver
                </button>
              </div>
            </div>
          )}
          {kycStatus === "verified" && (
            <p className="font-mono text-[10px] text-green-600/70">
              ✓ Vérifié le {kyc?.kyc_verified_at ? new Date(kyc.kyc_verified_at as string).toLocaleDateString("fr-FR") : "-"}
            </p>
          )}
        </div>

        {/* Recent orders */}
        <div className="rounded-2xl border border-[#1A1612]/8 p-5 space-y-4">
          <h2 className="font-fraunces text-base text-[#1A1612]">Dernières commandes</h2>
          {recent_orders.length === 0 ? (
            <p className="font-hanken text-sm text-[#1A1612]/30">Aucune commande</p>
          ) : (
            <div className="space-y-2">
              {recent_orders.map((o: Record<string, unknown>) => (
                <div key={o.id as string} className="flex items-center justify-between py-2 border-b border-[#1A1612]/4">
                  <div>
                    <span className="font-mono text-[10px] text-[#1A1612]/30">#{(o.id as string).slice(0,8).toUpperCase()}</span>
                    <p className="font-mono text-[9px] text-[#1A1612]/20 mt-0.5">
                      {new Date(o.created_at as string).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="font-fraunces text-sm text-[#1A1612]">{Number(o.total).toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}
          <div className="pt-2">
            <h3 className="font-fraunces text-sm text-[#1A1612] mb-3 flex items-center gap-2">
              <Package size={12} /> Derniers produits
            </h3>
            {recent_products.length === 0 ? (
              <p className="font-hanken text-sm text-[#1A1612]/30">Aucun produit</p>
            ) : (
              <div className="space-y-2">
                {recent_products.map((p: Record<string, unknown>) => (
                  <div key={p.id as string} className="flex items-center justify-between py-1.5 border-b border-[#1A1612]/4">
                    <span className="font-hanken text-xs text-[#1A1612]/70 truncate flex-1">{p.title as string}</span>
                    <span className="font-fraunces text-xs text-[#1A1612]/50 ml-2">{Number(p.price).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
