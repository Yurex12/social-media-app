import { useEntityStore } from '@/entities/store';
import { ActionError } from '@/types';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleBookmarkAction } from '../action';
import { PostIdsPage } from '@/features/post/types';

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

      const prevBookmarkIds = queryClient.getQueryData<
        InfiniteData<PostIdsPage>
      >(['posts', 'bookmarks']);

      const post = useEntityStore.getState().posts[postId];
      if (!post) return;

      const previousPost = { ...post };

      // Update entity
      const newBookmarkState = !post.isBookmarked;
      updatePost(postId, { isBookmarked: newBookmarkState });

      // CHANGE 2: Update InfiniteData cache
      queryClient.setQueryData<InfiniteData<PostIdsPage>>(
        ['posts', 'bookmarks'],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (newBookmarkState && index === 0) {
                return { ...page, postIds: [postId, ...page.postIds] };
              }
              if (!newBookmarkState) {
                return {
                  ...page,
                  postIds: page.postIds.filter((id) => id !== postId),
                };
              }
              return page;
            }),
          };
        },
      );

      return { previousPost, prevBookmarkIds };
    },

    onSuccess: (res) => {
      toast.success(res.message);
    },

    onError: (error: Error | ActionError, postId, context) => {
      if ('code' in error && error.code === 'NOT_FOUND') {
        removePost(postId);
        toast.info('This post no longer exists');
        return;
      }

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
