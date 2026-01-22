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
      function updatePost(post: PostWithRelations) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked,
        };
      }

      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['posts'] }),
        queryClient.cancelQueries({ queryKey: ['bookmarks'] }),
        queryClient.cancelQueries({ queryKey: ['posts', postId] }),
      ]);

      const prevPosts = queryClient.getQueryData<PostWithRelations[]>([
        'posts',
      ]);
      const prevBookmarks = queryClient.getQueryData<PostWithRelations[]>([
        'bookmarks',
      ]);
      const prevDetail = queryClient.getQueryData<PostWithRelations>([
        'posts',
        postId,
      ]);

      queryClient.setQueryData<PostWithRelations[]>(['posts'], (oldPosts) => {
        return oldPosts?.map((post) =>
          post.id === postId ? updatePost(post) : post,
        );
      });

      queryClient.setQueryData<PostWithRelations[]>(
        ['bookmarks'],
        (oldBookmarks) => {
          return oldBookmarks?.map((post) =>
            post.id === postId ? updatePost(post) : post,
          );
        },
      );

      queryClient.setQueryData<PostWithRelations>(
        ['posts', postId],
        (oldPost) => {
          return oldPost ? updatePost(oldPost) : oldPost;
        },
      );

      return { prevPosts, prevBookmarks, prevDetail };
    },

    onSuccess(_, postId, context) {
      const oldPost =
        context?.prevPosts?.find((post) => post.id === postId) ||
        context?.prevBookmarks?.find((post) => post.id === postId) ||
        context?.prevDetail;

      const wasBookmarked = oldPost?.isBookmarked;

      toast.success(
        wasBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
      );
    },

    onError(err, postId, context) {
      queryClient.setQueryData(['posts'], context?.prevPosts);
      queryClient.setQueryData(['bookmarks'], context?.prevBookmarks);
      queryClient.setQueryData(['posts', postId], context?.prevDetail);

      toast.error(err.message || 'Failed to update bookmark');
    },

    onSettled(_, __, postId) {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });

  return { toggleBookmark, isToggling, error };
}
