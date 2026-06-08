"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, Plus, LayoutDashboard, Eye } from "lucide-react";

interface Props {
  ownerId: string;
  shopSlug: string;
}

export function ShopOwnerBar({ ownerId, shopSlug }: Props) {
  const { user, loading } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading && user?.id === ownerId) setVisible(true);
  }, [user, loading, ownerId]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[#FF2DA0]/30 bg-[#0e061a]/90 backdrop-blur-md shadow-2xl shadow-black/40">
      <span className="font-mono text-[10px] text-[#FF2DA0]/70 tracking-wide mr-1">
        Ta boutique
      </span>
      <div className="w-px h-4 bg-[#101014]/10" />
      <Link href="/vendeur"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-hanken text-[#101014]/60 hover:text-[#101014] hover:bg-[#101014]/8 transition-all">
        <LayoutDashboard size={12} /> Dashboard
      </Link>
      <Link href="/vendeur/boutique"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-hanken text-[#101014]/60 hover:text-[#101014] hover:bg-[#101014]/8 transition-all">
        <Pencil size={12} /> Modifier
      </Link>
      <Link href="/vendeur/nouveau-produit"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF2DA0]/15 text-xs font-hanken text-[#FF2DA0] hover:bg-[#FF2DA0]/25 transition-all">
        <Plus size={12} /> Produit
      </Link>
      <div className="w-px h-4 bg-[#101014]/10" />
      <span className="flex items-center gap-1 font-mono text-[10px] text-[#2323C4]/70 px-2">
        <Eye size={10} /> Vue publique
      </span>
    </div>
  );
}
