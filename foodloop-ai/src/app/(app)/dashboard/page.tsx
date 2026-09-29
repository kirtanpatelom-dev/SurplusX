'use client';

import { AlertItem, ChartCard, ErrorState, KpiCard, LoadingSkeleton, PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { formatINR, formatNumber, formatWeight } from '@/lib/utils';
import { useRoleStore } from '@/store/role-store';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IndianRupee, Leaf, Soup, Wheat } from 'lucide-react';
import Link from 'next/link';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function DashboardPage() {
  const role = useRoleStore((s) => s.currentRole);
  const kpis = useQuery({ queryKey: ['kpis'], queryFn: () => mockApi.getKpis() });
  const trend = useQuery({ queryKey: ['waste-trend'], queryFn: () => mockApi.getWasteTrend() });
  const donut = useQuery({ queryKey: ['surplus-cat'], queryFn: () => mockApi.getSurplusByCategory() });
  const alerts = useQuery({ queryKey: ['alerts'], queryFn: () => mockApi.getAlerts() });
  const surplus = useQuery({ queryKey: ['surplus'], queryFn: () => mockApi.getSurplus() });

  if (kpis.isLoading) return <LoadingSkeleton variant="page" />;
  if (kpis.isError) return <ErrorState onRetry={() => kpis.refetch()} />;

  const kpi = kpis.data!;
  const today = surplus.data?.filter((s) => !['cancelled', 'delivered'].includes(s.status)) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations dashboard"
        description="Gandhinagar kitchen + Ahmedabad plant snapshot. Figures are simulated."
        badge={
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {role.replaceAll('_', ' ')}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Waste prevented" value={formatWeight(kpi.wastePreventedKg)} trend={kpi.wastePreventedTrend} trendLabel="last week" icon={<Wheat className="h-5 w-5" />} />
        <KpiCard title="Meals redistributed" value={formatNumber(kpi.mealsRedistributed)} trend={kpi.mealsRedistributedTrend} trendLabel="last week" icon={<Soup className="h-5 w-5" />} />
        <KpiCard title="INR saved" value={formatINR(kpi.costSavedInr)} trend={kpi.costSavedTrend} trendLabel="last week" icon={<IndianRupee className="h-5 w-5" />} />
        <KpiCard title="CO₂e avoided" value={`${formatNumber(kpi.co2eAvoidedKg)} kg`} trend={kpi.co2eAvoidedTrend} trendLabel="last week" icon={<Leaf className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <ChartCard className="lg:col-span-3" title="Kitchen waste vs recovered (30 days)" description="kg per day from the hostel consumption ledger" loading={trend.isLoading}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.data ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: 'kg', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="wasteKg" name="Waste (kg)" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="savedKg" name="Recovered (kg)" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="targetKg" name="Target waste (kg)" stroke="var(--chart-2)" strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard className="lg:col-span-2" title="Surplus by category" aiGenerated loading={donut.isLoading}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut.data ?? []} dataKey="value" nameKey="category" innerRadius={58} outerRadius={88} paddingAngle={2}>
                  {(donut.data ?? []).map((d) => (
                    <Cell key={d.category} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Live alerts</h2>
          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {(alerts.data ?? []).slice(0, 8).map((a) => (
              <AlertItem key={a.id} alert={a} compact />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Today’s redistribution</h2>
          <ul className="mt-3 space-y-3">
            {today.slice(0, 6).map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{row.foodType}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.quantity} kg · {row.status.replace('_', ' ')}
                  </p>
                </div>
                <Link href="/surplus" className="text-xs font-medium text-primary">
                  Open
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Quick href="/inventory" label="Inventory" />
            <Quick href="/surplus" label="List surplus" />
            <Quick href="/forecasting" label="Approve forecast" />
            <Quick href="/sensors" label="Sensors" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Quick({ href, label }: { href: string; label: string }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link href={href}>
        <Button variant="outline" size="sm">
          {label}
        </Button>
      </Link>
    </motion.div>
  );
}
