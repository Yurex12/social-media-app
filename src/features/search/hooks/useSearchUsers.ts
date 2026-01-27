import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../api';

export function useSearchUsers(query: string) {
  const {
    data: users,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query),
    enabled: !!query,
  });
  return { users, isPending, error };
}
