"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      // Store referral code for 30 days
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `spectrum_ref=${ref}; expires=${expires}; path=/; SameSite=Lax`;
      localStorage.setItem("spectrum_ref", ref);
    }
  }, [searchParams]);

  return null;
}
