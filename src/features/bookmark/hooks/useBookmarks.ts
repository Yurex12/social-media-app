import { useQuery } from '@tanstack/react-query';
import { getBookmarks } from '../api';

export function useBookmarks() {
  const {
    data: bookmarks,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'feed', 'bookmarks'],
    queryFn: getBookmarks,
  });

  return { bookmarks, isPending, error };
}
