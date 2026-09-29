'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { LiveDataBridge } from '@/components/layout/live-data-bridge';
import { useRoleStore } from '@/store/role-store';

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLoggedIn = useRoleStore((s) => s.isLoggedIn);

  useEffect(() => {
    // Redirect to login if not "logged in"
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AppLayout>
      <LiveDataBridge />
      {children}
    </AppLayout>
  );
}
