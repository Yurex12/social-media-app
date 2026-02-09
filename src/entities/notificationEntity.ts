import { NotificationType } from '@/generated/prisma/enums';
import { StateCreator } from 'zustand';

export interface NotificationEntity {
  id: string;
  recipientId: string;
  issuerId: string;
  type: NotificationType;
  postId: string | null;
  commentId: string | null;
  read: boolean;
  createdAt: Date;
}

export interface NotificationEntitySlice {
  notifications: Record<string, NotificationEntity>;

  addNotification: (notification: NotificationEntity) => void;
  addNotifications: (notifications: NotificationEntity[]) => void;
  updateNotification: (
    id: string,
    updates: Partial<NotificationEntity>,
  ) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const notificationEntitySlice: StateCreator<NotificationEntitySlice> = (
  set,
) => ({
  notifications: {},

  addNotification: (notification) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [notification.id]: notification,
      },
    })),

  addNotifications: (notifications) =>
    set((state) => {
      const next = { ...state.notifications };
      notifications.forEach((n) => {
        next[n.id] = n;
      });
      return { notifications: next };
    }),

  updateNotification: (id, updates) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [id]: state.notifications[id]
          ? { ...state.notifications[id], ...updates }
          : state.notifications[id],
      },
    })),

  markAllAsRead: () =>
    set((state) => {
      const next = { ...state.notifications };
      Object.keys(next).forEach((id) => {
        next[id] = { ...next[id], read: true };
      });
      return { notifications: next };
    }),

  removeNotification: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.notifications;
      return { notifications: rest };
    }),
});
