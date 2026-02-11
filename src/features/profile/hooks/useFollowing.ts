import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserFollowing } from '../api';
import { useEntityStore } from '@/entities/store';
import { normalizeUsers } from '@/entities/utils';

export function useFollowing(username: string) {
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ['users', 'following', username],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const res = await getUserFollowing(username, pageParam ?? undefined);

      const { normalizedUsers } = normalizeUsers(res.users);
      addUsers(normalizedUsers);

      return {
        userIds: normalizedUsers.map((user) => user.id),
        nextCursor: res.nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!username,
  });

  const userIds = data?.pages.flatMap((page) => page.userIds);

  return {
    userIds,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  };
}
