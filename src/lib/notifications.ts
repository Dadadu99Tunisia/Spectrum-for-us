import { createAdminClient } from "@/lib/supabase/admin";

export type NotifInput = {
  userId: string;
  type: string;
  title: string;
  body?: string | null;
  href?: string | null;
  metadata?: Record<string, unknown> | null;
};

/** Crée une ou plusieurs notifications (service-role → bypass RLS). Best-effort : n'interrompt jamais le flux appelant. */
export async function notify(input: NotifInput | NotifInput[]): Promise<void> {
  const list = (Array.isArray(input) ? input : [input]).filter((n) => n.userId);
  if (!list.length) return;
  try {
    const admin = createAdminClient();
    await admin.from("notifications").insert(
      list.map((n) => ({
        user_id: n.userId,
        type: n.type,
        title: n.title,
        body: n.body ?? null,
        href: n.href ?? null,
        metadata: n.metadata ?? null,
      }))
    );
  } catch (e) {
    console.error("[notify]", e);
  }
}
