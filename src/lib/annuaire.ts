import { ORGS, COUNTRIES, CATEGORIES, type OrgEntry, type OrgCategory } from "@/data/annuaire-orgs";

export function slugify(s: string): string {
  return s
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const COUNTRY_SLUGS = COUNTRIES.map((country) => ({ slug: slugify(country), country }));

export function countryFromSlug(slug: string): string | null {
  return COUNTRY_SLUGS.find((c) => c.slug === slug)?.country ?? null;
}

export function orgsByCountry(country: string): OrgEntry[] {
  return ORGS.filter((o) => o.country === country);
}

export function orgById(id: string): OrgEntry | null {
  return ORGS.find((o) => o.id === id) ?? null;
}

export function categoryLabels(cats: OrgCategory[]): string[] {
  return cats.map((c) => CATEGORIES.find((x) => x.value === c)?.label).filter(Boolean) as string[];
}

export { ORGS, COUNTRIES, CATEGORIES };
export type { OrgEntry };
