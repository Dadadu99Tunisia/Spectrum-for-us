import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScatterText } from "@/components/ui/ScatterText";

const T = { ink: "#101014", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF2DA0" };

export type Section = { h: string; p: string[] };

export function EditorialPage({ eyebrow, title, lead, sections, scatterWord }: {
  eyebrow: string; title: string; lead: string; sections: Section[]; scatterWord?: string;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "#FBFAF8", color: T.ink }}>
        <section className="max-w-3xl mx-auto px-6 md:px-8 pt-32 pb-10">
          <p className="font-hanken text-[13px] mb-3" style={{ color: T.faint }}>{eyebrow}</p>
          <h1 className="font-fraunces font-extrabold leading-[1.1] tracking-[-0.02em]" style={{ fontSize: "clamp(32px,5vw,52px)" }}>
            {scatterWord && title.includes(scatterWord)
              ? <>{title.split(scatterWord)[0]}<ScatterText text={scatterWord} intensity={0.7} className="align-baseline" style={{ color: T.mag }} />{title.split(scatterWord)[1]}</>
              : title}
          </h1>
          <p className="font-hanken text-[16.5px] leading-relaxed mt-5" style={{ color: T.soft }}>{lead}</p>
        </section>

        <section className="max-w-3xl mx-auto px-6 md:px-8 pb-20">
          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.h} className="rounded-2xl p-6 md:p-7" style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                <h2 className="font-bricolage font-bold text-[19px] mb-3">{s.h}</h2>
                <div className="space-y-3">
                  {s.p.map((para, i) => (
                    <p key={i} className="font-hanken text-[15px] leading-relaxed" style={{ color: T.soft }}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
