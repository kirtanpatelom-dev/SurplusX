import { ConsumptionHistory } from '@/types';

/**
 * Mock consumption history for FoodLoop AI
 * 90 days of daily meal data for an institutional kitchen serving 200-400 people
 * Shows realistic patterns: lower weekends, some holiday dips, 5-15% waste
 * Date range: 2026-07-01 to 2026-09-28
 */

/** Helper to generate a date string */
function d(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Seeded pseudo-random for consistency */
function seededValue(base: number, variance: number, seed: number): number {
  // Simple deterministic variation
  const v = Math.sin(seed * 127.1) * 43758.5453;
  const frac = v - Math.floor(v);
  return Math.round(base + (frac - 0.5) * 2 * variance);
}

function generateConsumptionData(): ConsumptionHistory[] {
  const data: ConsumptionHistory[] = [];
  const startDate = new Date(2026, 6, 1); // July 1, 2026

  // Indian holidays / reduced days (day-of-year offsets from July 1)
  // Aug 15 = Independence Day (day 45), Aug 19 = Raksha Bandhan (day 49)
  // Sep 5 = Teachers Day (day 66)
  const reducedDays = new Set([45, 49, 66]);

  for (let i = 0; i < 90; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    const dayOfWeek = current.getDay(); // 0=Sun, 6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isReduced = reducedDays.has(i);

    // Base values with weekend/holiday reductions
    const breakfastBase = isWeekend ? 165 : isReduced ? 145 : 200;
    const lunchBase = isWeekend ? 220 : isReduced ? 190 : 275;
    const dinnerBase = isWeekend ? 195 : isReduced ? 170 : 240;

    const breakfast = seededValue(breakfastBase, 25, i * 3 + 1);
    const lunch = seededValue(lunchBase, 35, i * 3 + 2);
    const dinner = seededValue(dinnerBase, 30, i * 3 + 3);
    const total = breakfast + lunch + dinner;

    // Waste: 5-15% of total, slightly higher on weekends due to lower attendance prediction accuracy
    const wastePercent = isWeekend
      ? seededValue(12, 3, i * 7) / 100
      : seededValue(8, 3, i * 7) / 100;
    const waste = Math.round(total * Math.max(0.04, Math.min(0.16, wastePercent)));

    data.push({
      date: d(current.getFullYear(), current.getMonth() + 1, current.getDate()),
      breakfast,
      lunch,
      dinner,
      total,
      waste,
    });
  }

  return data;
}

export const consumptionHistory: ConsumptionHistory[] = generateConsumptionData();
