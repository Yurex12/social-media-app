'use client';

import { useEntityStore } from '@/entities/store';
import { ActionError } from '@/types';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteCommentAction } from '../action';
import { CommentResponse } from '../types';

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

      const previousComments = queryClient.getQueryData<
        InfiniteData<CommentResponse>
      >(['comments', postId]);

      const post = useEntityStore.getState().posts[postId];

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

      if (post) {
        updatePost(postId, {
          commentsCount: Math.max(0, post.commentsCount - 1),
        });
      }

      return { previousComments, previousCommentsCount: post?.commentsCount };
    },

    onSuccess: (res) => {
      toast.success(res.message);
    },

    onError: (error: Error | ActionError, { postId }, context) => {
      // Rollback cache
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', postId],
          context.previousComments,
        );
      }

      if (context?.previousCommentsCount) {
        updatePost(postId, { commentsCount: context.previousCommentsCount });
      }

      if ('code' in error && error.code === 'NOT_FOUND') {
        toast.error('Comment already deleted');
        return;
      }

      toast.error(error.message || 'Could not delete comment');
    },
  });

  return { deleteComment, isPending };
}
