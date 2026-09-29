'use client';

import { mockApi } from '@/lib/mock-api';
import { useNotificationStore } from '@/store/notification-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

/** Keeps the bell badge in sync and refreshes the simulated IoT/alert stream. */
export function LiveDataBridge() {
  const setAlerts = useNotificationStore((s) => s.setAlerts);
  const alertsQuery = useQuery({
    queryKey: ['alerts'],
    queryFn: () => mockApi.getAlerts(),
    refetchInterval: 7000,
  });

  useQuery({
    queryKey: ['sensors'],
    queryFn: () => mockApi.getSensors(),
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (alertsQuery.data) setAlerts(alertsQuery.data);
  }, [alertsQuery.data, setAlerts]);

  return null;
}
