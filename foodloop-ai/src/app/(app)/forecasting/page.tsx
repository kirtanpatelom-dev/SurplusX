'use client';

import { ChartCard, ErrorState, LoadingSkeleton, PageHeader, RoleGuard } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function ForecastingPage() {
  const [horizon, setHorizon] = useState<7 | 14 | 30>(14);
  const [approved, setApproved] = useState<Record<string, number>>({});
  const q = useQuery({
    queryKey: ['forecast', horizon],
    queryFn: () => mockApi.getForecast(horizon),
  });
  const approve = useMutation({
    mutationFn: async () => true,
  });

  const chartRows = useMemo(() => {
    const byDate = new Map<string, { date: string; predicted: number; actual?: number; low: number; high: number }>();
    for (const row of q.data?.series ?? []) {
      const cur = byDate.get(row.date) ?? { date: row.date.slice(5), predicted: 0, actual: 0, low: 0, high: 0 };
      cur.predicted += row.predicted;
      cur.actual = (cur.actual ?? 0) + (row.actual ?? 0);
      cur.low += row.confidenceLow;
      cur.high += row.confidenceHigh;
      if (row.actual === undefined) cur.actual = undefined;
      byDate.set(row.date, cur);
    }
    return [...byDate.values()];
  }, [q.data]);

  return (
    <RoleGuard href="/forecasting">
      <div className="space-y-4">
        <PageHeader
          title="Demand forecasting"
          description="Hostel meal demand with a confidence band. AI-generated (simulated)."
          actions={
            <div className="flex gap-2">
              {([7, 14, 30] as const).map((h) => (
                <Button key={h} size="sm" variant={horizon === h ? 'default' : 'outline'} onClick={() => setHorizon(h)}>
                  {h} days
                </Button>
              ))}
            </div>
          }
        />
        {q.isLoading && <LoadingSkeleton variant="page" />}
        {q.isError && <ErrorState onRetry={() => q.refetch()} />}
        {q.data && (
          <>
            <ChartCard title="Actual vs predicted (kg, all meals)" aiGenerated>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartRows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} label={{ value: 'kg', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Area dataKey="high" name="High band (kg)" stroke="none" fill="var(--chart-1)" fillOpacity={0.12} />
                    <Area dataKey="low" name="Low band (kg)" stroke="none" fill="var(--background)" fillOpacity={1} />
                    <Line dataKey="predicted" name="Predicted (kg)" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                    <Line dataKey="actual" name="Actual (kg)" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">Inputs affecting forecast</h2>
                <ul className="mt-3 space-y-3">
                  {q.data.factors.map((f) => (
                    <li key={f.name} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-medium">
                        {f.name} · {f.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{f.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">Recommended production quantity</h2>
                <table className="mt-3 w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="py-2">Meal</th>
                      <th>Item</th>
                      <th>AI kg</th>
                      <th>Planned</th>
                      <th>Adjust</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.data.recommendations.map((r) => {
                      const key = `${r.meal}-${r.item}`;
                      const val = approved[key] ?? r.recommendedQty;
                      return (
                        <tr key={key} className="border-t border-border">
                          <td className="py-2 capitalize">{r.meal}</td>
                          <td>{r.item}</td>
                          <td className="tabular-nums">{r.recommendedQty}</td>
                          <td className="tabular-nums">{r.currentPlanned}</td>
                          <td>
                            <input
                              aria-label={`Adjust ${r.item}`}
                              type="number"
                              className="h-8 w-20 rounded-md border border-input bg-background px-2 tabular-nums"
                              value={val}
                              onChange={(e) => setApproved((s) => ({ ...s, [key]: Number(e.target.value) }))}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Button className="mt-4" onClick={() => approve.mutate()} disabled={approve.isPending}>
                  {approve.isSuccess ? 'Approved for tomorrow' : 'Approve quantities'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
