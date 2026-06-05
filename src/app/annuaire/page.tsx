import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnuaireClient } from "@/components/annuaire/AnnuaireClient";
import { ORGS, COUNTRIES } from "@/data/annuaire-orgs";

export const metadata = {
  title: "Annuaire LGBTQIA+ Europe — Spectrum For Us",
  description:
    "Organisations, associations, centres et ressources LGBTQIA+ à travers toute l'Europe.",
};

export default function AnnuairePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col" style={{ background: "#0d0d16" }}>
        {/* ─── Hero header ─── */}
        <section className="relative px-6 pt-28 pb-10 overflow-hidden">
          {/* Ambient glows */}
          <div
            className="absolute left-0 top-0 w-[500px] h-[300px] pointer-events-none opacity-30"
            style={{
              background: "radial-gradient(ellipse, #FF3D7F40, transparent 70%)",
            }}
          />
          <div
            className="absolute right-0 top-0 w-[400px] h-[250px] pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(ellipse, #1C9C9540, transparent 70%)",
            }}
          />
          {/* Left prism accent */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px]"
            style={{
              background:
                "linear-gradient(180deg, #E0533A, #E0901E, #CF3F7C, #6D2DB5, #1C9C95)",
            }}
          />

          <div className="max-w-7xl mx-auto relative">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#FF3D7F] block mb-4">
              ◈ Annuaire queer
            </span>
            <h1 className="font-fraunces text-4xl md:text-5xl text-[#1A1612] leading-tight mb-3">
              Les organisations{" "}
              <span className="italic text-[#CF3F7C]">qui nous soutiennent</span>
              <br />à travers l&apos;Europe.
            </h1>
            <p className="font-hanken text-[#1A1612]/55 text-lg max-w-2xl leading-relaxed">
              {ORGS.length} organisations dans {COUNTRIES.length} pays. Associations, centres
              communautaires, ressources juridiques et santé, au service de la communauté.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { value: `${ORGS.length}+`, label: "organisations", color: "#FF3D7F" },
                { value: `${COUNTRIES.length}`, label: "pays couverts", color: "#1C9C95" },
                { value: "100%", label: "vérifié", color: "#E0901E" },
                { value: "Gratuit", label: "accès libre", color: "#CF3F7C" },
              ].map(({ value, label, color }) => (
                <div key={label}>
                  <div className="font-fraunces text-2xl leading-none tabular-nums" style={{ color }}>
                    {value}
                  </div>
                  <div className="font-mono text-[10px] tracking-wide text-[#1A1612]/35 uppercase mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Interactive directory ─── */}
        <section
          className="mx-4 md:mx-6 mb-8 rounded-2xl border border-[#1A1612]/8 overflow-hidden"
          style={{ background: "rgba(26,22,18,0.02)" }}
        >
          <AnnuaireClient />
        </section>

        {/* ─── CTA référencer ─── */}
        <section className="px-6 py-16 text-center max-w-2xl mx-auto">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[#FF3D7F] mb-4">
            ✦ Vous manquez ?
          </p>
          <h2 className="font-fraunces text-2xl text-[#1A1612] mb-3">
            Référencer mon organisation
          </h2>
          <p className="font-hanken text-[#1A1612]/50 text-sm leading-relaxed mb-6">
            Une association, un centre, une ressource LGBTQIA+ qui n&apos;apparaît pas encore ?
            Faites-le nous savoir, nous l&apos;ajoutons gratuitement.
          </p>
          <a
            href="mailto:contact@spectrumforus.com?subject=Référencement annuaire"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-hanken font-semibold text-sm transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #FF3D7F, #CF3F7C)",
              color: "#fff",
            }}
          >
            Nous contacter →
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
