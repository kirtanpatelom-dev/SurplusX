'use client';

import { MapView } from '@/components/maps/map-view';
import { PageHeader, RoleGuard, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export default function LogisticsPage() {
  const [assigned, setAssigned] = useState('VEH-002');
  const vehicles = useQuery({ queryKey: ['vehicles'], queryFn: () => mockApi.getVehicles() });
  const routes = useQuery({ queryKey: ['routes'], queryFn: () => mockApi.getRoutes() });
  const optimize = useMutation({ mutationFn: () => mockApi.optimizeRoutes() });

  const markers = useMemo(() => {
    const v = (vehicles.data ?? []).map((veh) => ({
      id: veh.id,
      lat: veh.currentLocation.lat,
      lng: veh.currentLocation.lng,
      label: `${veh.number} · ${veh.driverName}`,
      kind: 'vehicle' as const,
    }));
    const stops = (routes.data ?? []).flatMap((r) =>
      r.stops.map((s) => ({
        id: s.id,
        lat: s.location.lat,
        lng: s.location.lng,
        label: s.entityName,
        kind: 'stop' as const,
      }))
    );
    return [...v, ...stops];
  }, [vehicles.data, routes.data]);

  const paths = useMemo(
    () =>
      (routes.data ?? []).map((r) => ({
        id: r.id,
        points: r.stops.map((s) => ({ lat: s.location.lat, lng: s.location.lng })),
      })),
    [routes.data]
  );

  const shown = optimize.data
    ? { before: optimize.data.beforeKm, after: optimize.data.afterKm, fuel: optimize.data.fuelSavedLiters }
    : {
        before: routes.data?.reduce((s, r) => s + r.totalDistanceKm, 0) ?? 0,
        after: routes.data?.reduce((s, r) => s + (r.optimizedDistanceKm ?? r.totalDistanceKm), 0) ?? 0,
        fuel: routes.data?.reduce((s, r) => s + (r.fuelSavedLiters ?? 0), 0) ?? 0,
      };

  return (
    <RoleGuard href="/logistics">
      <div className="space-y-4">
        <PageHeader
          title="Logistics and route optimisation"
          description="Multi-stop vans between Gandhinagar kitchens and Ahmedabad receivers."
          actions={
            <Button onClick={() => optimize.mutate()} disabled={optimize.isPending}>
              {optimize.isPending ? 'Optimising…' : 'Optimize routes'}
            </Button>
          }
        />
        {optimize.data && (
          <p className="rounded-lg border border-primary/30 bg-accent px-3 py-2 text-sm" role="status">
            Before {shown.before} km → after {shown.after} km · fuel saved {shown.fuel} L (simulated)
          </p>
        )}
        <MapView markers={markers} paths={paths} />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Vehicles</h2>
            <ul className="mt-3 space-y-2">
              {(vehicles.data ?? []).map((v) => (
                <li key={v.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{v.number}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.driverName} · {v.currentLoad}/{v.capacity} kg · fuel {v.fuelLevel}%
                      {v.hasColdChain ? ' · cold chain' : ''}
                    </p>
                  </div>
                  <StatusBadge status={v.status} size="sm" />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Assign driver to RTE-002</h2>
            <select
              className="mt-3 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={assigned}
              onChange={(e) => setAssigned(e.target.value)}
              aria-label="Assign vehicle"
            >
              {(vehicles.data ?? []).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.driverName} · {v.number}
                </option>
              ))}
            </select>
            <ul className="mt-4 space-y-2">
              {(routes.data ?? [])[1]?.stops.map((s) => (
                <li key={s.id} className="text-sm">
                  <span className="font-medium capitalize">{s.type}</span> {s.entityName} · ETA {s.estimatedArrival.slice(11, 16)} · {s.itemsKg} kg
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">Assigned {assigned} for today’s Ahmedabad loop.</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
