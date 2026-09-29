import { cn } from '@/lib/utils';
import { STATUS_COLORS, SURPLUS_STATUS_COLORS } from '@/lib/constants';
import type { ItemStatus, SurplusStatus } from '@/types';

interface StatusBadgeProps {
  status: ItemStatus | SurplusStatus | string;
  className?: string;
  size?: 'sm' | 'md';
}

const statusLabels: Record<string, string> = {
  fresh: 'Fresh',
  use_soon: 'Use Soon',
  at_risk: 'At Risk',
  expired: 'Expired',
  listed: 'Listed',
  matched: 'Matched',
  accepted: 'Accepted',
  picked_up: 'Picked Up',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  online: 'Online',
  offline: 'Offline',
  warning: 'Warning',
  running: 'Running',
  idle: 'Idle',
  maintenance: 'Maintenance',
  error: 'Error',
  available: 'Available',
  in_transit: 'In Transit',
  loading: 'Loading',
  compliant: 'Compliant',
  partial: 'Partial',
  non_compliant: 'Non-Compliant',
  not_applicable: 'N/A',
  open: 'Open',
  resolved: 'Resolved',
  snoozed: 'Snoozed',
};

const genericStatusColors: Record<string, { bg: string; text: string }> = {
  online: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  offline: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  warning: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  running: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  idle: { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-400' },
  maintenance: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  available: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  in_transit: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  loading: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  compliant: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  partial: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  non_compliant: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  not_applicable: { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-400' },
  open: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  resolved: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  snoozed: { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-400' },
};

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const colors = 
    (STATUS_COLORS as Record<string, { bg: string; text: string }>)[status] ?? 
    (SURPLUS_STATUS_COLORS as Record<string, { bg: string; text: string }>)[status] ?? 
    genericStatusColors[status] ?? 
    { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        className
      )}
      role="status"
      aria-label={`Status: ${statusLabels[status] || status}`}
    >
      <span className={cn(
        'mr-1.5 rounded-full',
        size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
        colors.text.replace('text-', 'bg-').split(' ')[0]
      )} />
      {statusLabels[status] || status}
    </span>
  );
}
