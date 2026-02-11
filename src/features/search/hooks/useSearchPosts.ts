import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchPosts } from '../api';

export function useSearchPosts(query: string) {
  const addPosts = useEntityStore((state) => state.addPosts);
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data,
    isPending,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ['posts', 'search', query],
    initialPageParam: null as string | null,
    staleTime: 0,
    gcTime: 0,
    enabled: !!query,
    queryFn: async ({ pageParam }) => {
      const res = await searchPosts(query, pageParam ?? undefined);

      const { posts: normalizedPosts, users: normalizedUsers } = normalizePosts(
        res.posts,
      );

      addPosts(normalizedPosts);
      addUsers(normalizedUsers);

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
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  };
}
