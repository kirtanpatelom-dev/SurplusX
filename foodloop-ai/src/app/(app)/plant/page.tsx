'use client';

import { ChartCard, KpiCard, PageHeader, RoleGuard, StatusBadge } from '@/components/shared';
import { mockApi } from '@/lib/mock-api';
import { useQuery } from '@tanstack/react-query';
import { Activity, Gauge, Timer, Zap } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function PlantPage() {
  const machines = useQuery({ queryKey: ['machines'], queryFn: () => mockApi.getMachines() });
  const downtime = useQuery({ queryKey: ['downtime'], queryFn: () => mockApi.getDowntime() });
  const energy = useQuery({ queryKey: ['energy'], queryFn: () => mockApi.getEnergyUsage() });
  const sensors = useQuery({ queryKey: ['sensors'], queryFn: () => mockApi.getSensors() });

  const list = machines.data ?? [];
  const oee = list.length ? Math.round(list.reduce((s, m) => s + m.oee, 0) / list.length) : 0;
  const loss = list.length ? (list.reduce((s, m) => s + m.rawMaterialLossPercent, 0) / list.length).toFixed(1) : '0';
  const down = list.reduce((s, m) => s + m.downtimeToday, 0);

  return (
    <RoleGuard href="/plant">
      <div className="space-y-4">
        <PageHeader title="Processing unit monitor" description="Gujarat Food Processing Ltd. — milling, dal, oil, packaging, cold store." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Plant OEE" value={`${oee}%`} icon={<Gauge className="h-5 w-5" />} />
          <KpiCard title="Downtime today" value={`${down} min`} icon={<Timer className="h-5 w-5" />} />
          <KpiCard title="Avg raw material loss" value={`${loss}%`} icon={<Activity className="h-5 w-5" />} />
          <KpiCard title="Boiler energy" value="210 kWh" icon={<Zap className="h-5 w-5" />} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {list.map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{m.name}</p>
                <StatusBadge status={m.status} size="sm" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Health {m.healthScore} · OEE {m.oee}% · {m.currentOutput}/{m.maxOutput} u/hr
              </p>
              <p className="text-xs text-muted-foreground">Loss {m.rawMaterialLossPercent}% · {m.energyUsageKwh} kWh</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Energy vs baseline (today)" loading={energy.isLoading}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energy.data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" name="Usage (kWh)" fill="var(--chart-1)" />
                  <Bar dataKey="baseline" name="Baseline (kWh)" fill="var(--chart-3)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Downtime log</h2>
            <ul className="mt-3 space-y-2">
              {(downtime.data ?? []).map((d) => (
                <li key={d.id} className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-medium">{d.machineName}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.durationMin} min · {d.reason} · {d.impact} · {d.resolved ? 'closed' : 'open'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Storage condition summary</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {(sensors.data ?? [])
              .slice(0, 4)
              .map((s) => `${s.name}: ${s.value}${s.unit} (${s.status})`)
              .join(' · ')}
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
