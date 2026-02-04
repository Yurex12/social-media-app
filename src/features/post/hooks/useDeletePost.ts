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
      const oldPosts = queryClient.getQueryData(['posts', 'home']);

      if (post) removePost(postId);

      queryClient.setQueryData<string[]>(['posts', 'home'], (oldIds) =>
        oldIds?.filter((id) => id !== postId),
      );

      return { post, oldPosts };
    },

    onSuccess: () => {
      toast.success('Post deleted successfully');
    },

    onError: (error, _, context) => {
      if (context?.post) addPost(context.post);
      if (context?.oldPosts)
        queryClient.setQueryData(['posts', 'home'], context.oldPosts);
      toast.error(error.message || 'Could not delete post');
    },
  });

  return { deletePost, isDeleting };
}
