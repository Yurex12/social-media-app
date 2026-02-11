import { useEntityStore } from '@/entities/store';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toggleLikeAction } from '../actions';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { ActionError } from '@/types';
import { PostIdsPage } from '../types';

export function useToggleLike() {
  const queryClient = useQueryClient();

  const updatePost = useEntityStore((state) => state.updatePost);
  const removePost = useEntityStore((state) => state.removePost);
  const username = useSession().data?.user.username;

  const { mutate: toggleLike } = useMutation({
    mutationFn: async (postId: string) => {
      const res = await toggleLikeAction(postId);
      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;
      return res;
    },

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const post = useEntityStore.getState().posts[postId];

      const previousLikedPostIds = queryClient.getQueryData<
        InfiniteData<PostIdsPage>
      >(['posts', 'likes', username]);

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
        queryClient.setQueryData<InfiniteData<PostIdsPage>>(
          ['posts', 'likes', username],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page, index) => {
                if (isLiked && index === 0) {
                  return { ...page, postIds: [postId, ...page.postIds] };
                }
                if (!isLiked) {
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
      }

      return { previousPost, previousLikedPostIds };
    },

    onError: (err: Error | ActionError, postId, context) => {
      if ('code' in err && err.code === 'NOT_FOUND') {
        removePost(postId);
        toast.info('This post no longer exists');
        return;
      }

      if (context?.previousPost) updatePost(postId, context.previousPost);

      if (username && context?.previousLikedPostIds) {
        queryClient.setQueryData<InfiniteData<PostIdsPage>>(
          ['posts', 'likes', username],
          context.previousLikedPostIds,
        );
      }
    },
  });

  return { toggleLike };
}
