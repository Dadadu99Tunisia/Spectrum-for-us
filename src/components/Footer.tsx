import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

const T = { ink: "#1A1612", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF3D7F" };

const LINKS: Record<string, { label: string; href: string }[]> = {
  Marketplace: [
    { label: "Créations", href: "/decouvrir?type=produit" },
    { label: "Services", href: "/services" },
    { label: "Associations", href: "/annuaire" },
    { label: "Événements", href: "/evenements" },
  ],
  Communauté: [
    { label: "Média", href: "/media" },
    { label: "Ambassadeur·rices", href: "/ambassadeurs" },
    { label: "Espace communauté", href: "/communaute" },
    { label: "Newsletter", href: "#newsletter" },
  ],
  Plateforme: [
    { label: "Ouvrir ma boutique", href: "/vendeur/onboarding" },
    { label: "Programme fondateur", href: "/programme-fondateur" },
    { label: "Comment ça marche", href: "/#manifeste" },
    { label: "Contact", href: "mailto:hello@spectrumforus.com" },
  ],
  Légal: [
    { label: "Mentions légales", href: "/legal/mentions" },
    { label: "CGU", href: "/legal/cgu" },
    { label: "Confidentialité", href: "/legal/confidentialite" },
    { label: "Cookies", href: "/legal/cookies" },
  ],
};

export function Footer() {
  return (
    <footer style={{ background: "#FBF9F5", borderTop: `1px solid ${T.line}` }}>
      {/* ── Newsletter ── */}
      <div id="newsletter" className="max-w-6xl mx-auto px-6 md:px-8 pt-14 pb-12">
        <div className="rounded-3xl px-8 py-10 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
          <div>
            <h3 className="font-fraunces text-[26px] leading-tight" style={{ color: T.ink }}>
              Reste dans le spectre.
            </h3>
            <p className="font-hanken text-[14.5px] mt-1" style={{ color: T.soft }}>
              Nouveautés, créateur·ices et événements queer — une fois par mois, jamais de spam.
            </p>
          </div>
          <form action="mailto:hello@spectrumforus.com" method="post" encType="text/plain"
            className="flex items-center gap-2 w-full md:w-auto">
            <input type="email" name="email" required placeholder="ton@email.com"
              className="flex-1 md:w-64 rounded-full px-5 py-3 text-[14px] outline-none"
              style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }} />
            <button type="submit"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-5 py-3 font-semibold text-[14px] text-white"
              style={{ background: T.ink }}>
              S&apos;inscrire <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Liens ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-dark.png" alt="Spectrum For Us" className="h-10 w-auto mb-4" />
            <p className="font-hanken text-[14px] leading-relaxed mb-5 max-w-xs" style={{ color: T.soft }}>
              La marketplace par et pour les communautés queer. Un espace tenu pour tout le spectre.
            </p>
            <div className="flex gap-2.5">
              {[
                { label: "Instagram", href: "https://www.instagram.com/spectrum.forus/",
                  svg: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></> },
                { label: "TikTok", href: "https://tiktok.com/@spectrumforus",
                  svg: <path fill="currentColor" stroke="none" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/> },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:text-[#FF3D7F]"
                  style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{s.svg}</svg>
                </a>
              ))}
              <a href="mailto:hello@spectrumforus.com" aria-label="Email"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:text-[#FF3D7F]"
                style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}>
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Colonnes */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bricolage font-semibold text-[13px] mb-4" style={{ color: T.ink }}>{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="font-hanken text-[14px] transition-colors hover:text-[#FF3D7F]"
                      style={{ color: T.soft }}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bas ── */}
      <div style={{ borderTop: `1px solid ${T.line}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 pb-28 md:pb-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <p className="font-hanken text-[12.5px]" style={{ color: T.faint }}>
            © 2026 Spectrum For Us · Tous droits réservés
          </p>
          <p className="font-fraunces text-[13px]" style={{ color: T.faint }}>B(u)y us, for us. 🌈</p>
        </div>
      </div>
    </footer>
  );
}
