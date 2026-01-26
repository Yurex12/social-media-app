import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { deletePostAction } from '../actions';
import { PostWithRelations } from '../types';

export function useDeletePost() {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: deletePostAction,

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const snapshots = queryClient.getQueriesData<
        PostWithRelations[] | PostWithRelations
      >({ queryKey: ['posts'] });

      snapshots.forEach(([queryKey]) => {
        queryClient.setQueryData<PostWithRelations[] | PostWithRelations>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;

            if (Array.isArray(oldData)) {
              return oldData.filter((post) => post.id !== postId);
            }

            if (oldData.id === postId) {
              return undefined;
            }

            return oldData;
          },
        );
      });

      return { snapshots };
    },

    onSuccess: () => {
      toast.success('Post deleted successfully');
    },

    onError: (error, _, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(error.message || 'Could not delete post');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'], type: 'active' });
    },
  });

  return { deletePost, isDeleting };
}
