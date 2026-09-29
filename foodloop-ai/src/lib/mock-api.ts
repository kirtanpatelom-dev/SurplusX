import { delay, generateId } from '@/lib/utils';
import { DONUT_COLORS, MAP_CENTER } from '@/lib/constants';
import { inventoryItems } from '@/data/inventory';
import { receivers } from '@/data/receivers';
import { surplusListings } from '@/data/surplus';
import { vehicles } from '@/data/vehicles';
import { machines, downtimeLogs } from '@/data/machines';
import { sensors } from '@/data/sensors';
import { alerts } from '@/data/alerts';
import { consumptionHistory } from '@/data/consumption-history';
import { inefficiencies as inefficiencySeed } from '@/data/inefficiencies';
import { esgMetricsByPeriod, complianceItems } from '@/data/esg';
import { qualityInspections } from '@/data/quality';
import { routes as routeSeed } from '@/data/routes';
import { driverTasks as driverTaskSeed } from '@/data/driver-tasks';
import type {
  Alert,
  CategoryData,
  DriverTask,
  EnergyUsageData,
  ForecastData,
  ForecastFactor,
  Inefficiency,
  InventoryItem,
  ItemStatus,
  KpiData,
  ProductionRecommendation,
  QualityInspection,
  Receiver,
  Route,
  Sensor,
  SuggestedAction,
  SurplusListing,
  SurplusStatus,
  WasteTrendData,
  WeeklyPlan,
} from '@/types';

function clone<T>(value: T): T {
  return structuredClone(value);
}

const inventoryState = clone(inventoryItems);
let surplusState = clone(surplusListings);
let sensorState = clone(sensors);
let alertState = clone(alerts);
let inefficiencyState = clone(inefficiencySeed);
let qualityState = clone(qualityInspections);
const routeState = clone(routeSeed);
let driverTaskState = clone(driverTaskSeed);
let ngoCapacityKg = 300;
let ngoPreferred: Receiver['preferredFoodTypes'] = ['grains', 'vegetables', 'prepared'];
let routesOptimized = false;

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function tickSensors() {
  const now = new Date().toISOString();
  sensorState = sensorState.map((s) => {
    const drift = (Math.random() - 0.48) * (s.type === 'temperature' ? 0.25 : s.type === 'humidity' ? 1.2 : 0.4);
    const next = Math.round((s.value + drift) * 10) / 10;
    const warning = next < s.minThreshold || next > s.maxThreshold;
    const status = s.status === 'offline' ? 'offline' : warning ? 'warning' : 'online';
    const history = [...s.history.slice(-23), { time: now, value: next }];
    return { ...s, value: next, lastUpdated: now, status, history };
  });
}

function maybePushSensorAlert() {
  const hot = sensorState.find((s) => s.status === 'warning');
  if (!hot || Math.random() > 0.35) return;
  const already = alertState.some(
    (a) => a.source === hot.id && Date.now() - new Date(a.timestamp).getTime() < 60_000
  );
  if (already) return;
  alertState = [
    {
      id: generateId('ALT'),
      title: `${hot.name} outside band`,
      message: `Live reading ${hot.value} ${hot.unit} (band ${hot.minThreshold}–${hot.maxThreshold}). Simulated IoT stream.`,
      severity: 'warning' as const,
      category: 'temperature' as const,
      timestamp: new Date().toISOString(),
      isRead: false,
      actionUrl: '/sensors',
      source: hot.id,
    },
    ...alertState,
  ].slice(0, 40);
}

function suggestAction(item: InventoryItem): SuggestedAction {
  if (item.suggestedAction) return item.suggestedAction;
  if (item.status === 'expired') return 'compost';
  if (item.status === 'at_risk') return 'donate';
  if (item.status === 'use_soon') return 'cook_now';
  return item.quantity > 80 ? 'discount' : 'cook_now';
}

export type SurplusCreateInput = {
  foodType: string;
  category: SurplusListing['category'];
  quantity: number;
  packTime: string;
  safeUntil: string;
  isVeg: boolean;
  allergens: string[];
  pickupWindowStart: string;
  pickupWindowEnd: string;
};

