import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '../api';

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
  });
}
