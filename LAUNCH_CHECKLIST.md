# ✅ Checklist pré-lancement — Spectrum For Us (27 juin)

Coche chaque parcours une fois. Temps total ≈ 30-40 min.

---

## 0. Config externe (À FAIRE D'ABORD — sinon ça casse en silence)

- [ ] **Stripe → Webhooks** : l'endpoint `https://spectrumforus.com/api/stripe/webhook` écoute bien :
  `payment_intent.succeeded`, `checkout.session.completed`, `charge.dispute.created`, `charge.dispute.closed`,
  `account.updated`, `customer.subscription.*`. (Sinon : pas de commande créée / chargebacks ignorés.)
- [ ] **Stripe en mode LIVE** (clés `sk_live`/`pk_live` déjà dans Vercel — vérifie que tu n'es pas resté en test).
- [ ] **Médiateur de la consommation** : souscrit + coordonnées renseignées dans les CGV (`/legal/cgv`).
- [ ] **Domaine Apple Pay** vérifié dans Stripe (pour le bouton Apple Pay au checkout).
- [ ] **Resend** : domaine d'envoi vérifié (sinon les emails partent en spam / pas du tout).

---

## 1. Parcours ACHETEUR (le plus important)

- [ ] **Achat-test réel** : ajoute un produit au panier → checkout → paie (vraie carte ou carte test en mode live) →
      page de confirmation `Commande confirmée ✦` avec un n° de commande.
- [ ] **Email de confirmation** reçu (acheteur) + **email nouvelle commande** reçu (vendeur).
- [ ] La commande apparaît dans **Mon compte → Commandes**.
- [ ] **Reçu** imprimable (`/compte/recu/[id]`) correct (montants en €).
- [ ] **Recherche** + **filtres** sur `/decouvrir` renvoient des résultats.
- [ ] **Favori** : cœur sur un produit → visible dans `/favoris` (et persiste après reload).
- [ ] **Avis** : essaie de laisser un avis SANS avoir acheté → bloqué (« seul·es les acheteur·ses »).
      Après l'achat-test → l'avis passe avec badge **Achat vérifié**.
- [ ] **Signaler** : bouton sur la fiche produit → motif → « Signalement envoyé ».
- [ ] **Bascule EN** : change la langue (sélecteur) → la home, /vendre, fiche produit passent en anglais.
- [ ] **Mobile** : refais l'essentiel sur téléphone (ou DevTools mobile).

## 2. Parcours VENDEUR·SE

- [ ] **Onboarding** : créer une boutique de bout en bout → dashboard.
- [ ] **Ajouter un produit** (photo, prix, stock) → visible en ligne + entre en **file de modération** admin.
- [ ] **Paiements** : connecter Stripe (pays Stripe) OU activer **versement manuel** (pays sans Stripe →
      message « Stripe pas dispo, active le versement manuel »).
- [ ] **KYC** : soumettre la vérification d'identité → statut « En cours ».
- [ ] **Compta** : la carte Comptabilité affiche les totaux + **Export CSV** télécharge un fichier.

## 3. ADMIN

- [ ] **CRM** (`/admin/crm`) : glisser une carte entre colonnes → le stage change ; ouvrir un contact →
      la **timeline** s'affiche, ajouter une note l'enregistre.
- [ ] **Versements** (`/admin/versements`) : le vendeur manuel apparaît avec son **statut KYC** →
      clique **« Vérifier KYC »** → le versement devient possible (« Disponible » > 0 après la rétention).
- [ ] **Modération** (`/admin/moderation`) : le produit créé plus haut apparaît dans la file.
- [ ] **Export DAC7** (bouton dans Versements) : télécharge le CSV.
- [ ] **Programme fondateur** : compteurs live cohérents.

---

## ⚠️ Effets de bord à connaître (voulus)

- **Versements manuels bloqués** tant que l'admin n'a pas cliqué « Vérifier KYC » sur le vendeur.
  → Vérifie au moins 1 vendeur avant le jour J. (Désactivable en 5 min si besoin, demande-moi.)
- **Relance panier abandonné** : quotidienne (plan Vercel Hobby), pas horaire.
- **Chargebacks** : gèlent automatiquement les fonds du vendeur concerné — seulement si le webhook Stripe
  est bien configuré (point 0).

---

## 🟢 Déjà vérifié par l'équipe technique
Build 276/276 · prod déployée et à jour · pages & APIs publiques 200 · APIs protégées 401 (auth OK) ·
avis sans achat refusé (testé en base) · bilingue FR/EN (testé navigateur) · CGV nettoyées.
