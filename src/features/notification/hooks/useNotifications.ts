import { useInfiniteQuery } from '@tanstack/react-query';
import { getNotifications } from '../api';

export function useNotifications() {
  const {
    data,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError: isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => getNotifications(pageParam ?? undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const notifications = data?.pages.flatMap((page) => page.notifications);

  return {
    notifications,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetchNextPageError,
  };
}
