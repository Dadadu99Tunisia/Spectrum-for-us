import { Resend } from "resend";

// Lazy init · évite le crash au build si RESEND_API_KEY est absent
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  return _resend;
}

const FROM = "Spectrum For Us <noreply@spectrumforus.com>";
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spectrumforus.com";

// ─────────────────────────────────────────────────────────────
// Templates HTML inline (minimalistes, universellement compatibles)
// ─────────────────────────────────────────────────────────────

// Charte Spectrum For Us · clair candy-pop (crème #FBFAF8, ink #101014, magenta #FF2DA0,
// titres serif façon Fraunces via Georgia, barre prisme = arc-en-ciel spectre).
function baseLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#FBFAF8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF8;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #ECE6DB;">
<!-- Prism header -->
<tr><td style="height:5px;background:linear-gradient(90deg,#FF2DA0,#C44CFF,#6B5CFF,#1FB6C9,#16A06A,#F2A03D);"></td></tr>
<!-- Logo -->
<tr><td style="padding:34px 40px 0;text-align:center;">
  <span style="font-family:Georgia,'Times New Roman',serif;font-size:30px;color:#101014;font-weight:700;letter-spacing:-1px;">Spectrum <span style="color:#FF2DA0;">For Us</span></span>
  <p style="margin:6px 0 0;font-size:11px;color:#9B9285;letter-spacing:3px;text-transform:uppercase;">✦ La marketplace queer</p>
</td></tr>
<!-- Body -->
<tr><td style="padding:30px 40px;">${body}</td></tr>
<!-- Footer -->
<tr><td style="padding:24px 40px;border-top:1px solid #ECE6DB;text-align:center;">
  <p style="font-size:11px;color:#9B9285;margin:0;line-height:1.6;">
    Spectrum For Us · <a href="${BASE}/legal/confidentialite" style="color:#9B9285;">Confidentialité</a> ·
    <a href="${BASE}/compte" style="color:#9B9285;">Mon compte</a>
  </p>
</td></tr>
<!-- Prism footer -->
<tr><td style="height:5px;background:linear-gradient(90deg,#F2A03D,#16A06A,#1FB6C9,#6B5CFF,#C44CFF,#FF2DA0);"></td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function text(s: string) {
  return `<p style="font-size:15px;line-height:1.7;color:#6B6258;margin:0 0 16px;">${s}</p>`;
}
function h2(s: string) {
  return `<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#101014;margin:0 0 12px;font-weight:600;line-height:1.25;">${s}</h2>`;
}
function cta(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:8px;padding:14px 28px;background:#FF2DA0;color:#FFFFFF;text-decoration:none;border-radius:100px;font-size:14px;font-weight:700;">${label}</a>`;
}
function itemRow(name: string, price: number, qty: number) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #ECE6DB;font-size:14px;color:#6B6258;">${name}</td>
    <td style="padding:10px 0;border-bottom:1px solid #ECE6DB;text-align:right;font-size:14px;color:#6B6258;">×${qty}</td>
    <td style="padding:10px 0;border-bottom:1px solid #ECE6DB;text-align:right;font-size:14px;color:#101014;font-weight:700;">${(price * qty).toFixed(2)} €</td>
  </tr>`;
}

// ─────────────────────────────────────────────────────────────

interface OrderItem { name: string; price: number; quantity: number }

export async function sendOrderConfirmation(params: {
  to: string;
  orderRef: string;
  items: OrderItem[];
  total: number;
  shippingName?: string;
}) {
  const rows = params.items.map(i => itemRow(i.name, i.price, i.quantity)).join("");

  const body = `
    ${h2("Commande confirmée ✦")}
    ${text(`${params.shippingName ? `Merci ${params.shippingName.split(" ")[0]}` : "Merci"} ✦ Ta commande a bien été enregistrée et ton paiement est validé.`)}
    <p style="font-family:monospace;font-size:11px;color:rgba(16,16,20,0.3);letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">Réf. #${params.orderRef.slice(0,8).toUpperCase()}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">${rows}
      <tr><td colspan="2" style="padding:12px 0;font-size:15px;color:rgba(16,16,20,0.6);font-weight:600;">Total</td>
      <td style="padding:12px 0;text-align:right;font-size:18px;color:#FF2DA0;font-weight:700;">${params.total.toFixed(2)} €</td></tr>
    </table>
    ${text("Les créateur·ices vont préparer ta commande. Tu recevras une notification dès l'expédition.")}
    ${cta("Voir ma commande", `${BASE}/compte`)}
  `;

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `Commande confirmée #${params.orderRef.slice(0,8).toUpperCase()} ✦`,
    html: baseLayout("Commande confirmée · Spectrum For Us", body),
  });
}

