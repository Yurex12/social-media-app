import { useEntityStore } from '@/entities/store';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getProfile } from '../api';
import { normalizeUser } from '@/entities/utils';

export function useProfile() {
  const { username } = useParams<{ username: string }>();
  const addUser = useEntityStore((state) => state.addUser);

  const userFromStore = useEntityStore((state) => {
    const id = state.usernameToId[username?.toLowerCase()];
    return id ? state.users[id] : undefined;
  });

  const { isPending, error } = useQuery({
    queryKey: ['users', 'profile', username],
    queryFn: async () => {
      const user = await getProfile(username);
      const { normalizedUser } = normalizeUser(user);
      if (user) addUser(normalizedUser);
      return normalizedUser;
    },
    enabled: !!username,
    // staleTime: 30 * 1000,
  });

  return {
    user: userFromStore,
    isPending: isPending && !userFromStore,
    error,
  };
}
