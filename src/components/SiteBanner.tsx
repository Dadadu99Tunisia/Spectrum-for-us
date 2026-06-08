"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type BannerData = {
  active: boolean;
  text: string;
  color: string;
  link: string;
  linkLabel: string;
};

export default function SiteBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("site_content")
      .select("key, value")
      .in("key", ["banner_active", "banner_text", "banner_color", "banner_link", "banner_link_label"])
      .then(({ data }) => {
        if (!data) return;
        const m = Object.fromEntries(data.map(r => [r.key, r.value ?? ""]));
        if (m["banner_active"] !== "true") return;
        setBanner({
          active: true,
          text: m["banner_text"] || "",
          color: m["banner_color"] || "#FF2DA0",
          link: m["banner_link"] || "",
          linkLabel: m["banner_link_label"] || "En savoir plus",
        });
      });
  }, []);

  if (!banner || dismissed) return null;

  return (
    <div className="w-full py-2.5 px-4 flex items-center justify-center gap-4 text-white text-sm font-hanken relative"
      style={{ backgroundColor: banner.color }}>
      <span>{banner.text}</span>
      {banner.link && (
        <a href={banner.link}
          className="underline underline-offset-2 font-medium opacity-90 hover:opacity-100 transition-opacity">
          {banner.linkLabel}
        </a>
      )}
      <button onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}
