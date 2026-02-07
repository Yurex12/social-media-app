import { useQuery } from '@tanstack/react-query';
import { getComments } from '../api';
import { useEntityStore } from '@/entities/store';
import { normalizeComments } from '@/entities/utils';

export function useComments(postId: string) {
  const addComments = useEntityStore((state) => state.addComments);
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: commentIds,
    isPending,
    error,
  } = useQuery({
    queryKey: ['comments', postId],
    enabled: !!postId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    queryFn: async () => {
      const comments = await getComments(postId);

      const { normalizedComments, normalizedUsers } =
        normalizeComments(comments);

      addComments(normalizedComments);
      addUsers(normalizedUsers);

      return normalizedComments.map((c) => c.id);
    },
  });

  return {
    commentIds,
    isPending,
    error,
  };
}
