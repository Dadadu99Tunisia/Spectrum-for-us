import { requireAdmin } from "@/lib/admin/rbac";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const supabase = await createClient();
  await supabase.from("site_navigation").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
