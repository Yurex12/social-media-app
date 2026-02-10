import { useEntityStore } from '@/entities/store';
import { extractUsersFromComments } from '@/entities/utils';
import { useQuery } from '@tanstack/react-query';
import { getComments } from '../api';

export function useComments(postId: string) {
  const addUsers = useEntityStore((state) => state.addUsers);

  const {
    data: comments,
    isPending,
    error,
  } = useQuery({
    queryKey: ['comments', postId],
    enabled: !!postId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    queryFn: async () => {
      const comments = await getComments(postId);

      const users = extractUsersFromComments(comments);
      addUsers(users);

      return comments;
    },
  });

  return {
    comments,
    isPending,
    error,
  };
}
