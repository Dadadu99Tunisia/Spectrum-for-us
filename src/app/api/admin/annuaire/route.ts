import { requireAdmin, apiError } from "@/lib/admin/rbac";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("annuaire_overrides")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return apiError(error.message);
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json() as {
    org_id: string;
    logo_url?: string;
    custom_name?: string;
    custom_desc?: string;
    website?: string;
    phone?: string;
    email?: string;
    accent?: string;
    is_featured?: boolean;
    is_hidden?: boolean;
  };

  if (!body.org_id) return apiError("org_id requis");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("annuaire_overrides")
    .upsert({
      ...body,
      updated_at: new Date().toISOString(),
      updated_by: auth.user.id,
    }, { onConflict: "org_id" })
    .select()
    .single();

  if (error) return apiError(error.message);
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { org_id } = await req.json() as { org_id: string };
  if (!org_id) return apiError("org_id requis");

  const supabase = await createClient();
  const { error } = await supabase
    .from("annuaire_overrides")
    .delete()
    .eq("org_id", org_id);

  if (error) return apiError(error.message);
  return NextResponse.json({ ok: true });
}
