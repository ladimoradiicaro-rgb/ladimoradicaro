// Pure date and price helpers for the booking calendar (no DOM, easy to test).
import type { HomePricing } from "../data/pricing";

export const DAY = 86400000;

export const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const fromIso = (iso: string) => new Date(`${iso}T12:00:00`);
export const addDays = (iso: string, n: number) => toIso(new Date(fromIso(iso).getTime() + n * DAY));
export const nightsBetween = (a: string, b: string) => Math.round((fromIso(b).getTime() - fromIso(a).getTime()) / DAY);

/** Every night of a stay: check-in included, check-out excluded. */
export function nightsOf(checkin: string, checkout: string): string[] {
  const out: string[] = [];
  for (let d = checkin; d < checkout; d = addDays(d, 1)) out.push(d);
  return out;
}

function inSeason(iso: string, from: string, to: string) {
  const md = iso.slice(5);
  return from <= to ? md >= from && md <= to : md >= from || md <= to; // wraps over New Year
}

export function rateFor(p: HomePricing, iso: string) {
  const season = p.seasons.find((s) => inSeason(iso, s.from, s.to));
  return { nightly: season?.nightly ?? p.nightly, minNights: season?.minNights ?? p.minNights };
}

export interface Quote {
  nights: number;
  lines: { nightly: number; count: number }[];
  subtotal: number;
  discount: number;
  cleaning: number;
  total: number;
  minNights: number;
}

export function quote(p: HomePricing, checkin: string, checkout: string): Quote {
  const nights = nightsOf(checkin, checkout);
  const groups = new Map<number, number>();
  for (const night of nights) {
    const { nightly } = rateFor(p, night);
    groups.set(nightly, (groups.get(nightly) ?? 0) + 1);
  }
  const lines = [...groups].map(([nightly, count]) => ({ nightly, count }));
  const subtotal = lines.reduce((sum, l) => sum + l.nightly * l.count, 0);
  const discount = nights.length >= 7 ? Math.round(subtotal * p.weeklyDiscount) : 0;
  return {
    nights: nights.length,
    lines,
    subtotal,
    discount,
    cleaning: p.cleaning,
    total: subtotal - discount + p.cleaning,
    minNights: rateFor(p, checkin).minNights,
  };
}

/** True when any night of the stay is already taken. */
export const overlapsBusy = (busy: Set<string>, checkin: string, checkout: string) =>
  nightsOf(checkin, checkout).some((n) => busy.has(n));
