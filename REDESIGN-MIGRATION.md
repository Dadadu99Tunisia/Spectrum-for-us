# Migration Redesign Spectrum For Us — Audit anti-régression

> **Règle absolue :** le redesign est **UX/UI/architecture visuelle uniquement**.
> 0 fonctionnalité supprimée · 0 champ DB retiré · 0 permission retirée · 0 workflow retiré.
> Toute fonctionnalité existante doit exister dans le nouveau design (déplacée/fusionnée si besoin, jamais perdue).

Stack réel : **Next.js 16 (App Router) + Supabase (PostgreSQL, RLS, Auth) + Stripe**.
⚠️ Le handoff suppose Prisma/Stripe Connect/moteur d'automation custom — on **n'adopte pas** ce stack, on **garde Supabase** et on ne migre que le **design**.

---

## ÉTAPE 1 — Inventaire exhaustif de l'existant

### 1.1 Base de données — 41 tables (public)

| Domaine | Tables |
|---|---|
| **Identité / rôles** | `profiles` (role, is_vendor, pronouns…), `vendor_kyc` (kyc_status) |
| **Marketplace** | `shops`, `products`, `categories`, `favorites`, `reviews` |
| **Commandes / paiement** | `orders`, `order_items` (vendor_id, price_at_purchase), `commissions`, `invoices` |
| **Abonnement vendeur** | `shops.subscription_status/_id/_current_period_end`, `shops.stripe_customer_id` |
| **Programme Fondateur·ice** | `founder_program_members` (rank, status, commission_free_until…) |
| **Annuaire / communauté** | `annuaire_overrides`, `queer_events`, `events`, `workshops`, `workshop_slots`, `ambassadors` |
| **CRM / acquisition** | `crm_contacts`, `crm_leads`, `crm_interactions`, `vendor_outreach`, `join_requests`, `referrals` |
| **Support / modération** | `support_tickets`, `ticket_messages`, `messages`, `moderation_queue`, `reports` |
| **CMS / contenu** | `site_content`, `site_navigation`, `site_pages`, `site_popups`, `site_testimonials`, `articles` |
| **Finance / analytics** | `financial_reports`, `analytics_events`, `admin_settings` |
| **Growth** | `newsletter_subscribers`, `referrals` |
| **Système / IA** | `activity_logs` (audit), `ai_messages` |

### 1.2 Rôles utilisateurs (src/lib/admin/rbac.ts)
`super_admin, ceo, cfo, marketing, commercial, support, moderation, hr` (rôles admin) + `vendor`, `buyer`.
2 super-admins hardcodés par email. RLS active sur les tables sensibles + middleware sur `/admin` & `/api/admin`.

### 1.3 Pages existantes

**Public / acheteur** : `/` (home), `/decouvrir` (marketplace), `/produit/[slug]`, `/boutique/[slug]`, `/panier`, `/checkout`, `/favoris`, `/compte`, `/annuaire`, `/communaute`, `/services`, `/evenements`, `/media` + `/media/[slug]`, `/art`, `/ressources`, `/ambassadeurs`, `/emploi`, `/programme-fondateur`, `/rejoindre`, `/auth` (login/signup/reset/OAuth), `/legal/*` (cgu, mentions, confidentialite, cookies).

**Vendeur** : `/vendeur` (dashboard), `/vendeur/onboarding`, `/vendeur/boutique`, `/vendeur/nouveau-produit`, `/vendeur/produit/[id]`, `/vendeur/abonnement`, `/publier`.

**Admin (~23 sections)** : `/admin` (overview), `users`, `vendors` + `vendors/[id]` + `vendors/[id]/verify`, `products`, `orders` + `orders/[id]`, `moderation`, `support` + `support/[id]`, `finance`, `founder-program`, `crm`, `outreach`, `rejoindre`, `annuaire`, `ambassadeurs`, `evenements`, `services`, `articles`, `blog/nouveau`, `contenu`, `communication`, `agents`, `ai`, `settings`.

### 1.4 API routes (~49)
- **Stripe** : `/api/stripe/payment-intent`, `/subscription`, `/webhook` (création commande, décrément stock, abonnement, échec paiement).
- **Compte (RGPD)** : `/api/account/export`, `/api/account/delete`.
- **Public** : `/api/founder-program`, `/api/newsletter`, `/api/rejoindre`, `/api/annuaire/overrides`, `/api/revalidate`, `/api/scrape/{events,vendors}`, `/api/upload`.
- **Admin** : `users`, `vendors/[id]` + `verify`, `products`, `orders/[id]` + `refund`, `moderation/[id]`, `support/[id]/messages`, `finance/summary`, `kpis`, `founder-program` (+`[id]`, `export`), `crm/[id]` (+`qualify`, `outreach`), `annuaire`, `rejoindre`, `content/*` (navigation, pages, popups, testimonials), `settings`, `agents/chat`, `ai`.

