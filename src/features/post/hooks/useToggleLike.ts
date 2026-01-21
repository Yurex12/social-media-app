import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikeAction } from '../actions';
import { PostWithRelations } from '../types';

export function useToggleLike() {
  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useMutation({
    mutationFn: toggleLikeAction,

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousPosts = queryClient.getQueryData<PostWithRelations[]>([
        'posts',
      ]);

      console.log(previousPosts);

      queryClient.setQueryData<PostWithRelations[]>(['posts'], (oldPosts) => {
        return (
          oldPosts?.map((p) => {
            if (p.id === postId) {
              const isLiked = !p.isLiked;
              return {
                ...p,
                isLiked,
                likesCount: isLiked
                  ? (p.likesCount ?? 0) + 1
                  : Math.max(0, (p.likesCount ?? 0) - 1),
              };
            }
            return p;
          }) ?? []
        );
      });

      return { previousPosts };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return { toggleLike };
}
