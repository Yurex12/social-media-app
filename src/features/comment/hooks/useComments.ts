import { useEntityStore } from '@/entities/store';
import { extractUsersFromComments } from '@/entities/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '../api';

export function useComments(postId: string) {
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data,
    isPending,
    error,
    isFetchNextPageError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: null as string | null,
    queryKey: ['comments', postId],
    enabled: !!postId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    queryFn: async ({ pageParam }) => {
      const res = await getComments(postId, pageParam ?? undefined);

      const users = extractUsersFromComments(res.comments);
      addUsers(users);

      return res;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const allComments = data?.pages.flatMap((page) => page.comments);

  return {
    isFetchNextPageError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    comments: allComments,
    isPending,
    error,
  };
}
