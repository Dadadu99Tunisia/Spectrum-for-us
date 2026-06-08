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

function baseLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#3D1F5C;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#3D1F5C;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1a0d28;border-radius:16px;overflow:hidden;border:1px solid rgba(243,234,219,0.08);">
<!-- Prism header -->
<tr><td style="height:4px;background:linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95);"></td></tr>
<!-- Logo -->
<tr><td style="padding:32px 40px 0;text-align:center;">
  <span style="font-size:28px;color:#F3EADB;font-weight:700;letter-spacing:-1px;">Spectrum <span style="color:#E0337E;">For Us</span></span>
  <p style="margin:4px 0 0;font-size:11px;color:rgba(243,234,219,0.3);letter-spacing:3px;text-transform:uppercase;">✦ La marketplace queer</p>
</td></tr>
<!-- Body -->
<tr><td style="padding:32px 40px;">${body}</td></tr>
<!-- Footer -->
<tr><td style="padding:24px 40px;border-top:1px solid rgba(243,234,219,0.06);text-align:center;">
  <p style="font-size:11px;color:rgba(243,234,219,0.25);margin:0;">
    Spectrum For Us · <a href="${BASE}/legal/confidentialite" style="color:rgba(243,234,219,0.25);">Confidentialité</a> ·
    <a href="${BASE}/compte" style="color:rgba(243,234,219,0.25);">Mon compte</a>
  </p>
</td></tr>
<!-- Prism footer -->
<tr><td style="height:4px;background:linear-gradient(90deg,#1C9C95,#6D2DB5,#CF3F7C,#E0901E,#E0533A);"></td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function text(s: string) {
  return `<p style="font-size:15px;line-height:1.7;color:rgba(243,234,219,0.75);margin:0 0 16px;">${s}</p>`;
}
function h2(s: string) {
  return `<h2 style="font-size:20px;color:#F3EADB;margin:0 0 12px;font-weight:600;">${s}</h2>`;
}
function cta(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:8px;padding:14px 28px;background:#E0337E;color:#F3EADB;text-decoration:none;border-radius:100px;font-size:14px;font-weight:600;">${label}</a>`;
}
function itemRow(name: string, price: number, qty: number) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(243,234,219,0.06);font-size:14px;color:rgba(243,234,219,0.75);">${name}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(243,234,219,0.06);text-align:right;font-size:14px;color:rgba(243,234,219,0.75);">×${qty}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(243,234,219,0.06);text-align:right;font-size:14px;color:#F3EADB;font-weight:600;">${(price * qty).toFixed(2)} €</td>
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
    <p style="font-family:monospace;font-size:11px;color:rgba(243,234,219,0.3);letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">Réf. #${params.orderRef.slice(0,8).toUpperCase()}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">${rows}
      <tr><td colspan="2" style="padding:12px 0;font-size:15px;color:rgba(243,234,219,0.6);font-weight:600;">Total</td>
      <td style="padding:12px 0;text-align:right;font-size:18px;color:#E0337E;font-weight:700;">${params.total.toFixed(2)} €</td></tr>
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
    <p style="font-family:monospace;font-size:11px;color:rgba(243,234,219,0.3);letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">Réf. #${params.orderRef.slice(0,8).toUpperCase()}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">${rows}
      <tr><td colspan="2" style="padding:12px 0;font-size:15px;color:rgba(243,234,219,0.6);font-weight:600;">Total</td>
      <td style="padding:12px 0;text-align:right;font-size:18px;color:#E0337E;font-weight:700;">${params.total.toFixed(2)} €</td></tr>
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
    ? `<p style="font-size:14px;font-family:monospace;color:rgba(243,234,219,0.5);margin:8px 0 0;">
        ${params.carrier ?? "Transporteur"} · <strong style="color:#F3EADB;">${params.trackingNumber}</strong>
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
    ${text(`<strong style="color:#F3EADB;">${params.productName}</strong> · ${params.price.toFixed(2)} €`)}
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

/** Silently ignore email errors · never block the main flow */
export async function trySend(fn: () => Promise<unknown>) {
  try { await fn(); } catch (e) { console.error("[email]", e); }
}
