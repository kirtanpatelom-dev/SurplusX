'use client';

import { DataTable, ErrorState, LoadingSkeleton, PageHeader, RoleGuard, StatusBadge, type Column } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { formatDate, formatINR } from '@/lib/utils';
import type { InventoryItem, ItemStatus, SuggestedAction } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const actionLabel: Record<SuggestedAction, string> = {
  cook_now: 'Cook now',
  discount: 'Staff meal / discount',
  donate: 'Donate',
  compost: 'Compost',
};

export default function InventoryPage() {
  const [status, setStatus] = useState<ItemStatus | 'all'>('all');
  const [toast, setToast] = useState<string | null>(null);
  const q = useQuery({ queryKey: ['inventory'], queryFn: () => mockApi.getInventory() });

  const rows = useMemo(() => {
    const data = q.data ?? [];
    return status === 'all' ? data : data.filter((i) => i.status === status);
  }, [q.data, status]);

  const columns: Column<InventoryItem>[] = [
    { key: 'name', header: 'Item', sortable: true },
    { key: 'batch', header: 'Batch', sortable: true },
    {
      key: 'quantity',
      header: 'Qty',
      sortable: true,
      render: (i) => <span className="tabular-nums">{i.quantity} {i.unit}</span>,
    },
    { key: 'storageLocation', header: 'Storage' },
    {
      key: 'expiryDate',
      header: 'Expiry',
      sortable: true,
      render: (i) => (
        <span className="tabular-nums">
          {formatDate(i.expiryDate)} ({i.daysUntilExpiry}d)
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} /> },
    {
      key: 'costPerKg',
      header: 'Value',
      render: (i) => <span className="tabular-nums">{formatINR(i.costPerKg * i.quantity)}</span>,
    },
    {
      key: 'suggestedAction',
      header: 'Action',
      searchable: false,
      render: (i) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            const act = i.suggestedAction ?? 'cook_now';
            setToast(`${i.name}: ${actionLabel[act]} (simulated)`);
          }}
        >
          Suggest action
        </Button>
      ),
    },
  ];

  return (
    <RoleGuard href="/inventory">
      <div className="space-y-4">
        <PageHeader
          title="Inventory and expiry"
          description="48 lots across dry, chilled, and prepared stores. Countdown is relative to 29 Sep 2026."
        />
        {toast && (
          <p className="rounded-lg border border-primary/30 bg-accent px-3 py-2 text-sm" role="status">
            {toast}
          </p>
        )}
        {q.isLoading && <LoadingSkeleton variant="table" count={8} />}
        {q.isError && <ErrorState onRetry={() => q.refetch()} />}
        {q.data && (
          <DataTable
            columns={columns}
            data={rows}
            rowKey={(i) => i.id}
            searchPlaceholder="Search item, batch, store…"
            filters={
              <select
                aria-label="Filter by status"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus | 'all')}
              >
                <option value="all">All statuses</option>
                <option value="fresh">Fresh</option>
                <option value="use_soon">Use soon</option>
                <option value="at_risk">At risk</option>
                <option value="expired">Expired</option>
              </select>
            }
          />
        )}
      </div>
    </RoleGuard>
  );
}
