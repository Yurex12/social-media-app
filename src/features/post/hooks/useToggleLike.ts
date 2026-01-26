import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikeAction } from '../actions';
import { PostWithRelations } from '../types';

function updatePost(post: PostWithRelations) {
  return {
    ...post,
    isLiked: !post.isLiked,
    likeCount: !post.isLiked
      ? post.likeCount + 1
      : Math.max(0, post.likeCount - 1),
  };
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useMutation({
    mutationFn: toggleLikeAction,

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const snapshots = queryClient.getQueriesData<
        PostWithRelations[] | PostWithRelations
      >({ queryKey: ['posts'] });

      snapshots.forEach(([queryKey]) => {
        queryClient.setQueryData<PostWithRelations[] | PostWithRelations>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;

            if (Array.isArray(oldData)) {
              if (queryKey.includes('likes'))
                return oldData.filter((post) => post.id !== postId);

              return oldData.map((post) =>
                post.id === postId ? updatePost(post) : post,
              );
            }

            if (oldData?.id === postId) {
              return updatePost(oldData);
            }

            return oldData;
          },
        );
      });

      return { snapshots };
    },

    onError: (err, postId, context) => {
      context?.snapshots?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'], type: 'active' });
    },
  });

  return { toggleLike };
}
