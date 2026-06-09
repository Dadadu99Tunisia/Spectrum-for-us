/**
 * Informations légales centralisées de la plateforme.
 * Utilisé par : reçus de commande, mentions légales, CGV.
 */
export const LEGAL = {
  brand: "Spectrum For Us",
  legalName: "Aïcha Chennaoui",
  legalForm: "Entrepreneur individuel (auto-entreprise)",
  siren: "894 102 912",
  siret: "894 102 912 00017",
  ape: "7021Z (conseil en relations publiques et communication)",
  address: "[À COMPLÉTER — adresse du siège]",
  vat: "TVA non applicable, art. 293 B du CGI (franchise en base de TVA)",
  capital: "", // sans objet en entreprise individuelle
  contactEmail: "hello@spectrumforus.com",
  site: "spectrumforus.com",
  mediator: {
    name: "[À COMPLÉTER — médiateur de la consommation]",
    url: "",
    address: "",
  },
} as const;

const isPlaceholder = (s: string) => s.startsWith("[");

/** Bloc pied de page pour les reçus / documents légaux. */
export function legalFooterLines(): string[] {
  const lines = [
    `${LEGAL.brand} · ${LEGAL.legalName} — ${LEGAL.legalForm}`,
    `SIRET ${LEGAL.siret}`,
    isPlaceholder(LEGAL.address) ? "" : LEGAL.address,
    LEGAL.vat,
    `${LEGAL.contactEmail} · ${LEGAL.site}`,
  ];
  return lines.filter(Boolean);
}
