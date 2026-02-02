import { useQuery } from '@tanstack/react-query';
import { getBookmarks } from '../api';
import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';

export function useBookmarks() {
  const addPosts = useEntityStore((state) => state.addPosts);
  const addUsers = useEntityStore((state) => state.addUsers);
  const {
    data: bookmarkIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'bookmarks'],
    queryFn: async () => {
      const bookmarks = await getBookmarks();

      const { posts: normalizedPosts, users: normalizedUsers } =
        normalizePosts(bookmarks);

      addPosts(normalizedPosts);
      addUsers(normalizedUsers);

      return normalizedPosts.map((p) => p.id);
    },
  });

  return { bookmarkIds, isPending, error };
}
