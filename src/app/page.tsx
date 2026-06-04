import { Header } from "@/components/Header";
import { PrideCountdown } from "@/components/PrideCountdown";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { Manifeste } from "@/components/sections/Manifeste";
import { Univers } from "@/components/sections/Univers";
import { CoupsDeCoeur } from "@/components/sections/CoupsDeCoeur";
import { Createurs } from "@/components/sections/Createurs";
import { Experiences } from "@/components/sections/Experiences";
import { RejoindreCTA } from "@/components/sections/RejoindreCTA";
import { VendreIci } from "@/components/sections/VendreIci";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <PrideCountdown />
      <Header />
      <main id="main-content">
        <Hero />
        <Manifeste />
        <Univers />
        <CoupsDeCoeur />
        <Createurs />
        <Experiences />
        <RejoindreCTA />
        <VendreIci />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
