// Générateur du PDF de présentation « Spectrum For Us ».
// Usage : node scripts/generate-report.mjs
// Produit : rapport-spectrum-presentation.pdf à la racine du repo.
//
// Le contenu est tiré de l'état réel du projet (SYSTEM-AUDIT.md,
// REDESIGN-MIGRATION.md et l'historique git). Relancer ce script
// régénère le rapport à l'identique.

import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "rapport-spectrum-presentation.pdf");

// ---------------------------------------------------------------- palette
const INK = "#1d1b2e";
const MUTED = "#6b6880";
const LINE = "#e4e1ef";
const VIOLET = "#7c3aed";
const PINK = "#db2777";
const AMBER = "#d97706";
const GREEN = "#059669";
const RED = "#dc2626";
const SOFT = "#f6f4fc";

const PAGE = { size: "A4", margins: { top: 56, bottom: 56, left: 56, right: 56 } };
const doc = new PDFDocument({ ...PAGE, bufferPages: true, info: {
  Title: "Spectrum For Us — Rapport de présentation",
  Author: "Spectrum For Us",
  Subject: "État du projet, audit système et roadmap",
} });
doc.pipe(fs.createWriteStream(OUT));

const W = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const L = doc.page.margins.left;
const R = doc.page.width - doc.page.margins.right;

// ---------------------------------------------------------------- helpers
function h1(text) {
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(20).text(text, { width: W });
  doc.moveDown(0.2);
  const y = doc.y;
  doc.moveTo(L, y).lineTo(L + 48, y).lineWidth(3).strokeColor(VIOLET).stroke();
  doc.moveDown(0.8);
}
function kicker(text) {
  doc.fillColor(VIOLET).font("Helvetica-Bold").fontSize(9).text(text.toUpperCase(), { characterSpacing: 1.5 });
  doc.moveDown(0.25);
}
function para(text, opts = {}) {
  doc.fillColor(opts.color || INK).font(opts.font || "Helvetica").fontSize(opts.size || 10.5)
    .text(text, { width: W, lineGap: 2.5, ...opts });
  doc.moveDown(opts.gap ?? 0.5);
}
function bullet(label, body, color = VIOLET) {
  const startY = doc.y;
  doc.circle(L + 3, startY + 6, 2.5).fillColor(color).fill();
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(10.5)
    .text(label, L + 14, startY, { width: W - 14, continued: !!body });
  if (body) doc.font("Helvetica").fillColor(MUTED).text(" — " + body, { width: W - 14 });
  doc.moveDown(0.45);
  doc.x = L;
}
function space(n = 1) { doc.moveDown(n); }

// Tableau simple à colonnes proportionnelles.
function table(cols, rows, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((w) => (w / total) * W);
  const xs = []; let acc = L;
  widths.forEach((w) => { xs.push(acc); acc += w; });
  const pad = 6;

  // header
  let y = doc.y;
  doc.rect(L, y, W, 22).fillColor(VIOLET).fill();
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
  cols.forEach((c, i) => doc.text(c, xs[i] + pad, y + 6, { width: widths[i] - pad * 2 }));
  y += 22;

  doc.font("Helvetica").fontSize(8.8);
  rows.forEach((row, ri) => {
    const heights = row.map((cell, i) =>
      doc.heightOfString(String(cell.text ?? cell), { width: widths[i] - pad * 2, lineGap: 1.5 }));
    const rh = Math.max(...heights) + 10;
    if (y + rh > doc.page.height - doc.page.margins.bottom) { doc.addPage(); y = doc.page.margins.top; }
    if (ri % 2 === 0) { doc.rect(L, y, W, rh).fillColor(SOFT).fill(); }
    row.forEach((cell, i) => {
      const c = typeof cell === "object" ? cell : { text: cell };
      doc.fillColor(c.color || INK).font(c.bold ? "Helvetica-Bold" : "Helvetica")
        .text(String(c.text), xs[i] + pad, y + 5, { width: widths[i] - pad * 2, lineGap: 1.5 });
    });
    y += rh;
  });
  doc.moveTo(L, y).lineTo(R, y).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.y = y + 10;
  doc.x = L;
}

// Carte KPI.
function kpiRow(items) {
  const gap = 12;
  const cw = (W - gap * (items.length - 1)) / items.length;
  const y = doc.y;
  items.forEach((it, i) => {
    const x = L + i * (cw + gap);
    doc.roundedRect(x, y, cw, 64, 8).fillColor(SOFT).fill();
    doc.rect(x, y, 4, 64).fillColor(it.color || VIOLET).fill();
    doc.fillColor(it.color || VIOLET).font("Helvetica-Bold").fontSize(20)
      .text(it.value, x + 14, y + 12, { width: cw - 20 });
    doc.fillColor(MUTED).font("Helvetica").fontSize(8.5)
      .text(it.label, x + 14, y + 40, { width: cw - 20 });
  });
  doc.y = y + 64 + 14;
  doc.x = L;
}

