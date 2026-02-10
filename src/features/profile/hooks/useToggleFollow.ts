import { useEntityStore } from '@/entities/store';
import { useSession } from '@/lib/auth-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleFollowAction } from '../action';
import { ActionError } from '@/types';

export function useToggleFollow() {
  const updateUser = useEntityStore((state) => state.updateUser);
  const removeUser = useEntityStore((state) => state.removeUser);
  const session = useSession();
  const currentUserId = session.data?.user.id;

  const queryClient = useQueryClient();

  const { mutate: toggleFollow } = useMutation({
    // mutationFn: toggleFollowAction,
    mutationFn: async (postId: string) => {
      const res = await toggleFollowAction(postId);
      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;
      return res;
    },

    onMutate: async (followingId: string) => {
      if (!currentUserId) return;

      await queryClient.cancelQueries({ queryKey: ['users'] });
      const state = useEntityStore.getState();

      const targetUser = state.users[followingId];
      const currentUser = currentUserId ? state.users[currentUserId] : null;

      if (!targetUser) return;

      const previousTarget = { ...targetUser };
      const previousMe = currentUser ? { ...currentUser } : null;

      const isFollowing = !targetUser.isFollowing;

      updateUser(followingId, {
        isFollowing,
        followersCount: isFollowing
          ? targetUser.followersCount + 1
          : Math.max(0, targetUser.followersCount - 1),
      });

      if (currentUser && currentUserId) {
        updateUser(currentUserId, {
          followingCount: isFollowing
            ? currentUser.followingCount + 1
            : Math.max(0, currentUser.followingCount - 1),
        });
      }

      return { previousTarget, previousMe };
    },

    onError: (err: Error | ActionError, followingId, context) => {
      if ('code' in err && err.code === 'NOT_FOUND') {
        removeUser(followingId);
        toast.info('This user no longer exists');
        return;
      }

      if (context?.previousTarget)
        updateUser(followingId, context.previousTarget);

      if (currentUserId && context?.previousMe)
        updateUser(currentUserId, context.previousMe);

      toast.error(err.message || 'Could not update follow status');
    },
  });

  return { toggleFollow };
}
