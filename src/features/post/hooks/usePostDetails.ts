import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPostById } from '../api';
import { PostWithRelations } from '../types';
import { useParams } from 'next/navigation';

export function usePostDetails() {
  const { id: postId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: post,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', 'details', postId],
    queryFn: () => getPostById(postId),

    initialData: () => {
      const posts = queryClient.getQueryData<PostWithRelations[]>([
        'posts',
        'feed',
        'home',
      ]);
      return posts?.find((post) => post.id === postId);
    },
  });

  return { post, isPending, error };
}