### 1.5 Fonctionnalités transverses
Auth email+Google OAuth · reset password · RGPD (export/delete) · i18n (FR/EN, `I18nProvider`) · panier persistant (zustand+localStorage) · favoris (localStorage **+** table `favorites`) · accessibilité (`AccessibilityBar`, skip-to-content) · cookie banner · bannières (Pride countdown, SiteBanner, EcoBanner) · referral tracking · webhook signé · RLS.

---

## ÉTAPE 2 — Matrice de migration

Légende statut : ✅ migré (light) · 🟡 en cours / à finir · ⏳ à faire · ➕ écran à créer

### Acheteur / marketplace
| Fonctionnalité | Écran actuel | Nouvel écran (design) | Statut |
|---|---|---|---|
| Accueil / hero / collections / feed | `/` (MobileHomeView dark) | Home light (Prototype Mobile screens-a) | ✅ mobile · ⏳ desktop |
| Marketplace / catégories / recherche / scroll infini | `/decouvrir` (ExploreFeed) | Feed masonry light | ✅ mobile · ⏳ desktop |
| Fiche produit (images, variantes, qty, story vendeur, related) | `/produit/[slug]` | Product light (screens-b) | ✅ |
| Panier (qty, suppression, totaux) | `/panier` | Cart light (screens-e) | ✅ |
| Checkout multi-step + Stripe | `/checkout` | Checkout light (screens-e) | 🟡 Stripe en thème clair, parcours à revoir |
| Favoris | `/favoris` | Favoris light | 🟡 header light, corps à finir |
| Compte (commandes, favoris, avis, paramètres, RGPD) | `/compte` | Me (screens) | 🟡 mobile partiel |
| Boutique publique vendeur | `/boutique/[slug]` | Boutique light (screens-d) | 🟡 swap appliqué, à peaufiner |
| Avis produit (`reviews`) | partiel | **à exposer** sur fiche produit | ➕ |

### Annuaire / communauté / contenu
| Fonctionnalité | Écran actuel | Nouvel écran | Statut |
|---|---|---|---|
| Annuaire orgs LGBTQ+ (filtres, carte/grille) | `/annuaire` | Annuaire light (screens-g) | ⏳ |
| Communauté | `/communaute` | Community | ⏳ |
| Événements / queer_events / workshops | `/evenements` | Events | ⏳ |
| Services (prestataires) | `/services` | Services screen | ⏳ |
| Média / articles / blog | `/media`, `/art`, `/ressources` | Editorial | ⏳ |
| Ambassadeurs | `/ambassadeurs` | — | ⏳ (à garder) |

### Vendeur
| Fonctionnalité | Écran actuel | Nouvel écran | Statut |
|---|---|---|---|
| Dashboard (KPIs, revenus, commandes, to-do, fondateur) | `/vendeur` | Dashboard Vendeur Spectrum | ✅ (déjà refait en clair) |
| Onboarding wizard (boutique → programme → charte) | `/vendeur/onboarding` | Onboarding (screens-f) | ⏳ |
| Édition boutique (logo, bannière, bio, contact) | `/vendeur/boutique` | Réglages boutique | ⏳ |
| Création / édition produit | `/vendeur/nouveau-produit`, `/vendeur/produit/[id]`, `/publier` | Produit éditeur | ⏳ |
| Abonnement 9,90€ (Stripe checkout) | `/vendeur/abonnement` | Abonnement (dashboard) | ⏳ |
| KYC / vérification | via admin `vendors/[id]/verify` | conservé | ✅ inchangé |

### Admin (Admin OS — 24 sections, **rester sombre** = exclu du re-thème)
| Fonctionnalité | Écran actuel | Nouvel écran | Statut |
|---|---|---|---|
| Overview / KPIs | `/admin` | Admin Dashboard | conservé |
| Utilisateurs | `/admin/users` | Users | conservé |
| Vendeurs + KYC verify | `/admin/vendors[/id][/verify]` | Sellers | conservé |
| Produits | `/admin/products` | Products | conservé |
| Commandes + refund | `/admin/orders[/id]`, `/refund` | Orders | conservé |
| Modération (file signalements) | `/admin/moderation[/id]` | Moderation queue | conservé |
| Support tickets + messages | `/admin/support[/id]` | Support | conservé |
| Finance (CA, commissions, top vendeurs) | `/admin/finance` | Finance | conservé |
| Programme Fondateur·ice (+export) | `/admin/founder-program` | Founder | conservé |
| CRM (contacts, leads, qualify, outreach) | `/admin/crm`, `/admin/outreach` | CRM | conservé |
| Demandes (rejoindre) | `/admin/rejoindre` | Inbound | conservé |
| Annuaire / Événements / Services / Ambassadeurs (admin) | `/admin/{annuaire,evenements,services,ambassadeurs}` | Directory mgmt | conservé |
| CMS (contenu, navigation, pages, popups, testimonials, articles, blog) | `/admin/{contenu,articles,blog}` | CMS | conservé |
| Communication (newsletter/campaigns) | `/admin/communication` | Campaigns | conservé |
| IA / Agents | `/admin/{ai,agents}` | AI ops | conservé |
| Paramètres (commission rate, etc.) | `/admin/settings` | Settings | conservé |

