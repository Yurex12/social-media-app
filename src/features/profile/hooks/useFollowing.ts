import { useQuery } from '@tanstack/react-query';
import { getUserFollowing } from '../api';
import { useEntityStore } from '@/entities/store';
import { normalizeUsers } from '@/entities/utils';

export function useFollowing(username: string) {
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: userIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', 'following', username],
    queryFn: async () => {
      const users = await getUserFollowing(username);
      const { normalizedUsers } = normalizeUsers(users);
      addUsers(normalizedUsers);
      return normalizedUsers.map((user) => user.id);
    },
    enabled: !!username,
  });

  return { userIds, isPending, error };
}
