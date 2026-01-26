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
      const postQueries = queryClient.getQueriesData<
        PostWithRelations[] | PostWithRelations
      >({ queryKey: ['posts'] });

      for (const [_, queryData] of postQueries) {
        if (Array.isArray(queryData)) {
          const post = queryData?.find((post) => post.id === postId);

          if (post) return post;
        }
      }

      return undefined;
    },
  });

  return { post, isPending, error };
}
