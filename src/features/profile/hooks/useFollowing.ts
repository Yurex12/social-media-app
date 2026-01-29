import { useQuery } from '@tanstack/react-query';
import { getUserFollowing } from '../api';

export function useFollowing(username: string) {
  const {
    data: users,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', 'following', username],
    queryFn: () => getUserFollowing(username),
    enabled: !!username,
  });

  return { users, isPending, error };
}
