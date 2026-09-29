'use client';

import { PageHeader, RoleGuard } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { LANGUAGES } from '@/lib/constants';
import { useRoleStore } from '@/store/role-store';
import { useSettingsStore } from '@/store/settings-store';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function SettingsPage() {
  const { currentUser } = useRoleStore();
  const { language, setLanguage, notifications, updateNotificationPrefs } = useSettingsStore();
  const { theme, setTheme } = useTheme();

  return (
    <RoleGuard href="/settings">
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title="Notifications and settings" description="Demo profile, alert toggles, English / Hindi / Gujarati nav labels, and theme." />
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Profile</h2>
          <p className="mt-2 text-sm">{currentUser.name}</p>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
          <p className="text-sm text-muted-foreground">{currentUser.organization}</p>
          <Link href="/login" className="mt-3 inline-block text-sm text-primary">
            Switch demo role
          </Link>
        </section>
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Language (nav labels only)</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Button key={l.code} size="sm" variant={language === l.code ? 'default' : 'outline'} onClick={() => setLanguage(l.code)}>
                {l.nativeLabel}
              </Button>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Theme</h2>
          <div className="mt-3 flex gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <Button key={t} size="sm" variant={theme === t ? 'default' : 'outline'} onClick={() => setTheme(t)}>
                {t}
              </Button>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Alert preferences</h2>
          <ul className="mt-3 space-y-3">
            {(
              [
                ['expiryAlerts', 'Expiry alerts'],
                ['temperatureAlerts', 'Temperature alerts'],
                ['surplusMatches', 'Surplus matches'],
                ['deliveryUpdates', 'Delivery updates'],
                ['machineAlerts', 'Machine alerts'],
                ['dailyDigest', 'Daily digest'],
                ['emailNotifications', 'Email'],
                ['smsNotifications', 'SMS'],
              ] as const
            ).map(([key, label]) => (
              <li key={key} className="flex items-center justify-between gap-3 text-sm">
                <span>{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications[key]}
                  className={`h-6 w-10 rounded-full ${notifications[key] ? 'bg-primary' : 'bg-muted'}`}
                  onClick={() => updateNotificationPrefs({ [key]: !notifications[key] })}
                >
                  <span className={`block h-5 w-5 rounded-full bg-background transition ${notifications[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </RoleGuard>
  );
}
