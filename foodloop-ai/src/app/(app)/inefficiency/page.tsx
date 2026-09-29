'use client';

import { DataTable, PageHeader, RoleGuard, StatusBadge, type Column } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { formatINR, formatDateTime } from '@/lib/utils';
import type { Inefficiency } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function InefficiencyPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['inefficiency'], queryFn: () => mockApi.getInefficiencies() });
  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Inefficiency['status'] }) => mockApi.setInefficiencyStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inefficiency'] }),
  });

  const columns: Column<Inefficiency>[] = [
    { key: 'title', header: 'Issue' },
    { key: 'type', header: 'Type' },
    { key: 'severity', header: 'Severity', render: (r) => <StatusBadge status={r.severity === 'critical' ? 'error' : r.severity === 'warning' ? 'warning' : 'online'} /> },
    { key: 'estimatedImpactInr', header: 'INR impact', render: (r) => <span className="tabular-nums">{formatINR(r.estimatedImpactInr)}</span> },
    { key: 'suggestedFix', header: 'Suggested fix' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'detectedAt', header: 'Detected', render: (r) => formatDateTime(r.detectedAt) },
    {
      key: 'id',
      header: '',
      searchable: false,
      render: (r) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: r.id, status: 'resolved' })}>
            Resolve
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStatus.mutate({ id: r.id, status: 'snoozed' })}>
            Snooze
          </Button>
        </div>
      ),
    },
  ];

  return (
    <RoleGuard href="/inefficiency">
      <div className="space-y-4">
        <PageHeader
          title="Inefficiency detection"
          description="Overproduction, yield loss, downtime, and energy outliers. AI-generated (simulated)."
        />
        <DataTable columns={columns} data={q.data ?? []} rowKey={(r) => r.id} loading={q.isLoading} />
      </div>
    </RoleGuard>
  );
}
