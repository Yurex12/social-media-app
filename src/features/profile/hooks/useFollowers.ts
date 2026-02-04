import { useQuery } from '@tanstack/react-query';
import { getUserFollowers } from '../api';
import { useEntityStore } from '@/entities/store';
import { normalizeUsers } from '@/entities/utils';

export function useFollowers(username: string) {
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: userIds,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['users', 'followers', username],
    queryFn: async () => {
      const users = await getUserFollowers(username);
      const { normalizedUsers } = normalizeUsers(users);
      addUsers(normalizedUsers);

      return normalizedUsers.map((user) => user.id);
    },
    enabled: !!username,
  });

  return { userIds, isPending, isError, error };
}
