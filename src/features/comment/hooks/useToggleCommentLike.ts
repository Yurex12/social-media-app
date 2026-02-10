import { ActionError } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleCommentLikeAction } from '../action';
import { CommentWithRelations } from '../types';

export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  const { mutate: toggleCommentLike } = useMutation({
    mutationFn: async ({
      commentId,
    }: {
      commentId: string;
      postId: string;
    }) => {
      const res = await toggleCommentLikeAction(commentId);
      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;
      return res;
    },

    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      const previousComments = queryClient.getQueryData<CommentWithRelations[]>(
        ['comments', postId],
      );

      if (!previousComments) return;

      queryClient.setQueryData<CommentWithRelations[]>(
        ['comments', postId],
        (oldComments) => {
          if (!oldComments) return oldComments;
          return oldComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked: !comment.isLiked,
                  likesCount: comment.isLiked
                    ? comment.likesCount - 1
                    : comment.likesCount + 1,
                }
              : comment,
          );
        },
      );

      return { previousComments };
    },

    onError: (error: Error | ActionError, { commentId, postId }, context) => {
      if ('code' in error && error.code === 'NOT_FOUND') {
        queryClient.setQueryData<CommentWithRelations[]>(
          ['comments', postId],
          (oldComments) => {
            if (!oldComments) return oldComments;
            return oldComments.filter((c) => c.id !== commentId);
          },
        );
        toast.info('This comment no longer exists');
        return;
      }

      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', postId],
          context.previousComments,
        );
      }
    },
  });

  return { toggleCommentLike };
}
