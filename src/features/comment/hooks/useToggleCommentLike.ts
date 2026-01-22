import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleCommentLikeAction } from '../action';
import { CommentWithRelations } from '../types';

export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  const { mutate: toggleCommentLike } = useMutation({
    mutationFn: toggleCommentLikeAction,

    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      const previousPosts = queryClient.getQueryData<CommentWithRelations[]>([
        'comments',
        postId,
      ]);

      queryClient.setQueryData<CommentWithRelations[]>(
        ['comments', postId],
        (oldComments) => {
          return oldComments?.map((comment) => {
            if (comment.id === commentId) {
              const isLiked = !comment.isLiked;
              return {
                ...comment,
                isLiked,
                likeCount: isLiked
                  ? comment.likeCount + 1
                  : Math.max(0, comment.likeCount - 1),
              };
            }
            return comment;
          });
        },
      );

      return { previousPosts };
    },

    onError: (err, { postId }, context) => {
      queryClient.setQueryData(['comments', postId], context?.previousPosts);
    },

    onSettled: (data, error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  return { toggleCommentLike };
}
