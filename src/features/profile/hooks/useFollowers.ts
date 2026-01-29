import { useQuery } from '@tanstack/react-query';
import { getUserFollowers } from '../api';

export function useFollowers(username: string) {
  const {
    data: users,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', 'followers', username],
    queryFn: () => getUserFollowers(username),
    enabled: !!username,
  });

  return { users, isPending, error };
}
