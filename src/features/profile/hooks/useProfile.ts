import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api';

export function useProfile(username: string) {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getProfile(username),
    enabled: !!username,
  });

  return { user, isPending, error };
}
