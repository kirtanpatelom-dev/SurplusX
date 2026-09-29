import { cn, formatDateTime } from '@/lib/utils';
import type { TimelineEvent } from '@/types';
import { SURPLUS_STATUS_COLORS } from '@/lib/constants';
import { Check, Clock, Package, Truck, MapPin } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const statusIcons: Record<string, React.ComponentType<{className?: string}>> = {
  listed: Package,
  matched: Clock,
  accepted: Check,
  picked_up: Truck,
  delivered: MapPin,
};

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn('space-y-0', className)} role="list" aria-label="Status timeline">
      {events.map((event, i) => {
        const Icon = statusIcons[event.status] || Clock;
        const colors = (SURPLUS_STATUS_COLORS as Record<string, {bg: string; text: string}>)[event.status];
        const isLast = i === events.length - 1;
        
        return (
          <div key={`${event.status}-${event.timestamp}`} className="flex gap-3" role="listitem">
            <div className="flex flex-col items-center">
              <div className={cn('rounded-full p-1.5', colors?.bg || 'bg-muted')}>
                <Icon className={cn('h-3.5 w-3.5', colors?.text || 'text-muted-foreground')} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border min-h-[24px]" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium text-foreground capitalize">
                {event.status.replace('_', ' ')}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatDateTime(event.timestamp)}
              </p>
              {event.note && (
                <p className="text-xs text-muted-foreground mt-0.5">{event.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
