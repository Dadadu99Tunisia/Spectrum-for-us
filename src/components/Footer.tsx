import { Globe, Share2, Mail } from "lucide-react";
import Image from "next/image";

const LINKS = {
  Marketplace: ["Créations", "Services", "Expériences", "Nouveautés"],
  Communauté: ["Créateur·rice·s", "Blog", "Événements", "Newsletter"],
  Plateforme: ["Vendre ici", "Comment ça marche", "Tarifs", "Contact"],
  Légal: ["Mentions légales", "CGU", "Confidentialité", "Cookies"],
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
              {[Globe, Share2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full border border-[#F3EADB]/15 text-[#F3EADB]/40 hover:border-[#E0337E]/40 hover:text-[#E0337E] transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-mono text-[10px] tracking-widest uppercase text-[#F3EADB]/30 mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-hanken text-sm text-[#F3EADB]/50 hover:text-[#F3EADB] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#F3EADB]/8 pt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <p className="font-mono text-[11px] text-[#F3EADB]/25">
            © 2026 Spectrum For Us · Tous droits réservés
          </p>
          <p className="font-mono text-[11px] text-[#F3EADB]/25">
            B(u)y us, for us.
          </p>
        </div>
      </div>
    </footer>
  );
}
