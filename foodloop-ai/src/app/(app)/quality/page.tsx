'use client';

import { DataTable, PageHeader, RoleGuard, type Column } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { formatDateTime } from '@/lib/utils';
import type { QualityInspection } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

export default function QualityPage() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [itemName, setItemName] = useState('Incoming vegetable crate');
  const history = useQuery({ queryKey: ['quality'], queryFn: () => mockApi.getQualityHistory() });
  const analyze = useMutation({
    mutationFn: () => mockApi.analyzeQuality(itemName),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quality'] }),
  });

  const onFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setItemName(file.name.replace(/\.[^.]+$/, '') || itemName);
  };

  const result = analyze.data;
  const columns: Column<QualityInspection>[] = [
    { key: 'itemName', header: 'Lot' },
    { key: 'freshnessScore', header: 'Score', render: (r) => <span className="tabular-nums">{r.freshnessScore}</span> },
    { key: 'grade', header: 'Grade' },
    { key: 'detectedIssues', header: 'Issues', render: (r) => r.detectedIssues.join(', ') || 'None' },
    { key: 'inspectedAt', header: 'When', render: (r) => formatDateTime(r.inspectedAt) },
  ];

  return (
    <RoleGuard href="/quality">
      <div className="space-y-4">
        <PageHeader
          title="Quality inspection"
          description="Computer vision freshness scoring. Results are AI-generated (simulated) — no model is called."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div
            className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload inspection photo"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {preview ? (
              <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Uploaded lot" className="h-56 w-full object-cover" />
                {result?.boundingBoxes.map((b, i) => (
                  <span
                    key={i}
                    className="absolute border-2 border-destructive text-[10px] font-medium text-destructive"
                    style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Drop a photo or click to browse. Analysis stays on-device in this demo.</p>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <input
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                aria-label="Lot name"
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  analyze.mutate();
                }}
                disabled={analyze.isPending}
              >
                {analyze.isPending ? 'Analysing…' : 'Run simulated scan'}
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-primary">AI-generated (simulated)</p>
            {result ? (
              <>
                <p className="mt-2 text-4xl font-bold tabular-nums">{result.freshnessScore}</p>
                <p className="text-sm text-muted-foreground">Freshness score · grade {result.grade}</p>
                <ul className="mt-4 list-disc pl-5 text-sm">
                  {result.detectedIssues.length === 0 && <li>No defects above the demo threshold.</li>}
                  {result.detectedIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">Run a scan to see score, grade, and overlay boxes.</p>
            )}
          </div>
        </div>
        <DataTable
          columns={columns}
          data={history.data ?? []}
          rowKey={(r) => r.id}
          loading={history.isLoading}
          emptyTitle="No scans yet"
        />
      </div>
    </RoleGuard>
  );
}
