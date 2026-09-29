import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  variant?: 'cards' | 'table' | 'chart' | 'page';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'cards', count = 4, className }: LoadingSkeletonProps) {
  if (variant === 'page') {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('rounded-xl border border-border bg-card', className)}>
        <div className="p-4 border-b border-border">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
        <div className="p-4 border-t border-border flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Default: cards
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}
