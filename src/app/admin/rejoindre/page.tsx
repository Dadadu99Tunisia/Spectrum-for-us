"use client";
import { useEffect, useState } from "react";
import { Check, X, Clock, Mail, Globe, Link2, Users } from "lucide-react";
import { SpectrumLoader } from "@/components/ui/SpectrumLoader";

const ACTIVITY_LABELS: Record<string, string> = {
  createur: "Créateur·ice",
  artiste: "Artiste",
  freelance: "Freelance",
  therapeute: "Thérapeute",
  coach: "Coach",
  avocat: "Avocat·e",
  medecin: "Médecin",
  educateur: "Éducateur·ice",
  autre: "Autre",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#E0901E]/10 text-[#E0901E] border-[#E0901E]/20",
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected: "bg-red-400/10 text-red-400 border-red-400/20",
  contacted: "bg-[#1C9C95]/10 text-[#1C9C95] border-[#1C9C95]/20",
};

type JoinRequest = {
  id: string;
  name: string;
  email: string;
  activity_type: string;
  description: string | null;
  website: string | null;
  instagram: string | null;
  is_queer: boolean;
  status: string;
  created_at: string;
};

export default function AdminRejoindrePage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/rejoindre")
      .then(r => r.json())
      .then(d => { setRequests(d); setLoading(false); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch("/api/admin/rejoindre", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setRequests(r => r.map(x => x.id === id ? { ...x, status } : x));
    }
    setUpdating(null);
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);
  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    contacted: requests.filter(r => r.status === "contacted").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Demandes « Rejoindre »</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-1">{counts.pending} en attente · {counts.all} total</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F3EADB]/5 border border-[#F3EADB]/10">
          <Users size={14} className="text-[#F3EADB]/30 ml-2" />
          <span className="font-mono text-xs text-[#F3EADB]/40 mr-2">{counts.all}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["all", "pending", "approved", "contacted", "rejected"] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-colors border ${
              filter === s
                ? "bg-[#E0337E]/15 text-[#E0337E] border-[#E0337E]/30"
                : "text-[#F3EADB]/40 border-[#F3EADB]/10 hover:text-[#F3EADB]/70"
            }`}
          >
            {s === "all" ? "Tout" : s} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <SpectrumLoader size="sm" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#F3EADB]/30 font-hanken text-sm">Aucune demande.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02] p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-bricolage font-semibold text-[#F3EADB]">{r.name}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded border bg-[#6D2DB5]/15 text-[#9B6DD5] border-[#6D2DB5]/25">
                      {ACTIVITY_LABELS[r.activity_type] ?? r.activity_type}
                    </span>
                    {r.is_queer && (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded border bg-[#E0337E]/10 text-[#E0337E] border-[#E0337E]/20">
                        🏳️‍🌈 queer/allié·e
                      </span>
                    )}
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${STATUS_STYLES[r.status] ?? STATUS_STYLES.pending}`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3 text-xs font-hanken text-[#F3EADB]/45">
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-[#E0337E] transition-colors">
                      <Mail size={11} /> {r.email}
                    </a>
                    {r.instagram && (
                      <span className="flex items-center gap-1">
                        <Link2 size={11} /> {r.instagram}
                      </span>
                    )}
                    {r.website && (
                      <a href={r.website.startsWith("http") ? r.website : `https://${r.website}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-[#E0337E] transition-colors">
                        <Globe size={11} /> {r.website}
                      </a>
                    )}
                    <span className="flex items-center gap-1 text-[#F3EADB]/25">
                      <Clock size={11} /> {new Date(r.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  {r.description && (
                    <p className="font-hanken text-sm text-[#F3EADB]/60 leading-relaxed border-l-2 border-[#F3EADB]/10 pl-3">
                      {r.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => updateStatus(r.id, "contacted")}
                    disabled={updating === r.id || r.status === "contacted"}
                    className="px-3 py-1.5 rounded-lg border border-[#1C9C95]/25 text-[#1C9C95] text-xs font-hanken hover:bg-[#1C9C95]/10 transition-colors disabled:opacity-40"
                    title="Marquer comme contacté·e"
                  >
                    Contacté·e
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "approved")}
                    disabled={updating === r.id || r.status === "approved"}
                    className="p-1.5 rounded-lg border border-green-500/25 text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40"
                    title="Approuver"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "rejected")}
                    disabled={updating === r.id || r.status === "rejected"}
                    className="p-1.5 rounded-lg border border-red-400/20 text-red-400/60 hover:bg-red-400/10 hover:text-red-400 transition-colors disabled:opacity-40"
                    title="Refuser"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
