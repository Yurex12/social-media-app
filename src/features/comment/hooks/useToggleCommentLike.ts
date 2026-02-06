import { useEntityStore } from '@/entities/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleCommentLikeAction } from '../action';
import toast from 'react-hot-toast';

export function useToggleCommentLike() {
  const queryClient = useQueryClient();
  const updateComment = useEntityStore((state) => state.updateComment);
  const removeComment = useEntityStore((state) => state.removeComment);

  const { mutate: toggleCommentLike } = useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      toggleCommentLikeAction(commentId),

    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      const comment = useEntityStore.getState().comments[commentId];
      if (!comment) return;

      const previousComment = { ...comment };

      const isLiked = !comment.isLiked;
      updateComment(commentId, {
        isLiked,
        likesCount: isLiked
          ? comment.likesCount + 1
          : Math.max(0, comment.likesCount - 1),
      });

      return { previousComment };
    },

    onSuccess: (res, { commentId }) => {
      if (!res.success) {
        if (res.error === 'NOT_FOUND') removeComment(commentId);

        toast.error(res.message);
      }
    },

    onError: (err, { commentId }, context) => {
      if (context?.previousComment)
        updateComment(commentId, context.previousComment);

      toast.error(err.message || 'something went wrong');
    },
  });

  return { toggleCommentLike };
}
