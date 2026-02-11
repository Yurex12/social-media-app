'use client';

import { ActionError } from '@/types';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleCommentLikeAction } from '../action';
import { CommentResponse } from '../types';

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

      const previousComments = queryClient.getQueryData<
        InfiniteData<CommentResponse>
      >(['comments', postId]);

      if (!previousComments) return;

      queryClient.setQueryData<InfiniteData<CommentResponse>>(
        ['comments', postId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              comments: page.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      isLiked: !comment.isLiked,
                      likesCount: comment.isLiked
                        ? comment.likesCount - 1
                        : comment.likesCount + 1,
                    }
                  : comment,
              ),
            })),
          };
        },
      );

      return { previousComments };
    },

    onError: (error: Error | ActionError, { commentId, postId }, context) => {
      if ('code' in error && error.code === 'NOT_FOUND') {
        queryClient.setQueryData<InfiniteData<CommentResponse>>(
          ['comments', postId],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                comments: page.comments.filter((c) => c.id !== commentId),
              })),
            };
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

      toast.error(error.message || 'Failed to update like');
    },
  });

  return { toggleCommentLike };
}
