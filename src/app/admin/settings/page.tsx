"use client";
import { useState } from "react";
import { Settings, Bell, Shield, Globe, Palette, CreditCard, Mail, Save, ChevronRight } from "lucide-react";

const SECTIONS = [
  { id: "general",      label: "Général",        icon: Settings },
  { id: "notifications",label: "Notifications",  icon: Bell },
  { id: "security",     label: "Sécurité",        icon: Shield },
  { id: "localization", label: "Localisation",    icon: Globe },
  { id: "appearance",   label: "Apparence",       icon: Palette },
  { id: "payments",     label: "Paiements",       icon: CreditCard },
  { id: "emails",       label: "Emails",          icon: Mail },
];

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-[#F3EADB]/6 last:border-0">
      <div className="flex-1">
        <p className="font-hanken text-sm text-[#F3EADB]">{label}</p>
        {description && <p className="font-mono text-[10px] text-[#F3EADB]/30 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-colors relative ${value ? "bg-[#E0337E]" : "bg-[#F3EADB]/10"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-1.5 font-hanken text-sm text-[#F3EADB] placeholder-[#F3EADB]/20 focus:outline-none focus:border-[#E0337E]/50 transition-colors w-56" />
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [toast, setToast] = useState<string | null>(null);

  // General
  const [siteName, setSiteName]         = useState("Spectrum For Us");
  const [siteUrl, setSiteUrl]           = useState("https://spectrumforus.com");
  const [supportEmail, setSupportEmail] = useState("contact@spectrumforus.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  // Notifications
  const [newOrderNotif, setNewOrderNotif]     = useState(true);
  const [newVendorNotif, setNewVendorNotif]   = useState(true);
  const [newTicketNotif, setNewTicketNotif]   = useState(true);
  const [weeklyReport, setWeeklyReport]       = useState(false);

  // Security
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [sessionTimeout, setSessionTimeout]       = useState("30");
  const [ipWhitelist, setIpWhitelist]             = useState("");

  // Localization
  const [defaultLocale, setDefaultLocale]   = useState("fr");
  const [timezone, setTimezone]             = useState("Europe/Paris");
  const [currency, setCurrency]             = useState("EUR");

  // Payments
  const [platformFee, setPlatformFee]       = useState("5");
  const [minPayout, setMinPayout]           = useState("50");
  const [payoutDelay, setPayoutDelay]       = useState("7");

  // Emails
  const [emailProvider, setEmailProvider]   = useState("resend");
  const [fromName, setFromName]             = useState("Spectrum For Us");
  const [fromEmail, setFromEmail]           = useState("noreply@spectrumforus.com");

  const save = () => {
    setToast("Paramètres sauvegardés ✓");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && <div className="fixed top-16 right-6 z-50 px-4 py-2 rounded-lg bg-[#E0337E] text-white font-hanken text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl text-[#F3EADB]">Paramètres</h1>
          <p className="font-hanken text-sm text-[#F3EADB]/40 mt-0.5">Configuration de la plateforme</p>
        </div>
        <button onClick={save}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E0337E] text-white font-hanken text-sm hover:bg-[#E0337E]/90 transition-colors">
          <Save size={13} /> Sauvegarder
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-hanken text-sm transition-all ${
                  activeSection === s.id
                    ? "bg-[#E0337E]/10 text-[#E0337E] border border-[#E0337E]/20"
                    : "text-[#F3EADB]/40 hover:text-[#F3EADB] hover:bg-[#F3EADB]/4"
                }`}>
                <Icon size={13} />
                {s.label}
                {activeSection === s.id && <ChevronRight size={10} className="ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 rounded-2xl border border-[#F3EADB]/8 bg-[#F3EADB]/[0.02]">
          {activeSection === "general" && (
            <div>
              <p className="font-fraunces text-base text-[#F3EADB] mb-4">Paramètres généraux</p>
              <Field label="Nom du site" description="Affiché dans les emails et le SEO">
                <Input value={siteName} onChange={setSiteName} />
              </Field>
              <Field label="URL du site">
                <Input value={siteUrl} onChange={setSiteUrl} />
              </Field>
              <Field label="Email de support" description="Reçoit les messages de contact">
                <Input value={supportEmail} onChange={setSupportEmail} />
              </Field>
              <Field label="Mode maintenance" description="Désactive l'accès public au site">
                <Toggle value={maintenanceMode} onChange={setMaintenanceMode} />
              </Field>
              <Field label="Inscriptions ouvertes" description="Permettre les nouvelles inscriptions">
                <Toggle value={registrationOpen} onChange={setRegistrationOpen} />
              </Field>
            </div>
          )}

          {activeSection === "notifications" && (
            <div>
              <p className="font-fraunces text-base text-[#F3EADB] mb-4">Notifications admin</p>
              <Field label="Nouvelle commande" description="Notification à chaque nouvelle commande">
                <Toggle value={newOrderNotif} onChange={setNewOrderNotif} />
              </Field>
              <Field label="Nouveau·elle vendeur·se" description="Notification à chaque inscription vendeur·se">
                <Toggle value={newVendorNotif} onChange={setNewVendorNotif} />
              </Field>
              <Field label="Nouveau ticket support" description="Notification à chaque ticket ouvert">
                <Toggle value={newTicketNotif} onChange={setNewTicketNotif} />
              </Field>
              <Field label="Rapport hebdomadaire" description="Résumé envoyé chaque lundi">
                <Toggle value={weeklyReport} onChange={setWeeklyReport} />
              </Field>
            </div>
          )}

          {activeSection === "security" && (
            <div>
              <p className="font-fraunces text-base text-[#F3EADB] mb-4">Sécurité</p>
              <Field label="2FA obligatoire" description="Impose la double authentification aux admins">
                <Toggle value={twoFactorRequired} onChange={setTwoFactorRequired} />
              </Field>
              <Field label="Expiration session (min)" description="Déconnexion automatique après inactivité">
                <Input value={sessionTimeout} onChange={setSessionTimeout} placeholder="30" />
              </Field>
              <Field label="Whitelist IP" description="IPs autorisées pour l'admin (vide = toutes)">
                <Input value={ipWhitelist} onChange={setIpWhitelist} placeholder="192.168.1.1, ..." />
              </Field>
            </div>
          )}

          {activeSection === "localization" && (
            <div>
              <p className="font-fraunces text-base text-[#F3EADB] mb-4">Localisation</p>
              <Field label="Langue par défaut">
                <select value={defaultLocale} onChange={e => setDefaultLocale(e.target.value)}
                  className="bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-1.5 font-hanken text-sm text-[#F3EADB] focus:outline-none focus:border-[#E0337E]/50">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </Field>
              <Field label="Fuseau horaire">
                <Input value={timezone} onChange={setTimezone} placeholder="Europe/Paris" />
              </Field>
              <Field label="Devise">
                <select value={currency} onChange={e => setCurrency(e.target.value)}
                  className="bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-1.5 font-hanken text-sm text-[#F3EADB] focus:outline-none focus:border-[#E0337E]/50">
                  <option value="EUR">EUR — Euro (€)</option>
                  <option value="USD">USD — Dollar ($)</option>
                  <option value="GBP">GBP — Livre (£)</option>
                </select>
              </Field>
            </div>
          )}

          {activeSection === "appearance" && (
            <div>
              <p className="font-fraunces text-base text-[#F3EADB] mb-4">Apparence</p>
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#F3EADB]/30 mb-3">Couleurs de la marque</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: "Primaire", color: "#E0337E" },
                      { name: "Secondaire", color: "#6D2DB5" },
                      { name: "Accent", color: "#E0901E" },
                    ].map(c => (
                      <div key={c.name} className="p-3 rounded-xl border border-[#F3EADB]/8 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg flex-shrink-0" style={{ background: c.color }} />
                        <div>
                          <p className="font-mono text-[9px] text-[#F3EADB]/40 uppercase">{c.name}</p>
                          <p className="font-mono text-[10px] text-[#F3EADB]/60">{c.color}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-[#F3EADB]/6 bg-[#F3EADB]/2">
                  <p className="font-mono text-[10px] text-[#F3EADB]/30">La personnalisation avancée des thèmes est disponible via le fichier <code className="text-[#E0337E]/70">tailwind.config.ts</code>.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "payments" && (
            <div>
              <p className="font-fraunces text-base text-[#F3EADB] mb-4">Configuration paiements</p>
              <Field label="Commission plateforme (%)" description="Pourcentage prélevé sur chaque vente">
                <Input value={platformFee} onChange={setPlatformFee} placeholder="5" />
              </Field>
              <Field label="Payout minimum (€)" description="Seuil minimal pour déclencher un virement">
                <Input value={minPayout} onChange={setMinPayout} placeholder="50" />
              </Field>
              <Field label="Délai payout (jours)" description="Jours après la commande avant le virement vendeur·se">
                <Input value={payoutDelay} onChange={setPayoutDelay} placeholder="7" />
              </Field>
              <div className="mt-4 p-4 rounded-xl bg-[#E0901E]/5 border border-[#E0901E]/15">
                <p className="font-mono text-[10px] text-[#E0901E]">
                  ⚠ Les clés Stripe sont configurées dans les variables d'environnement Vercel (<code>STRIPE_SECRET_KEY</code>).
                </p>
              </div>
            </div>
          )}

          {activeSection === "emails" && (
            <div>
              <p className="font-fraunces text-base text-[#F3EADB] mb-4">Configuration emails</p>
              <Field label="Provider">
                <select value={emailProvider} onChange={e => setEmailProvider(e.target.value)}
                  className="bg-[#F3EADB]/5 border border-[#F3EADB]/10 rounded-lg px-3 py-1.5 font-hanken text-sm text-[#F3EADB] focus:outline-none focus:border-[#E0337E]/50">
                  <option value="resend">Resend</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="postmark">Postmark</option>
                </select>
              </Field>
              <Field label="Nom expéditeur" description="Affiché comme nom d'envoi">
                <Input value={fromName} onChange={setFromName} />
              </Field>
              <Field label="Email expéditeur">
                <Input value={fromEmail} onChange={setFromEmail} />
              </Field>
              <div className="mt-4 p-4 rounded-xl bg-[#F3EADB]/3 border border-[#F3EADB]/8">
                <p className="font-mono text-[10px] text-[#F3EADB]/40">
                  La clé API email est configurée via <code>RESEND_API_KEY</code> dans les variables d'environnement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
