'use client';

import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorState({
  title = 'Could not load this view',
  description = 'The mock API layer failed. Retry to reload simulated data.',
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-12 text-center',
        className
      )}
      role="alert"
    >
      <AlertCircle className="mb-3 h-8 w-8 text-destructive" aria-hidden />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
