"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Script from "next/script"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Fonction pour envoyer les données de navigation à votre service d'analyse
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag("config", "G-XXXXXXXXXX", {
          page_path: url,
        })
      }
    }

    // Envoyer la page actuelle
    handleRouteChange(`${pathname}${searchParams ? `?${searchParams}` : ""}`)
  }, [pathname, searchParams])

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
