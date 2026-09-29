// User roles
export type UserRole = 'kitchen_manager' | 'plant_manager' | 'ngo_receiver' | 'logistics_driver' | 'admin_auditor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  organization: string;
}

// Inventory & Food Items
export type ItemCategory = 'grains' | 'dairy' | 'vegetables' | 'fruits' | 'protein' | 'spices' | 'packaged' | 'prepared' | 'beverages';
export type ItemStatus = 'fresh' | 'use_soon' | 'at_risk' | 'expired';
export type StorageType = 'ambient' | 'refrigerated' | 'frozen' | 'dry_storage';
export type SuggestedAction = 'cook_now' | 'discount' | 'donate' | 'compost';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  batch: string;
  quantity: number; // kg
  unit: string;
  storageLocation: string;
  storageType: StorageType;
  receivedDate: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: ItemStatus;
  suggestedAction?: SuggestedAction;
  supplier: string;
  costPerKg: number; // INR
  isVeg: boolean;
  allergens: string[];
}

// Surplus & Redistribution
export type SurplusStatus = 'listed' | 'matched' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';

export interface SurplusListing {
  id: string;
  foodType: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  packTime: string;
  safeUntil: string;
  isVeg: boolean;
  allergens: string[];
  pickupWindowStart: string;
  pickupWindowEnd: string;
  status: SurplusStatus;
  donorId: string;
  donorName: string;
  donorLocation: { lat: number; lng: number; address: string };
  matchedReceiverId?: string;
  matchedReceiverName?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  status: SurplusStatus;
  timestamp: string;
  note?: string;
}

// NGO / Receiver
export interface Receiver {
  id: string;
  name: string;
  type: 'ngo' | 'shelter' | 'community_kitchen' | 'secondary_buyer';
  location: { lat: number; lng: number; address: string };
  contactPerson: string;
  phone: string;
  email: string;
  capacity: number; // kg per day
  currentLoad: number; // kg
  preferredFoodTypes: ItemCategory[];
  isVeg: boolean;
  operatingHours: string;
  rating: number; // 1-5
  totalMealsServed: number;
  distanceKm?: number;
  matchScore?: number;
}

// Vehicles & Logistics
export type VehicleStatus = 'available' | 'in_transit' | 'loading' | 'maintenance';

export interface Vehicle {
  id: string;
  number: string; // registration number
  type: 'van' | 'truck' | 'auto_rickshaw' | 'bike';
  capacity: number; // kg
  currentLoad: number;
  status: VehicleStatus;
  driverId: string;
  driverName: string;
  driverPhone: string;
  hasColdChain: boolean;
  currentLocation: { lat: number; lng: number };
  fuelLevel: number; // percentage
}

export interface Route {
  id: string;
  vehicleId: string;
  driverId: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedTimeMin: number;
  optimizedDistanceKm?: number;
  optimizedTimeMin?: number;
  fuelSavedLiters?: number;
  status: 'planned' | 'in_progress' | 'completed';
  date: string;
}

export interface RouteStop {
  id: string;
  type: 'pickup' | 'delivery';
  location: { lat: number; lng: number; address: string };
  entityName: string;
  estimatedArrival: string;
  actualArrival?: string;
  status: 'pending' | 'arrived' | 'completed' | 'skipped';
  itemsKg: number;
  notes?: string;
}

// Machines & Plant
export type MachineStatus = 'running' | 'idle' | 'maintenance' | 'error';

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: MachineStatus;
  healthScore: number; // 0-100
  oee: number; // 0-100 Overall Equipment Effectiveness
  currentOutput: number; // units/hr
  maxOutput: number;
  lastMaintenance: string;
  nextMaintenance: string;
  downtimeToday: number; // minutes
  energyUsageKwh: number;
  rawMaterialLossPercent: number;
}

export interface DowntimeLog {
  id: string;
  machineId: string;
  machineName: string;
  startTime: string;
  endTime?: string;
  durationMin: number;
  reason: string;
  impact: 'low' | 'medium' | 'high';
  resolved: boolean;
}

