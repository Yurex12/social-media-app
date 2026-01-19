import { useQuery } from '@tanstack/react-query';
import { getComments } from '../api';

export function useComments(postId: string) {
  const {
    data: comments,
    isPending,
    error,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });

  return { comments, isPending, error };
}
