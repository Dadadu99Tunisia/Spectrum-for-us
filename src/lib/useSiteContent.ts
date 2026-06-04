"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/contexts/I18nContext";

export function useSiteContent(key: string) {
  const { locale } = useI18n();
  const [value, setValue]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    // Try locale-specific value first, then fallback to 'fr'
    supabase.from("site_content")
      .select("value, default_value")
      .eq("key", key)
      .eq("locale", locale)
      .single()
      .then(({ data }) => {
        if (data?.value) {
          setValue(data.value);
          setLoading(false);
        } else if (data?.default_value) {
          setValue(data.default_value);
          setLoading(false);
        } else if (locale !== 'fr') {
          // fallback to fr
          return supabase.from("site_content")
            .select("value, default_value")
            .eq("key", key)
            .eq("locale", 'fr')
            .single()
            .then(({ data: frData }) => {
              setValue(frData?.value ?? frData?.default_value ?? null);
              setLoading(false);
            });
        } else {
          setValue(null);
          setLoading(false);
        }
      });
  }, [key, locale]);

  return { value, loading };
}
