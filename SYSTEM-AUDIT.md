# Spectrum For Us — Audit système complet (synchronisation · data · UX · admin)

> Audit **grounded** sur le code réel (Next.js 16 + Supabase + Stripe), pas hypothétique.
> Date : session redesign. Stack réel ≠ handoff (pas de Prisma/Stripe Connect).

---

## 0. Constat fondateur (change toute l'analyse « sync »)
Spectrum est une app **mono-base de données (Supabase/PostgreSQL)**. Admin, frontend, marketplace, CMS, vendeur lisent/écrivent **les mêmes tables**.
➡️ Il n'existe **pas de second store** à désynchroniser : la « synchro admin ↔ front » est **structurelle**. Modifier un produit en admin = visible côté marketplace au prochain *read* (immédiat en client-fetch, ≤60 s sur `/boutique` à cause de l'ISR).
➡️ Les vrais risques ne sont **pas** la divergence entre modules, mais : **(a)** des *write-paths* cassés, **(b)** des tables **déclarées mais jamais écrites** (fausses promesses), **(c)** l'absence de **temps réel push**, **(d)** l'absence de **versioning/rollback** et **d'automation engine**.

---

## 1. FULL SYSTEM MAP (logique)

```
                       ┌────────────────────────────────────────┐
                       │           SUPABASE (source unique)       │
                       │  41 tables · RLS · Auth · triggers       │
                       └────────────────────────────────────────┘
        reads/writes ▲      ▲          ▲           ▲            ▲
        (même DB)    │      │          │           │            │
   ┌─────────────┐  ┌┴───────────┐ ┌──┴────────┐ ┌┴─────────┐ ┌┴──────────┐
   │  FRONTEND   │  │  VENDEUR   │ │   ADMIN    │ │   CMS    │ │  STRIPE   │
   │ (acheteur)  │  │ /vendeur   │ │  /admin    │ │ site_*   │ │  webhook  │
   │ home,feed,  │  │ dashboard, │ │ 23 sections│ │ pages,   │ │ orders,   │
   │ produit,    │  │ produits,  │ │ users,     │ │ nav,     │ │ stock,    │
   │ panier,     │  │ commandes, │ │ vendors,   │ │ popups,  │ │ abo,      │
   │ checkout    │  │ abo        │ │ finance…   │ │ content  │ │ commission│
   └─────────────┘  └────────────┘ └────────────┘ └──────────┘ └───────────┘
         │                                                          │
   localStorage (panier, favoris)                          Stripe (paiements)
```

**Sources de vérité** : Supabase (canonique) · localStorage (panier + favoris, **non remontés en DB**) · Stripe (transactions).

---

## 2. CRITICAL ISSUES LIST

