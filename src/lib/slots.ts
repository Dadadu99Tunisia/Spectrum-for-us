/**
 * Génération de créneaux libres pour un service.
 * Fonction pure (utilisable côté client ET serveur).
 * Les heures (start_time/end_time) sont interprétées en heure locale.
 */

export type AvailabilityRule = {
  weekday: number | null;        // 1=lundi … 7=dimanche (récurrent)
  specific_date: string | null;  // 'YYYY-MM-DD' (ponctuel)
  start_time: string;            // 'HH:MM' ou 'HH:MM:SS'
  end_time: string;
  slot_minutes: number;
};

export type Slot = { start: Date; end: Date };

const hm = (t: string) => { const [h, m] = t.slice(0, 5).split(":").map(Number); return { h, m }; };
const isoWeekday = (d: Date) => ((d.getDay() + 6) % 7) + 1; // 1=lundi … 7=dimanche
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function generateSlots(opts: {
  rules: AvailabilityRule[];
  blackouts: string[];            // dates 'YYYY-MM-DD' bloquées
  booked: { start: number }[];    // timestamps (ms) des créneaux déjà pris
  fromDate: Date;                 // début (souvent maintenant)
  days: number;                   // nombre de jours à projeter
}): Record<string, Slot[]> {
  const { rules, blackouts, booked, fromDate, days } = opts;
  const bookedSet = new Set(booked.map(b => b.start));
  const blackoutSet = new Set(blackouts);
  const out: Record<string, Slot[]> = {};
  const nowMs = Date.now();

  const base = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());

  for (let i = 0; i < days; i++) {
    const day = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    const key = ymd(day);
    if (blackoutSet.has(key)) continue;

    const applicable = rules.filter(r =>
      (r.weekday != null && r.weekday === isoWeekday(day)) ||
      (r.specific_date != null && r.specific_date.slice(0, 10) === key)
    );
    if (!applicable.length) continue;

    const slots: Slot[] = [];
    for (const r of applicable) {
      const s = hm(r.start_time), e = hm(r.end_time);
      const dur = r.slot_minutes || 60;
      let cursor = new Date(day.getFullYear(), day.getMonth(), day.getDate(), s.h, s.m);
      const limit = new Date(day.getFullYear(), day.getMonth(), day.getDate(), e.h, e.m);
      while (cursor.getTime() + dur * 60000 <= limit.getTime() + 1) {
        const start = new Date(cursor);
        const end = new Date(cursor.getTime() + dur * 60000);
        if (start.getTime() > nowMs && !bookedSet.has(start.getTime())) {
          slots.push({ start, end });
        }
        cursor = new Date(cursor.getTime() + dur * 60000);
      }
    }
    // dédoublonne + trie
    const uniq = Array.from(new Map(slots.map(s => [s.start.getTime(), s])).values()).sort((a, b) => a.start.getTime() - b.start.getTime());
    if (uniq.length) out[key] = uniq;
  }

  return out;
}
