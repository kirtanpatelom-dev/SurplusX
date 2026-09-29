export { cn } from "cn";

/** Format number as INR currency */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format number with Indian locale */
export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
  }).format(num);
}

/** Format weight in kg */
export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${formatNumber(kg / 1000, 1)} tonnes`;
  return `${formatNumber(kg, 1)} kg`;
}

/** Format relative time (e.g., '2 hours ago') */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Format date for display */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format time for display */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format date and time */
export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
}

/** Calculate days until a given date */
export function daysUntil(dateString: string): number {
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Get status based on days until expiry */
export function getExpiryStatus(daysLeft: number): 'fresh' | 'use_soon' | 'at_risk' | 'expired' {
  if (daysLeft <= 0) return 'expired';
  if (daysLeft <= 2) return 'at_risk';
  if (daysLeft <= 5) return 'use_soon';
  return 'fresh';
}

/** Generate a random ID */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

/** Simulate API delay */
export function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/** Get percentage change label */
export function getTrendLabel(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
