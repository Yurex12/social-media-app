import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api';
import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';

export function usePosts() {
  const addPosts = useEntityStore((state) => state.addPosts);
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: postIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'home'],
    // staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const posts = await getPosts();

      const { posts: normalizedPosts, users: normalizedUsers } =
        normalizePosts(posts);

      console.log(normalizedUsers);

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
