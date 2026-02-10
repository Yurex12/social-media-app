import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationWithRelations } from '../types';
import { markAllNotificationsAsRead } from '../action';

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  const { mutate: markAllAsRead, isPending } = useMutation({
    onMutate: async () => {
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
          return old?.map((n) => ({ ...n, read: true }));
        },
      );

      queryClient.setQueryData<number>(['notifications', 'unread-count'], 0);

      return { previousNotifications, previousCount };
    },
    mutationFn: markAllNotificationsAsRead,
    onError: (err, _, context) => {
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

  return { markAllAsRead, isPending };
}
