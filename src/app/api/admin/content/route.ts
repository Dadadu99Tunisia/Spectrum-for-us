import { requireAdmin, apiError } from "@/lib/admin/rbac";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("section")
    .order("label");

  if (error) return apiError(error.message);
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json() as { key: string; value: string }[];
  if (!Array.isArray(body)) return apiError("Expected array of { key, value }");

  const supabase = await createClient();

  const updates = body.map(({ key, value }) =>
    supabase.from("site_content").update({
      value,
      updated_at: new Date().toISOString(),
      updated_by: auth.user.id,
    }).eq("key", key)
  );

  await Promise.all(updates);
  return NextResponse.json({ ok: true });
}