export async function sendVendorNewOrder(params: {
  to: string;
  shopName: string;
  orderRef: string;
  items: OrderItem[];
  total: number;
}) {
  const rows = params.items.map(i => itemRow(i.name, i.price, i.quantity)).join("");

  const body = `
    ${h2(`Nouvelle commande sur ${params.shopName} ✦`)}
    ${text(`Une nouvelle commande vient d'arriver ! Pense à préparer les articles et à mettre à jour le statut d'expédition.`)}
    <p style="font-family:monospace;font-size:11px;color:rgba(16,16,20,0.3);letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">Réf. #${params.orderRef.slice(0,8).toUpperCase()}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">${rows}
      <tr><td colspan="2" style="padding:12px 0;font-size:15px;color:rgba(16,16,20,0.6);font-weight:600;">Total</td>
      <td style="padding:12px 0;text-align:right;font-size:18px;color:#FF2DA0;font-weight:700;">${params.total.toFixed(2)} €</td></tr>
    </table>
    ${cta("Gérer mes commandes", `${BASE}/vendeur`)}
  `;

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `🛍 Nouvelle commande #${params.orderRef.slice(0,8).toUpperCase()} sur ${params.shopName}`,
    html: baseLayout("Nouvelle commande · Spectrum For Us", body),
  });
}

export async function sendShippingNotification(params: {
  to: string;
  orderRef: string;
  trackingNumber?: string;
  carrier?: string;
}) {
  const trackingInfo = params.trackingNumber
    ? `<p style="font-size:14px;font-family:monospace;color:rgba(16,16,20,0.5);margin:8px 0 0;">
        ${params.carrier ?? "Transporteur"} · <strong style="color:#101014;">${params.trackingNumber}</strong>
       </p>`
    : "";

  const body = `
    ${h2("Ta commande est en route ! 📦")}
    ${text(`Bonne nouvelle · ta commande #${params.orderRef.slice(0,8).toUpperCase()} a été expédiée.`)}
    ${trackingInfo}
    <br/>
    ${text("Elle devrait arriver dans les prochains jours selon le mode de livraison choisi.")}
    ${cta("Voir ma commande", `${BASE}/compte`)}
  `;

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `Ta commande #${params.orderRef.slice(0,8).toUpperCase()} est en route 📦`,
    html: baseLayout("Expédition · Spectrum For Us", body),
  });
}

export async function sendRefundConfirmation(params: {
  to: string;
  orderRef: string;
  amount: number; // en euros
}) {
  const body = `
    ${h2("Ton remboursement est confirmé ✓")}
    ${text(`Ta demande de retour pour la commande #${params.orderRef.slice(0,8).toUpperCase()} a été acceptée.`)}
    ${text(`Un remboursement de <strong style="color:#101014;">${params.amount.toFixed(2)} €</strong> a été émis sur ton moyen de paiement d'origine. Selon ta banque, il peut apparaître sous 5 à 10 jours ouvrés.`)}
    ${cta("Voir mes commandes", `${BASE}/compte`)}
  `;

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `Remboursement confirmé · commande #${params.orderRef.slice(0,8).toUpperCase()}`,
    html: baseLayout("Remboursement · Spectrum For Us", body),
  });
}

export async function sendBookingConfirmation(params: { to: string; service: string; when: string; shop: string }) {
  const body = `
    ${h2("Ta réservation est confirmée ✓")}
    ${text(`Ton rendez-vous pour <strong style="color:#101014;">${params.service}</strong>${params.shop ? ` avec ${params.shop}` : ""} est confirmé.`)}
    ${text(`📅 <strong style="color:#101014;">${params.when}</strong>`)}
    ${cta("Voir mes réservations", `${BASE}/compte`)}
  `;
  return getResend().emails.send({ from: FROM, to: params.to, subject: `Réservation confirmée · ${params.service}`, html: baseLayout("Réservation · Spectrum For Us", body) });
}

