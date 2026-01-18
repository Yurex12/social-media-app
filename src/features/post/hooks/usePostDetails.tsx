import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPostById } from '../api';
import { PostWithRelations } from '../types';

export function usePostDetail(postId: string) {
  const queryClient = useQueryClient();

  const {
    data: post,
    isPending,
    error,
  } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPostById(postId),

    initialData: () => {
      const posts = queryClient.getQueryData<PostWithRelations[]>(['posts']);
      return posts?.find((post) => post.id === postId);
    },
  });

  return { post, isPending, error };
}
