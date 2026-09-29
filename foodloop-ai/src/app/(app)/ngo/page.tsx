'use client';

import { PageHeader, RoleGuard, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import type { ItemCategory } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const types: ItemCategory[] = ['grains', 'vegetables', 'prepared', 'dairy', 'fruits', 'packaged'];

export default function NgoPage() {
  const qc = useQueryClient();
  const surplus = useQuery({ queryKey: ['surplus'], queryFn: () => mockApi.getSurplus() });
  const settings = useQuery({ queryKey: ['ngo-settings'], queryFn: () => mockApi.getNgoSettings() });
  const [capacity, setCapacity] = useState<number | null>(null);
  const [preferred, setPreferred] = useState<ItemCategory[] | null>(null);
  const save = useMutation({
    mutationFn: () =>
      mockApi.saveNgoSettings(capacity ?? settings.data?.capacityKg ?? 300, preferred ?? settings.data?.preferredFoodTypes ?? []),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ngo-settings'] }),
  });
  const update = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: 'accepted' | 'cancelled' | 'delivered'; note: string }) =>
      mockApi.updateSurplusStatus(id, status, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['surplus'] }),
  });

  const cap = capacity ?? settings.data?.capacityKg ?? 300;
  const prefs = preferred ?? settings.data?.preferredFoodTypes ?? [];
  const incoming = (surplus.data ?? []).filter((s) => s.matchedReceiverId === 'RCV-001' || s.status === 'listed');

  return (
    <RoleGuard href="/ngo">
      <div className="space-y-4">
        <PageHeader title="NGO portal" description="Annapurna Food Trust — incoming lots, capacity, and impact receipts." />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 lg:col-span-1">
            <h2 className="text-sm font-semibold">Capacity settings</h2>
            <label className="mt-3 block text-xs text-muted-foreground" htmlFor="cap">
              Daily capacity (kg)
            </label>
            <input
              id="cap"
              type="number"
              className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3"
              value={cap}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
            <p className="mt-4 text-xs font-medium">Preferred food types</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {types.map((t) => {
                const on = prefs.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs ${on ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                    onClick={() =>
                      setPreferred(on ? prefs.filter((p) => p !== t) : [...prefs, t])
                    }
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <Button className="mt-4" onClick={() => save.mutate()}>
              Save preferences
            </Button>
          </div>
          <div className="space-y-3 lg:col-span-2">
            {incoming.map((s) => (
              <article key={s.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{s.foodType}</h3>
                    <p className="text-xs text-muted-foreground">
                      {s.quantity} kg · {s.donorName} · pickup {s.pickupWindowStart.slice(11, 16)}–{s.pickupWindowEnd.slice(11, 16)}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => update.mutate({ id: s.id, status: 'accepted', note: 'Annapurna accepted' })}>
                    Confirm pickup
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => update.mutate({ id: s.id, status: 'cancelled', note: 'Over capacity' })}>
                    Decline
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => window.print()}>
                    Impact certificate
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 print:border-0">
          <h2 className="text-sm font-semibold">Receipt / impact certificate</h2>
          <p className="mt-2 text-sm">
            Annapurna Food Trust confirms receipt of surplus food via FoodLoop AI. Meals equivalent this month: 36,840 (platform-wide, simulated). Certificate ID AFL-2026-09-GN.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
