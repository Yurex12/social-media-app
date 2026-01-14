import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { deletePostAction } from '../actions';
import { PostWithRelations } from '../types';

export function useDeletePost() {
  const queryClient = useQueryClient();
  const {
    mutate: deletePost,
    isPending: isDeleting,
    error,
  } = useMutation({
    mutationFn: deletePostAction,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['post'] });

      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData<PostWithRelations[]>(['posts'], (oldPosts) => {
        return oldPosts?.filter((post) => post.id !== postId) ?? [];
      });

      return { previousPosts };
    },

    onSuccess() {
      toast.success('Post deleted successfully');
    },

    onError(err, postId, context) {
      queryClient.setQueryData(['posts'], context?.previousPosts);
      toast.error(err.message || 'Post could not be deleted');
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
  return { deletePost, isDeleting, error };
}
