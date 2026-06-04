import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError } from "@/lib/admin/rbac";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","support"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const { content, is_internal } = body;
  if (!content?.trim()) return apiError("content required");

  const supabase = await createClient();
  const { data, error } = await supabase.from("ticket_messages").insert({
    ticket_id: id,
    sender_id: auth.user.id,
    content,
    is_internal: Boolean(is_internal),
  }).select().single();

  if (error) return apiError(error.message);

  // Mettre à jour first_response_at si premier message de l'équipe
  const { data: ticket } = await supabase.from("support_tickets")
    .select("first_response_at").eq("id", id).single();
  if (!ticket?.first_response_at) {
    await supabase.from("support_tickets").update({
      first_response_at: new Date().toISOString(),
      ticket_status: "in_progress",
      updated_at: new Date().toISOString(),
    }).eq("id", id);
  }

  return apiResponse(data, {}, 201);
}
