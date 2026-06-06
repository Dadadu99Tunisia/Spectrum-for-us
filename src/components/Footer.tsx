import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LINKS: Record<string, { label: string; href: string }[]> = {
  Marketplace: [
    { label: "Créations", href: "/decouvrir?type=produit" },
    { label: "Services", href: "/decouvrir?type=service" },
    { label: "Expériences", href: "/decouvrir?type=experience" },
    { label: "Nouveautés", href: "/decouvrir?sort=newest" },
  ],
  Communauté: [
    { label: "Créateur·rice·s", href: "/#createurs" },
    { label: "Média", href: "/media" },
    { label: "Ambassadeur·rices", href: "/ambassadeurs" },
    { label: "Newsletter", href: "/#newsletter" },
  ],
  Plateforme: [
    { label: "Vendre ici", href: "/vendeur/onboarding" },
    { label: "Abonnement vendeur", href: "/vendeur/abonnement" },
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
    <footer className="border-t border-[#F3EADB]/8 pt-16 pb-32 px-6">
      {/* Prism line */}
      <div
        className="h-[2px] w-full mb-12"
        style={{
          background:
            "linear-gradient(90deg, #E0533A, #E0901E, #CF3F7C, #6D2DB5, #1C9C95)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <Image src="/logo.png" alt="Spectrum For Us" width={40} height={40} className="object-contain" />
              <div className="font-fraunces text-xl text-[#F3EADB] leading-tight">
                Spectrum <span className="text-[#E0337E] font-light">For Us</span>
              </div>
            </div>
            <p className="font-hanken text-sm text-[#F3EADB]/50 leading-relaxed mb-6 max-w-xs">
              Un espace tenu pour tout le spectre.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/spectrum.forus/" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full border border-[#F3EADB]/15 text-[#F3EADB]/40 hover:border-[#E0337E]/40 hover:text-[#E0337E] transition-all duration-200"
                aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://tiktok.com/@spectrumforus" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full border border-[#F3EADB]/15 text-[#F3EADB]/40 hover:border-[#E0337E]/40 hover:text-[#E0337E] transition-all duration-200"
                aria-label="TikTok">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/></svg>
              </a>
              <a href="mailto:hello@spectrumforus.com"
                className="p-2 rounded-full border border-[#F3EADB]/15 text-[#F3EADB]/40 hover:border-[#E0337E]/40 hover:text-[#E0337E] transition-all duration-200"
                aria-label="Email">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-mono text-[10px] tracking-wide text-[#F3EADB]/30 mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-hanken text-sm text-[#F3EADB]/50 hover:text-[#F3EADB] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#F3EADB]/8 pt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <p className="font-mono text-[11px] text-[#F3EADB]/25">
            © 2026 Spectrum For Us · Tous droits réservés ·{" "}
            <Link href="/legal/mentions" className="hover:text-[#F3EADB]/50 transition-colors">Mentions légales</Link>
          </p>
          <p className="font-mono text-[11px] text-[#F3EADB]/25">
            B(u)y us, for us. 🌈
          </p>
        </div>
      </div>
    </footer>
  );
}
