/**
 * Pricing logic for Pontal Sereias reservations.
 *
 * Seasons:
 *   Low  (R$800):  Mar 1–Jun 30, Aug 1–Nov 30
 *   Med  (R$1200): Jul 1–Jul 31, Dec 1–Dec 19
 *   High (R$1700): Dec 20–Jan 31, Carnival, Holy Week, Christmas, New Year
 *
 * Cleaning fee: R$150 flat per reservation.
 */

export type Season = "low" | "medium" | "high";

export const SEASON_PRICES: Record<Season, number> = {
  low: 800,
  medium: 1200,
  high: 1700,
};

export const SEASON_LABELS: Record<Season, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export const CLEANING_FEE = 150;

/** Easter Sunday for a given year (Anonymous Gregorian algorithm). */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Mar, 4=Apr
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Check if a date falls within carnival (Saturday–Tuesday before Ash Wednesday). */
function isCarnival(date: Date): boolean {
  const year = date.getFullYear();
  const easter = easterSunday(year);
  // Ash Wednesday = Easter - 46 days
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(ashWednesday.getDate() - 46);
  // Carnival Saturday = Ash Wednesday - 4 days
  const carnivalStart = new Date(ashWednesday);
  carnivalStart.setDate(carnivalStart.getDate() - 4);
  // Carnival Tuesday = Ash Wednesday - 1 day
  const carnivalEnd = new Date(ashWednesday);
  carnivalEnd.setDate(carnivalEnd.getDate() - 1);

  return date >= carnivalStart && date <= carnivalEnd;
}

/** Check if a date falls within Holy Week (Palm Sunday through Easter Sunday). */
function isHolyWeek(date: Date): boolean {
  const year = date.getFullYear();
  const easter = easterSunday(year);
  const palmSunday = new Date(easter);
  palmSunday.setDate(palmSunday.getDate() - 7);
  return date >= palmSunday && date <= easter;
}

/** Check if a date is Christmas period (Dec 24–26). */
function isChristmas(date: Date): boolean {
  const m = date.getMonth(); // 0-indexed
  const d = date.getDate();
  return m === 11 && d >= 24 && d <= 26;
}

/** Check if a date is New Year period (Dec 30 – Jan 2). */
function isNewYear(date: Date): boolean {
  const m = date.getMonth();
  const d = date.getDate();
  return (m === 11 && d >= 30) || (m === 0 && d <= 2);
}

/** Determine the season for a specific date. */
export function getSeason(date: Date): Season {
  const m = date.getMonth(); // 0-indexed (0=Jan, 11=Dec)
  const d = date.getDate();

  // Check special high-season holidays first
  if (isCarnival(date) || isHolyWeek(date) || isChristmas(date) || isNewYear(date)) {
    return "high";
  }

  // High season: Dec 20–31, Jan 1–31
  if (m === 0) return "high"; // January
  if (m === 11 && d >= 20) return "high"; // Dec 20+

  // Medium season: Jul, Dec 1–19
  if (m === 6) return "medium"; // July
  if (m === 11 && d >= 1 && d <= 19) return "medium"; // Dec 1–19

  // Low season: Mar–Jun, Aug–Nov
  if (m >= 2 && m <= 5) return "low"; // Mar–Jun
  if (m >= 7 && m <= 10) return "low"; // Aug–Nov

  // February (not carnival/holy week) → low
  return "low";
}

/** Get the price for a specific night (date = check-in date of that night). */
export function getNightPrice(date: Date): number {
  return SEASON_PRICES[getSeason(date)];
}

/** Generate all nights between check-in and check-out (exclusive of check-out). */
export function getNightsDates(checkin: Date, checkout: Date): Date[] {
  const nights: Date[] = [];
  const current = new Date(checkin);
  current.setHours(0, 0, 0, 0);
  const end = new Date(checkout);
  end.setHours(0, 0, 0, 0);

  while (current < end) {
    nights.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return nights;
}

export interface PricingBreakdown {
  nights: { date: Date; season: Season; price: number }[];
  subtotal: number;
  cleaningFee: number;
  total: number;
}

/** Calculate full pricing breakdown for a reservation. */
export function calculatePricing(checkin: Date, checkout: Date): PricingBreakdown {
  const nightsDates = getNightsDates(checkin, checkout);
  const nights = nightsDates.map((date) => ({
    date,
    season: getSeason(date),
    price: getNightPrice(date),
  }));
  const subtotal = nights.reduce((sum, n) => sum + n.price, 0);
  return {
    nights,
    subtotal,
    cleaningFee: CLEANING_FEE,
    total: subtotal + CLEANING_FEE,
  };
}
