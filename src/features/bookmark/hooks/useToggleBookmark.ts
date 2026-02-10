import { useEntityStore } from '@/entities/store';
import { ActionError } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleBookmarkAction } from '../action';

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const updatePost = useEntityStore((state) => state.updatePost);
  const removePost = useEntityStore((state) => state.removePost);

  const { mutate: toggleBookmark, isPending: isToggling } = useMutation({
    mutationFn: async (postId: string) => {
      const res = await toggleBookmarkAction(postId);
      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;
      return res;
    },

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const prevBookmarkIds = queryClient.getQueryData<string[]>([
        'posts',
        'bookmarks',
      ]);
      const post = useEntityStore.getState().posts[postId];
      if (!post) return;

      const previousPost = { ...post };

      // Update entity
      const newBookmarkState = !post.isBookmarked;
      updatePost(postId, { isBookmarked: newBookmarkState });

      // Update cache
      queryClient.setQueryData<string[]>(
        ['posts', 'bookmarks'],
        (oldBookmarkIds) => {
          if (!oldBookmarkIds) return oldBookmarkIds;
          if (newBookmarkState) return [postId, ...oldBookmarkIds];
          else return oldBookmarkIds.filter((id) => id !== postId);
        },
      );

      return { previousPost, prevBookmarkIds };
    },

    onSuccess: (res) => {
      toast.success(res.message);
    },

    onError: (error: Error | ActionError, postId, context) => {
      // Handle NOT_FOUND - remove post
      if ('code' in error && error.code === 'NOT_FOUND') {
        removePost(postId);
        toast.info('This post no longer exists');
        return;
      }

      // Rollback for all other errors
      if (context?.previousPost) updatePost(postId, context.previousPost);

      if (context?.prevBookmarkIds) {
        queryClient.setQueryData(
          ['posts', 'bookmarks'],
          context.prevBookmarkIds,
        );
      }

      toast.error(error.message || 'Failed to update bookmark');
    },
  });

  return { toggleBookmark, isToggling };
}
