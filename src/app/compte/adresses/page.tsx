"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AddressForm } from "@/components/account/AddressForm";
import { EMPTY_ADDRESS, type Address } from "@/lib/types/address";
import { MapPin, Plus, Pencil, Trash2, Star, ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const T = { bg: "#FBFAF8", ink: "#101014", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF2DA0" };

const CONTENT = {
  fr: {
    back: "Mon compte",
    title: "Mes adresses",
    add: "Ajouter",
    newAddress: "Nouvelle adresse",
    editAddress: "Modifier l'adresse",
    confirmDelete: "Supprimer cette adresse ?",
    default: "Par défaut",
    makeDefault: "Par défaut",
    edit: "Modifier",
    remove: "Supprimer",
    notLoggedIn: "Connecte-toi pour gérer tes adresses.",
    login: "Se connecter",
    loading: "Chargement…",
    emptyText: "Aucune adresse enregistrée. Ajoute-en une pour payer plus vite.",
    emptyCta: "Ajouter une adresse",
  },
  en: {
    back: "My account",
    title: "My addresses",
    add: "Add",
    newAddress: "New address",
    editAddress: "Edit address",
    confirmDelete: "Delete this address?",
    default: "Default",
    makeDefault: "Set as default",
    edit: "Edit",
    remove: "Delete",
    notLoggedIn: "Log in to manage your addresses.",
    login: "Log in",
    loading: "Loading…",
    emptyText: "No saved address yet. Add one to check out faster.",
    emptyCta: "Add an address",
  },
} as const;

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const supabase = createClient();
  const [list, setList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }).order("created_at", { ascending: false });
    setList((data ?? []) as Address[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { if (!authLoading) { if (user) load(); else setLoading(false); } }, [user, authLoading, load]);

  const save = async (a: Omit<Address, "id">) => {
    if (!user) return;
    setBusy(true);
    const isEdit = editing && editing !== "new";
    if (a.is_default) await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    if (isEdit) await supabase.from("addresses").update({ ...a }).eq("id", (editing as Address).id);
    else await supabase.from("addresses").insert({ ...a, user_id: user.id });
    setBusy(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm(C.confirmDelete)) return;
    await supabase.from("addresses").delete().eq("id", id); load();
  };

  const makeDefault = async (id: string) => {
    if (!user) return;
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id); load();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: T.bg, color: T.ink }}>
        <div className="max-w-2xl mx-auto px-5 md:px-8 pt-28 pb-24">
          <Link href="/compte" className="inline-flex items-center gap-1.5 text-[13px] mb-4" style={{ color: T.soft }}><ArrowLeft size={14} /> {C.back}</Link>
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-fraunces text-[30px]">{C.title}</h1>
            {!editing && <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-semibold text-[14px] text-white" style={{ background: T.ink }}><Plus size={15} /> {C.add}</button>}
          </div>

          {editing ? (
            <div className="rounded-2xl p-6" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
              <h2 className="font-bricolage font-semibold text-[16px] mb-4">{editing === "new" ? C.newAddress : C.editAddress}</h2>
              <AddressForm
                initial={editing === "new" ? EMPTY_ADDRESS : { ...(editing as Address) }}
                onSubmit={save}
                onCancel={() => setEditing(null)}
                submitting={busy}
              />
            </div>
          ) : !user && !authLoading ? (
            <Empty text={C.notLoggedIn} cta={C.login} href="/auth" />
          ) : loading ? (
            <p style={{ color: T.faint }}>{C.loading}</p>
          ) : list.length === 0 ? (
            <Empty text={C.emptyText} cta={C.emptyCta} onClick={() => setEditing("new")} />
          ) : (
            <div className="space-y-3">
              {list.map((a) => (
                <div key={a.id} className="rounded-2xl p-5 flex items-start gap-3" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                  <MapPin size={18} className="mt-0.5 shrink-0" style={{ color: T.mag }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bricolage font-semibold text-[15px]">{a.label || a.full_name}</span>
                      {a.is_default && <span className="font-mono text-[10px] rounded-full px-2 py-0.5" style={{ background: `${T.mag}1A`, color: T.mag }}>{C.default}</span>}
                    </div>
                    <p className="text-[14px] mt-0.5" style={{ color: T.soft }}>{a.full_name} · {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.zip} {a.city}, {a.country}</p>
                    {a.phone && <p className="text-[13px]" style={{ color: T.faint }}>{a.phone}</p>}
                    <div className="flex gap-3 mt-2 text-[13px]">
                      {!a.is_default && <button onClick={() => makeDefault(a.id)} className="inline-flex items-center gap-1" style={{ color: T.soft }}><Star size={13} /> {C.makeDefault}</button>}
                      <button onClick={() => setEditing(a)} className="inline-flex items-center gap-1" style={{ color: T.soft }}><Pencil size={13} /> {C.edit}</button>
                      <button onClick={() => remove(a.id)} className="inline-flex items-center gap-1" style={{ color: "#c0392b" }}><Trash2 size={13} /> {C.remove}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Empty({ text, cta, href, onClick }: { text: string; cta: string; href?: string; onClick?: () => void }) {
  const inner = (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 font-semibold text-[15px] text-white" style={{ background: "#101014" }}>{cta}</button>
  );
  return (
    <div className="text-center py-16 rounded-2xl" style={{ background: "#fff", boxShadow: "inset 0 0 0 1px #ECE6DB" }}>
      <MapPin size={26} className="mx-auto mb-3" style={{ color: "#9B9285" }} />
      <p className="text-[15px] mb-5" style={{ color: "#6B6258" }}>{text}</p>
      {href ? <Link href={href} className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 font-semibold text-[15px] text-white" style={{ background: "#101014" }}>{cta}</Link> : inner}
    </div>
  );
}
