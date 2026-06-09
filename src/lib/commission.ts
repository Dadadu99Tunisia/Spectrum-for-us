import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Taux de commission (%) appliqué à une boutique à l'instant T.
 * - 0 % si l'avantage fondateur·ice est actif (commission_free_until dans le futur)
 * - sinon commission_rate_override du programme fondateur si présent
 * - sinon le taux par défaut (admin_settings.commission_rate, défaut 5 %)
 */
export async function getCommissionRate(supabase: SupabaseClient, shopId: string): Promise<number> {
  const { data: setting } = await supabase
    .from("admin_settings").select("value").eq("key", "commission_rate").maybeSingle();
  const defaultRate = setting?.value != null ? Number(setting.value) : 5;

  const { data: f } = await supabase
    .from("founder_program_members")
    .select("commission_free_until, commission_rate_override")
    .eq("shop_id", shopId)
    .maybeSingle();

  if (f?.commission_free_until && new Date(f.commission_free_until).getTime() > Date.now()) return 0;
  if (f?.commission_rate_override != null) return Number(f.commission_rate_override);
  return defaultRate;
}
