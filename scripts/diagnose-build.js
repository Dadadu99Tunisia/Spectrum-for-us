// Script de diagnostic pour identifier les problèmes de build
const fs = require("fs")
const path = require("path")

console.log("🔍 Diagnostic du projet Spectrum Marketplace...\n")

// 1. Vérifier les fichiers critiques
const criticalFiles = ["package.json", "next.config.mjs", "tailwind.config.ts", "tsconfig.json"]

console.log("📁 Vérification des fichiers critiques:")
criticalFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - OK`)
  } else {
    console.log(`❌ ${file} - MANQUANT`)
  }
})

// 2. Vérifier la structure des dossiers
const requiredDirs = ["app", "components", "lib"]
console.log("\n📂 Vérification de la structure:")
requiredDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ - OK`)
  } else {
    console.log(`❌ ${dir}/ - MANQUANT`)
  }
})

// 3. Analyser package.json
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
  console.log("\n📦 Analyse du package.json:")
  console.log(`✅ Next.js version: ${packageJson.dependencies?.next || "Non trouvé"}`)
  console.log(`✅ React version: ${packageJson.dependencies?.react || "Non trouvé"}`)

  // Vérifier les scripts
  if (packageJson.scripts?.build) {
    console.log("✅ Script build présent")
  } else {
    console.log("❌ Script build manquant")
  }
} catch (error) {
  console.log("❌ Erreur lors de la lecture du package.json")
}

// 4. Vérifier les variables d'environnement
console.log("\n🔐 Variables d'environnement:")
const envFiles = [".env", ".env.local", ".env.example"]
envFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} présent`)
  }
})

// 5. Rechercher les erreurs communes dans le code
console.log("\n🔍 Recherche d'erreurs communes...")

function checkForCommonErrors(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  files.forEach((file) => {
    if (file.isDirectory() && !file.name.startsWith(".") && file.name !== "node_modules") {
      checkForCommonErrors(path.join(dir, file.name))
    } else if (file.name.endsWith(".tsx") || file.name.endsWith(".ts")) {
      const filePath = path.join(dir, file.name)
      const content = fs.readFileSync(filePath, "utf8")

      // Vérifier les imports problématiques
      if (content.includes("import React from")) {
        console.log(`⚠️  ${filePath}: Import React inutile (Next.js 13+)`)
      }

      // Vérifier les exports config dans app/
      if (filePath.includes("app/") && content.includes("export const config")) {
        console.log(`❌ ${filePath}: export const config déprécié dans app/`)
      }

      // Vérifier les use client manquants
      if (content.includes("useState") || content.includes("useEffect")) {
        if (!content.includes("'use client'")) {
          console.log(`⚠️  ${filePath}: Manque 'use client' pour les hooks React`)
        }
      }
    }
  })
}

try {
  checkForCommonErrors("./app")
  checkForCommonErrors("./components")
} catch (error) {
  console.log("Erreur lors de la vérification des fichiers")
}

console.log("\n✨ Diagnostic terminé!")
