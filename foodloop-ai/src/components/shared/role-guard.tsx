'use client';

import { NAV_ITEMS } from '@/lib/constants';
import { useRoleStore } from '@/store/role-store';
import type { UserRole } from '@/types';
import { ShieldOff } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function RoleGuard({ href, children }: { href: string; children: React.ReactNode }) {
  const role = useRoleStore((s) => s.currentRole);
  const item = NAV_ITEMS.find((n) => n.href === href);
  const allowed = (item?.roles as readonly UserRole[] | undefined)?.includes(role) ?? true;
  if (allowed) return <>{children}</>;
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
      <ShieldOff className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden />
      <h1 className="text-lg font-semibold">This module is not in your demo role</h1>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Switch role from the avatar menu, or return to the dashboard.
      </p>
      <Link href="/dashboard" className={cn(buttonVariants(), 'mt-4')}>
        Go to dashboard
      </Link>
    </div>
  );
}
