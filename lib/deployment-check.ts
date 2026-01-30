// Ce fichier aide à identifier les problèmes de déploiement

export function checkDeploymentIssues() {
  // Vérifier si nous sommes en environnement de production
  const isProduction = process.env.NODE_ENV === "production"

  // Vérifier si les variables d'environnement nécessaires sont définies
  const requiredEnvVars = [
    "NEXT_PUBLIC_SITE_URL",
    // Ajoutez d'autres variables d'environnement requises ici
  ]

  const missingEnvVars = requiredEnvVars.filter((varName) => typeof process.env[varName] === "undefined")

  if (isProduction && missingEnvVars.length > 0) {
    console.warn(`⚠️ Variables d'environnement manquantes: ${missingEnvVars.join(", ")}`)
  }

  return {
    isProduction,
    missingEnvVars,
    isReady: missingEnvVars.length === 0,
  }
}
