export const APP_NAME = 'SurplusX';
export const APP_DESCRIPTION = 'AI-powered Smart Food Waste Management & Redistribution Platform';

export const ROLES = {
  kitchen_manager: {
    label: 'Kitchen Manager',
    description: 'Manage institutional kitchen operations, track inventory, and reduce waste',
    icon: 'ChefHat',
    color: 'emerald',
  },
  plant_manager: {
    label: 'Plant Manager',
    description: 'Monitor processing units, machine health, and production efficiency',
    icon: 'Factory',
    color: 'blue',
  },
  ngo_receiver: {
    label: 'NGO / Receiver',
    description: 'Receive surplus food donations and manage distribution to communities',
    icon: 'Heart',
    color: 'rose',
  },
  logistics_driver: {
    label: 'Logistics Driver',
    description: 'Handle pickups, deliveries, and route navigation',
    icon: 'Truck',
    color: 'amber',
  },
  admin_auditor: {
    label: 'Admin / ESG Auditor',
    description: 'Oversee platform operations, compliance, and sustainability reporting',
    icon: 'Shield',
    color: 'purple',
  },
} as const;

export const MOCK_USERS: Record<string, { id: string; name: string; email: string; organization: string }> = {
  kitchen_manager: { id: 'usr_km_01', name: 'Priya Sharma', email: 'priya@guesthousegn.in', organization: 'Gujarat Guest House, Gandhinagar' },
  plant_manager: { id: 'usr_pm_01', name: 'Rajesh Patel', email: 'rajesh@gujfoodproc.in', organization: 'Gujarat Food Processing Ltd.' },
  ngo_receiver: { id: 'usr_ngo_01', name: 'Meera Desai', email: 'meera@annapurnatrust.org', organization: 'Annapurna Food Trust' },
  logistics_driver: { id: 'usr_ld_01', name: 'Amit Kumar', email: 'amit@surplusxlogistics.in', organization: 'SurplusX Logistics' },
  admin_auditor: { id: 'usr_aa_01', name: 'Dr. Kavita Joshi', email: 'kavita@mofpi.gov.in', organization: 'Ministry of Food Processing Industries' },
};

// Navigation items per role
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', roles: ['kitchen_manager', 'plant_manager', 'ngo_receiver', 'logistics_driver', 'admin_auditor'] },
  { label: 'Demand Forecasting', href: '/forecasting', icon: 'TrendingUp', roles: ['kitchen_manager', 'admin_auditor'] },
  { label: 'Inventory & Expiry', href: '/inventory', icon: 'Package', roles: ['kitchen_manager', 'admin_auditor'] },
  { label: 'Quality Inspection', href: '/quality', icon: 'ScanSearch', roles: ['kitchen_manager', 'plant_manager', 'admin_auditor'] },
  { label: 'IoT Sensors', href: '/sensors', icon: 'Thermometer', roles: ['kitchen_manager', 'plant_manager', 'admin_auditor'] },
  { label: 'Surplus & Redistribution', href: '/surplus', icon: 'Repeat', roles: ['kitchen_manager', 'ngo_receiver', 'admin_auditor'] },
  { label: 'Logistics & Routes', href: '/logistics', icon: 'MapPin', roles: ['kitchen_manager', 'logistics_driver', 'admin_auditor'] },
  { label: 'Plant Monitor', href: '/plant', icon: 'Factory', roles: ['plant_manager', 'admin_auditor'] },
  { label: 'Inefficiency Detection', href: '/inefficiency', icon: 'AlertTriangle', roles: ['plant_manager', 'admin_auditor'] },
  { label: 'Production Planning', href: '/production', icon: 'CalendarDays', roles: ['kitchen_manager', 'plant_manager', 'admin_auditor'] },
  { label: 'ESG Reports', href: '/reports', icon: 'FileBarChart', roles: ['admin_auditor', 'kitchen_manager', 'plant_manager'] },
  { label: 'NGO Portal', href: '/ngo', icon: 'Heart', roles: ['ngo_receiver', 'admin_auditor'] },
  { label: 'Driver View', href: '/driver', icon: 'Navigation', roles: ['logistics_driver'] },
  { label: 'Settings', href: '/settings', icon: 'Settings', roles: ['kitchen_manager', 'plant_manager', 'ngo_receiver', 'logistics_driver', 'admin_auditor'] },
] as const;

export const STATUS_COLORS = {
  fresh: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  use_soon: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  at_risk: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  expired: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
} as const;

export const SURPLUS_STATUS_COLORS = {
  listed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  matched: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
  accepted: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  picked_up: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  delivered: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
} as const;

// Gandhinagar / Ahmedabad center coordinates
export const MAP_CENTER = { lat: 23.2156, lng: 72.6369 } as const;
export const MAP_DEFAULT_ZOOM = 12;

export const CURRENCY_SYMBOL = '₹';
export const WEIGHT_UNIT = 'kg';

// Language options
export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
] as const;

// Nav label translations (demo only)
export const NAV_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: { Dashboard: 'Dashboard', 'Demand Forecasting': 'Demand Forecasting', 'Inventory & Expiry': 'Inventory & Expiry', 'Quality Inspection': 'Quality Inspection', 'IoT Sensors': 'IoT Sensors', 'Surplus & Redistribution': 'Surplus & Redistribution', 'Logistics & Routes': 'Logistics & Routes', 'Plant Monitor': 'Plant Monitor', 'Inefficiency Detection': 'Inefficiency Detection', 'Production Planning': 'Production Planning', 'ESG Reports': 'ESG Reports', 'NGO Portal': 'NGO Portal', 'Driver View': 'Driver View', Settings: 'Settings' },
  hi: { Dashboard: 'डैशबोर्ड', 'Demand Forecasting': 'माँग पूर्वानुमान', 'Inventory & Expiry': 'इन्वेंटरी और समाप्ति', 'Quality Inspection': 'गुणवत्ता निरीक्षण', 'IoT Sensors': 'IoT सेंसर', 'Surplus & Redistribution': 'अधिशेष और पुनर्वितरण', 'Logistics & Routes': 'लॉजिस्टिक्स और मार्ग', 'Plant Monitor': 'प्लांट मॉनिटर', 'Inefficiency Detection': 'अक्षमता पहचान', 'Production Planning': 'उत्पादन योजना', 'ESG Reports': 'ESG रिपोर्ट', 'NGO Portal': 'NGO पोर्टल', 'Driver View': 'ड्राइवर दृश्य', Settings: 'सेटिंग्स' },
  gu: { Dashboard: 'ડેશબોર્ડ', 'Demand Forecasting': 'માંગ આગાહી', 'Inventory & Expiry': 'ઇન્વેન્ટરી અને સમાપ્તિ', 'Quality Inspection': 'ગુણવત્તા તપાસ', 'IoT Sensors': 'IoT સેન્સર', 'Surplus & Redistribution': 'સરપ્લસ અને પુનઃવિતરણ', 'Logistics & Routes': 'લોજિસ્ટિક્સ અને માર્ગો', 'Plant Monitor': 'પ્લાન્ટ મોનિટર', 'Inefficiency Detection': 'બિનકાર્યક્ષમતા શોધ', 'Production Planning': 'ઉત્પાદન આયોજન', 'ESG Reports': 'ESG અહેવાલ', 'NGO Portal': 'NGO પોર્ટલ', 'Driver View': 'ડ્રાઇવર દૃશ્ય', Settings: 'સેટિંગ્સ' },
};

export const DONUT_COLORS = ['#16a34a', '#eab308', '#f97316', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
