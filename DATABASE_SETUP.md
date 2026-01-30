# Configuration de la Base de Données Spectrum For Us

## Variables d'Environnement

Ajoutez ces variables à votre fichier `.env.local` :

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pcdhecwdrbnqipazziid.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_zvcdFk7ziV8LEjXCiMuQIA_3TMABPzc
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Database Connection (Prisma)
DATABASE_URL="postgresql://postgres.pcdhecwdrbnqipazziid:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.pcdhecwdrbnqipazziid:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
\`\`\`

## Configuration Prisma

### 1. Générer le Client Prisma

\`\`\`bash
npm run prisma:generate
\`\`\`

### 2. Synchroniser le Schéma avec la Base de Données

\`\`\`bash
npm run prisma:push
\`\`\`

### 3. Ouvrir Prisma Studio (Interface Visuelle)

\`\`\`bash
npm run prisma:studio
\`\`\`

## Scripts SQL

Les scripts SQL sont disponibles dans le dossier `scripts/` :

1. **001_create_tables.sql** - Crée toutes les tables
2. **002_rls_policies.sql** - Configure les politiques de sécurité Row Level Security
3. **003_functions.sql** - Ajoute les fonctions et triggers

### Exécution des Scripts

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `pcdhecwdrbnqipazziid`
3. Allez dans **SQL Editor**
4. Copiez et exécutez chaque script dans l'ordre

## Import du Catalogue

Pour importer le catalogue complet de produits :

1. Allez sur `/admin/import-catalog`
2. Cliquez sur "Importer le Catalogue"
3. Le système importera automatiquement tous les produits depuis le CSV

## Utilisation de Prisma dans le Code

\`\`\`typescript
import { prisma } from '@/lib/prisma'

// Exemple : Récupérer tous les produits
const products = await prisma.products.findMany({
  include: {
    vendor: true,
    reviews: true
  }
})

// Exemple : Créer un produit
const product = await prisma.products.create({
  data: {
    name: "Nouveau produit",
    description: "Description",
    price: 29.99,
    vendor_id: userId,
    category: "Mode",
    currency: "EUR"
  }
})
\`\`\`

## Avantages de Prisma

- **Type-Safety** : Autocomplétion et vérification des types
- **Migrations** : Gestion des changements de schéma
- **Relations** : Gestion automatique des relations entre tables
- **Studio** : Interface visuelle pour explorer les données
- **Performance** : Requêtes optimisées automatiquement

## Connexion Directe vs Pooler

- **DATABASE_URL** (Pooler) : Utilisé pour les requêtes normales de l'application
- **DIRECT_URL** : Utilisé pour les migrations et opérations administratives

Le pooler (PgBouncer) améliore les performances en réutilisant les connexions.
