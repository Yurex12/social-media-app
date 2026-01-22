import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikeAction } from '../actions';
import { PostWithRelations } from '../types';

export function useToggleLike() {
  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useMutation({
    mutationFn: toggleLikeAction,

    onMutate: async (postId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['posts'] }),
        queryClient.cancelQueries({ queryKey: ['bookmarks'] }),
        queryClient.cancelQueries({ queryKey: ['posts', postId] }),
      ]);

      const prevPosts = queryClient.getQueryData(['posts']);
      const prevBookmarks = queryClient.getQueryData(['bookmarks']);
      const prevDetail = queryClient.getQueryData(['posts', postId]);

      function updatePost(post: PostWithRelations) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likeCount: !post.isLiked
            ? post.likeCount + 1
            : Math.max(0, post.likeCount - 1),
        };
      }

      queryClient.setQueryData<PostWithRelations[]>(['posts'], (oldPosts) => {
        return oldPosts?.map((post) =>
          post.id === postId ? updatePost(post) : post,
        );
      });

      queryClient.setQueryData<PostWithRelations[]>(
        ['bookmarks'],
        (oldBookmarks) =>
          oldBookmarks?.map((post) =>
            post.id === postId ? updatePost(post) : post,
          ),
      );

      queryClient.setQueryData<PostWithRelations>(
        ['posts', postId],
        (oldPost) => (oldPost ? updatePost(oldPost) : oldPost),
      );

      return { prevPosts, prevBookmarks, prevDetail };
    },

    onError: (err, postId, context) => {
      queryClient.setQueryData(['posts'], context?.prevPosts);
      queryClient.setQueryData(['bookmark'], context?.prevBookmarks);
      queryClient.setQueryData(['posts', postId], context?.prevDetail);
    },

    onSettled: (data, err, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark'] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });

  return { toggleLike };
}
