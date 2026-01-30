# Prisma Schema - Spectrum For Us

Ce schéma Prisma définit toutes les tables de la base de données pour la marketplace Spectrum For Us.

## Modèles Principaux

### Utilisateurs et Profils
- **profiles** : Profils utilisateurs et vendeurs

### Commerce
- **products** : Produits physiques
- **services** : Services professionnels
- **orders** : Commandes
- **order_items** : Articles dans les commandes
- **service_bookings** : Réservations de services

### Contenu
- **streaming_content** : Vidéos, musique, podcasts
- **streaming_views** : Historique de visionnage
- **blog_posts** : Articles de blog
- **events** : Événements
- **event_bookings** : Réservations d'événements

### Social
- **reviews** : Avis et évaluations

## Commandes Utiles

\`\`\`bash
# Générer le client Prisma
npm run prisma:generate

# Synchroniser avec la base de données
npm run prisma:push

# Créer une migration
npm run prisma:migrate

# Ouvrir Prisma Studio
npm run prisma:studio
\`\`\`

## Relations

Toutes les relations utilisent `onDelete: Cascade` pour maintenir l'intégrité référentielle.

## Types Personnalisés

- Les IDs utilisent UUID
- Les prix utilisent Decimal(10,2)
- Les timestamps utilisent Timestamptz(6)
- Les tableaux sont supportés pour tags, images, etc.