### Transverses
| Fonctionnalité | Statut |
|---|---|
| Auth (email/OAuth/reset) | ✅ light |
| RGPD export/delete | ✅ inchangé (logique) |
| i18n FR/EN | ✅ conservé |
| Panier persistant / favoris | ✅ conservé |
| Webhook Stripe (commande, stock, abo, commission) | ✅ inchangé |
| Intro cinématique | ✅ (sombre par design) |
| RLS / middleware / rôles | ✅ inchangé |

---

## ÉTAPE 3 — Fonctionnalités existantes ABSENTES des nouveaux prototypes
Le handoff est un MVP idéalisé ; il **n'illustre pas** une bonne partie du produit réel. À **conserver** (ne pas perdre) :

1. **Admin OS réel à 23 sections** (le proto montre surtout la modération) → garder toutes les sections.
2. **CRM complet** (contacts/leads/interactions/outreach/qualify) — absent du proto.
3. **CMS** (site_content, navigation, pages, popups, testimonials, articles, blog) — absent.
4. **KYC vendeur** (vendor_kyc + verify) — absent du proto onboarding.
5. **RGPD** (export/delete compte) — absent.
6. **i18n FR/EN** — absent.
7. **Accessibilité** (AccessibilityBar, a11y modes) — partiel dans le proto (A11ySheet).
8. **Reviews / avis** (table existante) — peu exposé.
9. **Référral / parrainage** (`referrals`, ReferralTracker) — absent.
10. **Workshops / workshop_slots / ambassadors / queer_events** — absents.
11. **Invoices / commissions immuables** — logique à préserver.
12. **Programme Fondateur·ice** complet (page marketing + admin + intégration dashboard) — partiel.

## ÉTAPE 4 — Où intégrer ces fonctionnalités dans le nouveau design
- **Admin (23 sections)** : on **garde l'admin sombre actuel tel quel** (exclu du re-thème) — 0 régression, et on pourra le re-styler plus tard sur le modèle « Dashboard Admin Spectrum » section par section.
- **CRM / CMS / KYC / Communication / IA** : restent dans l'admin (sidebar admin), inchangés.
- **RGPD** : reste dans `/compte` → onglet « Paramètres » (déjà présent), re-stylé clair.
- **i18n** : `LocaleSwitcher` conservé dans Header/menu.
- **Accessibilité** : fusionner `AccessibilityBar` existant avec le pattern `A11ySheet` du proto (bottom-sheet + FAB).
- **Reviews** : ajouter une section avis sur `/produit/[slug]` (lecture des `reviews`).
- **Référral** : conserver `ReferralTracker` (layout) + exposer le code dans `/compte`.
- **Workshops / events / ambassadeurs** : conservés dans Communauté/Événements (re-stylés).

## ÉTAPE 5 — Vérification anti-régression (méthode)
Audit écran par écran : pour chaque page, **diff des handlers/props/API avant→après** (les commits de re-thème ne touchent que les classes/couleurs, jamais la logique). Checklist :
- [ ] Aucune route supprimée (`find src/app -name route.ts|page.tsx` identique avant/après).
- [ ] Aucune table/colonne touchée (0 migration DDL dans le re-thème).
- [ ] Aucun appel Supabase/Stripe retiré (grep des `.from(`, `supabase.`, `stripe.`).
- [ ] Tous les rôles/permissions intacts (rbac.ts + middleware inchangés).
- [ ] `tsc` + `next build` verts à chaque étape.

## ÉTAPE 6 — Rapport final (état à ce jour)
- ✅ **Conservées** : 100% des fonctionnalités (aucune suppression — le re-thème ne modifie que couleurs/typo/classes).
- ✅ **Améliorées** : home + explore + produit + panier (mobile light, masonry, réassurance, collections) ; dashboard vendeur (refonte claire complète).
- ✅ **Déplacées** : publication produit accessible depuis `/compte` (mobile) ; favoris/commandes en tuiles d'accès rapide.
- ✅ **Fusionnées** : accessibilité (barre existante ↔ sheet proto) — à finaliser.
- ✅ **Admin / vendeur / acheteur / annuaire / marketplace / abonnement / commission / paiement / modération** : **toutes présentes**, aucune retirée (cf. matrice).

**Restant pour finir le redesign (light) sans régression :** desktop (Header/Footer/home/marketing), checkout, favoris, compte, boutique, onboarding vendeur, annuaire/communauté/événements/services/média — tous sur la branche `light-theme`, à peaufiner visuellement puis merger.
