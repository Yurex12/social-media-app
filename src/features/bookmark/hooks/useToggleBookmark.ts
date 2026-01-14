import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { toggleBookmarkAction } from '../action';
import { PostWithRelations } from '@/features/post/types';

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const {
    mutate: toggleBookmark,
    isPending: isToggling,
    error,
  } = useMutation({
    mutationFn: toggleBookmarkAction,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousPosts = queryClient.getQueryData<PostWithRelations[]>([
        'posts',
      ]);

      queryClient.setQueryData<PostWithRelations[]>(['posts'], (oldPosts) => {
        return (
          oldPosts?.map((post) =>
            post.id === postId
              ? { ...post, isBookmarked: !post.isBookmarked }
              : post
          ) ?? []
        );
      });

      return { previousPosts };
    },

    onSuccess(_, postId, context) {
      const wasBookmarked = context?.previousPosts?.find(
        (p) => p.id === postId
      )?.isBookmarked;

      toast.success(
        wasBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks'
      );
    },

    onError(err, _, context) {
      queryClient.setQueryData(['posts'], context?.previousPosts);
      toast.error(err.message || 'Failed to update bookmark');
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
  return { toggleBookmark, isToggling, error };
}
