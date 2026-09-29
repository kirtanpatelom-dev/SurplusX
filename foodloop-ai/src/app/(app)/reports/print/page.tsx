'use client';

import { mockApi } from '@/lib/mock-api';
import { formatINR, formatNumber, formatWeight } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function ReportPrintPage() {
  const q = useQuery({ queryKey: ['esg', 'month'], queryFn: () => mockApi.getEsg('month') });
  const m = q.data?.metrics;

  useEffect(() => {
    // Printable view; user can use browser print. PDF export is a stub.
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 bg-background p-6 text-foreground print:p-0">
      <div className="no-print flex justify-end gap-2">
        <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => window.print()}>
          Print
        </button>
        <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" disabled>
          Download PDF (stub)
        </button>
      </div>
      <header>
        <h1 className="text-2xl font-bold">FoodLoop AI — ESG impact pack</h1>
        <p className="text-sm text-muted-foreground">Period: September 2026 · Gujarat Guest House + Gujarat Food Processing Ltd.</p>
      </header>
      {m && (
        <table className="w-full text-sm">
          <tbody>
            <Row k="Waste prevented" v={formatWeight(m.wastePreventedKg)} />
            <Row k="Meals redistributed" v={formatNumber(m.mealsRedistributed)} />
            <Row k="CO₂e saved" v={`${formatNumber(m.co2eSavedKg)} kg`} />
            <Row k="Water saved" v={`${formatNumber(m.waterSavedLiters)} L`} />
            <Row k="Cost saved" v={formatINR(m.costSavedInr)} />
            <Row k="Waste diverted" v={`${m.wasteDivertedPercent}%`} />
            <Row k="Compliance score" v={`${m.complianceScore}`} />
          </tbody>
        </table>
      )}
      <p className="text-xs text-muted-foreground">AI-generated (simulated). Not a statutory filing.</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr className="border-b border-border">
      <td className="py-2">{k}</td>
      <td className="py-2 text-right tabular-nums font-medium">{v}</td>
    </tr>
  );
}
