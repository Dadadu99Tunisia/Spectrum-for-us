import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { Manifeste } from "@/components/sections/Manifeste";
import { Univers } from "@/components/sections/Univers";
import { CoupsDeCoeur } from "@/components/sections/CoupsDeCoeur";
import { Createurs } from "@/components/sections/Createurs";
import { Experiences } from "@/components/sections/Experiences";
import { VendreIci } from "@/components/sections/VendreIci";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/Footer";
import { AccessibilityBar } from "@/components/AccessibilityBar";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifeste />
        <Univers />
        <CoupsDeCoeur />
        <Createurs />
        <Experiences />
        <VendreIci />
        <Newsletter />
      </main>
      <Footer />
      <AccessibilityBar />
    </>
  );
}
