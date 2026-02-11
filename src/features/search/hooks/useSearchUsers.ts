import { useEntityStore } from '@/entities/store';
import { normalizeUsers } from '@/entities/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchUsers } from '../api';

export function useSearchUsers(query: string) {
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError: isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ['users', 'search', query],
    enabled: !!query,
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const { users, nextCursor } = await searchUsers({
        query,
        cursor: pageParam ?? undefined,
      });

      const { normalizedUsers } = normalizeUsers(users);
      addUsers(normalizedUsers);

      return {
        userIds: normalizedUsers.map((u) => u.id),
        nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const userIds = data?.pages.flatMap((page) => page.userIds);

  return {
    userIds,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetchNextPageError,
  };
}
