import { useInfiniteQuery } from '@tanstack/react-query';
import { getBookmarks } from '../api'; // Ensure this API accepts (cursor)
import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';

export function useBookmarks() {
  const addPosts = useEntityStore((state) => state.addPosts);
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ['posts', 'bookmarks'],
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const res = await getBookmarks(pageParam ?? undefined);

      const { posts, users } = normalizePosts(res.posts);

      addPosts(posts);
      addUsers(users);

      return {
        postIds: res.posts.map((p) => p.id),
        nextCursor: res.nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const allPostIds = data?.pages.flatMap((page) => page.postIds);

  return {
    postIds: allPostIds,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  };
}
