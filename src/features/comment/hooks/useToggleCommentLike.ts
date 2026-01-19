import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleCommentLikeAction } from '../action';
import { CommentWithRelations } from '../types';

export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  const { mutate: toggleCommentLike } = useMutation({
    mutationFn: toggleCommentLikeAction,

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ['comments'] });

      const previousPosts = queryClient.getQueryData<CommentWithRelations[]>([
        'comments',
      ]);

      queryClient.setQueryData<CommentWithRelations[]>(
        ['comments'],
        (oldComments) => {
          return (
            oldComments?.map((comment) => {
              if (comment.id === commentId) {
                const isLiked = !comment.isLiked;
                return {
                  ...comment,
                  isLiked,
                  likesCount: isLiked
                    ? (comment.likesCount ?? 0) + 1
                    : Math.max(0, (comment.likesCount ?? 0) - 1),
                };
              }
              return comment;
            }) ?? []
          );
        },
      );

      return { previousPosts };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(['comments'], context?.previousPosts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  return { toggleCommentLike };
}