export async function sendBookingVendorAlert(params: { to: string; service: string; when: string }) {
  const body = `
    ${h2("Nouvelle réservation 🗓️")}
    ${text(`Tu as une nouvelle réservation pour <strong style="color:#101014;">${params.service}</strong>.`)}
    ${text(`📅 <strong style="color:#101014;">${params.when}</strong>`)}
    ${cta("Voir mon agenda", `${BASE}/vendeur`)}
  `;
  return getResend().emails.send({ from: FROM, to: params.to, subject: `Nouvelle réservation · ${params.service}`, html: baseLayout("Réservation · Spectrum For Us", body) });
}

export async function sendPayoutNotification(params: { to: string; amount: number; method?: string; reference?: string }) {
  const ref = params.reference ? `<p style="font-size:13px;font-family:monospace;color:rgba(16,16,20,0.5);margin:6px 0 0;">Réf. ${params.reference}</p>` : "";
  const body = `
    ${h2("Tu as reçu un versement 💸")}
    ${text(`La plateforme vient de te verser <strong style="color:#101014;">${params.amount.toFixed(2)} €</strong>${params.method ? ` via ${params.method}` : ""}.`)}
    ${ref}
    ${text("Selon le moyen utilisé (Payoneer, virement…), la réception peut prendre quelques jours.")}
    ${cta("Voir mon espace vendeur·se", `${BASE}/vendeur`)}
  `;
  return getResend().emails.send({ from: FROM, to: params.to, subject: `Versement de ${params.amount.toFixed(2)} € · Spectrum For Us`, html: baseLayout("Versement · Spectrum For Us", body) });
}

export async function sendAbandonedCart(params: { to: string; items: { name: string; price: number; quantity: number }[]; total: number }) {
  const rows = params.items.slice(0, 6).map(i => itemRow(i.name, i.price, i.quantity)).join("");
  const body = `
    ${h2("Tu as oublié quelque chose 🛒")}
    ${text("Ton panier t'attend sur Spectrum. Les créations partent vite — finalise ta commande avant qu'elles ne s'envolent.")}
    <table style="width:100%;border-collapse:collapse;margin:8px 0;">${rows}</table>
    ${text(`<strong style="color:#101014;">Total : ${params.total.toFixed(2)} €</strong>`)}
    ${cta("Reprendre mon panier", `${BASE}/panier`)}
  `;
  return getResend().emails.send({ from: FROM, to: params.to, subject: "Ton panier t'attend sur Spectrum 🛒", html: baseLayout("Ton panier · Spectrum For Us", body) });
}

export async function sendWelcomeEmail(params: { to: string; pseudo: string }) {
  const body = `
    ${h2(`Bienvenue sur Spectrum, ${params.pseudo} ✦`)}
    ${text("Tu fais maintenant partie de la première marketplace queer. On est vraiment content·e·s de t'avoir ici.")}
    ${text("Explore les créations de nos vendeur·ses, ou rejoins-nous en tant que créateur·rice.")}
    <div style="margin:24px 0;display:flex;gap:12px;">
      ${cta("Explorer la marketplace", `${BASE}/decouvrir`)}
    </div>
  `;

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: "Bienvenue sur Spectrum For Us ✦",
    html: baseLayout("Bienvenue · Spectrum For Us", body),
  });
}

