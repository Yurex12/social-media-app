import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';
import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '../api';

export function useSearchPosts(query: string) {
  const addPosts = useEntityStore((state) => state.addPosts);
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: postIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'search', query],
    staleTime: 0,
    gcTime: 0,
    enabled: !!query,
    queryFn: async () => {
      const posts = await searchPosts(query);

      const { posts: normalizedPosts, users: normalizedUsers } =
        normalizePosts(posts);

      addPosts(normalizedPosts);
      addUsers(normalizedUsers);

      return normalizedPosts.map((p) => p.id);
    },
  });

  return {
    postIds,
    isPending,
    error,
  };
}
