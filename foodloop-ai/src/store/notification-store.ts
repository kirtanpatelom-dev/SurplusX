import { create } from 'zustand';
import type { Alert } from '@/types';

interface NotificationState {
  /** All alerts */
  alerts: Alert[];
  /** Count of unread alerts */
  unreadCount: number;
  /** Set all alerts */
  setAlerts: (alerts: Alert[]) => void;
  /** Add a new alert */
  addAlert: (alert: Alert) => void;
  /** Mark an alert as read */
  markAsRead: (id: string) => void;
  /** Mark all alerts as read */
  markAllAsRead: () => void;
  /** Remove an alert */
  removeAlert: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  alerts: [],
  unreadCount: 0,

  setAlerts: (alerts) =>
    set({
      alerts,
      unreadCount: alerts.filter((a) => !a.isRead).length,
    }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      unreadCount: state.unreadCount + (alert.isRead ? 0 : 1),
    })),

  markAsRead: (id) =>
    set((state) => {
      const alerts = state.alerts.map((a) =>
        a.id === id ? { ...a, isRead: true } : a
      );
      return {
        alerts,
        unreadCount: alerts.filter((a) => !a.isRead).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, isRead: true })),
      unreadCount: 0,
    })),

  removeAlert: (id) =>
    set((state) => {
      const alerts = state.alerts.filter((a) => a.id !== id);
      return {
        alerts,
        unreadCount: alerts.filter((a) => !a.isRead).length,
      };
    }),
}));
