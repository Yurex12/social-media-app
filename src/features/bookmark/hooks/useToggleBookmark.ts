import { useEntityStore } from '@/entities/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { toggleBookmarkAction } from '../action';

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const updatePost = useEntityStore((state) => state.updatePost);

  const { mutate: toggleBookmark, isPending: isToggling } = useMutation({
    mutationFn: toggleBookmarkAction,

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const prevBookmarkIds = queryClient.getQueryData<string[]>([
        'posts',
        'bookmarks',
      ]);
      const post = useEntityStore.getState().posts[postId];
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

    onSuccess: (_, postId, context) => {
      toast.success(
        context.previousPost.isBookmarked
          ? 'Removed from bookmarks'
          : 'Added to bookmarks',
      );
    },

    onError: (err, postId, context) => {
      if (context?.previousPost) updatePost(postId, context?.previousPost);
      if (context?.prevBookmarkIds)
        queryClient.setQueryData(
          ['posts', 'bookmarks'],
          context.prevBookmarkIds,
        );
      toast.error('Failed to update bookmark');
    },
  });

  return { toggleBookmark, isToggling };
}
