'use client';

import { cn, formatRelativeTime } from '@/lib/utils';
import type { Alert } from '@/types';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertItemProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
  onRead?: (id: string) => void;
  compact?: boolean;
}

const severityConfig = {
  info: { icon: Info, className: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' },
  warning: { icon: AlertTriangle, className: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20' },
  critical: { icon: AlertCircle, className: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20' },
};

export function AlertItem({ alert, onDismiss, onRead, compact }: AlertItemProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;
  
  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-lg border border-l-4 p-3 transition-colors',
        config.className,
        !alert.isRead && 'ring-1 ring-primary/20',
        compact && 'p-2'
      )}
      role="alert"
      onClick={() => onRead?.(alert.id)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onRead?.(alert.id)}
    >
      <Icon className={cn(
        'h-5 w-5 shrink-0 mt-0.5',
        alert.severity === 'critical' && 'text-red-500',
        alert.severity === 'warning' && 'text-amber-500',
        alert.severity === 'info' && 'text-blue-500',
      )} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-medium text-foreground', compact && 'text-xs')}>
            {alert.title}
          </p>
          {!alert.isRead && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" aria-label="Unread" />
          )}
        </div>
        {!compact && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.message}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatRelativeTime(alert.timestamp)}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground capitalize">{alert.category}</span>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(alert.id); }}
          className="shrink-0 rounded p-1 hover:bg-muted transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
