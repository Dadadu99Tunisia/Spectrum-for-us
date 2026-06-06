import { Mail, ArrowRight, Heart, Accessibility } from "lucide-react";
import Link from "next/link";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";

const T = { ink: "#1A1612", soft: "#6B6258", faint: "#9B9285", line: "#ECE6DB", mag: "#FF3D7F" };

const LINKS: Record<string, { label: string; href: string }[]> = {
  "Accessibilité & inclusivité": [
    { label: "Notre engagement", href: "/#manifeste" },
    { label: "Charte d'inclusivité", href: "/legal/cgu" },
    { label: "Aide & accessibilité", href: "mailto:accessibilite@spectrumforus.com" },
    { label: "Signaler un souci", href: "mailto:hello@spectrumforus.com?subject=Signalement" },
  ],
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

const PAYMENTS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay", "Stripe"];

function Social({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:text-[#FF3D7F]"
      style={{ boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.soft }}>
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "#FBF9F5", borderTop: `1px solid ${T.line}` }}>
      {/* ── Engagement accessibilité & inclusivité (en premier) ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-12">
        <div className="rounded-2xl px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-2"
          style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
          <span className="flex items-center gap-2 font-bricolage font-semibold text-[14px]" style={{ color: T.ink }}>
            <Accessibility size={17} style={{ color: T.mag }} /> Accessibilité et inclusivité d'abord
          </span>
          <span className="font-hanken text-[13.5px]" style={{ color: T.soft }}>
            Un espace pensé pour tout le spectre : navigation au clavier, contrastes, langues et devises adaptées.
          </span>
          <Link href="/#manifeste" className="font-hanken font-semibold text-[13.5px] ml-auto" style={{ color: T.mag }}>
            Notre engagement
          </Link>
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div id="newsletter" className="max-w-6xl mx-auto px-6 md:px-8 pt-8 pb-12">
        <div className="rounded-3xl px-8 py-10 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ background: "#fff", boxShadow: `inset 0 0 0 1px ${T.line}` }}>
          <div>
            <h3 className="font-fraunces text-[26px] leading-tight" style={{ color: T.ink }}>Reste dans le spectre.</h3>
            <p className="font-hanken text-[14.5px] mt-1" style={{ color: T.soft }}>
              Offres, nouveautés et actus queer en avant première. Une fois par mois, jamais de spam.
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

      {/* ── Colonnes ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {/* Brand + socials */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-dark.png" alt="Spectrum For Us" className="h-10 w-auto mb-4" />
            <p className="font-hanken text-[14px] leading-relaxed mb-5 max-w-xs" style={{ color: T.soft }}>
              La marketplace par et pour les communautés queer.
            </p>
            <div className="flex gap-2.5">
              <Social label="Instagram" href="https://www.instagram.com/spectrum.forus/">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Social>
              <Social label="TikTok" href="https://tiktok.com/@spectrumforus">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/></svg>
              </Social>
              <Social label="Email" href="mailto:hello@spectrumforus.com"><Mail size={15} /></Social>
            </div>
          </div>

          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bricolage font-semibold text-[13px] mb-4" style={{ color: T.ink }}>{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="font-hanken text-[14px] transition-colors hover:text-[#FF3D7F]" style={{ color: T.soft }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pays / langue / devise + paiements ── */}
      <div style={{ borderTop: `1px solid ${T.line}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="font-hanken text-[12px]" style={{ color: T.faint }}>Pays, langue et devise</span>
            <LocaleSwitcher variant="footer" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold"
                style={{ background: "#fff", color: T.soft, boxShadow: `inset 0 0 0 1px ${T.line}` }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bas ── */}
      <div style={{ borderTop: `1px solid ${T.line}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 pb-28 md:pb-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <p className="font-hanken text-[12.5px] flex items-center gap-1.5" style={{ color: T.faint }}>
            © 2026 Spectrum For Us · Fait avec <Heart size={12} className="inline" style={{ color: T.mag }} /> pour la communauté
          </p>
          <p className="font-fraunces text-[13px]" style={{ color: T.faint }}>B(u)y us, for us. 🌈</p>
        </div>
      </div>
    </footer>
  );
}
