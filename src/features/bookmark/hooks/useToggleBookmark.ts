import { useEntityStore } from '@/entities/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { toggleBookmarkAction } from '../action';

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const posts = useEntityStore((state) => state.posts);
  const updatePost = useEntityStore((state) => state.updatePost);

  const { mutate: toggleBookmark, isPending: isToggling } = useMutation({
    mutationFn: toggleBookmarkAction,

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const post = posts[postId];

      const previousPost = { ...post };

      updatePost(postId, {
        isBookmarked: !post.isBookmarked,
      });

      return { previousPost };
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
      toast.error('Failed to update bookmark');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'bookmarks'] });
    },
  });

  return { toggleBookmark, isToggling };
}
