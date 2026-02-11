import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../api';

export function usePosts() {
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
    queryKey: ['posts', 'home'],
    initialPageParam: null as string | null,
    // staleTime: 1000 * 60 * 5,
    queryFn: async ({ pageParam }) => {
      const res = await getPosts(pageParam ?? undefined);

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
