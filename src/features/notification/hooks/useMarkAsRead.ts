import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationAsRead } from '../action';
import { NotificationWithRelations } from '../types';

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const { mutate: markAsRead } = useMutation({
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      await queryClient.cancelQueries({
        queryKey: ['notifications', 'unread-count'],
      });

      const previousNotifications = queryClient.getQueryData<
        NotificationWithRelations[]
      >(['notifications']);
      const previousCount = queryClient.getQueryData<number>([
        'notifications',
        'unread-count',
      ]);

      queryClient.setQueryData<NotificationWithRelations[]>(
        ['notifications'],
        (old) => {
          return old?.map((n) => (n.id === id ? { ...n, read: true } : n));
        },
      );

      queryClient.setQueryData<number>(
        ['notifications', 'unread-count'],
        (old = 0) => {
          const wasUnread = previousNotifications?.find(
            (n) => n.id === id && !n.read,
          );
          return wasUnread ? Math.max(0, old - 1) : old;
        },
      );

      return { previousNotifications, previousCount };
    },
    mutationFn: async (id: string) => {
      const res = await markNotificationAsRead(id);
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onError: (err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications'],
          context.previousNotifications,
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          ['notifications', 'unread-count'],
          context.previousCount,
        );
      }
    },
  });

  return { markAsRead };
}