| # | Sévérité | Problème | Preuve | Impact |
|---|---|---|---|---|
| C1 | 🔴 P0 | **Webhook bloqué sans 2 env vars** (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_WEBHOOK_SECRET`) | webhook → 503 si manquant ; non posées dans Vercel | Paiement encaissé → **aucune commande créée** → finance/dashboards/vendeur **tous faux** |
| C2 | 🔴 P0 | **Commissions jamais enregistrées** | `grep commissions` = 0 write | Finance affiche un **estimé 15 % forfaitaire**, pas le réel ; payouts non calculables |
| C3 | 🟠 P1 | **Payouts vendeurs absents** (pas de Stripe Connect) | aucun transfer/Connect | Fonds 100 % sur compte plateforme → reversement **manuel**, non tracé |
| C4 | 🟠 P1 | **Favoris = localStorage only** ; table `favorites` morte | 0 write `favorites` | Pas multi-device, invisibles admin/analytics, perdus au clear cache |
| C5 | 🟠 P1 | **Aucun versioning/rollback CMS** | pas de table `*_versions` | « rollback » du spec **impossible** aujourd'hui |
| C6 | 🟡 P2 | **Pas d'automation engine générique** | logique en dur (webhook + 1 trigger `enroll_founder_program`) | Pas de IF→COND→ACTION, ni simulation/test mode |
| C7 | 🟡 P2 | **Reviews non exposées** | table `reviews` non lue côté produit | Avis collectés mais invisibles |
| C8 | 🟡 P2 | **Pas de temps réel push** | 0 `.channel/.subscribe` | Dashboards = lecture à la requête, pas « live » |

---

## 3. SYNC PROBLEMS (réels)
- **Admin ↔ Front : OK structurellement** (même DB). Exception : `/boutique/[slug]` en **ISR 60 s** → une édition produit met **jusqu'à 60 s** à apparaître sur la vitrine. (Les autres pages sont client-fetch = immédiat.)
- **Finance ↔ réalité : CASSÉ tant que C1** (orders non créés ⇒ CA=0, top vendeurs vides).
- **Commission ↔ payouts : CASSÉ** (C2 — table vide, estimé seulement).
- **Favoris front ↔ admin/analytics : ABSENT** (C4 — localStorage isolé).
- **CMS ↔ front : OK** (lecture `site_content`), mais **pas de draft/publish/version** (C5).

## 4. UX PROBLEMS
- **Redondance vente** : `/publier` **et** `/vendeur/nouveau-produit` font la création produit → 2 écrans pour 1 job. À fusionner.
- **Onboarding vs abonnement** : `/vendeur/onboarding` + `/vendeur/abonnement` + step abo → parcours éclaté.
- **i18n** : clés non traduites historiquement visibles (`nav.shop`…) — à vérifier/compléter (signalé par le handoff).
- **Admin 23 sections** : surcharge cognitive ; manque un **Command Center** unique (live) + **global search** cross-entités (n'existe pas).
- **Avis** absents de la fiche produit (perte de réassurance/conversion).
- **Mobile** : ✅ bon niveau post-redesign (bottom nav, thumb-friendly, masonry) ; checkout/compte/boutique à finaliser en clair.

## 5. DATA RISKS
- **R1** — *Orders fantômes* : paiement sans order (C1) = perte de données financière + client lésé. **Critique.**
- **R2** — *Tables mortes* (`commissions`, `favorites`, partiellement `reviews`) = fausses garanties produit.
- **R3** — *Produits orphelins* : possible si `shop_id` null (déjà nettoyé une fois) — ajouter contrainte NOT NULL + FK.
- **R4** — *Pas de rollback* (C5) = une mauvaise édition CMS/produit n'est pas annulable.
- **R5** — *RLS* : OK (corrigée en session sur 4 tables exposées), à re-scanner après chaque DDL.

## 6. IMPROVEMENT ROADMAP

### P0 — bloquant prod (heures)
1. **Poser `SUPABASE_SERVICE_ROLE_KEY` + `STRIPE_WEBHOOK_SECRET`** dans Vercel + test achat → order créé. *(débloque C1, R1, finance, dashboards)*
2. **Écrire les commissions** dans le webhook à la création d'order (taux : 0 % fondateur, sinon taux `admin_settings`) → table `commissions` réelle. *(C2)*

### P1 — cohérence (jours)
3. **Favoris en DB** : écrire la table `favorites` (+ garder localStorage en cache invité, merge au login). *(C4)*
4. **Reviews sur fiche produit** (lecture + dépôt post-achat). *(C7)*
5. **Payouts tracés** : table/route payouts (manuel d'abord), ou Stripe Connect. *(C3)*
6. **CMS draft/publish + versions** : table `*_versions` + rollback. *(C5)*
7. **Fusionner** `/publier` ↔ `/vendeur/nouveau-produit` ; unifier onboarding+abo. *(UX)*

### P2 — structurel / scale (semaines)
8. **Command Center** admin (live KPIs : ventes, erreurs webhook, abos à risque, file modération).
9. **Global search** cross-entités (users/sellers/products/orders/pages).
10. **Automation engine** générique IF→COND→ACTION (+ retry, simulation, logs `activity_logs`).
11. **Temps réel** : Supabase Realtime sur les dashboards critiques.
12. **Safe mode** : confirmation explicite sur paiements/commissions/abos/commandes.

---

## 7. Verdict
- **Sync inter-modules** : structurellement saine (mono-DB) — sauf ISR `/boutique` (≤60 s).
- **Bloquant réel** : **C1 (env vars webhook)** — sans ça, tout l'aval (orders/finance/commissions/dashboards) est faux. **À régler avant tout.**
- **« Shopify+Stripe+Notion unifié »** : la fondation existe (mono-DB, 23 sections admin, RLS, Stripe) ; manquent surtout **commissions réelles, payouts, versioning CMS, command center, global search, automation engine**.
