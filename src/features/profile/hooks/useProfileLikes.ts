import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getUserLikedPosts } from '../api';
import { useEntityStore } from '@/entities/store';
import { normalizePosts } from '@/entities/utils';

export function useProfileLikes() {
  const { username } = useParams<{ username: string }>();

  const addPosts = useEntityStore((state) => state.addPosts);
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: postIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'likes', username],
    queryFn: async () => {
      const posts = await getUserLikedPosts(username);

      const { posts: normalizedPosts, users: normalizedUsers } =
        normalizePosts(posts);

      addPosts(normalizedPosts);
      addUsers(normalizedUsers);

      return normalizedPosts.map((p) => p.id);
    },
    enabled: !!username,
  });

  return { postIds, isPending, error };
}
