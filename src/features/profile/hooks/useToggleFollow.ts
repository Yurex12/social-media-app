import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFollowAction } from '../action';
import toast from 'react-hot-toast';
import { PostWithRelations } from '@/features/post/types';
import { SuggestedUsers, UserWithRelations } from '../types';

// shape for user data -> userWithRelations - object, SuggestedUser - array

function updatePostUserData(post: PostWithRelations) {
  const isNowFollowing = !post.user.isFollowing;
  const followerAdjustment = isNowFollowing ? 1 : -1;

  return {
    ...post,
    user: {
      ...post.user,
      isFollowing: isNowFollowing,
      _count: {
        ...post.user._count,
        followers: post.user._count.followers + followerAdjustment,
      },
    },
  };
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  const { mutate: toggleFollow } = useMutation({
    mutationFn: toggleFollowAction,

    onMutate: async (followingId) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const userSnapshots = queryClient.getQueriesData<
        SuggestedUsers[] | UserWithRelations
      >({ queryKey: ['users'] });
      const postSnapshots = queryClient.getQueriesData<
        PostWithRelations | PostWithRelations[]
      >({ queryKey: ['posts'] });

      // --- UPDATE USERS CACHE ---
      userSnapshots.forEach(([queryKey]) => {
        queryClient.setQueryData<SuggestedUsers[] | UserWithRelations>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;

            //  when it's an array then it's the suggested user array type
            if (Array.isArray(oldData)) {
              return oldData.map((user) =>
                user.id === followingId
                  ? { ...user, isFollowing: !user.isFollowing }
                  : user,
              );
            }
            //  for the profile
            if (oldData.id === followingId) {
              const isFollowing = !oldData.isFollowing;
              return {
                ...oldData,
                isFollowing,
                _count: {
                  ...oldData._count,
                  followers: isFollowing
                    ? oldData._count.followers + 1
                    : oldData._count.followers - 1,
                },
              };
            }
            return oldData;
          },
        );
      });
      // --- UPDATE POSTS CACHE ---
      postSnapshots.map(([queryKey]) => {
        queryClient.setQueryData<PostWithRelations | PostWithRelations[]>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;

            // Handle Arrays (Feeds, Bookmarks, Likes, profilePosts)
            if (Array.isArray(oldData)) {
              return oldData.map((post) =>
                post.user.id === followingId ? updatePostUserData(post) : post,
              );
            }

            // Handle Single Objects (Post Details page)
            if (oldData.user.id === followingId) {
              return updatePostUserData(oldData);
            }

            return oldData;
          },
        );
      });

      return { snapshots: [...userSnapshots, ...postSnapshots] };
    },

    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
      }
    },

    onError: (err, _, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('Something went wrong');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], type: 'active' });
      queryClient.invalidateQueries({ queryKey: ['posts'], type: 'active' });
    },
  });

  return { toggleFollow };
}