// ================================================================ COVER
doc.rect(0, 0, doc.page.width, doc.page.height).fillColor("#16121f").fill();
// bande dégradée façon spectre
const grad = doc.linearGradient(0, 0, doc.page.width, 0);
grad.stop(0, "#7c3aed").stop(0.5, "#db2777").stop(1, "#d97706");
doc.rect(0, 0, doc.page.width, 8).fill(grad);
doc.rect(0, doc.page.height - 8, doc.page.width, 8).fill(grad);

doc.fillColor("#a78bfa").font("Helvetica-Bold").fontSize(11)
  .text("SPECTRUM FOR US", L, 150, { characterSpacing: 3 });
doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(40)
  .text("Rapport de présentation", L, 190, { width: W, lineGap: 4 });
doc.fillColor("#c9c4d8").font("Helvetica").fontSize(13)
  .text("État du projet · architecture · audit système · roadmap", L, 270, { width: W });

doc.moveTo(L, 330).lineTo(L + 60, 330).lineWidth(2).strokeColor("#db2777").stroke();
doc.fillColor("#ffffff").font("Helvetica").fontSize(11)
  .text("Marketplace queer & inclusive — Next.js 16 · Supabase · Stripe", L, 348, { width: W });

doc.fillColor("#8b85a0").font("Helvetica").fontSize(10)
  .text("Présentation du 16 juin 2026", L, doc.page.height - 90);
doc.fillColor("#8b85a0").font("Helvetica")
  .text("Document interne — état au jour de la présentation", L, doc.page.height - 74);

// ================================================================ P1 — Vue d'ensemble
doc.addPage();
kicker("Vue d'ensemble");
h1("Ce qu'est Spectrum For Us");
para("Spectrum For Us est une marketplace inclusive (modèle façon Etsy/Vinted) dédiée aux créateur·ice·s et boutiques queer. La plateforme réunit vitrine acheteur, espace vendeur, back-office admin, CMS de contenu et paiements — le tout sur une base de données unique.", { gap: 0.7 });

kpiRow([
  { value: "41", label: "tables Supabase (source unique)", color: VIOLET },
  { value: "23", label: "sections back-office admin", color: PINK },
  { value: "1", label: "base de données canonique", color: AMBER },
]);

kicker("Architecture en bref");
bullet("Source unique de vérité", "Supabase / PostgreSQL — admin, front, vendeur et CMS lisent et écrivent les mêmes tables. La « synchro » est donc structurelle.", VIOLET);
bullet("Paiements & logistique", "Stripe pour l'encaissement et les abonnements vendeur ; Sendcloud pour les étiquettes et points relais.", PINK);
bullet("Sécurité", "RLS active sur les tables sensibles + middleware sur /admin et /api/admin ; RBAC (super_admin, ceo, cfo, marketing, support, modération…).", AMBER);
bullet("Rendu", "Next.js 16 (App Router). Pages client-fetch = mise à jour immédiate ; vitrine /boutique en ISR (<= 60 s).", GREEN);

space(0.4);
kicker("Le constat fondateur");
para("Il n'existe pas de second « store » à désynchroniser : modifier un produit en admin le rend visible côté marketplace au prochain read. Les vrais risques ne sont donc pas la divergence entre modules, mais les write-paths cassés, les tables déclarées mais jamais écrites, et l'absence de versioning / d'automation.", { color: MUTED });

// ================================================================ P2 — Carte du système
doc.addPage();
kicker("Architecture");
h1("Carte logique du système");
para("Cinq surfaces applicatives partagent la même base Supabase. Stripe alimente les commandes, le stock, les abonnements et (à terme) les commissions via webhook.", { gap: 0.7 });

// schéma maison
function box(x, y, w, h, title, lines, color) {
  doc.roundedRect(x, y, w, h, 6).lineWidth(1).strokeColor(color).fillColor("#ffffff").fillAndStroke("#ffffff", color);
  doc.fillColor(color).font("Helvetica-Bold").fontSize(9).text(title, x + 6, y + 6, { width: w - 12 });
  doc.fillColor(MUTED).font("Helvetica").fontSize(7).text(lines, x + 6, y + 19, { width: w - 12, lineGap: 1 });
}
const topY = doc.y + 4;
doc.roundedRect(L, topY, W, 40, 6).fillColor(VIOLET).fill();
doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(11).text("SUPABASE — source unique", L, topY + 8, { width: W, align: "center" });
doc.fillColor("#ddd6fe").font("Helvetica").fontSize(8).text("41 tables · RLS · Auth · triggers", L, topY + 24, { width: W, align: "center" });

