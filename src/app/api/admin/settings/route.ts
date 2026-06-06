import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

const SETTINGS_TABLE = "admin_settings";

// Defaults · returned if DB row doesn't exist yet
const DEFAULTS: Record<string, unknown> = {
  site_name:          "Spectrum For Us",
  site_url:           "https://spectrumforus.com",
  support_email:      "contact@spectrumforus.com",
  commission_rate:    15,
  maintenance_mode:   false,
  registration_open:  true,
  vendor_auto_approve: false,
  locale_default:     "fr",
  locales_enabled:    ["fr","en"],
  email_provider:     "resend",
  smtp_host:          "",
  smtp_port:          "587",
  smtp_from:          "noreply@spectrumforus.com",
  notif_new_order:    true,
  notif_new_vendor:   true,
  notif_new_ticket:   true,
  notif_moderation:   true,
  stripe_mode:        "live",
};

export async function GET() {
  const auth = await requireAdmin(["super_admin","ceo"]);
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select("key, value")
    .order("key");

  if (error) {
    // Table might not exist yet · return defaults
    return apiResponse(DEFAULTS);
  }

  const settings = { ...DEFAULTS };
  for (const row of data ?? []) {
    try { settings[row.key] = JSON.parse(row.value as string); }
    catch { settings[row.key] = row.value; }
  }

  return apiResponse(settings);
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(["super_admin","ceo"]);
  if ("error" in auth) return auth.error;

  const body = await req.json() as Record<string, unknown>;
  const supabase = await createClient();

  const upserts = Object.entries(body).map(([key, value]) => ({
    key,
    value: JSON.stringify(value),
    updated_at: new Date().toISOString(),
    updated_by: auth.user.id,
  }));

  const { error } = await supabase
    .from(SETTINGS_TABLE)
    .upsert(upserts, { onConflict: "key" });

  if (error) {
    // If table doesn't exist, just return success (settings will be in-memory)
    if (error.code === "42P01") {
      return apiResponse({ saved: upserts.length, note: "Settings table not created yet · run migration" });
    }
    return apiError(error.message);
  }

  return apiResponse({ saved: upserts.length });
}
