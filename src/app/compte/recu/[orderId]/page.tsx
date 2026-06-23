"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LEGAL, legalFooterLines } from "@/lib/legal";
import { ArrowLeft, Printer } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const CONTENT = {
  fr: {
    dateLocale: "fr-FR",
    notFound: "Reçu introuvable.",
    loading: "Chargement…",
    myOrders: "Mes commandes",
    print: "Imprimer / Enregistrer en PDF",
    receiptTitle: "Reçu de commande",
    refPrefix: "N°",
    billedTo: "Facturé à",
    item: "Article",
    shop: "Boutique",
    qty: "Qté",
    price: "Prix",
    total: "Total",
    defaultItem: "Article",
    subtotal: "Sous-total",
    shipping: "Frais de port",
    free: "Offert",
    discount: "Remise",
    totalPaid: "Total payé",
    intermediary:
      "Spectrum For Us agit en qualité d'intermédiaire. La vente est conclue avec chaque boutique vendeuse.",
    withdrawalPre: "Droit de rétractation 14 jours (hors exceptions légales) — voir nos ",
    cgv: "CGV",
    withdrawalPost: ".",
  },
  en: {
    dateLocale: "en-GB",
    notFound: "Receipt not found.",
    loading: "Loading…",
    myOrders: "My orders",
    print: "Print / Save as PDF",
    receiptTitle: "Order receipt",
    refPrefix: "No.",
    billedTo: "Billed to",
    item: "Item",
    shop: "Shop",
    qty: "Qty",
    price: "Price",
    total: "Total",
    defaultItem: "Item",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    discount: "Discount",
    totalPaid: "Total paid",
    intermediary:
      "Spectrum For Us acts as an intermediary. Each sale is concluded with the selling shop.",
    withdrawalPre: "14-day right of withdrawal (legal exceptions apply) — see our ",
    cgv: "Terms of Sale",
    withdrawalPost: ".",
  },
} as const;

type Order = {
  id: string; total_amount: number; status: string; created_at: string;
  shipping_name: string | null; shipping_address: string | null; shipping_zip: string | null;
  shipping_city: string | null; shipping_country: string | null; shipping_email: string | null;
};
type Item = { id: string; quantity: number; price_at_purchase: number; products: { name: string | null; title: string | null; shops: { name: string } | null } | null };
type Ship = { method_label: string | null; shipping_cost: number };

