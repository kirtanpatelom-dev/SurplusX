'use client';

import { MapView } from '@/components/maps/map-view';
import { DataTable, PageHeader, RoleGuard, StatusBadge, Timeline, type Column } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import type { SurplusListing } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  foodType: z.string().min(2),
  category: z.enum(['grains', 'dairy', 'vegetables', 'fruits', 'protein', 'spices', 'packaged', 'prepared', 'beverages']),
  quantity: z.coerce.number().positive(),
  packTime: z.string().min(1),
  safeUntil: z.string().min(1),
  isVeg: z.boolean(),
  allergens: z.string(),
  pickupWindowStart: z.string().min(1),
  pickupWindowEnd: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function SurplusPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<SurplusListing | null>(null);
  const surplus = useQuery({ queryKey: ['surplus'], queryFn: () => mockApi.getSurplus() });
  const receivers = useQuery({ queryKey: ['receivers'], queryFn: () => mockApi.getReceivers() });
  const create = useMutation({
    mutationFn: mockApi.createSurplus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['surplus'] }),
  });
  const match = useMutation({
    mutationFn: (id: string) => mockApi.matchSurplus(id),
    onSuccess: (row) => {
      setSelected(row);
      qc.invalidateQueries({ queryKey: ['surplus'] });
    },
  });
  const update = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: SurplusListing['status']; note: string }) =>
      mockApi.updateSurplusStatus(id, status, note),
    onSuccess: (row) => {
      setSelected(row);
      qc.invalidateQueries({ queryKey: ['surplus'] });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      foodType: 'Vegetable pulao',
      category: 'prepared',
      quantity: 22,
      packTime: '2026-09-29T14:00',
      safeUntil: '2026-09-29T22:00',
      isVeg: true,
      allergens: '',
      pickupWindowStart: '2026-09-29T15:00',
      pickupWindowEnd: '2026-09-29T18:00',
    },
  });

  const markers = useMemo(() => {
    const donor = {
      id: 'donor',
      lat: 23.22,
      lng: 72.64,
      label: 'SurplusX Central Kitchen',
      kind: 'donor' as const,
    };
    const rec = (receivers.data ?? []).slice(0, 8).map((r) => ({
      id: r.id,
      lat: r.location.lat,
      lng: r.location.lng,
      label: r.name,
      kind: 'receiver' as const,
    }));
    return [donor, ...rec];
  }, [receivers.data]);

  const columns: Column<SurplusListing>[] = [
    { key: 'foodType', header: 'Food' },
    { key: 'quantity', header: 'kg', render: (r) => <span className="tabular-nums">{r.quantity}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'matchedReceiverName', header: 'Receiver', render: (r) => r.matchedReceiverName ?? '—' },
  ];

  return (
    <RoleGuard href="/surplus">
      <div className="space-y-4">
        <PageHeader title="Surplus listing and redistribution" description="List leftover food, rank NGO matches, and walk the handover timeline." />
        <div className="grid gap-4 xl:grid-cols-5">
          <form
            className="space-y-3 rounded-xl border border-border bg-card p-5 xl:col-span-2"
            onSubmit={form.handleSubmit((values) =>
              create.mutate({
                ...values,
                allergens: values.allergens
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            )}
          >
            <h2 className="text-sm font-semibold">Create listing</h2>
            <Field label="Food type">
              <input className="input" {...form.register('foodType')} />
            </Field>
            <Field label="Category">
              <select className="input" {...form.register('category')}>
                {['prepared', 'vegetables', 'grains', 'dairy', 'fruits', 'packaged'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quantity (kg)">
              <input type="number" className="input" {...form.register('quantity')} />
            </Field>
            <Field label="Pack time">
              <input type="datetime-local" className="input" {...form.register('packTime')} />
            </Field>
            <Field label="Safe until">
              <input type="datetime-local" className="input" {...form.register('safeUntil')} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register('isVeg')} /> Vegetarian
            </label>
            <Field label="Allergens (comma separated)">
              <input className="input" {...form.register('allergens')} />
            </Field>
            <Field label="Pickup window start">
              <input type="datetime-local" className="input" {...form.register('pickupWindowStart')} />
            </Field>
            <Field label="Pickup window end">
              <input type="datetime-local" className="input" {...form.register('pickupWindowEnd')} />
            </Field>
            <Button type="submit" disabled={create.isPending}>
              List surplus
            </Button>
          </form>
          <div className="space-y-4 xl:col-span-3">
            <MapView markers={markers} />
            <DataTable
              columns={columns}
              data={surplus.data ?? []}
              rowKey={(r) => r.id}
              loading={surplus.isLoading}
              onRowClick={setSelected}
            />
          </div>
        </div>
        {selected && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">{selected.foodType}</h2>
              <p className="text-xs text-muted-foreground">
                {selected.quantity} kg · {selected.isVeg ? 'Veg' : 'Non-veg'}
              </p>
              <div className="mt-4">
                <Timeline events={selected.timeline} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => match.mutate(selected.id)}>
                  AI match receivers
                </Button>
                <Button size="sm" variant="outline" onClick={() => update.mutate({ id: selected.id, status: 'accepted', note: 'NGO accepted the lot' })}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => update.mutate({ id: selected.id, status: 'cancelled', note: 'Declined by receiver' })}>
                  Decline
                </Button>
                <Button size="sm" variant="outline" onClick={() => update.mutate({ id: selected.id, status: 'picked_up', note: 'Driver scanned pickup' })}>
                  Mark picked up
                </Button>
                <Button size="sm" variant="outline" onClick={() => update.mutate({ id: selected.id, status: 'delivered', note: 'Signed at shelter' })}>
                  Mark delivered
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">AI-matched receivers</h2>
              <p className="text-xs text-primary">Ranked by distance, capacity headroom, and rating. AI-generated (simulated).</p>
              <ul className="mt-3 space-y-2">
                {(receivers.data ?? []).slice(0, 6).map((r) => (
                  <li key={r.id} className="rounded-lg border border-border p-3">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.distanceKm} km · score {r.matchScore} · {r.capacity - r.currentLoad} kg headroom
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <style jsx>{`
          .input {
            width: 100%;
            height: 2.25rem;
            border-radius: 0.5rem;
            border: 1px solid var(--input);
            background: var(--background);
            padding: 0 0.75rem;
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    </RoleGuard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
