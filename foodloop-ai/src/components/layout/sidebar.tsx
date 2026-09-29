'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  ScanSearch,
  Thermometer,
  Repeat,
  MapPin,
  Factory,
  AlertTriangle,
  CalendarDays,
  FileBarChart,
  Heart,
  Navigation,
  Settings,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NAV_ITEMS, NAV_TRANSLATIONS } from '@/lib/constants';
import { useRoleStore } from '@/store/role-store';
import { useSettingsStore } from '@/store/settings-store';

/**
 * Icon lookup – maps the icon name strings from NAV_ITEMS to actual
 * lucide-react components so we can render them dynamically.
 */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  TrendingUp,
  Package,
  ScanSearch,
  Thermometer,
  Repeat,
  MapPin,
  Factory,
  AlertTriangle,
  CalendarDays,
  FileBarChart,
  Heart,
  Navigation,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole } = useRoleStore();
  const { language, sidebarCollapsed, toggleSidebar } = useSettingsStore();

  // Filter navigation items to only those accessible by the current role
  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(currentRole)
  );

  // Resolve a translated label for the current language, fallback to English
  const translate = (label: string): string => {
    const langMap = NAV_TRANSLATIONS[language];
    return langMap?.[label] ?? label;
  };

  return (
    <nav
      aria-label="Main navigation"
      className={`
        flex flex-col h-full
        bg-sidebar text-sidebar-foreground
        border-r border-sidebar-border
        transition-[width] duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* ── Brand / Logo ────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-sidebar-border">
        <Leaf className="size-7 shrink-0 text-primary" aria-hidden="true" />
        <span
          className={`
            font-bold text-lg tracking-tight text-foreground
            transition-opacity duration-200
            ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
          `}
        >
          FoodLoop AI
        </span>
      </div>

      {/* ── Navigation links ────────────────────────────────── */}
      <ul
        role="list"
        className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5"
      >
        {visibleItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const label = translate(item.label);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  group relative flex items-center gap-3 rounded-lg
                  px-3 py-2.5 text-sm font-medium
                  transition-colors duration-150 ease-in-out
                  outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring
                  ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                {/* Active indicator – green bar on left edge */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                  />
                )}

                {Icon && (
                  <Icon
                    className={`size-5 shrink-0 ${
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                    }`}
                  />
                )}

                <span
                  className={`
                    truncate transition-opacity duration-200
                    ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden sr-only' : 'opacity-100'}
                  `}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── Collapse toggle ─────────────────────────────────── */}
      <div className="shrink-0 border-t border-sidebar-border p-2">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            flex items-center justify-center gap-2 w-full
            rounded-lg px-3 py-2
            text-sm font-medium text-muted-foreground
            hover:bg-sidebar-accent/50 hover:text-sidebar-foreground
            transition-colors duration-150
            outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring
          `}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="size-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="size-5 shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
