import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LightAnnuaire } from "@/components/annuaire/LightAnnuaire";

export const metadata = {
  title: "Annuaire LGBTQIA+ Europe · Spectrum For Us",
  description:
    "Organisations, associations, centres et ressources LGBTQIA+ à travers toute l'Europe.",
};

export default function AnnuairePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "#FBF9F5", color: "#1A1612" }}>
        <LightAnnuaire />

        {/* ─── CTA référencer ─── */}
        <section className="px-6 py-16 text-center max-w-2xl mx-auto">
          <p className="font-fraunces text-[26px] mb-3">Référencer mon organisation</p>
          <p className="font-hanken text-[15px] leading-relaxed mb-6" style={{ color: "#6B6258" }}>
            Une association, un centre, une ressource LGBTQIA+ qui n&apos;apparaît pas encore ?
            Faites-le nous savoir, nous l&apos;ajoutons gratuitement.
          </p>
          <a
            href="mailto:contact@spectrumforus.com?subject=Référencement annuaire"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-hanken font-semibold text-sm text-white transition-all hover:brightness-110"
            style={{ background: "#FF3D7F" }}
          >
            Nous contacter →
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
