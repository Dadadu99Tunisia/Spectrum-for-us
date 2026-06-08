"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

/** Track automatique des vues de page à chaque navigation. */
export function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    track("page_view");
  }, [pathname]);
  return null;
}
