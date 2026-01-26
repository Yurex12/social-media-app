import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api';

export function usePosts() {
  const {
    data: posts,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'feed', 'home'],
    queryFn: getPosts,
  });

  return { posts, isPending, error };
}
