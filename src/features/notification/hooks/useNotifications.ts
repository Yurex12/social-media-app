import { useEntityStore } from '@/entities/store';
import { normalizeNotifications } from '@/entities/utils';
import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api';

export function useNotifications() {
  const addNotifications = useEntityStore((state) => state.addNotifications);
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: notificationIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    // staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const notifications = await getNotifications();

      const { notifications: normalizedNotifications, users: normalizedUsers } =
        normalizeNotifications(notifications);

      console.log(normalizedUsers);

      addNotifications(normalizedNotifications);
      addUsers(normalizedUsers);

      return normalizedNotifications.map((n) => n.id);
    },
  });

  return {
    notificationIds,
    isPending,
    error,
  };
}
