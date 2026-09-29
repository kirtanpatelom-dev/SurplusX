import { Sensor } from '@/types';

/**
 * Helper: generate 24-hour history data points
 * Creates hourly readings for the past 24 hours from a base value with slight variations
 */
function generateHistory(
  baseValue: number,
  variance: number,
  anomalyHour?: number,
  anomalyValue?: number
): { time: string; value: number }[] {
  const history: { time: string; value: number }[] = [];
  for (let i = 23; i >= 0; i--) {
    const hour = (9 - i + 24) % 24; // starts 24h ago from ~09:00
    const paddedHour = hour.toString().padStart(2, '0');
    let value = baseValue + (Math.sin(i * 0.5) * variance) + ((i % 3) * variance * 0.2);
    // Inject anomaly at specified hour
    if (anomalyHour !== undefined && anomalyValue !== undefined && i === anomalyHour) {
      value = anomalyValue;
    }
    history.push({
      time: `2026-09-${i < 9 ? '29' : '28'}T${paddedHour}:00:00`,
      value: Math.round(value * 10) / 10,
    });
  }
  return history;
}

/**
 * Mock sensor data for FoodLoop AI
 * 8 sensors monitoring cold storage, dry storage, and ambient conditions
 */
export const sensors: Sensor[] = [
  // ── Temperature Sensors ───────────────────────────────────────────
  {
    id: 'TMP-001',
    name: 'Cold Storage A – Main',
    type: 'temperature',
    location: 'Cold Storage A',
    value: 4.2,
    unit: '°C',
    minThreshold: 1,
    maxThreshold: 5,
    status: 'online',
    lastUpdated: '2026-09-29T09:30:00',
    history: generateHistory(3.8, 0.6, 5, 6.2),
  },
  {
    id: 'TMP-002',
    name: 'Freezer Unit – Section 1',
    type: 'temperature',
    location: 'Cold Storage A – Freezer',
    value: -18.5,
    unit: '°C',
    minThreshold: -22,
    maxThreshold: -16,
    status: 'online',
    lastUpdated: '2026-09-29T09:30:00',
    history: generateHistory(-18.0, 1.2),
  },
  {
    id: 'TMP-003',
    name: 'Cold Storage A – Door Zone',
    type: 'temperature',
    location: 'Cold Storage A – Entry',
    value: 6.8,
    unit: '°C',
    minThreshold: 2,
    maxThreshold: 8,
    status: 'warning',
    lastUpdated: '2026-09-29T09:30:00',
    history: generateHistory(5.5, 1.5, 3, 8.4),
  },
  {
    id: 'TMP-004',
    name: 'Dry Storage B – Ambient',
    type: 'temperature',
    location: 'Dry Storage B',
    value: 26.3,
    unit: '°C',
    minThreshold: 18,
    maxThreshold: 30,
    status: 'online',
    lastUpdated: '2026-09-29T09:30:00',
    history: generateHistory(25.0, 2.0),
  },

  // ── Humidity Sensors ──────────────────────────────────────────────
  {
    id: 'HUM-001',
    name: 'Dry Storage B – Humidity',
    type: 'humidity',
    location: 'Dry Storage B',
    value: 72.0,
    unit: '%',
    minThreshold: 30,
    maxThreshold: 65,
    status: 'warning',
    lastUpdated: '2026-09-29T09:30:00',
    history: generateHistory(58.0, 8.0, 2, 72.0),
  },
  {
    id: 'HUM-002',
    name: 'Cold Storage A – Humidity',
    type: 'humidity',
    location: 'Cold Storage A',
    value: 82.5,
    unit: '%',
    minThreshold: 75,
    maxThreshold: 90,
    status: 'online',
    lastUpdated: '2026-09-29T09:30:00',
    history: generateHistory(83.0, 3.0),
  },

  // ── Gas Sensors ───────────────────────────────────────────────────
  {
    id: 'GAS-001',
    name: 'Cold Storage – Ammonia Detector',
    type: 'ammonia',
    location: 'Cold Storage A – Compressor Room',
    value: 32.0,
    unit: 'ppm',
    minThreshold: 0,
    maxThreshold: 25,
    status: 'warning',
    lastUpdated: '2026-09-29T09:30:00',
    history: generateHistory(18.0, 5.0, 6, 32.0),
  },
  {
    id: 'GAS-002',
    name: 'Main Kitchen – Air Quality',
    type: 'gas',
    location: 'Main Kitchen',
    value: 420,
    unit: 'AQI',
    minThreshold: 0,
    maxThreshold: 500,
    status: 'online',
    lastUpdated: '2026-09-29T09:30:00',
    history: generateHistory(380, 40),
  },
];
