"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Calendar, MapPin, Users } from "lucide-react";

const EVENTS = [
  {
    id: 1,
    title: "Atelier Impression Risographie",
    organizer: "Collectif Roseau",
    date: "14 juin 2026",
    lieu: "Paris 11ème",
    spots: "12 places",
    tags: [
      { label: "Atelier", variant: "teal" as const },
      { label: "Créatif", variant: "default" as const },
    ],
    tickets: [
      { name: "Standard", price: "25 €" },
      { name: "Solidaire", price: "15 €" },
      { name: "Soutien", price: "40 €" },
    ],
    bg: "#F1ECE3",
    accent: "#1C9C95",
  },
  {
    id: 2,
    title: "Soirée Lecture Queer",
    organizer: "La Librairie Arc",
    date: "21 juin 2026",
    lieu: "Lyon 7ème",
    spots: "40 places",
    tags: [
      { label: "Événement", variant: "magenta" as const },
      { label: "Culture", variant: "default" as const },
    ],
    tickets: [
      { name: "Standard", price: "10 €" },
      { name: "Solidaire", price: "5 €" },
      { name: "Soutien", price: "20 €" },
    ],
    bg: "#F1ECE3",
    accent: "#CF3F7C",
  },
  {
    id: 3,
    title: "Workshop Photo Intime",
    organizer: "Maëlis Artwork",
    date: "5 juillet 2026",
    lieu: "En ligne",
    spots: "8 places",
    tags: [
      { label: "Workshop", variant: "peach" as const },
      { label: "Photo", variant: "default" as const },
    ],
    tickets: [
      { name: "Standard", price: "55 €" },
      { name: "Solidaire", price: "35 €" },
      { name: "Soutien", price: "80 €" },
    ],
    bg: "#1f1408",
    accent: "#E0901E",
  },
];

export function Experiences() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} id="experiences" className="py-24 px-6 bg-[#1A1612]/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)" }}
        >
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#FF3D7F] block mb-3">
            À venir
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl text-[#1A1612] leading-tight">
            Expériences &{" "}
            <span className="italic text-[#1A1612]">événements</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EVENTS.map((ev, i) => (
            <div
              key={ev.id}
              className="transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <Card className="overflow-hidden h-full flex flex-col group">
                {/* Header */}
                <div
                  className="h-24 relative flex items-end p-4"
                  style={{ backgroundColor: ev.bg }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(ellipse at 30% 50%, ${ev.accent}60, transparent 70%)`,
                    }}
                  />
                  <div className="relative flex gap-2 flex-wrap">
                    {ev.tags.map((t) => (
                      <Tag key={t.label} variant={t.variant}>{t.label}</Tag>
                    ))}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bricolage font-bold text-[#1A1612] text-lg leading-tight mb-1">
                    {ev.title}
                  </h3>
                  <p className="font-mono text-xs text-[#1A1612]/40 mb-4">{ev.organizer}</p>

                  <div className="flex flex-col gap-2 text-sm text-[#1A1612]/60 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="shrink-0" />
                      {ev.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="shrink-0" />
                      {ev.lieu}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} className="shrink-0" />
                      {ev.spots}
                    </div>
                  </div>

                  {/* Tickets */}
                  <div className="mt-auto border-t border-[#1A1612]/8 pt-4">
                    <p className="font-mono text-[10px] tracking-widest uppercase text-[#1A1612]/30 mb-2">
                      Billetterie
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {ev.tickets.map((t) => (
                        <button
                          key={t.name}
                          className="px-3 py-1.5 rounded-full border border-[#1A1612]/15 text-xs font-hanken text-[#1A1612]/70 hover:border-[#FF3D7F]/50 hover:text-[#FF3D7F] transition-all duration-200"
                        >
                          {t.name} · {t.price}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
