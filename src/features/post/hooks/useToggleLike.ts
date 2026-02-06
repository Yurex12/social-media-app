import { useEntityStore } from '@/entities/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikeAction } from '../actions';
import { useSession } from '@/lib/auth-client';

export function useToggleLike() {
  const queryClient = useQueryClient();

  const updatePost = useEntityStore((state) => state.updatePost);

  const username = useSession().data?.user.username;

  const { mutate: toggleLike } = useMutation({
    mutationFn: toggleLikeAction,

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const post = useEntityStore.getState().posts[postId];

      const previousLikedPostIds = queryClient.getQueryData<string[]>([
        'posts',
        'likes',
        username,
      ]);

      if (!post) return;

      const previousPost = { ...post };

      const isLiked = !post.isLiked;
      updatePost(postId, {
        isLiked,
        likesCount: isLiked
          ? post.likesCount + 1
          : Math.max(0, post.likesCount - 1),
      });

      if (username) {
        queryClient.setQueryData<string[]>(
          ['posts', 'likes', username],
          (oldIds) => {
            if (!oldIds) return oldIds;
            if (isLiked) return [postId, ...oldIds];
            else return oldIds.filter((id) => id !== postId);
          },
        );
      }

      return { previousPost, previousLikedPostIds };
    },

    onError: (err, postId, context) => {
      if (context?.previousPost) updatePost(postId, context.previousPost);
      if (username && context?.previousLikedPostIds) {
        queryClient.setQueryData<string[]>(
          ['posts', 'likes', username],
          context?.previousLikedPostIds,
        );
      }
    },
  });

  return { toggleLike };
}
