import { useEntityStore } from '@/entities/store';
import { extractUsersFromComments } from '@/entities/utils';
import { ActionError } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCommentAction } from '../action';
import { CommentWithRelations } from '../types';

let toastId: string | number;

export function useCreateComment() {
  const queryClient = useQueryClient();
  const addUsers = useEntityStore((state) => state.addUsers);
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

      const newComment = res.data;

      const users = extractUsersFromComments([newComment]);
      addUsers(users);

      const store = useEntityStore.getState();
      const currentPost = store.posts[postId];

      if (currentPost) {
        store.updatePost(postId, {
          commentsCount: currentPost.commentsCount + 1,
        });
      }

      queryClient.setQueryData<CommentWithRelations[]>(
        ['comments', postId],
        (oldComments) => {
          if (!oldComments) return oldComments;
          return [newComment, ...oldComments];
        },
      );
    },

    onError(error: ActionError | Error, { postId }) {
      if ('code' in error && error.code === 'NOT_FOUND') removePost(postId);

      toast.error(error.message || 'Something went wrong', { id: toastId });
    },
  });

  return { createComment, isPending };
}
