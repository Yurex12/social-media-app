import { useEntityStore } from '@/entities/store';
import { normalizeComment } from '@/entities/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createCommentAction } from '../action';

const toastId = 'comment-toast';

export function useCreateComment() {
  const queryClient = useQueryClient();
  const addComment = useEntityStore((state) => state.addComment);
  const addUser = useEntityStore((state) => state.addUser);

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: async ({
      content,
      postId,
    }: {
      content: string;
      postId: string;
    }) => {
      toast.loading('Posting your comment...', {
        id: toastId,
        duration: Infinity,
      });

      const res = await createCommentAction(postId, { content });

      if (!res.success) throw new Error(res.message);

      return res;
    },

    onSuccess(res, { postId }) {
      toast.success(res.message, {
        id: toastId,
        duration: 3000,
      });

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

    onError(error) {
      toast.error(error.message, {
        id: toastId,
        duration: 3000,
      });
    },
  });

  return { createComment, isPending };
}
