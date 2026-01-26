import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getUserLikedPosts } from '../api';

export function useProfileLikes() {
  const { username } = useParams<{ username: string }>();
  const {
    data: likedPosts,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'feed', 'likes', username],
    queryFn: () => getUserLikedPosts(username),
    enabled: !!username,
  });

  return { likedPosts, isPending, error };
}
