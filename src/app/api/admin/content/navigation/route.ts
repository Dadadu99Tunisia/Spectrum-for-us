import { requireAdmin, apiError } from "@/lib/admin/rbac";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const supabase = await createClient();
  const { data } = await supabase.from("site_navigation").select("*").order("location").order("sort_order");
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const body = await req.json() as Record<string, unknown>;
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_navigation").insert(body).select().single();
  if (error) return apiError(error.message);
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const body = await req.json() as { id: string; [k: string]: unknown }[];
  const supabase = await createClient();
  await Promise.all(body.map(({ id, ...rest }) => supabase.from("site_navigation").update(rest).eq("id", id)));
  return NextResponse.json({ ok: true });
}
