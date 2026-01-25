import { useQuery } from '@tanstack/react-query';
import { getUserLikedPosts } from '../api';
import { useParams } from 'next/navigation';

export function useProfileLikes() {
  const { username } = useParams<{ username: string }>();
  const {
    data: likedPosts,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'likes', username],
    queryFn: () => getUserLikedPosts(username),
    enabled: !!username,
  });

  return { likedPosts, isPending, error };
}
