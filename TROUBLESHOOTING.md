# 🚨 Guide de Dépannage - Spectrum Marketplace

## Problèmes de Déploiement Courants

### 1. Erreur "export const config is deprecated"
**Solution:** Supprimer `export const config` des Route Handlers dans `app/api/`

### 2. Erreur "Module not found"
**Solutions:**
- Vérifier les imports relatifs (`@/components/...`)
- S'assurer que tous les fichiers existent
- Vérifier la casse des noms de fichiers

### 3. Erreur TypeScript
**Solutions:**
- Exécuter `npm run build` localement
- Corriger les erreurs TypeScript avant le déploiement
- Vérifier les types dans `lib/` et `components/`

### 4. Erreur "use client" manquant
**Solution:** Ajouter `'use client'` en haut des composants utilisant:
- `useState`, `useEffect`, etc.
- Event handlers (`onClick`, `onSubmit`)
- Browser APIs

### 5. Variables d'environnement manquantes
**Solution:** Configurer dans Vercel Dashboard:
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY` 
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_BASE_URL`

## Commandes de Diagnostic

\`\`\`bash
# Tester le build localement
npm run build

# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Lancer le diagnostic
node scripts/diagnose-build.js
\`\`\`

## Page de Test

Visitez `/test-deploy` après déploiement pour vérifier que tout fonctionne.

## Support

Si le problème persiste:
1. Vérifiez les logs Vercel
2. Testez localement avec `npm run build`
3. Consultez la documentation Next.js 13+
\`\`\`

Enfin, créons un tsconfig.json optimisé :
