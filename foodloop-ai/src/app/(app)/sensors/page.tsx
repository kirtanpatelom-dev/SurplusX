'use client';

import { ChartCard, ErrorState, LoadingSkeleton, PageHeader, RoleGuard, StatusBadge } from '@/components/shared';
import { mockApi } from '@/lib/mock-api';
import { formatRelativeTime } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

export default function SensorsPage() {
  const q = useQuery({
    queryKey: ['sensors'],
    queryFn: () => mockApi.getSensors(),
    refetchInterval: 4000,
  });

  return (
    <RoleGuard href="/sensors">
      <div className="space-y-4">
        <PageHeader
          title="IoT sensor panel"
          description="Cold rooms and dry stores around Sector 15. Values jitter every few seconds (simulated)."
        />
        {q.isLoading && <LoadingSkeleton count={8} />}
        {q.isError && <ErrorState onRetry={() => q.refetch()} />}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(q.data ?? []).map((s) => {
            const out = s.value < s.minThreshold || s.value > s.maxThreshold;
            return (
              <ChartCard
                key={s.id}
                title={s.name}
                description={`${s.location} · last ${formatRelativeTime(s.lastUpdated)}`}
                action={<StatusBadge status={s.status} size="sm" />}
              >
                <p className={`text-3xl font-bold tabular-nums ${out ? 'text-destructive' : 'text-foreground'}`}>
                  {s.value} {s.unit}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Band {s.minThreshold}–{s.maxThreshold} {s.unit}
                  {out ? ' · threshold alert' : ''}
                </p>
                <div className="mt-4 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={s.history}>
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            );
          })}
        </div>
      </div>
    </RoleGuard>
  );
}
