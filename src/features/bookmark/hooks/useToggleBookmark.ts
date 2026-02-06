import { useEntityStore } from '@/entities/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { toggleBookmarkAction } from '../action';

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const updatePost = useEntityStore((state) => state.updatePost);
  const removePost = useEntityStore((state) => state.removePost);

  const { mutate: toggleBookmark, isPending: isToggling } = useMutation({
    mutationFn: toggleBookmarkAction,

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

    onSuccess: (res, postId, context) => {
      if (res.success) {
        toast.success(res.message);
        return;
      }

      if (res.error === 'NOT_FOUND') {
        removePost(postId);
        toast.error(res.message);
        return;
      }

      if (context?.previousPost) updatePost(postId, context?.previousPost);
      if (context?.prevBookmarkIds)
        queryClient.setQueryData(
          ['posts', 'bookmarks'],
          context.prevBookmarkIds,
        );
      toast.error(res.message || 'Something went wrong');
    },

    onError: (err, postId, context) => {
      if (context?.previousPost) updatePost(postId, context?.previousPost);
      if (context?.prevBookmarkIds)
        queryClient.setQueryData(
          ['posts', 'bookmarks'],
          context.prevBookmarkIds,
        );
      toast.error(err.message || 'Failed to update bookmark');
    },
  });

  return { toggleBookmark, isToggling };
}
