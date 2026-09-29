'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useRoleStore } from '@/store/role-store';
import { useNotificationStore } from '@/store/notification-store';
import { ROLES, NAV_ITEMS, NAV_TRANSLATIONS } from '@/lib/constants';
import { useSettingsStore } from '@/store/settings-store';
import { Button } from '@/components/ui/button';
import { AlertItem } from '@/components/shared/alert-item';

/* ─────────────────────────────────────────────────────── */

interface TopbarProps {
  /** Callback to toggle the mobile sidebar overlay */
  onMobileMenuToggle: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { currentRole, currentUser, logout } = useRoleStore();
  const { language } = useSettingsStore();
  const { unreadCount, alerts, markAsRead, markAllAsRead } = useNotificationStore();

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(e.target as Node)
      ) {
        setAvatarMenuOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setAvatarMenuOpen(false);
        setBellOpen(false);
      }
    }
    if (avatarMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [avatarMenuOpen]);

  // ── Breadcrumbs ──────────────────────────────────────
  const buildBreadcrumbs = (): { label: string; href: string }[] => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ label: 'Home', href: '/' }];

    const langMap = NAV_TRANSLATIONS[language] ?? NAV_TRANSLATIONS.en;

    return segments.map((seg, i) => {
      const href = '/' + segments.slice(0, i + 1).join('/');
      // Try to match a NAV_ITEMS label for a friendlier name
      const navItem = NAV_ITEMS.find((n) => n.href === href);
      const rawLabel = navItem ? navItem.label : seg.replace(/-/g, ' ');
      const translated = langMap[rawLabel] ?? rawLabel;
      // Capitalise first letter for raw slugs
      const label = navItem
        ? translated
        : translated.charAt(0).toUpperCase() + translated.slice(1);
      return { label, href };
    });
  };

  const breadcrumbs = buildBreadcrumbs();

  // ── Role badge ───────────────────────────────────────
  const roleConfig = ROLES[currentRole];

  // ── User initials for avatar circle ──────────────────
  const initials = currentUser.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 h-16 px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-sm"
      role="banner"
    >
      {/* ── Mobile hamburger ─────────────────────────────── */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMobileMenuToggle}
        aria-label="Toggle navigation menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* ── Breadcrumbs ──────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {idx > 0 && (
              <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
            )}
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* ── Spacer ───────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Search (decorative) ──────────────────────────── */}
      <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 w-56">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search…"
          disabled
          aria-label="Search (coming soon)"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full cursor-not-allowed"
        />
      </div>

      {/* ── Role badge ───────────────────────────────────── */}
      <span
        className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary"
        aria-label={`Current role: ${roleConfig.label}`}
      >
        {roleConfig.label}
      </span>

      {/* ── Theme toggle ─────────────────────────────────── */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )}
      </Button>

      {/* ── Notification bell ────────────────────────────── */}
      <div className="relative" ref={bellRef}>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          aria-expanded={bellOpen}
          className="relative"
          onClick={() => setBellOpen((v) => !v)}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-4.5 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
        {bellOpen && (
          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-border bg-popover p-2 shadow-lg"
          >
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-sm font-semibold">Alerts</p>
              <button type="button" className="text-xs text-primary" onClick={markAllAsRead}>
                Mark all read
              </button>
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto p-1">
              {alerts.slice(0, 8).map((alert) => (
                <AlertItem key={alert.id} alert={alert} compact onRead={markAsRead} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Avatar dropdown ──────────────────────────────── */}
      <div className="relative" ref={avatarMenuRef}>
        <button
          type="button"
          onClick={() => setAvatarMenuOpen((prev) => !prev)}
          aria-label="User menu"
          aria-expanded={avatarMenuOpen}
          aria-haspopup="true"
          className="flex items-center justify-center size-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold select-none transition-shadow hover:ring-2 hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-ring outline-none"
        >
          {initials}
        </button>

        {/* Dropdown menu */}
        {avatarMenuOpen && (
          <div
            role="menu"
            aria-label="User options"
            className={cn(
              'absolute right-0 mt-2 w-72 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg',
              'animate-in fade-in-0 zoom-in-95 origin-top-right',
              'py-2'
            )}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{currentUser.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{currentUser.organization}</p>
              <span className="inline-flex mt-2 items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {roleConfig.label}
              </span>
            </div>

            {/* Actions */}
            <div className="py-1">
              <Link
                href="/login"
                role="menuitem"
                onClick={() => setAvatarMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="size-4 text-muted-foreground" aria-hidden="true" />
                Switch Role
              </Link>
              <Link
                href="/settings"
                role="menuitem"
                onClick={() => setAvatarMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
                Settings
              </Link>
            </div>

            <div className="border-t border-border py-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  logout();
                  setAvatarMenuOpen(false);
                  router.push('/login');
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
