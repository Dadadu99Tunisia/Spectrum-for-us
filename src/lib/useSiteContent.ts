/**
 * Hook client pour lire les blocs CMS.
 * Usage: const { value } = useSiteContent("banner_text")
 */
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSiteContent(key: string) {
  const [value, setValue]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("site_content").select("value").eq("key", key).single()
      .then(({ data }) => {
        setValue(data?.value ?? null);
        setLoading(false);
      });
  }, [key]);

  return { value, loading };
}