export async function sendPasswordReset(params: { to: string; resetUrl: string }) {
  const body = `
    ${h2("Réinitialisation du mot de passe")}
    ${text("Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous (valable 1 heure).")}
    ${cta("Réinitialiser mon mot de passe", params.resetUrl)}
    ${text(`Si tu n'as pas fait cette demande, ignore cet email.`)}
  `;

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: "Réinitialisation de ton mot de passe · Spectrum For Us",
    html: baseLayout("Mot de passe · Spectrum For Us", body),
  });
}

export async function sendNewMessageNotification(params: {
  to: string;
  fromName: string;
  preview: string;
}) {
  const body = `
    ${h2(`Nouveau message de ${params.fromName} 💬`)}
    ${text(`« ${params.preview.slice(0, 240)}${params.preview.length > 240 ? "…" : ""} »`)}
    ${text("Réponds directement depuis ta boîte de réception Spectrum.")}
    ${cta("Voir le message", `${BASE}/messages`)}
  `;
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `💬 Nouveau message de ${params.fromName} · Spectrum For Us`,
    html: baseLayout("Nouveau message · Spectrum For Us", body),
  });
}

export async function sendFollowerNewProduct(params: {
  to: string;
  shopName: string;
  productName: string;
  productSlug: string;
  price: number;
}) {
  const body = `
    ${h2(`${params.shopName} vient de publier ✦`)}
    ${text(`<strong style="color:#101014;">${params.productName}</strong> · ${params.price.toFixed(2)} €`)}
    ${text(`Une nouvelle création d'une boutique que tu suis. Sois parmi les premier·es à la découvrir.`)}
    ${cta("Voir la création", `${BASE}/produit/${params.productSlug}`)}
  `;
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `✦ Nouvelle création chez ${params.shopName}`,
    html: baseLayout("Nouvelle création · Spectrum For Us", body),
  });
}

/** Nurturing créateur·ice · relance "publie ta 1re création" (J+1 puis J+7). */
export async function sendCreatorActivation(params: { to: string; pseudo: string; day: 1 | 7 }) {
  const isJ1 = params.day === 1;
  const body = `
    ${h2(isJ1 ? `${params.pseudo}, ta boutique t'attend ✦` : `${params.pseudo}, on garde ta place au chaud 🏳️‍🌈`)}
    ${text(isJ1
      ? "Ta boutique est créée, bravo ! Il ne manque plus que ta première création pour qu'on puisse te mettre en avant auprès de la communauté."
      : "Tu as ouvert ta boutique il y a une semaine mais elle est encore vide. Ta place de fondateur·ice est précieuse — publie une première création et lance ta visibilité.")}
    ${text("Ça prend 5 minutes : une belle photo, un prix, et tu es en ligne. On s'occupe du reste (paiement, livraison, mise en avant).")}
    ${cta("Publier ma première création", `${BASE}/vendeur/nouveau-produit`)}
    ${text(`<span style="color:rgba(16,16,20,0.4);font-size:13px;">Besoin d'un coup de main ? Réponds à cet email, on est là.</span>`)}
  `;
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: isJ1 ? "Plus qu'une étape pour lancer ta boutique ✦" : "Ta boutique Spectrum est encore vide 🏳️‍🌈",
    html: baseLayout("Publie ta première création · Spectrum For Us", body),
  });
}

/** Notif créateur·ice · quelqu'un suit ta boutique. */
export async function sendNewFollower(params: { to: string; shopName: string; followerName?: string }) {
  const who = params.followerName?.trim() || "Quelqu'un";
  const body = `
    ${h2(`${who} suit désormais ${params.shopName} ✦`)}
    ${text("Ta communauté grandit ! Les personnes qui te suivent sont notifiées à chaque nouvelle création.")}
    ${text("Profite-en pour publier une nouveauté — c'est le meilleur moment pour transformer un·e abonné·e en client·e.")}
    ${cta("Voir mon tableau de bord", `${BASE}/vendeur`)}
  `;
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `✦ ${who} suit ta boutique sur Spectrum`,
    html: baseLayout("Nouvel·le abonné·e · Spectrum For Us", body),
  });
}

/** Notif créateur·ice · quelqu'un a mis une création en favori. */
export async function sendNewFavorite(params: { to: string; productName: string; productSlug: string }) {
  const body = `
    ${h2(`Une création vient d'être mise en favori ❤️`)}
    ${text(`<strong style="color:#101014;">${params.productName}</strong> a tapé dans l'œil de quelqu'un.`)}
    ${text("Les favoris sont un signal d'achat fort. Une promo ou un petit mot peuvent faire la différence.")}
    ${cta("Voir la création", `${BASE}/produit/${params.productSlug}`)}
  `;
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `❤️ « ${params.productName} » a été mise en favori`,
    html: baseLayout("Nouveau favori · Spectrum For Us", body),
  });
}

/** Candidature "Rejoindre" approuvée · invite à ouvrir sa boutique. */
export async function sendJoinApproved(params: { to: string; name?: string }) {
  const who = params.name?.split(" ")[0] || "";
  const body = `
    ${h2(`C'est un oui ! Bienvenue${who ? `, ${who}` : ""} 🏳️‍🌈`)}
    ${text("Ta candidature pour vendre sur Spectrum For Us est <strong style=\"color:#101014;\">acceptée</strong>. On a hâte de découvrir ce que tu crées.")}
    ${text("Prochaine étape : ouvre ta boutique en 10 minutes (photos, prix, c'est parti). On s'occupe du paiement, de la livraison et de la mise en avant.")}
    ${cta("Ouvrir ma boutique", `${BASE}/vendeur/onboarding`)}
    ${text(`<span style="color:rgba(16,16,20,0.4);font-size:13px;">Une question ? Réponds simplement à cet email.</span>`)}
  `;
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: "Ta candidature Spectrum est acceptée ✦",
    html: baseLayout("Candidature acceptée · Spectrum For Us", body),
  });
}

/**
 * Prospection vendeur·se (B2B) · email d'introduction + relances.
 * `step` 0 = intro, 1+ = relance douce. Inclut un lien de désinscription (RGPD).
 */
export async function sendOutreachEmail(params: {
  to: string; name?: string; category?: string; step: number; unsubscribeUrl: string;
}) {
  const who = params.name?.split(" ")[0] || "";
  const cat = params.category ? ` dans ${params.category}` : "";
  const intro = `
    ${h2(`${who ? who + ", on" : "On"} a un espace pour ton travail ✦`)}
    ${text(`Je suis Aicha, je lance <strong style="color:#101014;">Spectrum For Us</strong> — la marketplace par et pour les communautés queer. En découvrant ton travail${cat}, je me suis dit que ta place était parmi nos premier·es créateur·ices.`)}
    ${text("Concrètement : ta boutique en ligne, une audience qui te cherche déjà, et — pour les fondateur·ices — <strong style=\"color:#101014;\">12 mois d'abonnement offerts et 0 % de commission</strong>. Il reste quelques places.")}
    ${cta("Voir le programme fondateur", `${BASE}/programme-fondateur`)}
  `;
  const followup = `
    ${h2(`${who ? who + ", " : ""}je reviens vers toi 🌸`)}
    ${text(`Je ne voulais pas que tu rates les <strong style="color:#101014;">places fondateur·ice</strong> de Spectrum For Us (12 mois offerts, 0 % de commission). On garde une place pour ton univers${cat}, mais plus pour longtemps.`)}
    ${text("Si ce n'est pas le bon moment, aucun souci — réponds-moi juste un mot et je te recontacterai plus tard.")}
    ${cta("Réserver ma place", `${BASE}/programme-fondateur`)}
  `;
  const body = (params.step <= 0 ? intro : followup) + `
    <p style="font-size:11px;line-height:1.6;color:rgba(16,16,20,0.3);margin:24px 0 0;border-top:1px solid rgba(16,16,20,0.08);padding-top:14px;">
      Spectrum For Us · Aicha Chennaoui · 61 rue Lautréamont, 93300 Aubervilliers.
      Tu reçois cet email car ton activité correspond à notre communauté.
      <a href="${params.unsubscribeUrl}" style="color:rgba(16,16,20,0.45);">Ne plus recevoir de messages</a>.
    </p>`;
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    replyTo: process.env.OUTREACH_REPLY_TO || undefined,
    subject: params.step <= 0
      ? `${who ? who + ", t" : "T"}a place de fondateur·ice sur Spectrum For Us ✦`
      : `${who ? who + ", d" : "D"}ernières places fondateur·ice 🌸`,
    html: baseLayout("Spectrum For Us", body),
  });
}

/** Silently ignore email errors · never block the main flow */
export async function trySend(fn: () => Promise<unknown>) {
  try { await fn(); } catch (e) { console.error("[email]", e); }
}