export default function ReceiptPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { user, loading } = useAuth();
  const { locale } = useI18n();
  const C = CONTENT[locale === "en" ? "en" : "fr"];
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/auth?redirect=/compte"); return; }
    const supabase = createClient();
    (async () => {
      const { data: o } = await supabase.from("orders").select("*").eq("id", orderId).eq("user_id", user.id).maybeSingle();
      if (!o) { setNotFound(true); return; }
      const [{ data: it }, { data: sh }] = await Promise.all([
        supabase.from("order_items").select("id, quantity, price_at_purchase, products(name, title, shops(name))").eq("order_id", orderId),
        supabase.from("order_shipments").select("method_label, shipping_cost").eq("order_id", orderId),
      ]);
      setOrder(o as Order);
      setItems((it ?? []) as unknown as Item[]);
      setShips((sh ?? []) as Ship[]);
    })();
  }, [user, loading, orderId, router]);

  if (notFound) return <div className="min-h-screen flex items-center justify-center font-hanken text-[#101014]/50">{C.notFound}</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center font-hanken text-[#101014]/40">{C.loading}</div>;

  const ref = order.id.slice(0, 8).toUpperCase();
  const subtotal = items.reduce((s, i) => s + Number(i.price_at_purchase) * i.quantity, 0);
  const shipping = ships.reduce((s, x) => s + Number(x.shipping_cost), 0);
  const total = Number(order.total_amount);
  const footer = legalFooterLines();

  return (
    <div className="min-h-screen bg-[#F1ECE3] py-8 px-4 print:bg-white print:py-0">
      {/* Barre d'actions (cachée à l'impression) */}
      <div className="max-w-[760px] mx-auto flex items-center justify-between mb-4 print:hidden">
        <button onClick={() => router.push("/compte")} className="inline-flex items-center gap-2 font-hanken text-sm text-[#101014]/60 hover:text-[#101014]">
          <ArrowLeft size={16} /> {C.myOrders}
        </button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101014] text-white font-hanken text-sm hover:brightness-125">
          <Printer size={15} /> {C.print}
        </button>
      </div>

      {/* Document */}
      <div className="max-w-[760px] mx-auto bg-white rounded-2xl print:rounded-none shadow-sm p-8 md:p-12 text-[#101014]">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-fraunces text-2xl font-bold">{C.receiptTitle}</h1>
            <p className="font-mono text-xs text-[#101014]/50 mt-1">{C.refPrefix} {ref}</p>
            <p className="font-mono text-xs text-[#101014]/50">{new Date(order.created_at).toLocaleDateString(C.dateLocale, { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="text-right">
            <p className="font-fraunces text-lg font-bold">{LEGAL.brand}</p>
            <p className="font-mono text-[10px] text-[#101014]/40">{LEGAL.site}</p>
          </div>
        </div>

        {/* Destinataire */}
        <div className="mb-7">
          <p className="font-mono text-[10px] uppercase tracking-wide text-[#101014]/35 mb-1">{C.billedTo}</p>
          <p className="font-hanken text-sm">{order.shipping_name ?? "—"}</p>
          {order.shipping_address && <p className="font-hanken text-sm text-[#101014]/70">{order.shipping_address}</p>}
          <p className="font-hanken text-sm text-[#101014]/70">
            {[order.shipping_zip, order.shipping_city, order.shipping_country].filter(Boolean).join(" · ")}
          </p>
          {order.shipping_email && <p className="font-hanken text-sm text-[#101014]/50">{order.shipping_email}</p>}
        </div>

        {/* Lignes */}
        <div className="overflow-x-auto -mx-1 px-1 mb-6">
        <table className="w-full min-w-[360px] text-sm">
          <thead>
            <tr className="border-b border-[#101014]/15 text-[#101014]/45 font-mono text-[10px] uppercase tracking-wide">
              <th className="text-left py-2 font-normal">{C.item}</th>
              <th className="text-left py-2 font-normal">{C.shop}</th>
              <th className="text-center py-2 font-normal">{C.qty}</th>
              <th className="text-right py-2 font-normal">{C.price}</th>
              <th className="text-right py-2 font-normal">{C.total}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => {
              const name = it.products?.name || it.products?.title || C.defaultItem;
              const shop = it.products?.shops?.name ?? "—";
              const line = Number(it.price_at_purchase) * it.quantity;
              return (
                <tr key={it.id} className="border-b border-[#101014]/8">
                  <td className="py-2.5 font-hanken">{name}</td>
                  <td className="py-2.5 font-hanken text-[#101014]/60">{shop}</td>
                  <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                  <td className="py-2.5 text-right font-mono">{Number(it.price_at_purchase).toFixed(2)} €</td>
                  <td className="py-2.5 text-right font-mono">{line.toFixed(2)} €</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        {/* Totaux */}
        <div className="flex justify-end">
          <div className="w-full max-w-[260px] space-y-1.5">
            <div className="flex justify-between font-hanken text-sm text-[#101014]/70"><span>{C.subtotal}</span><span className="font-mono">{subtotal.toFixed(2)} €</span></div>
            <div className="flex justify-between font-hanken text-sm text-[#101014]/70"><span>{C.shipping}</span><span className="font-mono">{shipping === 0 ? C.free : `${shipping.toFixed(2)} €`}</span></div>
            {Math.round((subtotal + shipping - total) * 100) > 0 && (
              <div className="flex justify-between font-hanken text-sm text-green-600"><span>{C.discount}</span><span className="font-mono">−{(subtotal + shipping - total).toFixed(2)} €</span></div>
            )}
            <div className="flex justify-between font-fraunces font-bold text-base border-t border-[#101014]/15 pt-2 mt-1"><span>{C.totalPaid}</span><span className="font-mono">{total.toFixed(2)} €</span></div>
          </div>
        </div>

        <p className="font-mono text-[10px] text-[#101014]/35 mt-8">
          {C.intermediary}{" "}
          {C.withdrawalPre}<span className="underline">{C.cgv}</span>{C.withdrawalPost}
        </p>

        {/* Pied de page légal */}
        <div className="mt-6 pt-4 border-t border-[#101014]/10 text-center">
          {footer.map((l, i) => (
            <p key={i} className="font-mono text-[9px] text-[#101014]/35 leading-relaxed">{l}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
