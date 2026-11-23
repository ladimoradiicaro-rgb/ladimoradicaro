// Direct-booking prices shown on the site. Change them here (or ask) — the calendar
// computes the quote from these rules. All amounts in euro.
//
// ⚠️ DEMO VALUES: replace with the real prices before publishing the calendar.

export interface Season {
  /** Inclusive start and end, as "MM-DD" (the season repeats every year). */
  from: string;
  to: string;
  nightly: number;
  minNights: number;
}

export interface HomePricing {
  /** Price per night outside the seasons below. */
  nightly: number;
  minNights: number;
  seasons: Season[];
  /** One-off cleaning fee per stay. */
  cleaning: number;
  /** Discount on the nights for stays of 7 nights or more (0.1 = 10%). */
  weeklyDiscount: number;
}

export const pricingIsDemo = true;

export const pricing: Record<"verde" | "blu", HomePricing> = {
  verde: {
    nightly: 90,
    minNights: 2,
    seasons: [
      { from: "06-15", to: "09-15", nightly: 130, minNights: 3 },
      { from: "12-22", to: "01-06", nightly: 110, minNights: 3 },
    ],
    cleaning: 40,
    weeklyDiscount: 0.1,
  },
  blu: {
    nightly: 60,
    minNights: 2,
    seasons: [
      { from: "06-15", to: "09-15", nightly: 90, minNights: 3 },
      { from: "12-22", to: "01-06", nightly: 75, minNights: 3 },
    ],
    cleaning: 30,
    weeklyDiscount: 0.1,
  },
};