// Alerts
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertCategory = 'expiry' | 'temperature' | 'surplus' | 'machine' | 'delivery' | 'quality' | 'production';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  source: string;
}

// Sensors / IoT
export type SensorType = 'temperature' | 'humidity' | 'gas' | 'ammonia';
export type SensorStatus = 'online' | 'offline' | 'warning';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: string;
  value: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  status: SensorStatus;
  lastUpdated: string;
  history: { time: string; value: number }[];
}

// Forecasting
export interface ForecastData {
  date: string;
  predicted: number;
  actual?: number;
  confidenceLow: number;
  confidenceHigh: number;
  meal: 'breakfast' | 'lunch' | 'dinner';
}

export interface ForecastFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  value: string;
  description: string;
}

export interface ProductionRecommendation {
  meal: 'breakfast' | 'lunch' | 'dinner';
  item: string;
  recommendedQty: number;
  currentPlanned: number;
  unit: string;
  confidence: number;
  adjustedQty?: number;
  approved: boolean;
}

// Production Planning
export interface WeeklyPlan {
  day: string;
  date: string;
  meals: {
    breakfast: PlanItem[];
    lunch: PlanItem[];
    dinner: PlanItem[];
  };
}

export interface PlanItem {
  item: string;
  recommended: number;
  planned: number;
  unit: string;
  procurement: string;
  inStock: boolean;
}

// Quality Inspection
export interface QualityInspection {
  id: string;
  itemName: string;
  imagePath?: string;
  freshnessScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  detectedIssues: string[];
  boundingBoxes: { x: number; y: number; w: number; h: number; label: string; confidence: number }[];
  inspectedAt: string;
  inspectedBy: string;
  aiGenerated: boolean;
}

// ESG / Sustainability Reports
export interface ESGMetrics {
  period: string;
  wastePreventedKg: number;
  mealsRedistributed: number;
  co2eSavedKg: number;
  waterSavedLiters: number;
  costSavedInr: number;
  wasteDivertedPercent: number;
  resourceEfficiency: number;
  complianceScore: number;
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  category: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
  lastAuditDate: string;
  notes: string;
}

// Inefficiency
export interface Inefficiency {
  id: string;
  type: 'overproduction' | 'raw_material_loss' | 'machine_downtime' | 'high_energy' | 'spoilage';
  title: string;
  description: string;
  severity: AlertSeverity;
  estimatedImpactInr: number;
  suggestedFix: string;
  detectedAt: string;
  status: 'open' | 'resolved' | 'snoozed';
  resolvedAt?: string;
  source: string;
}

// KPI
export interface KpiData {
  wastePreventedKg: number;
  mealsRedistributed: number;
  costSavedInr: number;
  co2eAvoidedKg: number;
  wastePreventedTrend: number; // percentage change
  mealsRedistributedTrend: number;
  costSavedTrend: number;
  co2eAvoidedTrend: number;
}

// Driver tasks
export interface DriverTask {
  id: string;
  type: 'pickup' | 'delivery';
  entityName: string;
  address: string;
  location: { lat: number; lng: number };
  scheduledTime: string;
  itemDescription: string;
  quantityKg: number;
  contactPerson: string;
  contactPhone: string;
  status: 'pending' | 'in_progress' | 'completed';
  proofPhotoUrl?: string;
  notes?: string;
  sequence: number;
}

// Notification settings
export interface NotificationPreferences {
  expiryAlerts: boolean;
  temperatureAlerts: boolean;
  surplusMatches: boolean;
  deliveryUpdates: boolean;
  machineAlerts: boolean;
  dailyDigest: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

// Chart data types
export interface WasteTrendData {
  date: string;
  wasteKg: number;
  savedKg: number;
  targetKg: number;
}

export interface CategoryData {
  category: string;
  value: number;
  color: string;
}

export interface EnergyUsageData {
  hour: string;
  usage: number;
  baseline: number;
}

export interface ConsumptionHistory {
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  total: number;
  waste: number;
}
