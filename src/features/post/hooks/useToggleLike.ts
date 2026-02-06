import { useEntityStore } from '@/entities/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikeAction } from '../actions';
import { useSession } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export function useToggleLike() {
  const queryClient = useQueryClient();

  const updatePost = useEntityStore((state) => state.updatePost);
  const removePost = useEntityStore((state) => state.removePost);
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

    onSuccess: (res, postId, context) => {
      if (res.success) return;

      if (res.error === 'NOT_FOUND') {
        removePost(postId);
        toast.error('This post no longer exists');
        return;
      }

      if (context?.previousPost) updatePost(postId, context.previousPost);
      if (username && context?.previousLikedPostIds) {
        queryClient.setQueryData(
          ['posts', 'likes', username],
          context.previousLikedPostIds,
        );
      }
      toast.error(res.message);
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
