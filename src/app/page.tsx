import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { MobileHomeView } from "@/components/mobile/MobileHomeView";
import { LightHome } from "@/components/home/LightHome";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />

      {/* ══ MOBILE EXPERIENCE (< 768px) ══ */}
      <MobileHomeView />

      {/* ══ DESKTOP EXPERIENCE (≥ 768px) · accueil clair minimaliste ══ */}
      <div className="hidden md:block" id="main-content">
        <LightHome />
      </div>

      {/* Footer unique · identique sur tout le site (mobile + desktop) */}
      <Footer />
    </>
  );
}
