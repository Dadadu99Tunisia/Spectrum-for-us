"use client";
import { useEffect, useState, useCallback } from "react";
import { Store, Search, CheckCircle, Clock, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

type Vendor = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  vendor_kyc: {
    kyc_status: string;
    legal_name: string | null;
    siret: string | null;
    kyc_submitted_at: string | null;
  } | null;
  profiles: { id: string; full_name: string | null; pseudo: string | null } | null;
};

const KYC_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending:   { label: "En attente",  icon: Clock,        color: "text-[#101014]/40", bg: "bg-[#101014]/[0.09] border-[#101014]/[0.14]" },
  submitted: { label: "À vérifier",  icon: AlertCircle,  color: "text-[#FFD400]",    bg: "bg-[#FFD400]/10 border-[#FFD400]/20" },
  verified:  { label: "Vérifié",     icon: CheckCircle,  color: "text-green-600",    bg: "bg-green-500/10 border-green-500/20" },
  rejected:  { label: "Rejeté",      icon: XCircle,      color: "text-red-600",      bg: "bg-red-500/10 border-red-500/20" },
};

export default function VendorsPage() {
  const [vendors, setVendors]   = useState<Vendor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [kycFilter, setKycFilter] = useState("");
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const LIMIT = 20;

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set("search", search);
    if (kycFilter) params.set("status", kycFilter);
    try {
      const res = await fetch(`/api/admin/vendors?${params}`);
      const json = await res.json();
      setVendors(json.data ?? []);
      setTotal(json.meta?.total ?? 0);
    } catch {
      // silently fail · show empty state
    } finally {
      setLoading(false);
    }
  }, [page, search, kycFilter]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);
  useEffect(() => { setPage(1); }, [search, kycFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-fraunces text-2xl text-[#101014]">Vendeurs</h1>
        <p className="font-hanken text-sm text-[#101014]/40 mt-0.5">{total} boutique{total !== 1 ? "s" : ""} enregistrée{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#101014]/25" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une boutique…"
            className="w-full pl-9 pr-4 py-2 bg-[#101014]/[0.09] border border-[#101014]/[0.14] rounded-lg font-hanken text-sm text-[#101014] placeholder-[#101014]/25 focus:outline-none focus:border-[#a78bfa]/50 transition-colors" />
        </div>
        <div className="flex gap-1 p-1 bg-[#101014]/[0.08] rounded-lg">
          {[["","Tous"],["submitted","À vérifier"],["verified","Vérifiés"],["pending","En attente"],["rejected","Rejetés"]].map(([val, label]) => (
            <button key={val} onClick={() => setKycFilter(val)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] transition-all ${
                kycFilter === val ? "bg-[#FF2DA0] text-white" : "text-[#101014]/40 hover:text-[#101014]"
              }`}>{label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-20">
          <Store size={40} className="mx-auto mb-3 text-[#101014]/10" />
          <p className="font-hanken text-[#101014]/30">Aucune boutique trouvée</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[#101014]/[0.13] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#101014]/[0.12] bg-[#101014]/[0.07]">
                  {["Boutique","Propriétaire","KYC","SIRET","Active","Inscription",""].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-[#101014]/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => {
                  const kyc = v.vendor_kyc;
                  const kycStatus = kyc?.kyc_status ?? "pending";
                  const cfg = KYC_CONFIG[kycStatus] ?? KYC_CONFIG.pending;
                  const Icon = cfg.icon;
                  return (
                    <tr key={v.id} onClick={() => { window.location.href = `/admin/vendors/${v.id}`; }}
                      className="border-b border-[#101014]/[0.05] hover:bg-[#101014]/[0.07] transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-hanken text-sm text-[#101014]">{v.name}</p>
                          <p className="font-mono text-[9px] text-[#101014]/25">{v.slug}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-hanken text-sm text-[#101014]/70">
                          {v.profiles?.full_name ?? v.profiles?.pseudo ?? "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded-full font-mono text-[9px] border ${cfg.bg} ${cfg.color}`}>
                          <Icon size={9} /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[#101014]/40">{kyc?.siret ?? "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`w-2 h-2 rounded-full ${v.is_active ? "bg-green-400" : "bg-[#101014]/15"}`} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-[#101014]/30">
                          {new Date(v.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/vendors/${v.id}`}
                          className="p-1.5 rounded-lg text-[#101014]/25 hover:text-[#101014] transition-colors inline-flex">
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#101014]/25">
                {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)} sur {total}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#101014]/[0.14] font-mono text-[10px] text-[#101014]/40 hover:text-[#101014] disabled:opacity-30 transition-colors">
                  ← Préc.
                </button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * LIMIT >= total}
                  className="px-3 py-1.5 rounded-lg border border-[#101014]/[0.14] font-mono text-[10px] text-[#101014]/40 hover:text-[#101014] disabled:opacity-30 transition-colors">
                  Suiv. →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
