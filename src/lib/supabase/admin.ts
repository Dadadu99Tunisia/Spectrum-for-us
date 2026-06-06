import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client · bypasses RLS.
 *
 * À utiliser UNIQUEMENT côté serveur dans des contextes sans session utilisateur
 * (webhooks Stripe, jobs, suppression de compte). Ne jamais exposer au client.
 *
 * Nécessite la variable d'environnement SUPABASE_SERVICE_ROLE_KEY.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL manquant · " +
      "client service-role indisponible."
    );
  }
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
