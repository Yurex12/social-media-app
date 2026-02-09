import { useEntityStore } from '@/entities/store';
import { normalizeComment } from '@/entities/utils';
import { ActionError } from '@/features/post/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCommentAction } from '../action';

let toastId: string | number;

export function useCreateComment() {
  const queryClient = useQueryClient();
  const addComment = useEntityStore((state) => state.addComment);
  const addUser = useEntityStore((state) => state.addUser);
  const removePost = useEntityStore((state) => state.removePost);

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: async ({
      content,
      postId,
    }: {
      content: string;
      postId: string;
    }) => {
      toastId = toast.loading('Posting your comment...');

      const res = await createCommentAction(postId, { content });

      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;

      return res;
    },

    onSuccess(res, { postId }) {
      toast.success(res.message, { id: toastId });

      const { comment: normalizedComment, user: normalizedUser } =
        normalizeComment(res.data);

      addComment(normalizedComment);
      addUser(normalizedUser);

      const store = useEntityStore.getState();
      const currentPost = store.posts[postId];

      if (currentPost) {
        store.updatePost(postId, {
          commentsCount: currentPost.commentsCount + 1,
        });
      }

      queryClient.setQueryData<string[]>(['comments', postId], (oldIds) => {
        if (!oldIds) return [normalizedComment.id];
        return [normalizedComment.id, ...oldIds];
      });
    },

    onError(error: ActionError | Error, { postId }) {
      if ('code' in error && error.code === 'NOT_FOUND') {
        removePost(postId);
      }
      toast.error(error.message || 'Something went wrong', { id: toastId });
    },
  });

  return { createComment, isPending };
}
