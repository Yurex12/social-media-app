import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useEntityStore } from '@/entities/store';
import { deletePostAction } from '../actions';

export function useDeletePost() {
  const queryClient = useQueryClient();

  const removePost = useEntityStore((state) => state.removePost);
  const addPost = useEntityStore((state) => state.addPost);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: deletePostAction,

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const post = useEntityStore.getState().posts[postId];

      if (post) removePost(postId);

      return { post };
    },

    onSuccess: (res, postId, context) => {
      if (!res.success) {
        if (res.error !== 'NOT_FOUND' && context?.post) {
          addPost(context.post);
        }
        toast.error(res.message);
        return;
      }

      toast.success('Post deleted successfully');
    },

    onError: (error, _, context) => {
      if (context?.post) addPost(context.post);
      toast.error(error.message || 'Could not delete post');
    },
  });

  return { deletePost, isDeleting };
}
