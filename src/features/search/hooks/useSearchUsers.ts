import { useEntityStore } from '@/entities/store';
import { normalizeUsers } from '@/entities/utils';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../api';

export function useSearchUsers(query: string) {
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: userIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', 'search', query],
    enabled: !!query,
    staleTime: 0,
    gcTime: 0,
    queryFn: async () => {
      const users = await searchUsers(query);
      const { normalizedUsers } = normalizeUsers(users);
      addUsers(normalizedUsers);
      return normalizedUsers.map((u) => u.id);
    },
  });

  return {
    userIds,
    isPending,
    error,
  };
}
