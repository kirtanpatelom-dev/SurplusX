'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useSettingsStore } from '@/store/settings-store';
import { cn } from '@/lib/utils';

/**
 * AppLayout – root shell that combines the sidebar, topbar, and main content
 * area. Manages mobile sidebar overlay state and responsive transitions.
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarCollapsed } = useSettingsStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Mobile overlay backdrop ─────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed lg:relative z-50 h-full transition-all duration-300 ease-in-out',
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
        aria-label="Application sidebar"
      >
        <Sidebar />
      </aside>

      {/* ── Main area (topbar + content) ────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />

        <main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          id="main-content"
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
