import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api';
import { useParams } from 'next/navigation';

export function useProfile() {
  const { username } = useParams<{ username: string }>();
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', username],
    queryFn: () => getProfile(username),
    enabled: !!username,
  });

  return { user, isPending, error };
}