export const mockApi = {
  async getKpis(): Promise<KpiData> {
    await delay(280);
    const last = consumptionHistory.slice(-7);
    const prev = consumptionHistory.slice(-14, -7);
    const wasteNow = last.reduce((s, d) => s + d.waste, 0);
    const wastePrev = prev.reduce((s, d) => s + d.waste, 0);
    return {
      wastePreventedKg: 18420,
      mealsRedistributed: 36840,
      costSavedInr: 921000,
      co2eAvoidedKg: 44208,
      wastePreventedTrend: wastePrev ? ((wastePrev - wasteNow) / wastePrev) * 100 : 8.4,
      mealsRedistributedTrend: 11.2,
      costSavedTrend: 9.6,
      co2eAvoidedTrend: 10.1,
    };
  },

  async getWasteTrend(): Promise<WasteTrendData[]> {
    await delay(220);
    return consumptionHistory.slice(-30).map((d) => ({
      date: d.date.slice(5),
      wasteKg: d.waste,
      savedKg: Math.max(4, Math.round(d.total * 0.11 - d.waste * 0.2)),
      targetKg: 55,
    }));
  },

  async getSurplusByCategory(): Promise<CategoryData[]> {
    await delay(180);
    const map = new Map<string, number>();
    for (const row of surplusState) {
      map.set(row.category, (map.get(row.category) ?? 0) + row.quantity);
    }
    return [...map.entries()].map(([category, value], i) => ({
      category,
      value,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    }));
  },

  async getAlerts(): Promise<Alert[]> {
    await delay(160);
    return clone(alertState);
  },

  async getInventory(): Promise<InventoryItem[]> {
    await delay(320);
    return clone(inventoryState).map((item) => ({ ...item, suggestedAction: suggestAction(item) }));
  },

  async getInventoryByStatus(status?: ItemStatus): Promise<InventoryItem[]> {
    const all = await this.getInventory();
    return status ? all.filter((i) => i.status === status) : all;
  },

  async getReceivers(from = MAP_CENTER): Promise<Receiver[]> {
    await delay(260);
    return clone(receivers)
      .map((r) => {
        const distanceKm = Math.round(haversineKm(from, r.location) * 10) / 10;
        const capacityHeadroom = Math.max(0, r.capacity - r.currentLoad) / r.capacity;
        const matchScore = Math.round((0.45 * (1 / (1 + distanceKm / 12)) + 0.35 * capacityHeadroom + 0.2 * (r.rating / 5)) * 100);
        return { ...r, distanceKm, matchScore };
      })
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  },

  async getSurplus(): Promise<SurplusListing[]> {
    await delay(240);
    return clone(surplusState);
  },

  async createSurplus(input: SurplusCreateInput): Promise<SurplusListing> {
    await delay(400);
    const listing: SurplusListing = {
      id: generateId('SUR').toUpperCase(),
      foodType: input.foodType,
      category: input.category,
      quantity: input.quantity,
      unit: 'kg',
      packTime: input.packTime,
      safeUntil: input.safeUntil,
      isVeg: input.isVeg,
      allergens: input.allergens,
      pickupWindowStart: input.pickupWindowStart,
      pickupWindowEnd: input.pickupWindowEnd,
      status: 'listed',
      donorId: 'DON-001',
      donorName: 'FoodLoop Central Kitchen',
      donorLocation: { lat: 23.22, lng: 72.64, address: 'Sector 15, Gandhinagar, Gujarat 382015' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [{ status: 'listed', timestamp: new Date().toISOString(), note: 'Created from kitchen console' }],
    };
    surplusState = [listing, ...surplusState];
    return clone(listing);
  },

  async matchSurplus(id: string): Promise<SurplusListing> {
    await delay(350);
    const ranked = await this.getReceivers();
    const top = ranked[0];
    surplusState = surplusState.map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        status: 'matched' as SurplusStatus,
        matchedReceiverId: top?.id,
        matchedReceiverName: top?.name,
        updatedAt: new Date().toISOString(),
        timeline: [
          ...s.timeline,
          {
            status: 'matched' as SurplusStatus,
            timestamp: new Date().toISOString(),
            note: `AI matched with ${top?.name} (${top?.distanceKm} km). AI-generated (simulated).`,
          },
        ],
      };
    });
    return clone(surplusState.find((s) => s.id === id)!);
  },

  async updateSurplusStatus(id: string, status: SurplusStatus, note: string): Promise<SurplusListing> {
    await delay(280);
    surplusState = surplusState.map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        status,
        updatedAt: new Date().toISOString(),
        timeline: [...s.timeline, { status, timestamp: new Date().toISOString(), note }],
      };
    });
    return clone(surplusState.find((s) => s.id === id)!);
  },

  async getVehicles() {
    await delay(200);
    return clone(vehicles);
  },

  async getRoutes(): Promise<(Route & { optimized: boolean })[]> {
    await delay(280);
    return clone(routeState).map((r) => ({ ...r, optimized: routesOptimized }));
  },

  async optimizeRoutes(): Promise<{ beforeKm: number; afterKm: number; fuelSavedLiters: number }> {
    await delay(700);
    routesOptimized = true;
    const beforeKm = routeState.reduce((s, r) => s + r.totalDistanceKm, 0);
    const afterKm = routeState.reduce((s, r) => s + (r.optimizedDistanceKm ?? r.totalDistanceKm), 0);
    const fuelSavedLiters = routeState.reduce((s, r) => s + (r.fuelSavedLiters ?? 0), 0);
    return {
      beforeKm: Math.round(beforeKm * 10) / 10,
      afterKm: Math.round(afterKm * 10) / 10,
      fuelSavedLiters: Math.round(fuelSavedLiters * 10) / 10,
    };
  },

  async getMachines() {
    await delay(240);
    return clone(machines);
  },

  async getDowntime() {
    await delay(200);
    return clone(downtimeLogs);
  },

  async getEnergyUsage(): Promise<EnergyUsageData[]> {
    await delay(220);
    return Array.from({ length: 12 }, (_, i) => {
      const hour = `${String(i + 6).padStart(2, '0')}:00`;
      const baseline = 42 + (i % 4) * 4;
      const usage = baseline + (i === 3 ? 28 : i === 8 ? 18 : (i % 3) * 3);
      return { hour, usage, baseline };
    });
  },

  async getSensors(): Promise<Sensor[]> {
    await delay(120);
    tickSensors();
    maybePushSensorAlert();
    return clone(sensorState);
  },

  async getForecast(horizon: 7 | 14 | 30): Promise<{
    series: ForecastData[];
    factors: ForecastFactor[];
    recommendations: ProductionRecommendation[];
  }> {
    await delay(360);
    const history = consumptionHistory.slice(-horizon);
    const series: ForecastData[] = [];
    history.forEach((d, idx) => {
      const meals = [
        { meal: 'breakfast' as const, actual: d.breakfast },
        { meal: 'lunch' as const, actual: d.lunch },
        { meal: 'dinner' as const, actual: d.dinner },
      ];
      for (const m of meals) {
        const predicted = Math.round(m.actual * (0.96 + ((idx % 5) * 0.01)));
        series.push({
          date: d.date,
          meal: m.meal,
          actual: m.actual,
          predicted,
          confidenceLow: Math.round(predicted * 0.9),
          confidenceHigh: Math.round(predicted * 1.1),
        });
      }
    });
    const forwardDays = Math.min(7, horizon);
    for (let i = 1; i <= forwardDays; i++) {
      const date = `2026-09-${String(28 + i).padStart(2, '0')}`;
      const base = { breakfast: 198, lunch: 272, dinner: 238 };
      (Object.keys(base) as (keyof typeof base)[]).forEach((meal) => {
        const predicted = base[meal] + (i === 2 ? -22 : i === 5 ? 18 : 0);
        series.push({
          date,
          meal,
          predicted,
          confidenceLow: Math.round(predicted * 0.88),
          confidenceHigh: Math.round(predicted * 1.12),
        });
      });
    }
    return {
      series,
      factors: [
        { name: 'Weather', impact: 'negative', value: '36°C, dry', description: 'Hot afternoon reduces lunch intake by ~4% in hostel kitchens.' },
        { name: 'Events', impact: 'positive', value: 'Navratri prep', description: 'Community kitchen overflow expected on 2 Oct evening.' },
        { name: 'Holidays', impact: 'negative', value: 'Gandhi Jayanti window', description: 'Attendance dip of 8–12% around 2 Oct.' },
        { name: 'Attendance', impact: 'neutral', value: '312 signed in', description: 'Hostel occupancy stable versus 7-day mean of 308.' },
      ],
      recommendations: [
        { meal: 'breakfast', item: 'Poha + tea', recommendedQty: 92, currentPlanned: 105, unit: 'kg', confidence: 0.86, approved: false },
        { meal: 'lunch', item: 'Rice + dal + sabzi', recommendedQty: 268, currentPlanned: 310, unit: 'kg', confidence: 0.91, approved: false },
        { meal: 'lunch', item: 'Chapati', recommendedQty: 54, currentPlanned: 70, unit: 'kg', confidence: 0.88, approved: false },
        { meal: 'dinner', item: 'Khichdi + kadhi', recommendedQty: 230, currentPlanned: 240, unit: 'kg', confidence: 0.84, approved: false },
      ],
    };
  },

  async getWeeklyPlan(attendanceDeltaPercent: number): Promise<WeeklyPlan[]> {
    await delay(300);
    const factor = 1 + attendanceDeltaPercent / 100;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const date = `2026-09-${String(22 + i).padStart(2, '0')}`;
      const mk = (item: string, rec: number, planned: number, procurement: string, inStock: boolean) => ({
        item,
        recommended: Math.round(rec * factor),
        planned: Math.round(planned * factor),
        unit: 'kg',
        procurement,
        inStock,
      });
      return {
        day,
        date,
        meals: {
          breakfast: [mk('Poha', 90, 100, 'Use stocked poha (INV-031)', true)],
          lunch: [
            mk('Steamed rice', 140, 160, 'Draw from Basmati lot INV-008', true),
            mk('Toor dal', 55, 62, 'Gujarat Agro — no PO needed', true),
            mk('Seasonal sabzi', 48, 40, 'Raise vegetable indent +8 kg', false),
          ],
          dinner: [mk('Khichdi', 120, 130, 'Balance rice + moong', true)],
        },
      };
    });
  },

  async getInefficiencies(): Promise<Inefficiency[]> {
    await delay(240);
    return clone(inefficiencyState);
  },

  async setInefficiencyStatus(id: string, status: Inefficiency['status']): Promise<Inefficiency> {
    await delay(220);
    inefficiencyState = inefficiencyState.map((row) =>
      row.id === id
        ? { ...row, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : row.resolvedAt }
        : row
    );
    return clone(inefficiencyState.find((r) => r.id === id)!);
  },

  async getEsg(period: 'month' | 'quarter' | 'year') {
    await delay(260);
    const metrics = esgMetricsByPeriod.find((m) => m.period === period)!;
    return { metrics, compliance: clone(complianceItems) };
  },

  async getQualityHistory(): Promise<QualityInspection[]> {
    await delay(200);
    return clone(qualityState);
  },

  async analyzeQuality(itemName: string): Promise<QualityInspection> {
    await delay(900);
    const score = 58 + Math.round(Math.random() * 34);
    const grade = score >= 85 ? 'A' : score >= 72 ? 'B' : score >= 60 ? 'C' : score >= 48 ? 'D' : 'F';
    const issues =
      score >= 85
        ? []
        : score >= 70
          ? ['Minor surface blemish']
          : ['Soft tissue detected', 'Colour variance vs reference lot'];
    const result: QualityInspection = {
      id: generateId('QIN').toUpperCase(),
      itemName,
      freshnessScore: score,
      grade,
      detectedIssues: issues,
      boundingBoxes:
        issues.length === 0
          ? []
          : [{ x: 20 + Math.random() * 20, y: 18 + Math.random() * 20, w: 24, h: 22, label: issues[0]!, confidence: 0.7 + Math.random() * 0.2 }],
      inspectedAt: new Date().toISOString(),
      inspectedBy: 'CV pipeline (simulated)',
      aiGenerated: true,
    };
    qualityState = [result, ...qualityState];
    return clone(result);
  },

  async getDriverTasks(): Promise<DriverTask[]> {
    await delay(220);
    return clone(driverTaskState);
  },

  async updateDriverTask(id: string, patch: Partial<DriverTask>): Promise<DriverTask> {
    await delay(240);
    driverTaskState = driverTaskState.map((t) => (t.id === id ? { ...t, ...patch } : t));
    return clone(driverTaskState.find((t) => t.id === id)!);
  },

  async getNgoSettings() {
    await delay(160);
    return { capacityKg: ngoCapacityKg, preferredFoodTypes: ngoPreferred };
  },

  async saveNgoSettings(capacityKg: number, preferredFoodTypes: Receiver['preferredFoodTypes']) {
    await delay(200);
    ngoCapacityKg = capacityKg;
    ngoPreferred = preferredFoodTypes;
    return { capacityKg, preferredFoodTypes };
  },

  async getConsumption() {
    await delay(180);
    return clone(consumptionHistory);
  },
};
