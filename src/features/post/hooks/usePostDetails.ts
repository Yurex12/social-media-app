import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getPostById } from '../api';

export function usePostDetails() {
  const { id: postId } = useParams<{ id: string }>();

  const {
    data: post,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPostById(postId),
  });

  return { post, isPending, error };
}
