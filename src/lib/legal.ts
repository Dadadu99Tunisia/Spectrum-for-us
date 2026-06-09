/**
 * Informations légales centralisées de la plateforme.
 * ⚠️ À COMPLÉTER avec les vraies données fournies par l'éditeur·rice.
 * Utilisé par : reçus de commande, mentions légales, CGV.
 */
export const LEGAL = {
  brand: "Spectrum For Us",
  legalName: "[À COMPLÉTER — raison sociale]",
  legalForm: "[À COMPLÉTER — forme juridique]",
  siret: "[À COMPLÉTER — SIRET]",
  address: "[À COMPLÉTER — adresse du siège]",
  vat: "[À COMPLÉTER — n° TVA intracom, ou « non assujetti · franchise en base »]",
  capital: "", // ex. "1 000 €" si société, sinon vide
  contactEmail: "hello@spectrumforus.com",
  site: "spectrumforus.com",
  mediator: {
    name: "[À COMPLÉTER — médiateur de la consommation]",
    url: "",
    address: "",
  },
} as const;

/** Bloc pied de page pour les reçus / documents légaux. */
export function legalFooterLines(): string[] {
  const lines = [
    `${LEGAL.brand}${LEGAL.legalName.startsWith("[") ? "" : ` · ${LEGAL.legalName}`}`,
    LEGAL.legalForm.startsWith("[") ? "" : LEGAL.legalForm,
    LEGAL.siret.startsWith("[") ? "" : `SIRET ${LEGAL.siret}`,
    LEGAL.address.startsWith("[") ? "" : LEGAL.address,
    LEGAL.vat.startsWith("[") ? "" : `TVA : ${LEGAL.vat}`,
    `${LEGAL.contactEmail} · ${LEGAL.site}`,
  ];
  return lines.filter(Boolean);
}
