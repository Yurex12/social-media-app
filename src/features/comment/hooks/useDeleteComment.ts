import { useEntityStore } from '@/entities/store';
import { ActionError } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteCommentAction } from '../action';
import { CommentWithRelations } from '../types';

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const updatePost = useEntityStore((state) => state.updatePost);

  const { mutate: deleteComment, isPending } = useMutation({
    mutationFn: async ({
      commentId,
    }: {
      commentId: string;
      postId: string;
    }) => {
      const res = await deleteCommentAction(commentId);
      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;
      return res;
    },

    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      const previousComments = queryClient.getQueryData<CommentWithRelations[]>(
        ['comments', postId],
      );

      if (!previousComments) return;

      const comment = previousComments.find((c) => c.id === commentId);
      if (!comment) return;

      queryClient.setQueryData<CommentWithRelations[]>(
        ['comments', postId],
        (oldComments) => {
          if (!oldComments) return oldComments;
          return oldComments.filter((c) => c.id !== commentId);
        },
      );

      const post = useEntityStore.getState().posts[postId];
      if (post) {
        updatePost(postId, { commentsCount: post.commentsCount - 1 });
      }

      return { previousComments, previousCommentsCount: post?.commentsCount };
    },

    onSuccess: (res) => {
      toast.success(res.message);
    },

    onError: (error: Error | ActionError, { postId }, context) => {
      if ('code' in error && error.code === 'NOT_FOUND') {
        toast.error(error.message || 'Could not delete comment');
        return;
      }

      // Rollback
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', postId],
          context.previousComments,
        );
      }
      if (context?.previousCommentsCount !== undefined) {
        updatePost(postId, { commentsCount: context.previousCommentsCount });
      }

      toast.error(error.message || 'Could not delete comment');
    },
  });

  return { deleteComment, isPending };
}
