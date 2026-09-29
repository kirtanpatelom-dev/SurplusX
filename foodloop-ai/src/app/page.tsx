'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleStore } from '@/store/role-store';

export default function HomePage() {
  const router = useRouter();
  const isLoggedIn = useRoleStore((s) => s.isLoggedIn);

  useEffect(() => {
    // If already logged in, go to dashboard; otherwise go to landing page
    if (isLoggedIn) {
      router.replace('/dashboard');
    } else {
      router.replace('/landing');
    }
  }, [isLoggedIn, router]);

  // Show nothing while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}
