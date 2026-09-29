'use client';

import { PageHeader, RoleGuard, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { formatTime } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Check, Navigation } from 'lucide-react';
import { useRef } from 'react';

export default function DriverPage() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const tasks = useQuery({ queryKey: ['driver-tasks'], queryFn: () => mockApi.getDriverTasks() });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'in_progress' | 'completed' }) =>
      mockApi.updateDriverTask(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['driver-tasks'] }),
  });

  const list = [...(tasks.data ?? [])].sort((a, b) => a.sequence - b.sequence);
  const current = list.find((t) => t.status !== 'completed') ?? list[0];

  return (
    <RoleGuard href="/driver">
      <div className="mx-auto max-w-md space-y-4">
        <PageHeader title="Today’s route" description="Amit Kumar · van GJ-18-CD-5678 · cold chain on" />
        {current && (
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium uppercase text-primary">Next stop</p>
            <h2 className="mt-1 text-xl font-semibold">{current.entityName}</h2>
            <p className="text-sm text-muted-foreground">{current.address}</p>
            <p className="mt-2 text-sm tabular-nums">
              {formatTime(current.scheduledTime)} · {current.quantityKg} kg · {current.itemDescription}
            </p>
            <p className="mt-1 text-sm">
              {current.contactPerson} · {current.contactPhone}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button className="w-full gap-2">
                <Navigation className="h-4 w-4" />
                Open step-by-step (maps stub)
              </Button>
              {current.type === 'pickup' ? (
                <Button className="w-full gap-2" onClick={() => update.mutate({ id: current.id, status: 'completed' })}>
                  <Check className="h-4 w-4" />
                  Mark picked
                </Button>
              ) : (
                <Button className="w-full gap-2" onClick={() => update.mutate({ id: current.id, status: 'completed' })}>
                  <Check className="h-4 w-4" />
                  Mark delivered
                </Button>
              )}
              <Button variant="outline" className="w-full gap-2" onClick={() => fileRef.current?.click()}>
                <Camera className="h-4 w-4" />
                Upload proof photo
              </Button>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" aria-label="Proof photo" />
            </div>
          </div>
        )}
        <ul className="space-y-2">
          {list.map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <div>
                <p className="text-sm font-medium">
                  {t.sequence}. {t.type} · {t.entityName}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">{formatTime(t.scheduledTime)}</p>
              </div>
              <StatusBadge status={t.status === 'in_progress' ? 'in_transit' : t.status === 'completed' ? 'delivered' : 'listed'} size="sm" />
            </li>
          ))}
        </ul>
      </div>
    </RoleGuard>
  );
}
