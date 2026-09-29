'use client';

import type { MapMarker, MapPath } from './map-view';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const kindColor: Record<MapMarker['kind'], string> = {
  donor: '#16a34a',
  receiver: '#3b82f6',
  vehicle: '#f59e0b',
  stop: '#8b5cf6',
};

export function LeafletMap({
  center,
  zoom,
  markers,
  paths,
}: {
  center: { lat: number; lng: number };
  zoom: number;
  markers: MapMarker[];
  paths: MapPath[];
}) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom={false}
      aria-label="Gandhinagar and Ahmedabad map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {paths.map((path) => (
        <Polyline
          key={path.id}
          positions={path.points.map((p) => [p.lat, p.lng] as [number, number])}
          pathOptions={{ color: '#16a34a', weight: 3, opacity: 0.85 }}
        />
      ))}
      {markers.map((m) => (
        <CircleMarker
          key={m.id}
          center={[m.lat, m.lng]}
          radius={9}
          pathOptions={{ color: kindColor[m.kind], fillColor: kindColor[m.kind], fillOpacity: 0.85 }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{m.label}</p>
              <p className="capitalize text-slate-600">{m.kind}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
