import { useQuery } from '@tanstack/react-query';
import { getUserPosts } from '../api';
import { useParams } from 'next/navigation';
import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';

export function useProfilePosts() {
  const { username } = useParams<{ username: string }>();

  const addPosts = useEntityStore((state) => state.addPosts);
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: postIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'users', username],
    queryFn: async () => {
      const posts = await getUserPosts(username);

      const { posts: normalizedPosts, users: normalizedUsers } =
        normalizePosts(posts);

      addPosts(normalizedPosts);
      addUsers(normalizedUsers);

      return normalizedPosts.map((p) => p.id);
    },
    enabled: !!username,
  });

  return { postIds, isPending, error };
}
