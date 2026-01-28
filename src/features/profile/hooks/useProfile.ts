import { PostWithRelations } from '@/features/post/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getProfile } from '../api';
import { UserWithRelations } from '../types';

export function useProfile() {
  const { username } = useParams<{ username: string }>();
  const queryClient = useQueryClient();
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ['users', 'profile', username],
    queryFn: () => getProfile(username),
    enabled: !!username,
    staleTime: 30 * 1000,
    initialData: () => {
      const lowerUsername = username.toLowerCase();

      // Check Search Results
      const searchQueries = queryClient.getQueriesData<UserWithRelations[]>({
        queryKey: ['users', 'search'],
      });
      for (const [_, users] of searchQueries) {
        const found = users?.find(
          (user) => user.username.toLowerCase() === lowerUsername,
        );
        if (found) return found;
      }

      // Check "Suggested Users"
      const suggestedQueries = queryClient.getQueriesData<UserWithRelations[]>({
        queryKey: ['users', 'suggested'],
      });

      for (const [_, users] of suggestedQueries) {
        if (Array.isArray(users)) {
          const found = users.find(
            (user) => user.username.toLowerCase() === lowerUsername,
          );
          if (found) return found;
        }
      }

      // Check Post Details first (If they just clicked into a post)
      const postDetailQueries = queryClient.getQueriesData<PostWithRelations>({
        queryKey: ['posts', 'details'],
      });

      for (const [_, post] of postDetailQueries) {
        if (post?.user?.username.toLowerCase() === lowerUsername) {
          return post.user;
        }
      }

      // Fallback to Home/Bookmark Feeds (If they clicked directly from the feed)
      const postQueries = queryClient.getQueriesData<PostWithRelations[]>({
        queryKey: ['posts', 'feed'],
      });

      for (const [_, posts] of postQueries) {
        if (Array.isArray(posts)) {
          const post = posts.find(
            (p) => p.user.username.toLowerCase() === lowerUsername,
          );
          if (post) return post.user;
        }
      }

      return undefined;
    },
  });

  return { user, isPending, error };
}
