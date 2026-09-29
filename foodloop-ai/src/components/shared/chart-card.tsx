import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  aiGenerated?: boolean;
}

export function ChartCard({ title, description, action, children, className, loading, aiGenerated }: ChartCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {aiGenerated && (
            <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:text-purple-400">
              AI-generated (simulated)
            </span>
          )}
          {action}
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-[200px] w-full" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