const rowY = topY + 64;
const bw = (W - 4 * 10) / 5;
box(L + 0 * (bw + 10), rowY, bw, 70, "FRONTEND", "home, feed, produit, panier, checkout", PINK);
box(L + 1 * (bw + 10), rowY, bw, 70, "VENDEUR", "dashboard, produits, commandes, abo", VIOLET);
box(L + 2 * (bw + 10), rowY, bw, 70, "ADMIN", "users, vendors, finance… (23 sections)", AMBER);
box(L + 3 * (bw + 10), rowY, bw, 70, "CMS", "pages, nav, popups, contenu", GREEN);
box(L + 4 * (bw + 10), rowY, bw, 70, "STRIPE", "orders, stock, abo, commission", "#0ea5e9");

// connecteurs
doc.lineWidth(0.8).strokeColor(LINE);
for (let i = 0; i < 5; i++) {
  const cx = L + i * (bw + 10) + bw / 2;
  doc.moveTo(cx, topY + 40).lineTo(cx, rowY).stroke();
}
doc.y = rowY + 86;
doc.x = L;

kicker("Sources de vérité");
bullet("Supabase", "données canoniques (produits, commandes, contenu, utilisateurs).", VIOLET);
bullet("Stripe", "transactions, abonnements vendeur, déclenchement des commandes via webhook.", "#0ea5e9");
bullet("localStorage", "panier invité + favoris (non encore remontés en DB — voir audit).", AMBER);

// ================================================================ P3 — Livré récemment
doc.addPage();
kicker("Avancement");
h1("Ce qui a été livré récemment");
para("Itérations des dernières sessions, regroupées par chantier. Logistique, promotions, rétention et corrections d'audit.", { gap: 0.7 });

kicker("Livraison & logistique (Sendcloud)");
bullet("Étiquettes & points relais", "intégration Sendcloud avec clés plateforme (repli par vendeur), vrai sélecteur de point relais par code postal, choix de la méthode la moins chère.");
bullet("Grille de port par paliers de poids", "modèle Vinted : prix calculé automatiquement selon le poids réel du colis (poids saisi par produit), au checkout et côté serveur.");
bullet("Comptabilité du port", "les frais de port restent sur la plateforme pour les boutiques Stripe (elle paie l'étiquette) ; conservés par les boutiques en versement manuel.");

space(0.2);
kicker("Croissance & conversion");
bullet("Codes promo", "par boutique (vendeur absorbe sa remise) et plateforme (campagnes globales absorbées par la plateforme, transferts plafonnés), appliqués et re-validés au checkout et au paiement.");
bullet("Relance panier", "persistance du panier connecté + email de relance automatique (cron horaire) si pas de commande sous une heure, marqué « récupéré » à l'achat.");
bullet("Onboarding vendeur", "écran de coaching final « lance ta 1re vente » (checklist produits, paiement, livraison, partage de boutique) façon Etsy.");

space(0.2);
kicker("Corrections d'audit (vagues 1 & 2)");
bullet("Fiabilité checkout & imports", "le checkout n'avance plus si le PaymentIntent échoue ; import CSV résilient (repli ligne par ligne).");
bullet("Admin & finance", "6 routes admin passées en client admin (listes qui restaient vides), checklist paiement basée sur Stripe/manuel, label « CA brut », versements responsive mobile.");

// ================================================================ P4 — Audit
doc.addPage();
kicker("Audit système");
h1("Points critiques identifiés");
para("Audit ancré sur le code réel. Le bloquant n°1 conditionne toute la chaîne aval (commandes, finance, commissions, dashboards).", { gap: 0.6 });

