import { NotificationEntity } from './notificationEntity';

type NotificationState = { notifications: Record<string, NotificationEntity> };

export const selectNotificationById = (
  state: NotificationState,
  notificationId: string | undefined,
) => (notificationId ? state.notifications[notificationId] : undefined);

export const selectNotificationsByIds = (
  state: NotificationState,
  notificationIds: string[] | undefined,
) =>
  notificationIds
    ? notificationIds.map((id) => state.notifications[id]).filter(Boolean)
    : [];
