import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { toggleFollowAction } from '../action';

import { PostWithRelations } from '@/features/post/types';
import { UserWithRelations } from '../types';

// shape for user data -> userWithRelations - object, SuggestedUser - array

function updatePostUserData(post: PostWithRelations) {
  const isFollowing = !post.user.isFollowing;

  return {
    ...post,
    user: {
      ...post.user,
      isFollowing,
      _count: {
        ...post.user._count,
        followers: isFollowing
          ? post.user._count.followers + 1
          : Math.max(0, post.user._count.followers - 1),
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
        UserWithRelations[] | UserWithRelations
      >({ queryKey: ['users'] });
      const postSnapshots = queryClient.getQueriesData<
        PostWithRelations | PostWithRelations[]
      >({ queryKey: ['posts'] });

      // --- UPDATE USERS CACHE ---
      userSnapshots.forEach(([queryKey]) => {
        queryClient.setQueryData<UserWithRelations[] | UserWithRelations>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData;

            if (Array.isArray(oldData)) {
              return oldData.map((user) => {
                if (user.id !== followingId) return user;

                const isFollowing = !user.isFollowing;

                return {
                  ...user,
                  isFollowing,
                  _count: {
                    ...user._count,

                    followers: isFollowing
                      ? user._count.followers + 1
                      : Math.max(0, user._count.followers - 1),
                  },
                };
              });
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
                    : Math.max(0, oldData._count.followers - 1),
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

    onError: (err, _, context) => {
      context?.snapshots?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      toast.error('Something went wrong');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'], type: 'active' });
      queryClient.invalidateQueries({
        queryKey: ['users', 'profile'],
        type: 'active',
      });
    },
  });

  return { toggleFollow };
}
