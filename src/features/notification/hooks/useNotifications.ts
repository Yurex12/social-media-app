import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api';

export function useNotifications() {
  const {
    data: notifications,
    isPending,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });
  return {
    notifications,
    isPending,
    error,
  };
}
