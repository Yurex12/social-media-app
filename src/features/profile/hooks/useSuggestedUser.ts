import { useEntityStore } from '@/entities/store';
import { normalizeUsers } from '@/entities/utils';
import { useQuery } from '@tanstack/react-query';
import { getSuggestedUsers } from '../api';

export function useSuggestedUsers(limit?: number) {
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: userIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', 'suggested', { limit }],
    queryFn: async () => {
      const users = await getSuggestedUsers(limit);

      const { normalizedUsers } = normalizeUsers(users);

      addUsers(normalizedUsers);

      return normalizedUsers.map((u) => u.id);
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    userIds,
    isPending,
    error,
  };
}
