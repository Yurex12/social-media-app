'use client';

import { useEntityStore } from '@/entities/store';
import { extractUsersFromComments } from '@/entities/utils';
import { ActionError } from '@/types';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCommentAction } from '../action';
import { CommentResponse, CommentWithRelations } from '../types';

let toastId: string | number;

export function useCreateComment() {
  const queryClient = useQueryClient();
  const addUsers = useEntityStore((state) => state.addUsers);
  const updatePost = useEntityStore((state) => state.updatePost);
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

      if (!res.success) {
        throw { code: res.error, message: res.message } as ActionError;
      }

      return res;
    },

    onSuccess(res, { postId }) {
      toast.success(res.message, { id: toastId });

      const newComment = res.data as CommentWithRelations;

      const users = extractUsersFromComments([newComment]);
      addUsers(users);

      const currentPost = useEntityStore.getState().posts[postId];
      if (currentPost) {
        updatePost(postId, {
          commentsCount: currentPost.commentsCount + 1,
        });
      }

      queryClient.setQueryData<InfiniteData<CommentResponse>>(
        ['comments', postId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  comments: [newComment, ...page.comments],
                };
              }
              return page;
            }),
          };
        },
      );
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
