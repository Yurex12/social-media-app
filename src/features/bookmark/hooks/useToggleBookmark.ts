import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { toggleBookmarkAction } from '../action';
import { PostWithRelations } from '@/features/post/types';

function updatePostBookmark(post: PostWithRelations) {
  return {
    ...post,
    isBookmarked: !post.isBookmarked,
  };
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  const { mutate: toggleBookmark, isPending: isToggling } = useMutation({
    mutationFn: toggleBookmarkAction,

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const snapshots = queryClient.getQueriesData<
        PostWithRelations[] | PostWithRelations
      >({ queryKey: ['posts'] });

      // Use the manual loop so we can check the queryKey
      snapshots.forEach(([queryKey]) => {
        queryClient.setQueryData<PostWithRelations[] | PostWithRelations>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;

            if (Array.isArray(oldData)) {
              if (queryKey.includes('bookmarks')) {
                return oldData.filter((p) => p.id !== postId);
              }

              return oldData.map((post) =>
                post.id === postId ? updatePostBookmark(post) : post,
              );
            }

            if (oldData.id === postId) {
              return updatePostBookmark(oldData);
            }

            return oldData;
          },
        );
      });

      return { snapshots };
    },

    onSuccess: (_, postId, context) => {
      let wasBookmarked = false;
      const snapshot = context?.snapshots.find(([_, data]) => {
        if (Array.isArray(data)) return data.some((p) => p.id === postId);
        return data?.id === postId;
      });

      if (snapshot) {
        const data = snapshot[1];
        const post = Array.isArray(data)
          ? data.find((p) => p.id === postId)
          : data;
        wasBookmarked = post?.isBookmarked ?? false;
      }

      toast.success(
        wasBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
      );
    },

    onError: (err, _, context) => {
      context?.snapshots?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
      toast.error('Failed to update bookmark');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'], type: 'active' });
    },
  });

  return { toggleBookmark, isToggling };
}
