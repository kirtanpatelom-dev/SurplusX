import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationPreferences } from '@/types';

type Language = 'en' | 'hi' | 'gu';
type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  language: Language;
  theme: Theme;
  sidebarCollapsed: boolean;
  notifications: NotificationPreferences;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updateNotificationPrefs: (prefs: Partial<NotificationPreferences>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'system',
      sidebarCollapsed: false,
      notifications: {
        expiryAlerts: true,
        temperatureAlerts: true,
        surplusMatches: true,
        deliveryUpdates: true,
        machineAlerts: true,
        dailyDigest: true,
        emailNotifications: true,
        smsNotifications: false,
      },

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      updateNotificationPrefs: (prefs) =>
        set((state) => ({
          notifications: { ...state.notifications, ...prefs },
        })),
    }),
    {
      name: 'surplusx-settings',
    }
  )
);
