import { useEntityStore } from '@/entities/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikeAction } from '../actions';

export function useToggleLike() {
  const queryClient = useQueryClient();

  const updatePost = useEntityStore((state) => state.updatePost);
  const posts = useEntityStore((state) => state.posts);

  const { mutate: toggleLike } = useMutation({
    mutationFn: toggleLikeAction,

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const post = posts[postId];
      if (!post) return;

      const previousPost = { ...post };

      const isLiked = !post.isLiked;
      updatePost(postId, {
        isLiked,
        likesCount: isLiked
          ? post.likesCount + 1
          : Math.max(0, post.likesCount - 1),
      });

      return { previousPost };
    },

    onError: (err, postId: string, context) => {
      if (context?.previousPost) updatePost(postId, context.previousPost);
    },
  });

  return { toggleLike };
}
