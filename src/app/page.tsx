import { Header } from "@/components/Header";
import { PrideCountdown } from "@/components/PrideCountdown";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { Manifeste } from "@/components/sections/Manifeste";
import { Origines } from "@/components/sections/Origines";
import { Univers } from "@/components/sections/Univers";
import { CoupsDeCoeur } from "@/components/sections/CoupsDeCoeur";
import { Createurs } from "@/components/sections/Createurs";
import { Voix } from "@/components/sections/Voix";
import { Experiences } from "@/components/sections/Experiences";
import { RejoindreCTA } from "@/components/sections/RejoindreCTA";
import { VendreIci } from "@/components/sections/VendreIci";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/Footer";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";
import { EcoBanner } from "@/components/EcoBanner";

export default function Home() {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <PrideCountdown />
      <Header />
      <main id="main-content">
        <Hero />
        <MarqueeBanner variant="default" />
        <Manifeste />
        <Origines />
        <Univers />
        <MarqueeBanner
          variant="bold"
          speed="slow"
          reverse
          items={[
            "✦ Ce n'est pas une tolérance : c'est un droit",
            "◈ Chaque achat soutient un·e créateur·rice",
            "✦ Mode sans genre",
            "◈ Art queer sans filtre",
            "✦ Bijoux uniques",
            "◈ Corps & Soin inclusif",
            "✦ Zines & édition indépendante",
            "◈ Nous existons, et nous créons",
          ]}
        />
        <CoupsDeCoeur />
        <Createurs />
        <Voix />
        <Experiences />
        <RejoindreCTA />
        <VendreIci />
        <Newsletter />
      </main>
      <EcoBanner />
      <Footer />
    </>
  );
}
