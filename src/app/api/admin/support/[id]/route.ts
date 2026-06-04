import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, apiResponse, apiError, logActivity } from "@/lib/admin/rbac";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","support"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const supabase = await createClient();

  const [ticketRes, messagesRes] = await Promise.all([
    supabase.from("support_tickets").select(`
      *,
      profiles!support_tickets_user_id_fkey(id, full_name, email),
      assigned:profiles!support_tickets_assigned_to_fkey(id, full_name)
    `).eq("id", id).single(),
    supabase.from("ticket_messages").select(`
      *, profiles!ticket_messages_sender_id_fkey(id, full_name, role)
    `).eq("ticket_id", id).order("created_at"),
  ]);

  if (ticketRes.error) return apiError(ticketRes.error.message, 404);
  return apiResponse({ ticket: ticketRes.data, messages: messagesRes.data ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(["super_admin","ceo","support"]);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();
  const allowed = ["ticket_status","priority","assigned_to","category"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of allowed) if (k in body) update[k] = body[k];

  if (body.ticket_status === "resolved") update.resolved_at = new Date().toISOString();
  if (body.assigned_to) update.ticket_status = "assigned";

  const supabase = await createClient();
  const { data, error } = await supabase.from("support_tickets").update(update).eq("id", id).select().single();
  if (error) return apiError(error.message);

  await logActivity(auth.user.id, "update_ticket", "ticket", id, update);
  return apiResponse(data);
}
