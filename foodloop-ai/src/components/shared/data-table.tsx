'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from './empty-state';
import { Skeleton } from '@/components/ui/skeleton';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  /** Used for search filtering */
  searchable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  rowKey: (item: T) => string;
  className?: string;
  /** Extra filters to render above the table */
  filters?: React.ReactNode;
  /** Actions to render above table */
  actions?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  searchPlaceholder = 'Search...',
  loading,
  emptyTitle = 'No data found',
  emptyDescription,
  onRowClick,
  rowKey,
  className,
  filters,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  // Filter data by search term
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const searchLower = search.toLowerCase();
    const searchableKeys = columns.filter(c => c.searchable !== false).map(c => c.key);
    return data.filter(item => 
      searchableKeys.some(key => {
        const val = (item as Record<string, unknown>)[key];
        return val != null && String(val).toLowerCase().includes(searchLower);
      })
    );
  }, [data, search, columns]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const pagedData = sortedData.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  if (loading) {
    return (
      <div className={cn('rounded-xl border border-border bg-card', className)}>
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
            aria-label="Search table"
          />
        </div>
        {filters}
        {actions}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-foreground',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                  aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  tabIndex={col.sortable ? 0 : undefined}
                  onKeyDown={(e) => e.key === 'Enter' && col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                      ) : <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.map(item => (
              <tr
                key={rowKey(item)}
                className={cn(
                  'border-b border-border last:border-0 transition-colors hover:bg-muted/30',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(item)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => e.key === 'Enter' && onRowClick?.(item)}
              >
                {columns.map(col => (
                  <td key={col.key} className={cn('px-4 py-3 text-sm text-card-foreground', col.className)}>
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden p-4 space-y-3">
        {pagedData.map(item => (
          <div
            key={rowKey(item)}
            className={cn(
              'rounded-lg border border-border p-3 space-y-2',
              onRowClick && 'cursor-pointer hover:bg-muted/30'
            )}
            onClick={() => onRowClick?.(item)}
            tabIndex={onRowClick ? 0 : undefined}
            onKeyDown={(e) => e.key === 'Enter' && onRowClick?.(item)}
          >
            {columns.map(col => (
              <div key={col.key} className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">{col.header}</span>
                <span className="text-sm text-card-foreground text-right">
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pagedData.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription || 'Try adjusting your search or filters.'} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, sortedData.length)} of {sortedData.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm tabular-nums px-2">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
