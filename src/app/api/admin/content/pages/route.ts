import { requireAdmin, apiError } from "@/lib/admin/rbac";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const supabase = await createClient();
  const { data } = await supabase.from("site_pages").select("*").order("sort_order").order("created_at");
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const body = await req.json() as Record<string, unknown>;
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_pages").insert({ ...body, updated_by: auth.user.id }).select().single();
  if (error) return apiError(error.message);
  return NextResponse.json({ data });
}
