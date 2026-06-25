"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ChevronDown, Store, Package, Wallet, Truck, Bell, Sparkles, HeartHandshake, LifeBuoy } from "lucide-react";

type QA = { q: string; a: React.ReactNode };
type Section = { id: string; title: string; icon: React.ElementType; intro?: string; items: QA[] };

const L = (href: string, label: string) => <Link href={href} className="font-semibold text-[#FF2DA0] underline underline-offset-2">{label}</Link>;

const SECTIONS: Section[] = [
  {
    id: "demarrer", title: "Démarrer ma boutique", icon: Store,
    intro: "Tu crées, tu vends, on s'occupe du reste. Bienvenue chez toi 🌈",
    items: [
      { q: "Comment j'ouvre ma boutique ?", a: <>Va sur {L("/vendre", "Ouvrir ma boutique")}, crée ton compte, et c'est parti. Tu peux publier ta première création en quelques minutes — aucune validation à attendre pour démarrer.</> },
      { q: "C'est payant ?", a: <>Non, <strong>pas d'abonnement</strong>. On prend une petite commission <strong>uniquement quand tu vends</strong> (5% sur tes produits). Et si tu fais partie des <strong>fondateur·ices</strong>, c'est <strong>0% pendant 6 mois</strong>.</> },
      { q: "Qui peut vendre sur Spectrum ?", a: <>La plateforme est <strong>par et pour</strong> les personnes queer, trans, racisé·es, et leurs allié·es. Créateur·ices, artisan·es, thérapeutes, coachs, asso… tu es chez toi ici. ✨</> },
    ],
  },
  {
    id: "produits", title: "Mes produits", icon: Package,
    items: [
      { q: "Comment j'ajoute un produit ?", a: <>Depuis ton {L("/vendeur", "Espace vendeur")} → <strong>Nouveau produit</strong>. Ajoute une belle photo, un titre, un prix, et le <strong>poids</strong> (important pour calculer les frais de port au plus juste 📦).</> },
      { q: "Pourquoi mes produits passent en « modération » ?", a: <>Pour garder l'espace <strong>safe et bienveillant</strong>, chaque création est vérifiée rapidement avant d'être visible. C'est express, et tu es notifié·e dès que c'est validé.</> },
      { q: "Je vends des produits 18+ / NSFW ?", a: <>Oui, c'est permis et bienvenu — coche simplement <strong>« réservé aux adultes »</strong> sur le produit. Il sera affiché avec un voile et un avertissement d'âge.</> },
      { q: "Je peux vendre des services ou des places d'événement ?", a: <>Oui ! Au moment de créer, choisis le <strong>type</strong> (produit, service, événement). Les services/événements n'ont pas de frais de port.</> },
    ],
  },
  {
    id: "paiements", title: "Être payé·e", icon: Wallet,
    intro: "Ton argent t'appartient. On veut que ce soit clair et rapide.",
    items: [
      { q: "Comment je reçois mon argent ?", a: <>Tu connectes ton compte <strong>Stripe</strong> (gratuit). À <strong>chaque vente</strong>, ta part t'est versée <strong>automatiquement</strong> : prix de tes produits <strong>− la commission</strong> (+ les frais de port si tu gères ta livraison). Pas de virement à demander, c'est auto. 💸</> },
      { q: "C'est quoi la commission exactement ?", a: <><strong>5%</strong> sur le prix de tes produits (pas sur le port). <strong>0%</strong> pendant 6 mois si tu es fondateur·ice. On ne prend <strong>rien</strong> sur les frais de port quand tu expédies toi-même.</> },
      { q: "Je suis dans un pays où Stripe n'existe pas (Tunisie, etc.) ?", a: <>Pas de souci ! Active le <strong>versement manuel</strong> dans ton espace : tu vends normalement, et on te paie via <strong>Wise / Payoneer / virement</strong>. Commission 12% (6% fondateur·ice), versements groupés.</> },
      { q: "Quand l'argent arrive sur mon compte ?", a: <>Stripe libère les fonds sous quelques jours (un peu plus pour tes toutes premières ventes, c'est normal et temporaire). Tu suis tout dans <strong>Espace vendeur → Revenus</strong>.</> },
    ],
  },
  {
    id: "livraison", title: "Livraison", icon: Truck,
    intro: "Tu choisis : tu gères toi-même, ou Spectrum s'en occupe.",
    items: [
      { q: "Je peux gérer ma livraison moi-même ?", a: <>Oui, totalement ! Dans {L("/vendeur", "Espace vendeur")} → <strong>Livraison</strong>, choisis <strong>« Je gère ma livraison »</strong>. Tu expédies avec <strong>ton transporteur habituel</strong> (Mondial Relay, La Poste, Colissimo…) — <strong>pas besoin de Sendcloud</strong> ni de t'inscrire ailleurs. Et tu <strong>reçois les frais de port</strong> avec ta vente, donc c'est couvert. 🙌</> },
      { q: "Ou je laisse Spectrum gérer ?", a: <>Choisis <strong>« Spectrum gère pour moi »</strong> : on te fournit une <strong>étiquette prépayée</strong>, tu imprimes, tu déposes le colis, tu n'avances rien.</> },
      { q: "Comment je marque une commande comme expédiée ?", a: <>Sur la commande (Espace vendeur → Commandes), colle ton <strong>numéro de suivi</strong> et clique <strong>« Marquer expédié »</strong>. L'acheteur·se est prévenu·e automatiquement par email + notification.</> },
      { q: "Les frais de port me coûtent quelque chose ?", a: <>Non. Si tu gères ta livraison, le port payé par le client <strong>te revient</strong> pour couvrir ton affranchissement. Tu n'es jamais de ta poche.</> },
    ],
  },
  {
    id: "commandes", title: "Commandes & notifications", icon: Bell,
    items: [
      { q: "Comment je sais qu'une vente est tombée ?", a: <>De deux façons : un <strong>email détaillé</strong> (client, adresse, mode de livraison) <strong>et</strong> la <strong>cloche de notifications</strong> 🔔 en haut du site, en temps réel.</> },
      { q: "Où je vois toutes mes commandes ?", a: <>Dans {L("/vendeur", "Espace vendeur")} → <strong>Commandes</strong> : à préparer, expédiées, tout l'historique, avec les infos client et l'adresse.</> },
      { q: "Et ma compta ?", a: <>Espace vendeur → <strong>Revenus</strong> : brut, commission, net, versé, courbe sur 12 semaines, et un <strong>export CSV</strong> pour ta compta.</> },
    ],
  },
  {
    id: "fondateur", title: "Programme fondateur·ice", icon: Sparkles,
    items: [
      { q: "C'est quoi ?", a: <>Les <strong>20 premières boutiques</strong> deviennent <strong>fondateur·ices</strong> : <strong>0% de commission pendant 6 mois</strong>, <strong>abonnement offert 12 mois</strong>, et un <strong>badge exclusif</strong> sur ton profil. Une façon de remercier celleux qui construisent l'aventure avec nous. 💕</> },
      { q: "Comment j'en fais partie ?", a: <>En ouvrant ta boutique tôt ! Ton rang fondateur·ice s'affiche dans ton espace dès que tu es éligible.</> },
    ],
  },
];

function Item({ qa }: { qa: QA }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#101014]/8 last:border-0">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-start justify-between gap-4 text-left py-4">
        <span className="font-hanken text-[15px] font-semibold text-[#101014]">{qa.q}</span>
        <ChevronDown size={18} className={`shrink-0 mt-0.5 text-[#101014]/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="font-hanken text-[14px] text-[#101014]/65 leading-relaxed pb-4 pr-6">{qa.a}</div>}
    </div>
  );
}

export default function AidePage() {
  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#101014]">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg,#2323C4,#7A2BF0,#FF2DA0,#F93C2C,#FFD400)" }} />
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-12 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#7A2BF0] mb-4">
            <LifeBuoy size={14} /> Centre d'aide
          </span>
          <h1 className="font-fraunces text-4xl md:text-5xl text-[#101014] mb-3">Aide aux vendeur·euses ✦</h1>
          <p className="font-hanken text-[#101014]/55 text-lg leading-relaxed">
            Tout pour vendre sereinement sur Spectrum : ta boutique, tes paiements, ta livraison, tes commandes.
            Une question reste ? On est juste là 💌
          </p>
        </div>
      </div>

      {/* Sommaire */}
      <div className="max-w-3xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#101014]/12 px-3.5 py-1.5 font-hanken text-[13px] text-[#101014]/65 hover:border-[#FF2DA0]/50 hover:text-[#FF2DA0] transition-colors">
              <s.icon size={13} /> {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 rounded-3xl bg-white border border-[#101014]/8 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-[#FF2DA0]/10 flex items-center justify-center shrink-0">
                <s.icon size={18} className="text-[#FF2DA0]" />
              </div>
              <h2 className="font-fraunces text-2xl text-[#101014]">{s.title}</h2>
            </div>
            {s.intro && <p className="font-hanken text-[14px] text-[#101014]/45 mb-3 ml-[52px]">{s.intro}</p>}
            <div className="mt-2">
              {s.items.map((qa, i) => <Item key={i} qa={qa} />)}
            </div>
          </section>
        ))}

        {/* Contact */}
        <section className="rounded-3xl p-8 text-center text-white"
          style={{ background: "linear-gradient(135deg,#7A2BF0,#FF2DA0)" }}>
          <HeartHandshake size={28} className="mx-auto mb-3 opacity-90" />
          <h2 className="font-fraunces text-2xl mb-2">Tu ne trouves pas ta réponse ?</h2>
          <p className="font-hanken text-white/85 mb-5 max-w-md mx-auto">
            On répond vite et avec le sourire. Écris-nous, on est une vraie équipe humaine derrière Spectrum.
          </p>
          <a href="mailto:hello@spectrumforus.com"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#101014] font-hanken font-semibold text-sm px-6 py-3 hover:scale-[1.02] transition-transform">
            Nous écrire 💌
          </a>
        </section>
      </div>
    </div>
  );
}
