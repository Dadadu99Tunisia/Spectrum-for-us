// Source de vérité des enums CRM (doivent rester alignés avec la DB Postgres :
// types `crm_stage` et `crm_contact_type`). Servent à valider les écritures API
// pour éviter les erreurs Postgres 22P02/23514 sur valeur hors enum.

export const CRM_STAGES = [
  "identified", "contacted", "interested", "negotiating", "converted", "lost",
  "qualified", "nurturing", "partner", "rejected", "closed", "vendor",
] as const;

// ⚠️ La colonne crm_contacts.contact_type utilise l'enum Postgres `crm_type`
// (PAS `crm_contact_type`). Garder cette liste synchronisée avec `crm_type`.
export const CRM_CONTACT_TYPES = [
  "prospect_vendor", "prospect_creator", "prospect_association", "prospect_buyer",
  "partner", "investor", "grant", "foundation", "media", "ambassador",
] as const;

// Stages considérés comme une conversion aboutie → posent converted_at.
export const CRM_CONVERTED_STAGES: readonly string[] = ["converted", "vendor", "partner"];
