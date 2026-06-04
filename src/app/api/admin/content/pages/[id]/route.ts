import { requireAdmin, apiError } from "@/lib/admin/rbac";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const body = await req.json() as Record<string, unknown>;
  const supabase = await createClient();
  const { error } = await supabase.from("site_pages").update({ ...body, updated_at: new Date().toISOString(), updated_by: auth.user.id }).eq("id", id);
  if (error) return apiError(error.message);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const supabase = await createClient();
  await supabase.from("site_pages").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
