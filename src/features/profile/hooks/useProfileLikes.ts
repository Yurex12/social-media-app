import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getUserLikedPosts } from '../api';
import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';

export function useProfileLikes() {
  const { username } = useParams<{ username: string }>();
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
    queryKey: ['posts', 'likes', username],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const res = await getUserLikedPosts(username, pageParam ?? undefined);

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
    enabled: !!username,
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
