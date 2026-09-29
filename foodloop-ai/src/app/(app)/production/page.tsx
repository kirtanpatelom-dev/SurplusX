'use client';

import { PageHeader, RoleGuard } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export default function ProductionPage() {
  const [delta, setDelta] = useState(0);
  const q = useQuery({
    queryKey: ['weekly-plan', delta],
    queryFn: () => mockApi.getWeeklyPlan(delta),
  });

  const totals = useMemo(() => {
    let rec = 0;
    let plan = 0;
    for (const day of q.data ?? []) {
      for (const meal of Object.values(day.meals)) {
        for (const item of meal) {
          rec += item.recommended;
          plan += item.planned;
        }
      }
    }
    return { rec, plan, gap: plan - rec };
  }, [q.data]);

  return (
    <RoleGuard href="/production">
      <div className="space-y-4">
        <PageHeader
          title="Production planning"
          description="Weekly grid for the guest house kitchen. Slider scales recommended and planned kg live."
        />
        <div className="rounded-xl border border-border bg-card p-5">
          <label className="text-sm font-medium" htmlFor="att">
            What-if attendance {delta >= 0 ? '+' : ''}
            {delta}%
          </label>
          <input
            id="att"
            type="range"
            min={-10}
            max={10}
            step={1}
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
            className="mt-3 w-full accent-primary"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Recommended {totals.rec} kg · planned {totals.plan} kg · gap {totals.gap} kg (over-plan if positive)
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
                <th>Procurement</th>
              </tr>
            </thead>
            <tbody>
              {(q.data ?? []).map((day) => (
                <tr key={day.date} className="border-b border-border align-top">
                  <td className="px-4 py-3 font-medium">
                    {day.day}
                    <div className="text-xs text-muted-foreground">{day.date}</div>
                  </td>
                  {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                    <td key={meal} className="py-3 pr-3">
                      {day.meals[meal].map((item) => (
                        <p key={item.item} className="tabular-nums">
                          {item.item}: {item.recommended}/{item.planned} {item.unit}
                        </p>
                      ))}
                    </td>
                  ))}
                  <td className="py-3 pr-4 text-xs text-muted-foreground">
                    {day.meals.lunch.find((i) => !i.inStock)?.procurement ?? 'Stock covers the day'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="outline" disabled>
          Push plan to kitchen display (stub)
        </Button>
      </div>
    </RoleGuard>
  );
}
