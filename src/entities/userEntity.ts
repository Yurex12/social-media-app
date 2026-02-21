import { StateCreator } from 'zustand';
import { reconcileCount } from './helpers';
import { User } from '@/features/profile/types';

export type UserEntity = User;

export interface UserEntitySlice {
  users: Record<string, UserEntity>;
  usernameToId: Record<string, string>;

  addUser: (user: UserEntity) => void;
  addUsers: (users: UserEntity[]) => void;
  updateUser: (userId: string, updates: Partial<UserEntity>) => void;
  removeUser: (userId: string) => void;

  incrementUserCount: (
    userId: string,
    field: 'followersCount' | 'followingCount',
  ) => void;
  decrementUserCount: (
    userId: string,
    field: 'followersCount' | 'followingCount',
  ) => void;
}

export const userEntitySlice: StateCreator<UserEntitySlice> = (set) => ({
  users: {},
  usernameToId: {},

  addUser: (user) =>
    set((state) => {
      const existing = state.users[user.id];

      if (!existing) {
        return {
          users: { ...state.users, [user.id]: user },
          usernameToId: {
            ...state.usernameToId,
            [user.username.toLowerCase()]: user.id,
          },
        };
      }

      const isMe = user.isCurrentUser;

      return {
        users: {
          ...state.users,
          [user.id]: {
            ...user,
            isFollowing: existing.isFollowing,
            followersCount: reconcileCount(
              existing.isFollowing,
              user.isFollowing,
              user.followersCount,
            ),
            followingCount: isMe
              ? existing.followingCount !== user.followingCount
                ? existing.followingCount
                : user.followingCount
              : user.followingCount,
          },
        },
        usernameToId: {
          ...state.usernameToId,
          [user.username.toLowerCase()]: user.id,
        },
      };
    }),

  addUsers: (users) =>
    set((state) => {
      const nextUsers = { ...state.users };
      const nextUsernameToId = { ...state.usernameToId };
      users.forEach((user) => {
        const existing = nextUsers[user.id];
        const isMe = user.isCurrentUser;
        if (!existing) {
          nextUsers[user.id] = user;
          nextUsernameToId[user.username.toLowerCase()] = user.id;
        } else {
          nextUsers[user.id] = {
            ...user,
            isFollowing: existing.isFollowing,
            followersCount: reconcileCount(
              existing.isFollowing,
              user.isFollowing,
              user.followersCount,
            ),
            followingCount: isMe
              ? existing.followingCount !== user.followingCount
                ? existing.followingCount
                : user.followingCount
              : user.followingCount,
          };
          nextUsernameToId[user.username.toLowerCase()] = user.id;
        }
      });

      return { users: nextUsers, usernameToId: nextUsernameToId };
    }),

  updateUser: (userId, updates) =>
    set((state) => {
      const currentUser = state.users[userId];
      if (!currentUser) return state;

      const updatedUser = { ...currentUser, ...updates };
      const nextMap = { ...state.usernameToId };

      if (updates.username && updates.username !== currentUser.username) {
        delete nextMap[currentUser.username.toLowerCase()];
        nextMap[updates.username.toLowerCase()] = userId;
      }

      return {
        users: { ...state.users, [userId]: updatedUser },
        usernameToId: nextMap,
      };
    }),

  removeUser: (userId) =>
    set((state) => {
      const user = state.users[userId];
      const { [userId]: _, ...restUsers } = state.users;
      const nextMap = { ...state.usernameToId };

      if (user) delete nextMap[user.username.toLowerCase()];

      return { users: restUsers, usernameToId: nextMap };
    }),

  incrementUserCount: (userId, field) =>
    set((state) => {
      const user = state.users[userId];
      if (!user) return state;
      return {
        users: {
          ...state.users,
          [userId]: { ...user, [field]: user[field] + 1 },
        },
      };
    }),

  decrementUserCount: (userId, field) =>
    set((state) => {
      const user = state.users[userId];
      if (!user || user[field] <= 0) return state;
      return {
        users: {
          ...state.users,
          [userId]: { ...user, [field]: user[field] - 1 },
        },
      };
    }),
});