table(
  ["#", "Sév.", "Problème", "Impact"],
  [
    [{ text: "C1", bold: true }, { text: "P0", color: RED, bold: true }, { text: "Webhook bloqué sans 2 env vars (service role + webhook secret)", bold: true }, "Paiement encaissé sans commande créée -> finance & dashboards faux"],
    [{ text: "C2", bold: true }, { text: "P0", color: RED, bold: true }, { text: "Commissions jamais enregistrées", bold: true }, "Finance affiche un estimé 15 % forfaitaire, payouts non calculables"],
    [{ text: "C3", bold: true }, { text: "P1", color: AMBER, bold: true }, "Payouts vendeurs absents (pas de Stripe Connect)", "Reversement manuel, non tracé"],
    [{ text: "C4", bold: true }, { text: "P1", color: AMBER, bold: true }, "Favoris en localStorage seulement", "Pas multi-device, invisibles admin/analytics"],
    [{ text: "C5", bold: true }, { text: "P1", color: AMBER, bold: true }, "Aucun versioning / rollback CMS", "Une mauvaise édition n'est pas annulable"],
    [{ text: "C6", bold: true }, { text: "P2", color: GREEN, bold: true }, "Pas d'automation engine générique", "Logique en dur, pas de IF-COND-ACTION ni test mode"],
    [{ text: "C7", bold: true }, { text: "P2", color: GREEN, bold: true }, "Reviews non exposées sur la fiche produit", "Avis collectés mais invisibles (perte de réassurance)"],
    [{ text: "C8", bold: true }, { text: "P2", color: GREEN, bold: true }, "Pas de temps réel push", "Dashboards en lecture à la requête, pas « live »"],
  ],
  [4, 6, 42, 48]
);
para("Verdict synthèse : la synchro inter-modules est structurellement saine (mono-DB). Le seul vrai bloquant production est C1 — à régler avant tout, car il fausse toute la donnée financière en aval.", { color: MUTED, size: 9.5 });

// ================================================================ P5 — Roadmap
doc.addPage();
kicker("Plan d'action");
h1("Roadmap priorisée");

kicker("P0 — bloquant prod (heures)");
bullet("Poser les env vars du webhook", "SUPABASE_SERVICE_ROLE_KEY + STRIPE_WEBHOOK_SECRET dans Vercel + test d'achat -> commande créée.", RED);
bullet("Écrire les commissions", "à la création d'order (0 % fondateur, sinon taux admin_settings) -> table commissions réelle.", RED);

space(0.2);
kicker("P1 — cohérence (jours)");
bullet("Favoris en DB", "écrire la table favorites (+ cache invité, merge au login).", AMBER);
bullet("Reviews sur fiche produit", "lecture + dépôt post-achat.", AMBER);
bullet("Payouts tracés", "table/route payouts (manuel d'abord) ou Stripe Connect.", AMBER);
bullet("CMS draft / publish + versions", "table *_versions + rollback.", AMBER);
bullet("Fusion des parcours vente", "unifier /publier <-> /vendeur/nouveau-produit et onboarding + abonnement.", AMBER);

space(0.2);
kicker("P2 — structurel / scale (semaines)");
bullet("Command Center admin", "KPIs live : ventes, erreurs webhook, abos à risque, file de modération.", GREEN);
bullet("Global search", "cross-entités (users / vendeurs / produits / commandes / pages).", GREEN);
bullet("Automation engine", "générique IF-COND-ACTION (retry, simulation, logs).", GREEN);
bullet("Temps réel & safe mode", "Supabase Realtime sur dashboards critiques + confirmations explicites sur paiements/commandes.", GREEN);

space(0.6);
doc.roundedRect(L, doc.y, W, 58, 8).fillColor(SOFT).fill();
const cy = doc.y;
doc.fillColor(VIOLET).font("Helvetica-Bold").fontSize(11).text("Prochaine étape immédiate", L + 14, cy + 12, { width: W - 28 });
doc.fillColor(INK).font("Helvetica").fontSize(10).text("Débloquer C1 (env vars webhook) puis brancher l'écriture des commissions — c'est ce qui rend la finance et les dashboards fiables pour la suite.", L + 14, cy + 30, { width: W - 28 });
doc.y = cy + 58;

// ================================================================ Footers + numéros
const range = doc.bufferedPageRange();
for (let i = 1; i < range.count; i++) { // saute la cover (page 0)
  doc.switchToPage(i);
  // Écrire en pied de page sans déclencher l'ajout automatique de pages
  // (gotcha pdfkit : text() près de la marge basse crée une page vide).
  doc.page.margins.bottom = 0;
  const fy = doc.page.height - 38;
  doc.lineWidth(0.5).strokeColor(LINE).moveTo(L, fy).lineTo(R, fy).stroke();
  doc.fillColor(MUTED).font("Helvetica").fontSize(8)
    .text("Spectrum For Us — Rapport de présentation · 16 juin 2026", L, fy + 6, { width: W / 2, lineBreak: false });
  doc.fillColor(MUTED).font("Helvetica").fontSize(8)
    .text(String(i + 1), L + W / 2, fy + 6, { width: W / 2, align: "right", lineBreak: false });
}

doc.end();
console.log("PDF généré :", OUT);
