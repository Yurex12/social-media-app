import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useEntityStore } from '@/entities/store';
import { deletePostAction } from '../actions';
import { ActionError } from '@/types';

export function useDeletePost() {
  const queryClient = useQueryClient();

  const removePost = useEntityStore((state) => state.removePost);
  const addPost = useEntityStore((state) => state.addPost);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (postId: string) => {
      const res = await deletePostAction(postId);
      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;
      return res;
    },

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const post = useEntityStore.getState().posts[postId];

      if (post) removePost(postId);

      return { post };
    },

    onSuccess: (res) => toast.success(res.message),

    onError: (err: Error | ActionError, postId, context) => {
      const isNotFound = 'code' in err && err.code === 'NOT_FOUND';

      if (!isNotFound && context?.post) addPost(context.post);

      toast.error(err.message || 'Post could not be deleted');
    },
  });

  return { deletePost, isDeleting };
}
