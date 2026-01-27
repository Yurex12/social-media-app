import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '../api';

export function useSearchPosts(query: string) {
  const {
    data: posts,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'search', query],
    queryFn: () => searchPosts(query),
    enabled: !!query,
  });
  return { posts, isPending, error };
}
