/**
 * Fetch server-side uniquement · à utiliser dans Server Components ou API routes.
 * Ne jamais importer depuis un Client Component.
 */
import { createClient } from "@/lib/supabase/server";

export async function getSiteContent(key: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("value").eq("key", key).single();
  return data?.value ?? null;
}

export async function getSiteContentMany(keys: string[]): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("key, value").in("key", keys);
  const result: Record<string, string> = {};
  (data ?? []).forEach(row => { result[row.key] = row.value ?? ""; });
  return result;
}
