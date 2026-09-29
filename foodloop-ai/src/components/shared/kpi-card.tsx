'use client';

import { cn, getTrendLabel } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number; // percentage change
  trendLabel?: string;
  icon: React.ReactNode;
  className?: string;
}

export function KpiCard({ title, value, subtitle, trend, trendLabel, icon, className }: KpiCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const isNeutral = trend === undefined || trend === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tabular-nums text-card-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className={cn(
          'mt-3 flex items-center gap-1 text-sm font-medium',
          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
          isNeutral && 'text-muted-foreground'
        )}>
          {isNeutral ? <Minus className="h-4 w-4" /> : isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="tabular-nums">{getTrendLabel(trend)}</span>
          {trendLabel && <span className="text-muted-foreground font-normal">vs {trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
