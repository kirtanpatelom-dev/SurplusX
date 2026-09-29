'use client';

import { MAP_CENTER, MAP_DEFAULT_ZOOM } from '@/lib/constants';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: 'donor' | 'receiver' | 'vehicle' | 'stop';
};

export type MapPath = {
  id: string;
  points: { lat: number; lng: number }[];
};

const LeafletMap = dynamic(() => import('./leaflet-map').then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-[280px] w-full rounded-xl" />,
});

export function MapView({
  markers,
  paths,
  className,
  heightClass = 'h-[320px] md:h-[420px]',
}: {
  markers: MapMarker[];
  paths?: MapPath[];
  className?: string;
  heightClass?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border', heightClass, className)}>
      <LeafletMap
        center={MAP_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        markers={markers}
        paths={paths ?? []}
      />
    </div>
  );
}
