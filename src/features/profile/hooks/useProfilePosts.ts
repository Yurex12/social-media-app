import { useQuery } from '@tanstack/react-query';
import { getUserPosts } from '../api';
import { useParams } from 'next/navigation';

export function useProfilePosts() {
  const { username } = useParams<{ username: string }>();
  const {
    data: posts,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'feed', 'user', username],
    queryFn: () => getUserPosts(username),
    enabled: !!username,
  });

  return { posts, isPending, error };
}
