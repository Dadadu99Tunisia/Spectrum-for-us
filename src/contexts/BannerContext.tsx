"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const BannerCtx = createContext<{ visible: boolean; hide: () => void }>({
  visible: false,
  hide: () => {},
});

export function BannerProvider({ children }: { children: ReactNode }) {
  // Check sessionStorage on first render (client-only)
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("pride_banner_dismissed") !== "1";
  });

  const hide = () => {
    sessionStorage.setItem("pride_banner_dismissed", "1");
    setVisible(false);
  };

  return <BannerCtx.Provider value={{ visible, hide }}>{children}</BannerCtx.Provider>;
}

export const useBanner = () => useContext(BannerCtx);
