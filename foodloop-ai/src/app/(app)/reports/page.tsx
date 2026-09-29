'use client';

import { KpiCard, PageHeader, RoleGuard, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { formatINR, formatNumber, formatWeight } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Droplets, Leaf, Recycle, Scale } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ReportsPage() {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const q = useQuery({ queryKey: ['esg', period], queryFn: () => mockApi.getEsg(period) });
  const m = q.data?.metrics;

  return (
    <RoleGuard href="/reports">
      <div className="space-y-4">
        <PageHeader
          title="Sustainability and ESG"
          description="Aligned to MoFPI resource-efficiency reporting. Export opens a printable view."
          actions={
            <div className="flex flex-wrap gap-2">
              {(['month', 'quarter', 'year'] as const).map((p) => (
                <Button key={p} size="sm" variant={period === p ? 'default' : 'outline'} onClick={() => setPeriod(p)}>
                  {p}
                </Button>
              ))}
              <Link href="/reports/print">
                <Button size="sm" variant="secondary">
                  Export report
                </Button>
              </Link>
            </div>
          }
        />
        {m && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard title="Waste prevented" value={formatWeight(m.wastePreventedKg)} icon={<Scale className="h-5 w-5" />} />
            <KpiCard title="CO₂e saved" value={`${formatNumber(m.co2eSavedKg)} kg`} icon={<Leaf className="h-5 w-5" />} />
            <KpiCard title="Water saved" value={`${formatNumber(m.waterSavedLiters)} L`} icon={<Droplets className="h-5 w-5" />} />
            <KpiCard title="Cost saved" value={formatINR(m.costSavedInr)} icon={<Recycle className="h-5 w-5" />} />
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Meals redistributed" value={m ? formatNumber(m.mealsRedistributed) : '—'} />
          <Metric label="Waste diverted" value={m ? `${m.wasteDivertedPercent}%` : '—'} />
          <Metric label="Resource efficiency" value={m ? `${m.resourceEfficiency}` : '—'} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Compliance checklist</h2>
          <ul className="mt-3 space-y-2">
            {(q.data?.compliance ?? []).map((c) => (
              <li key={c.id} className="flex flex-col gap-1 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{c.requirement}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.category} · {c.notes}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RoleGuard>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
