import { useQuery } from '@tanstack/react-query';
import { getSuggestedUsers } from '../api';

export function useSuggestedUsers(limit?: number) {
  const {
    data: users,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', 'suggested', { limit }],
    queryFn: () => getSuggestedUsers(limit),
    staleTime: 5 * 60 * 1000,
  });

  return { users, isPending, error };
}
